import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function auth() {
  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      redirect("/auth/sign-in");
    }

    return {
      user: data.user,
    };
  } catch {}

  redirect("/api/auth/sign-out");
}
