import { createClient } from '@supabase/supabase-js';

/** @type {string} URL publique du projet Supabase — Settings → API → Project URL */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/** @type {string} Clé anon/public — Settings → API → Project API keys → anon */
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[supabase] VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis dans .env'
  );
}

/**
 * Client Supabase singleton — à importer dans toute l'application.
 *
 * Usage :
 *   import { supabase } from '@/lib/supabase';
 *   const { data, error } = await supabase.from('artworks').select('*');
 *
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
