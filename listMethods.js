const fs = require('fs');
const code = fs.readFileSync('js/SmartStoreApp.js', 'utf8');
const lines = code.split('\n');
const methods = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  // Match method definitions inside class (including async)
  if (trimmed.match(/^\s*(async\s+)?\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/) && !trimmed.startsWith('//') && !trimmed.startsWith('function') && !trimmed.startsWith('class') && !trimmed.startsWith('constructor')) {
    // Extract method name
    const match = trimmed.match(/^\s*(?:async\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
    if (match) {
      methods.push({ line: i+1, name: match[1] });
    }
  }
}
console.log('Methods found in SmartStoreApp.js:');
methods.forEach(m => console.log(`  ${m.name}() — line ${m.line}`));
