import "server-only";

import { createClient } from "@supabase/supabase-js";

import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./env";

/**
 * Client sans session pour les pages publiques : il ne lit pas les cookies,
 * ce qui permet de garder ces pages en cache (ISR).
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
