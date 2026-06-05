import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const defaultEnglishContent = {
  hero: {
    couple_names: "POOJA & JAGDISH",
    date: "July 6, 2026"
  },
  venue: {
    name: "Poker Garden",
    description: "Behind Ichhapurna Balaji Temple, Sojat"
  },
  timeline: [
    { id: 1, title: 'घृतपान', time: 'July 1, 2026', desc: 'Auspicious Hour' },
    { id: 2, title: 'विनायक', time: 'July 2, 2026', desc: 'Auspicious Hour' },
    { id: 3, title: 'बड़ी बन्दोली', time: 'July 3, 2026', desc: 'Auspicious Hour' },
    { id: 4, title: 'बारात स्वागत', time: 'July 6, 2026', desc: 'Auspicious Hour' },
    { id: 5, title: 'पाणिग्रहण संस्कार', time: 'July 6, 2026', desc: 'Midnight' },
    { id: 6, title: 'प्रीतिभोज समारोह', time: 'July 6, 2026, 6:15 PM', desc: 'Poker Garden, Sojat' }
  ],
  family: {
    blessings: ["Smt. Mishri Devi &", "Late Shri Basti Ram Ji Panwar"],
    invitedBy: ["Jugraj Panwar - Vimla Devi", "Prakash Chand Panwar - Teeja Devi"],
    groomsFamily: ["Shri Chaina Ram Ji Rathore", "Smt. Sushila Devi"]
  }
};

const args = process.argv.slice(2);
const applyChanges = args.includes('--apply');

async function run() {
  console.log("=========================================");
  console.log("Supabase English Content Migration Tool");
  console.log("=========================================\n");

  console.log("Proposed English Content Specification:");
  console.log(JSON.stringify(defaultEnglishContent, null, 2));
  console.log("");

  if (!applyChanges) {
    console.log("PREVIEW ONLY: No changes have been made to the live database.");
    console.log("To apply these changes, run: node migrate_content.js --apply");
    return;
  }

  console.log("Applying migration to live Supabase database...");
  for (const [id, data] of Object.entries(defaultEnglishContent)) {
    const { error } = await supabase.from('content').upsert({ id, data });
    if (error) {
      console.error(`Failed to upsert key '${id}':`, error.message);
      console.log("Make sure you have created the 'content' table using the SQL in 'supabase_schema.sql' first!");
      process.exit(1);
    } else {
      console.log(`Successfully seeded/updated key: '${id}'`);
    }
  }
  console.log("\nMigration completed successfully.");
}

run();
