import { createBrowserClient } from "@supabase/ssr";

import { supabaseKey, supabaseUrl } from "./env";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

/** Client Supabase côté navigateur (envoi des images vers le Storage). */
export function createClient() {
  browserClient ??= createBrowserClient(supabaseUrl, supabaseKey);
  return browserClient;
}
