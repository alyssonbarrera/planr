import { TaskForm } from "@/components/forms/task-form";

export default function CreateTask() {
  return (
    <div className="space-y-4 pt-6">
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Create task</h1>

        <TaskForm />
      </main>
    </div>
  );
}
