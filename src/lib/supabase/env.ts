export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

// Nouvelle clé « publishable » (sb_publishable_…) ou ancienne clé « anon ».
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const NEWS_IMAGES_BUCKET = "news-images";

// Cookie posé à la connexion quand « Rester connecté » est décoché :
// les cookies de session Supabase deviennent alors des cookies de session
// du navigateur (supprimés à sa fermeture).
export const REMEMBER_COOKIE = "afz_remember";

type CookieOptions = { maxAge?: number; expires?: Date; [key: string]: unknown };

export function sessionCookieOptions<T extends CookieOptions>(
  options: T,
  remember: boolean
): T {
  if (remember) return options;
  // Une suppression de cookie (maxAge 0) doit rester une suppression.
  if (options.maxAge === 0) return options;
  const { maxAge, expires, ...rest } = options;
  void maxAge;
  void expires;
  return rest as T;
}
