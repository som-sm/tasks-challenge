import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import { Column } from "@/lib/definitions";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Ban, Trash2 } from "lucide-react";

type MobileColumnActionProps = {
  columns: Column[];
  onColumnSort: (column: Column["id"], sort: Column["sort"]) => void;
  onColumnDelete: (columnId: Column["id"]) => void;
};

export function MobileColumnAction({
  columns,
  onColumnSort,
  onColumnDelete,
}: MobileColumnActionProps) {
  const [activeColumn, setActiveColumn] = React.useState<Column["id"] | null>(null);

  function handleAlertDialogConfirm() {
    if (activeColumn) {
      onColumnDelete(activeColumn);
      setActiveColumn(null);
    }
  }

  function handleAlertDialogTrigger(columnId: Column["id"]) {
    setActiveColumn(columnId);
  }

  function handleAlertDialogCancel() {
    setActiveColumn(null);
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Modify Columns</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            {columns.map(({ id, label, sort, required }) => (
              <DropdownMenuSub key={id}>
                <DropdownMenuSubTrigger>{label}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {sort && (
                      <DropdownMenuItem onSelect={() => onColumnSort(id, undefined)}>
                        <Ban size={16} /> Clear Sort
                      </DropdownMenuItem>
                    )}
                    {sort !== "asc" && (
                      <DropdownMenuItem onSelect={() => onColumnSort(id, "asc")}>
                        <ArrowUpNarrowWide size={16} /> Sort Ascending
                      </DropdownMenuItem>
                    )}
                    {sort !== "desc" && (
                      <DropdownMenuItem onSelect={() => onColumnSort(id, "desc")}>
                        <ArrowDownNarrowWide size={16} /> Sort Descending
                      </DropdownMenuItem>
                    )}
                    {!required && (
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={() => handleAlertDialogTrigger(id)}
                          className="text-red-600 focus:bg-red-50 focus:text-red-600"
                        >
                          <Trash2 size={16} /> Delete Column
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete column?</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col">
            <span>This action cannot be undone. This will permanently delete your column.</span>
            <span>
              Once deleted, the column and all it's associated data will be removed and cannot be
              recovered.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={handleAlertDialogCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleAlertDialogConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
