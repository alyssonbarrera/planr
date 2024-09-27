import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
import { ToogleTaskCompleteButton } from "@/components/toogle-task-complete-button";

dayjs.extend(relativeTime);

export const runtime = "edge";

export default async function Home() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      "id, title, description, due_date, completed_at, created_at, subtasks:subtasks(*)"
    )
    .order("completed_at", {
      nullsFirst: true,
    });

  if (error) {
    throw error;
  }

  return (
    <main className="space-y-4">
      <div className="mx-auto w-full max-w-[1200px] xl:px-0">
        <div className="flex items-center justify-center">
          <Button size="sm" variant="ghost" asChild>
            <Link href={"/create-task"}>
              <Plus className="mr-2 size-4" />
              Create task
            </Link>
          </Button>
        </div>
      </div>

      {data?.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          No tasks found. Create a new one.
        </p>
      )}

      {data && data?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.map((task) => (
            <Card
              key={task.id}
              className={cn(
                "relative flex flex-col justify-between",
                task.completed_at && "opacity-50"
              )}
            >
              <CardHeader className="relative">
                <CardTitle
                  className={cn(
                    "text-xl font-medium",
                    task.completed_at && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 leading-relaxed">
                  {task.description}
                </CardDescription>
              </CardHeader>

              <ToogleTaskCompleteButton task={task} />

              <CardContent>
                <h2 className="text-base font-medium border-b pb-1">
                  Subtasks
                </h2>

                {task.subtasks?.length === 0 && (
                  <p className="text-muted-foreground text-xs pt-3">
                    No subtasks found.
                  </p>
                )}

                <ul className="space-y-1 pt-2">
                  {task.subtasks?.map((subtask) => (
                    <li key={subtask.id} className="flex items-center gap-1">
                      <span
                        className={`${
                          subtask.completed_at
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex items-center gap-1.5">
                <div>
                  <span className="truncate text-xs text-muted-foreground">
                    Created {dayjs(task.created_at).fromNow()}
                  </span>

                  {!task.completed_at &&
                    dayjs(task.due_date).isBefore(dayjs()) && (
                      <span className="text-xs block text-muted-foreground">
                        Overdue
                      </span>
                    )}

                  {!task.completed_at &&
                    !dayjs(task.due_date).isBefore(dayjs()) && (
                      <span className="text-xs block text-muted-foreground">
                        Due {dayjs(task.due_date).fromNow()}
                      </span>
                    )}

                  {task.completed_at && (
                    <span className="text-xs block text-muted-foreground">
                      Completed {dayjs(task.completed_at).fromNow()}
                    </span>
                  )}
                </div>

                <Button size="xs" variant="outline" className="ml-auto" asChild>
                  <Link href={`/tasks/${task.id}`}>
                    View <ArrowRight className="ml-2 size-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
