import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string({
      message: "Please, provide a valid e-mail address.",
    })
    .min(4, {
      message: "Please, provide a title with at least 4 characters.",
    }),
  description: z
    .string({
      message: "Please, provide a valid description.",
    })
    .min(4, {
      message: "Please, provide a description with at least 4 characters.",
    }),
  due_date: z.string().optional(),
  priority: z.string().optional(),
  category_id: z.string().optional(),
});

export type TaskSchema = z.infer<typeof taskSchema>;
