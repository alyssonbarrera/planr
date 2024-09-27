import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { DangerZoneCard } from "@/components/danger-zone-card";
import { DeleteTaskButton } from "@/components/delete-task-button";
import { TaskForm } from "@/components/forms/task-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

import { ToogleTaskCompleteButton } from "@/components/toogle-task-complete-button";
import { cookies } from "next/headers";

dayjs.extend(relativeTime);

type TaskProps = {
  params: {
    id: string;
  };
};

export const runtime = "edge";

export default async function Task({ params }: TaskProps) {
  const { id } = params;

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      "id, title, description, due_date, completed_at, created_at, subtasks:subtasks(*)"
    )
    .eq("id", id);

  if (error) {
    throw error;
  }

  const task = data[0];

  if (!task) {
    return (
      <p className="text-sm text-muted-foreground text-center">
        Task not found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Card key={task.id} className="relative flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
          <CardDescription className="leading-relaxed">
            {task.description}
          </CardDescription>
        </CardHeader>

        <ToogleTaskCompleteButton task={task} />

        <CardFooter className="flex items-center gap-1.5">
          <div className="*:truncate *:text-xs *:text-muted-foreground">
            <span>
              Created {dayjs(task.created_at).format("D [de] MMMM [de] YYYY")} |{" "}
              {dayjs(task.created_at).fromNow()}
            </span>

            {task.completed_at && (
              <div>
                <span>
                  Completed{" "}
                  {dayjs(task.completed_at).format("D [de] MMMM [de] YYYY")} |{" "}
                </span>
                <span>{dayjs(task.completed_at).fromNow()}</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task settings</CardTitle>
          <CardDescription>Update task details</CardDescription>
        </CardHeader>

        <CardContent>
          <TaskForm isUpdating initialData={task} />
        </CardContent>
      </Card>

      <DangerZoneCard
        title="Delete task"
        description="This action cannot be undone. This will permanently delete this task."
      >
        <DeleteTaskButton taskId={task.id} />
      </DangerZoneCard>
    </div>
  );
}
