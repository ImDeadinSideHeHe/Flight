import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(
  /\/rest\/v1\/?$/,
  "",
);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

let transientSupabase = null;

export function createSupabaseTransientClient() {
  if (!isSupabaseConfigured) return null;

  if (!transientSupabase) {
    transientSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
        storageKey: "fontend-st-user-management-signup",
      },
    });
  }

  return transientSupabase;
}
