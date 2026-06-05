/**
 * GLOBAL COLOR MIGRATION SCRIPT
 * 
 * New Color System:
 *   BACKGROUND: #90E0EF  (light blue)
 *   CARDS:      linear-gradient(135deg, #35795A, #2D6A4F, #245741)  (emerald)
 *   BORDERS:    #FFC300  (matte gold)
 *   HEADINGS:   #FFC300  (matte gold)
 *   BODY TEXT on cards:  #F8F4E8 (warm ivory)
 *   BODY TEXT on bg:     #1F3D3A (deep green-charcoal)
 */

const fs = require('fs');
const path = require('path');

// ─── Color Replacements (ORDER MATTERS — longer/more specific first) ──────────
//
// Each entry: [regex, replacement]
// Replacements are applied in ORDER, so we handle transparency variants first.
//
const replacements = [
  // ── OLD LIGHT/CREAM/IVORY BACKGROUNDS → #90E0EF ───────────────────────────
  // These were used as page/section backgrounds, not card surfaces
  [/#fdfbf7/gi, '#90E0EF'],
  [/#FDFBF7/g,  '#90E0EF'],

  // ── OLD DARK NAVIES/CHARCOALS that were CARD backgrounds → emerald ─────────
  [/#1F4D3A/g,  '#245741'],   // was dark emerald card bg — keep in family
  [/#1f4d3a/gi, '#245741'],
  [/#2F435A/g,  '#245741'],   // old navy-dark
  [/#2f435a/gi, '#245741'],
  [/#34495E/g,  '#2D6A4F'],   // old navy-mid
  [/#34495e/gi, '#2D6A4F'],
  [/#3A4F66/g,  '#35795A'],   // old navy-light
  [/#3a4f66/gi, '#35795A'],
  [/#245845/g,  '#245741'],   // old emerald-mid (slight variant)
  [/#255A44/g,  '#245741'],   // old envelope side flap
  [/#255a44/gi, '#245741'],
  [/#1C4534/g,  '#245741'],   // old envelope bottom flap
  [/#1c4534/gi, '#245741'],
  [/#2E6A4F/g,  '#2D6A4F'],   // old envelope flap (tiny variant)
  [/#2e6a4f/gi, '#2D6A4F'],
  [/#3A7A5E/g,  '#35795A'],   // old emerald-light high variant
  [/#3a7a5e/gi, '#35795A'],
  [/#40916C/g,  '#35795A'],   // old bg-emerald high
  [/#40916c/gi, '#35795A'],

  // ── OLD GOLD → #FFC300 ────────────────────────────────────────────────────
  // (These should already be done from previous pass, but be thorough)
  [/#D4AF37/g,  '#FFC300'],
  [/#d4af37/gi, '#FFC300'],
  [/#C8A85D/g,  '#FFC300'],
  [/#c8a85d/gi, '#FFC300'],
  [/#B89B52/g,  '#FFC300'],
  [/#b89b52/gi, '#FFC300'],

  // ── OLD CREAM/BEIGE TEXT and SURFACE COLORS ───────────────────────────────
  // These appear as text colors on dark (navy/dark) backgrounds → #F8F4E8
  [/#F6F3EA/g,  '#F8F4E8'],
  [/#f6f3ea/gi, '#F8F4E8'],
  [/#F6F2E8/g,  '#F8F4E8'],
  [/#f6f2ea/gi, '#F8F4E8'],
  [/#f6f2e8/gi, '#F8F4E8'],
  [/#EEF3EA/g,  '#F8F4E8'],
  [/#eef3ea/gi, '#F8F4E8'],
  [/#F5E3E0/g,  '#F8F4E8'],
  [/#f5e3e0/gi, '#F8F4E8'],
  [/#E5E5E5/g,  '#F8F4E8'],
  [/#e5e5e5/gi, '#F8F4E8'],

  // ── OLD CHARCOAL/BLACK TEXT COLORS → #1F3D3A ─────────────────────────────
  // General body text was charcoal, now mapped to deep green-charcoal
  [/#3A3B4C/g,  '#1F3D3A'],
  [/#3a3b4c/gi, '#1F3D3A'],
  [/#111111/g,  '#1F3D3A'],
  [/#111/g,     '#1F3D3A'],
  [/#000000/g,  '#1F3D3A'],
  // NOTE: We do NOT replace #000 bare as it often appears in rgba() which is fine

  // ── PURE WHITE → context-dependent; on cards = #F8F4E8, on bg = #90E0EF ──
  // White used as text on dark cards → #F8F4E8
  [/#ffffff/gi, '#F8F4E8'],
  [/#fff\b/gi,  '#F8F4E8'],  // only standalone #fff
];

// ─── Tailwind class name replacements in JSX ──────────────────────────────────
// These handle tailwind utility classes used throughout JSX files
const twReplacements = [
  // bg-royal-blue was ivory before — now it should be the light blue, which is correct
  // bg-navy-gradient → emerald gradient
  [/bg-navy-gradient/g, 'bg-stationery-gradient'],
  
  // text-luxe-charcoal → now dark green-charcoal
  // (keep class name, update definition in CSS)
  
  // ivory/cream/pearl bg classes used as page/section backgrounds
  [/bg-ivory-cream\b/g, 'bg-royal-blue'],
  [/bg-pearl\b/g, 'bg-royal-blue'],
  [/bg-ivory\b/g, 'bg-royal-blue'],
  [/bg-warm-cream\b/g, 'bg-stationery-gradient'],
  [/bg-sage-tint\b/g, 'bg-royal-blue'],
  [/bg-soft-blush\b/g, 'bg-royal-blue'],

  // Text colors: old cream text on dark bg → now #F8F4E8
  [/text-ivory-cream\b/g, 'text-[#F8F4E8]'],
  [/text-pearl\b/g, 'text-[#F8F4E8]'],
  [/text-warm-cream\b/g, 'text-[#F8F4E8]'],
  [/text-soft-blush\b/g, 'text-[#F8F4E8]'],

  // Borders
  [/border-pearl\b/g, 'border-[#FFC300]'],
  [/border-ivory\b/g, 'border-[#FFC300]'],
  [/border-warm-cream\b/g, 'border-[#FFC300]'],
];

// ─── Files to process ────────────────────────────────────────────────────────
const rootDir = path.join(__dirname, 'src');
const extraFiles = [
  path.join(__dirname, 'tailwind.config.js'),
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  for (const [pattern, replacement] of twReplacements) {
    content = content.replace(pattern, replacement);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  UPDATED: ${path.relative(__dirname, filePath)}`);
    return true;
  }
  return false;
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full);
    } else if (/\.(jsx?|css)$/.test(entry.name)) {
      processFile(full);
    }
  }
}

console.log('Starting global color migration...\n');
walkDir(rootDir);
for (const f of extraFiles) processFile(f);
console.log('\nMigration complete.');
