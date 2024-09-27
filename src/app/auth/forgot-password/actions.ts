"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { AppError } from "@/utils/app-error";
import { executeServerActionWithHandling } from "@/utils/execute-server-action-with-handling";
import { forgotPasswordSchema } from "@/validations/schemas/forgot-password-schema";

export async function forgotPasswordAction(data: FormData) {
  const result = forgotPasswordSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      message: null,
      errors,
    };
  }

  const { email } = result.data;

  const supabase = createSupabaseServerClient();

  async function action() {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/auth/update-password",
    });

    if (error) {
      throw new AppError(error.message);
    }
  }

  return await executeServerActionWithHandling({
    action: action,
    successMessage: "Password recovery request sent successfully.",
  });
}
