"use client";

import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/use-form-state";
import type { TaskSchema } from "@/validations/schemas/task-schema";

import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FieldErrorMessage } from "../field-error-message";
import { Textarea } from "../ui/textarea";
import {
  createTaskAction,
  updateTaskAction,
} from "@/app/(app)/create-task/actions";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type TaskFormProps = {
  isUpdating?: boolean;
  initialData?: TaskSchema & { id: string };
};

export function TaskForm({ isUpdating = false, initialData }: TaskFormProps) {
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  async function formAction(form: FormData) {
    if (isUpdating) {
      return await updateTaskAction(form, initialData?.id!);
    }

    return await createTaskAction(form);
  }

  const [{ success, message, errors }, formStateHandleSubmit, isPending] =
    useFormState(formAction, (form) => {
      form.reset();
      setSelectedDate(undefined);
    });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    formStateHandleSubmit(event);
  }

  useEffect(() => {
    setSelectedDate(
      initialData?.due_date ? new Date(initialData.due_date) : undefined
    );
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Save Task Failed</AlertTitle>

          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success && message && (
        <Alert variant="success">
          <CheckCircle className="size-4" />
          <AlertTitle>Success!</AlertTitle>

          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Task title</Label>
        <Input
          name="title"
          type="text"
          id="title"
          defaultValue={initialData?.title}
        />

        {errors?.name && (
          <FieldErrorMessage>{errors.name[0]}</FieldErrorMessage>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          id="description"
          defaultValue={initialData?.description}
        />

        {errors?.description && (
          <FieldErrorMessage>{errors.description[0]}</FieldErrorMessage>
        )}
      </div>

      <div className="space-y-1 flex flex-col">
        <Label htmlFor="description">Due date</Label>
        <Popover open={popoverIsOpen} onOpenChange={setPopoverIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("flex-1 pl-3 text-left font-normal")}
            >
              {selectedDate
                ? dayjs(selectedDate).format("DD [de] MMMM [de] YYYY")
                : "Select due date"}

              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < dayjs().startOf("day").toDate()}
              onDayClick={() => setPopoverIsOpen(false)}
            />
          </PopoverContent>
        </Popover>

        <input
          type="hidden"
          id="due_date"
          name="due_date"
          value={dayjs(selectedDate).endOf("day").toISOString()}
        />

        {errors?.due_date && (
          <FieldErrorMessage>{errors.due_date[0]}</FieldErrorMessage>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Save task"}
      </Button>
    </form>
  );
}
