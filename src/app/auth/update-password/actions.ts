"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { AppError } from "@/utils/app-error";
import { executeServerActionWithHandling } from "@/utils/execute-server-action-with-handling";
import { updatePasswordSchema } from "@/validations/schemas/update-password-schema";

export async function updatePasswordAction(data: FormData) {
  const result = updatePasswordSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      message: null,
      errors,
    };
  }

  const { password, code } = result.data;

  const supabase = createSupabaseServerClient();

  async function action() {
    const { error: authCodeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (authCodeError) {
      throw new AppError(authCodeError.message);
    }

    const { data, error } = await supabase.auth.updateUser({
      password,
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
