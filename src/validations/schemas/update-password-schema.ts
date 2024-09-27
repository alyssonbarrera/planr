import { z } from "zod";

export const updatePasswordSchema = z
  .object({
    password: z
      .string({
        message: "Please, provide a valid password.",
      })
      .min(6, {
        message: "Please, provide a password with at least 6 characters.",
      }),
    password_confirmation: z
      .string({
        message: "Please, provide a valid password.",
      })
      .min(6, {
        message: "Please, provide a password with at least 6 characters.",
      }),
    code: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password confirmation does not match.",
    path: ["password_confirmation"],
  });
