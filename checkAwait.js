const fs = require('fs');
const code = fs.readFileSync('js/SmartStoreApp.js', 'utf8');
const lines = code.split('\n');

// Track function context
let currentFunction = null;
let functionLine = 0;
let issues = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  // Skip comments and blank lines
  if (trimmed.startsWith('//') || trimmed === '' || trimmed.startsWith('*')) continue;
  
  // Detect function declaration start
  const funcMatch = trimmed.match(/^\s*(async\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
  if (funcMatch && !trimmed.includes('=>') && !trimmed.startsWith('function') && !trimmed.startsWith('class') && !trimmed.startsWith('constructor') && !trimmed.includes('?.')) {
    // Found a method or function
    currentFunction = funcMatch[2];
    functionLine = i + 1;
    // Check if async
    const isAsync = !!funcMatch[1];
    if (!isAsync && /^\s*[a-zA-Z_$]/.test(line) && !line.includes('=>') && !line.includes('?.')) {
      // Could still be a property or something else; verify it's a method body by checking next line
      // We'll assume it's a method if it has a body block below
      // We'll check later when we encounter await inside
    }
  }
  
  // Check for await inside function
  if (trimmed.startsWith('await ') && currentFunction) {
    // Check if current function is async
    const funcDef = lines[functionLine - 1] || '';
    const isAsyncFunc = funcDef.includes('async ') || funcDef.includes('async function');
    if (!isAsyncFunc) {
      // Also check if function body spans multiple lines maybe with braces? We'll report
      issues.push({ line: i + 1, function: currentFunction, lineDef: functionLine, awaitLine: line.trim() });
    }
  }
  
  // Close brace likely ends function (simple heuristic)
  if (trimmed === '}' || (trimmed.includes('}') && !trimmed.includes('=>'))) {
    currentFunction = null;
  }
}

if (issues.length) {
  console.log('Found sync functions using await:');
  issues.forEach(issue => {
    console.log(`  Function '${issue.function}' (line ${issue.lineDef}) uses await at line ${issue.line}: ${issue.awaitLine}`);
  });
} else {
  console.log('No sync functions using await found.');
}
