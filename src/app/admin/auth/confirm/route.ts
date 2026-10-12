import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Lien reçu par e-mail (réinitialisation du mot de passe, invitation).
 * Accepte le flux PKCE (?code=…) et le flux « token hash »
 * (?token_hash=…&type=…, avec le modèle d'e-mail conseillé dans le README).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const nextParam = searchParams.get("next") ?? "/admin/news";
  const next = nextParam.startsWith("/admin/") && !nextParam.startsWith("//") ? nextParam : "/admin/news";

  const supabase = await createClient();
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  }

  const url = request.nextUrl.clone();
  url.search = "";
  if (ok) {
    url.pathname = next;
  } else {
    url.pathname = "/admin/login";
    url.searchParams.set("error", "lien");
  }
  return NextResponse.redirect(url);
}
