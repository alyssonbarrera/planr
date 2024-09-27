import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();

  const redirectURL = request.nextUrl.clone();
  redirectURL.pathname = "/auth/sign-in";
  return NextResponse.redirect(redirectURL);
}
