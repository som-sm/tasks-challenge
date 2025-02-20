import * as React from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Column, Task } from "@/lib/definitions";
import { FormItemByType } from "./FormItemByType";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Except, SetOptional } from "type-fest";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSchemaForCol } from "@/lib/utils";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "usehooks-ts";
import { X } from "lucide-react";

type TaskFormDialogContentProps = {
  task?: Task;
  columns: Column[];
  onTaskUpdate: (task: SetOptional<Task, "id">) => void;
  title: string;
  description: string;
  ctaLabel: string;
};

export function TaskFormDialogContent(props: TaskFormDialogContentProps) {
  const { title, description, ...restProps } = props;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <TaskForm {...restProps} />
      </DialogContent>
    );
  }

  return (
    <DrawerContent>
      <div className="max-h-[70dvh] overflow-auto">
        <DrawerHeader className="sticky top-0 z-10 bg-white text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <TaskForm {...restProps} />
        </div>
        <DrawerFooter className="sticky bottom-0 bg-white pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
}

function TaskForm({
  columns,
  task,
  onTaskUpdate,
  ctaLabel,
}: Except<TaskFormDialogContentProps, "title" | "description">) {
  const taskFormSchema = z.object(
    Object.fromEntries(columns.map((col) => [col.id, getSchemaForCol(col)])),
  );

  const defaultValues = React.useMemo(
    () =>
      Object.fromEntries(
        columns.map((col) => [
          col.id,
          task?.[col.id] === undefined
            ? col.type === "checkbox"
              ? false
              : col.type === "enum"
                ? col.choices[0]
                : ""
            : task[col.id],
        ]),
      ),
    [columns, task],
  );

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  function handleSubmit(values: z.infer<typeof taskFormSchema>) {
    onTaskUpdate(values as Except<Task, "id">);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 md:-mx-6 md:max-h-[70dvh] md:overflow-auto md:px-6"
      >
        {columns.map((col) => (
          <FormField
            key={col.id}
            control={form.control}
            name={col.id}
            render={({ field }) => <FormItemByType column={col} field={field} />}
          />
        ))}
        <div className="sticky bottom-[60px] bg-white md:bottom-0">
          <Button type="submit" className="mt-4 w-full">
            {ctaLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
