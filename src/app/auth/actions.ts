"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { AppError } from "@/utils/app-error";
import { redirect } from "next/navigation";

export async function signInWithGithub() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/auth/callback`,
    },
  });

  if (error) {
    throw new AppError(error.message);
  }

  data.url && redirect(data.url);
}
