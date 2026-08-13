const fs = require('fs');
const path = require('path');

function fixNewlines(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixNewlines(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.html') || fullPath.endsWith('.json')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('\\n')) {
        content = content.replace(/\\n/g, '\n');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fixNewlines(path.join(process.cwd(), 'src'));
console.log('Fixed newlines');
