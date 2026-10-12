import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  isSupabaseConfigured,
  REMEMBER_COOKIE,
  sessionCookieOptions,
  supabaseKey,
  supabaseUrl,
} from "./env";

// Pages du back-office accessibles sans être connecté.
const PUBLIC_ADMIN_PATHS = [
  "/admin/login",
  "/admin/mot-de-passe-oublie",
  "/admin/auth/confirm",
];

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/**
 * Rafraîchit la session Supabase à chaque requête du back-office et
 * redirige vers la connexion si besoin. Les droits d'éditeur sont vérifiés
 * dans les pages et dans chaque Server Action.
 */
export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next({ request });

  const remember = request.cookies.get(REMEMBER_COOKIE)?.value !== "0";
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, sessionCookieOptions(options, remember))
        );
        Object.entries(headers ?? {}).forEach(([key, value]) =>
          response.headers.set(key, value)
        );
      },
    },
  });

  // Ne rien exécuter entre createServerClient et getClaims : la session
  // pourrait ne pas être rafraîchie correctement.
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims?.sub);
  const { pathname } = request.nextUrl;

  const redirectTo = (path: string, params?: Record<string, string>) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    Object.entries(params ?? {}).forEach(([key, value]) => url.searchParams.set(key, value));
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (!isSignedIn && !isPublicAdminPath(pathname)) {
    const next = pathname === "/admin" ? undefined : `${pathname}${request.nextUrl.search}`;
    return redirectTo("/admin/login", next ? { next } : undefined);
  }

  // Avec ?error=… (compte sans accès, lien expiré), la page de connexion
  // s'affiche même si une session existe, pour éviter une boucle de redirection.
  if (isSignedIn && pathname === "/admin/login" && !request.nextUrl.searchParams.has("error")) {
    return redirectTo("/admin/news");
  }

  return response;
}
