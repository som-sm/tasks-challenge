import { Column, Task, ValueTypeForColumn } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { Pill } from "./Pill";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type FilterPillsProps = {
  columns: Column[];
  filters: Partial<Task>;
  onFilterDelete: (columnId: Column["id"]) => void;
};

export function FilterPills({ columns, filters, onFilterDelete }: FilterPillsProps) {
  if (Object.keys(filters).length <= 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {Object.entries(filters)
        .filter((entry) => entry[1] !== undefined)
        .map(([colId, filterValue]) => {
          const column = columns.find((col) => col.id === colId)!;

          return (
            <Pill
              key={colId}
              variant="relaxed"
              slot={
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Delete ${column.label} filter`}
                  onClick={() => onFilterDelete(colId)}
                  className="hover:bg-trasparent h-auto p-px [&:focus-visible>svg]:stroke-current [&:hover>svg]:stroke-current [&_svg]:size-3 [&_svg]:stroke-zinc-500"
                >
                  {<X />}
                </Button>
              }
            >
              {column.label}:{" "}
              <span className={cn("font-semibold", column.type === "enum" && "capitalize")}>
                {column.type === "enum"
                  ? (filterValue as ValueTypeForColumn[typeof column.type]).replace(/_/g, " ")
                  : column.type === "checkbox"
                    ? filterValue
                      ? "Yes"
                      : "No"
                    : filterValue}
              </span>
            </Pill>
          );
        })}
    </div>
  );
}
