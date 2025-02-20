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
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Ban,
  EllipsisVertical,
  Trash2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Column } from "@/lib/definitions";

type ColumnActionMenuProps = {
  column: Column;
  onColumnSort: (sort: Column["sort"]) => void;
  onColumnDelete: () => void;
};

export function ColumnActionMenu({
  column: { sort, required },
  onColumnSort,
  onColumnDelete,
}: ColumnActionMenuProps) {
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-2 py-0">
            <EllipsisVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sort && (
            <DropdownMenuItem onSelect={() => onColumnSort(undefined)}>
              <Ban size={16} /> Clear Sort
            </DropdownMenuItem>
          )}
          {sort !== "asc" && (
            <DropdownMenuItem onSelect={() => onColumnSort("asc")}>
              <ArrowUpNarrowWide size={16} /> Sort Ascending
            </DropdownMenuItem>
          )}
          {sort !== "desc" && (
            <DropdownMenuItem onSelect={() => onColumnSort("desc")}>
              <ArrowDownNarrowWide size={16} /> Sort Descending
            </DropdownMenuItem>
          )}
          {!required && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                <Trash2 size={16} /> Delete Column
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {!required && (
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={onColumnDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
