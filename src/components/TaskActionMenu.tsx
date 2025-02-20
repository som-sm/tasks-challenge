import * as React from "react";
import { useMediaQuery } from "usehooks-ts";
import { EllipsisVertical, FilePenLine, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Button, buttonVariants } from "@/components/ui/button";
import { TaskFormDialogContent } from "./TaskFormDialogContent";
import { Column, Task } from "@/lib/definitions";

type TaskActionMenuProps = {
  task: Task;
  columns: Column[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: number) => void;
};

export function TaskActionMenu({ task, columns, onTaskUpdate, onTaskDelete }: TaskActionMenuProps) {
  const [isEditFormOpen, setIsEditFormOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Modal = isDesktop ? Dialog : Drawer;
  const ModalTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <Modal open={isEditFormOpen} onOpenChange={setIsEditFormOpen} autoFocus={isEditFormOpen}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-2 py-0">
              <EllipsisVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ModalTrigger asChild>
              <DropdownMenuItem>
                <FilePenLine size={16} /> Edit
              </DropdownMenuItem>
            </ModalTrigger>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                <Trash2 size={16} /> Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <TaskFormDialogContent
          title="Edit Task Details"
          description="Update the task details using the form below."
          ctaLabel="Update Task"
          task={task}
          columns={columns}
          onTaskUpdate={(fields) => {
            onTaskUpdate({ ...fields, id: task.id });
            setIsEditFormOpen(false);
          }}
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col">
              <span>This action cannot be undone. This will permanently delete your task.</span>
              <span>
                Once deleted, the task will be removed from the board and cannot be recovered.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={() => onTaskDelete(task.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Modal>
  );
}
