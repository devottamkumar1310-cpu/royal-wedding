const fs = require('fs');
const path = require('path');

const targetHexes = [
  '#ffffff', '#fdfbf7', '#f8f4e8', '#f5e3e0', '#e5e5e5',
  '#d4af37', '#c8a85d', '#b89b52', '#111111', '#000000'
];

const targetKeywords = [
  'bg-white', 'text-white', 'border-white',
  'bg-black', 'text-black', 'border-black',
  'bg-gray', 'text-gray', 'border-gray',
  'bg-slate', 'text-slate', 'border-slate',
  'bg-zinc', 'text-zinc', 'border-zinc',
  'bg-neutral', 'text-neutral', 'border-neutral',
  'bg-stone', 'text-stone', 'border-stone'
];

const results = [];

function checkFile(filePath) {
  const relPath = path.relative(__dirname, filePath);
  if (
    relPath.startsWith('node_modules') || 
    relPath.startsWith('.git') || 
    relPath.startsWith('dist') ||
    relPath === 'check_stray_colors.cjs' || 
    relPath === 'find_colors.cjs' ||
    relPath === 'stray_report.txt'
  ) {
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Check hexes
    targetHexes.forEach(hex => {
      if (line.toLowerCase().includes(hex.toLowerCase())) {
        results.push({ file: relPath, lineNum: idx + 1, type: 'hex', matched: hex, content: line.trim() });
      }
    });
    
    // Check keywords
    targetKeywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(line)) {
        results.push({ file: relPath, lineNum: idx + 1, type: 'keyword', matched: kw, content: line.trim() });
      }
    });
  });
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full);
    } else if (/\.(jsx?|css|html|js)$/.test(entry.name)) {
      checkFile(full);
    }
  }
}

walkDir(__dirname);

let output = `Found ${results.length} occurrences:\n\n`;
results.forEach(r => {
  output += `[${r.file}:${r.lineNum}] (${r.type}: ${r.matched}) -> ${r.content}\n`;
});

fs.writeFileSync(path.join(__dirname, 'stray_report.txt'), output, 'utf8');
console.log('Done writing report to stray_report.txt');
