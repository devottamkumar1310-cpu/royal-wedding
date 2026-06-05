/**
 * PASS 2 — Admin cleanup
 * Replace semi-transparent dark overlays used as table header rows in admin
 * with emerald-compatible alternatives.
 * Replace bg-transparent used on admin page wrappers with bg-stationery-gradient.
 */
const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'components', 'admin');

const pass2 = [
  // Table header rows: dark transparent overlay → slightly darker emerald tint
  [/bg-black\/20\b/g, 'bg-[#1E5238]'],
  [/bg-black\/80\b/g, 'bg-[#1E5238]'],
  // bg-transparent on min-h-screen wrappers → keep transparent (body color shows through = light blue ✓)
  // Actually these should stay bg-transparent since they sit over the body gradient
  // bg-white/60 on content editor → emerald card
  [/bg-white\/60\b/g, 'bg-stationery-gradient'],
  // bg-white/85 on input fields → softer ivory
  [/bg-white\/85\b/g, 'bg-[#F8F4E8]'],
  // bg-white/5 hover row → emerald hover tint
  [/hover:bg-white\/5\b/g, 'hover:bg-[#35795A]'],
  // hover:bg-white → just let it be hover:brightness
  [/hover:bg-white\b/g, 'hover:bg-[#35795A]'],
  // text inputs on ivory background should have dark text
  // bg-[#F8F4E8] input fields → dark green text
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [pattern, replacement] of pass2) {
    content = content.replace(pattern, replacement);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  UPDATED: ${path.relative(__dirname, filePath)}`);
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(full);
    else if (/\.(jsx?|css)$/.test(e.name)) processFile(full);
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Pass 2 complete.');
