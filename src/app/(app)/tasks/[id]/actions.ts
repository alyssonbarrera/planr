"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";

export async function deleteTaskAction(id: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from("tasks").delete().eq("id", id);

  redirect("/");
}
