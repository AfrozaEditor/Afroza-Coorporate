import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  REMEMBER_COOKIE,
  sessionCookieOptions,
  supabaseKey,
  supabaseUrl,
} from "./env";

/**
 * Client Supabase lié à la session de l'utilisateur (cookies).
 * À utiliser dans les Server Components, Server Actions et Route Handlers.
 */
export async function createClient(options: { remember?: boolean } = {}) {
  const cookieStore = await cookies();
  const remember =
    options.remember ?? cookieStore.get(REMEMBER_COOKIE)?.value !== "0";

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
            cookieStore.set(name, value, sessionCookieOptions(cookieOptions, remember))
          );
        } catch {
          // Appelé depuis un Server Component : les cookies ne peuvent pas y
          // être écrits. Le proxy rafraîchit la session à chaque requête.
        }
      },
    },
  });
}
