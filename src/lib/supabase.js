/**
 * src/lib/supabase.js
 *
 * Central Supabase client — import { supabase } wherever you need DB access.
 *
 * Env vars (set in .env.local — never commit these):
 *   VITE_SUPABASE_URL      — your project URL
 *   VITE_SUPABASE_ANON_KEY — public anon key (safe to use in browser)
 *
 * If either var is missing the client throws an explicit error at startup
 * rather than a cryptic 400 from Supabase later.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[supabase.js] Missing environment variables.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // This is a public invitation site — no persistent session needed
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,  // throttle realtime for mobile battery
    },
  },
});