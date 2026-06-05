const fs = require('fs');
const path = require('path');

const colors = new Set();
const srcDir = path.join(__dirname, 'src');

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(/#[0-9a-fA-F]{3,8}\b/g);
  if (matches) {
    matches.forEach(m => colors.add(m.toLowerCase()));
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full);
    } else if (/\.(jsx?|css|html)$/.test(entry.name)) {
      scanFile(full);
    }
  }
}

walkDir(srcDir);
console.log('Distinct hex colors found in src/ :');
console.log(Array.from(colors).sort());
