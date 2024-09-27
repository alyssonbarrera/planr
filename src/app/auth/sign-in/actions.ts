"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { executeServerActionWithHandling } from "@/utils/execute-server-action-with-handling";
import { signInSchema } from "@/validations/schemas/sign-in-schema";
import { AppError } from "@/utils/app-error";

export async function signInWithEmailAndPassword(formData: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      message: null,
      errors,
    };
  }

  const { email, password } = result.data;

  async function action() {
    const supabase = createSupabaseServerClient();

    const data = {
      email,
      password,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      throw new AppError(error.message);
    }

    revalidatePath("/", "layout");
  }

  return await executeServerActionWithHandling({
    action,
  });
}
