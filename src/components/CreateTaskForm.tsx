import * as React from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { TaskFormDialogContent } from "./TaskFormDialogContent";
import { Column, Task } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { SetOptional } from "type-fest";
import { useMediaQuery } from "usehooks-ts";

type CreateTaskFormProps = {
  columns: Column[];
  onTaskUpdate: (task: SetOptional<Task, "id">) => void;
};

export function CreateTaskForm({ columns, onTaskUpdate }: CreateTaskFormProps) {
  const [isCreateFormOpen, setIsCreateFormOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
        <DialogTrigger asChild>
          <Button>Create Task</Button>
        </DialogTrigger>
        <TaskFormDialogContent
          title="Create New Task"
          description="Update the task details using the form below."
          ctaLabel="Create Task"
          columns={columns}
          onTaskUpdate={(task) => {
            onTaskUpdate(task);
            setIsCreateFormOpen(false);
          }}
        />
      </Dialog>
    );
  }

  return (
    <Drawer open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen} autoFocus={isCreateFormOpen}>
      <DrawerTrigger asChild>
        <Button>Create Task</Button>
      </DrawerTrigger>
      <TaskFormDialogContent
        title="Create New Task"
        description="Update the task details using the form below."
        ctaLabel="Create Task"
        columns={columns}
        onTaskUpdate={(task) => {
          onTaskUpdate(task);
          setIsCreateFormOpen(false);
        }}
      />
    </Drawer>
  );
}
