"use server";

import { taskSchema } from "@/validations/schemas/task-schema";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { AppError } from "@/utils/app-error";

import { executeServerActionWithHandling } from "@/utils/execute-server-action-with-handling";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createTaskAction(data: FormData) {
  const result = taskSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      message: null,
      errors,
    };
  }

  const { title, description, category_id, due_date, priority } = result.data;

  const supabase = createSupabaseServerClient();

  async function executeCreateTask() {
    const { error } = await supabase
      .from("tasks")
      .insert({ title, description, category_id, due_date, priority });

    if (error) {
      throw new AppError(error.message);
    }

    revalidatePath("/");
  }

  return await executeServerActionWithHandling({
    action: executeCreateTask,
    successMessage: "Successfully saved the task.",
  });
}

export async function updateTaskAction(data: FormData) {
  const result = taskSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      message: null,
      errors,
    };
  }

  const { title, description, category_id, due_date, priority } = result.data;

  const supabase = createSupabaseServerClient();

  const taskId = cookies().get("taskId")?.value;

  async function executeUpdateTask() {
    const { error } = await supabase
      .from("tasks")
      .update({ title, description, category_id, due_date, priority })
      .eq("id", taskId);

    if (error) {
      throw new AppError(error.message);
    }

    revalidatePath(`/tasks/${taskId}`);
  }

  return await executeServerActionWithHandling({
    action: executeUpdateTask,
    successMessage: "Successfully saved the task.",
  });
}

export async function toogleTaskCompleteAction(
  id: string,
  type: "complete" | "incomplete"
) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("tasks")
    .update({
      completed_at: type === "complete" ? new Date() : null,
    })
    .eq("id", id);

  if (error) return;

  revalidatePath(`/tasks/${id}`);
  revalidatePath("/", "page");
}
