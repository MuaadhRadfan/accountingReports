const fs = require('fs');
const code = fs.readFileSync('js/SmartStoreApp.js', 'utf8');
const lines = code.split('\n');

let inFunction = false;
let braceDepth = 0;
let issues = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  // Skip comments/blank
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed === '') continue;
  
  // Detect function/method start (simple: line ending with {)
  if (/\{[^}]*$/.test(trimmed)) {
    braceDepth++;
  }
  // Count braces more accurately per line
  const openBraces = (line.match(/{/g) || []).length;
  const closeBraces = (line.match(/}/g) || []).length;
  braceDepth += openBraces - closeBraces;
  
  // Rough: if braceDepth is 0, we are top-level
  // But need to check for await at depth 0
  
  // Check for top-level await (depth 0 before counting this line's opens)
  if (braceDepth === 0 && trimmed.startsWith('await ') && !trimmed.startsWith('async ')) {
    issues.push({ line: i+1, content: line.trim() });
  }
}

if (issues.length) {
  console.log('Potential top-level await statements:');
  issues.forEach(iss => console.log(`  Line ${iss.line}: ${iss.content}`));
} else {
  console.log('No obvious top-level await detected.');
}
