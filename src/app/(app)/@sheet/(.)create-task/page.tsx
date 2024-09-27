import { TaskForm } from "@/components/forms/task-form";
import { InterceptedSheetContent } from "@/components/intercepted-sheet-content";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function CreateTask() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Create task</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <TaskForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  );
}
