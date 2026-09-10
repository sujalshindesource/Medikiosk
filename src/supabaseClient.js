import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────
// PLACEHOLDERS — replace these in the .env file at the project
// root (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY), then restart
// `npm run dev`. Until real values are supplied, isSupabaseConfigured
// is false and every screen in the app quietly runs on local/mock
// data instead of failing.
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://mjkjqomimuxswpleyepr.supabase.co';
const SUPABASE_ANON_KEY ='sb_publishable_jiSqfuAmUEW_p7fHCgt7Ow_loCXPyNO';

export const isSupabaseConfigured =
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('INSERT_YOUR') &&
  !SUPABASE_ANON_KEY.includes('INSERT_YOUR');

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * Runs a Supabase call if configured, otherwise resolves to null.
 * Never throws — every caller in this app is designed to keep working
 * on local state if the database call fails or Supabase isn't set up,
 * which matters most during a live demo.
 */
export async function safeSupabaseCall(fn) {
  if (!isSupabaseConfigured || !supabase) return { data: null, error: null, skipped: true };
  try {
    const result = await fn(supabase);
    return { ...result, skipped: false };
  } catch (err) {
    console.warn('Supabase call failed, continuing on local state:', err);
    return { data: null, error: err, skipped: false };
  }
}
