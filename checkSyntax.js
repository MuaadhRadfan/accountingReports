try {
  const fs = require('fs');
  const code = fs.readFileSync('js/SmartStoreApp.js', 'utf8');
  // Try to parse with Function constructor (won't execute but checks syntax)
  new Function(code);
  console.log('Syntax OK');
} catch (e) {
  console.error('Syntax Error:', e.message);
  process.exit(1);
}
