"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { executeServerActionWithHandling } from "@/utils/execute-server-action-with-handling";
import { AppError } from "@/utils/app-error";
import { signUpSchema } from "@/validations/schemas/sign-up-schema";

export async function signUpWithEmailAndPassword(formData: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      message: null,
      errors,
    };
  }

  const { name, email, password } = result.data;

  async function action() {
    const supabase = createSupabaseServerClient();

    const data = {
      email: email,
      password: password,
      options: {
        data: {
          name,
        },
      },
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
      throw new AppError(error.message);
    }

    revalidatePath("/", "layout");
  }

  return await executeServerActionWithHandling({
    action,
  });
}
