import { toogleTaskCompleteAction } from "@/app/(app)/create-task/actions";
import { Button } from "../ui/button";

type Task = {
  id: string;
  title: string;
  description: string;
  due_date: string;
  completed_at: string;
  created_at: string;
};

type ToogleTaskCompleteButtonProps = {
  task: Task & {
    subtasks: Task[];
  };
};

export function ToogleTaskCompleteButton({
  task,
}: ToogleTaskCompleteButtonProps) {
  return (
    <form
      action={toogleTaskCompleteAction.bind(
        null,
        task.id,
        task.completed_at ? "incomplete" : "complete"
      )}
      className="absolute right-0"
    >
      <Button
        size="xs"
        variant="default"
        className="rounded-none rounded-tr-md rounded-bl-md"
      >
        {task.completed_at ? "Mark as incomplete" : "Mark as complete"}
      </Button>
    </form>
  );
}
