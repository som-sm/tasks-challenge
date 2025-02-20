import { Form, FormField } from "@/components/ui/form";
import { Column, Task } from "@/lib/definitions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FormItemByType } from "./FormItemByType";
import { Button } from "./ui/button";
import { z } from "zod";
import { getSchemaForCol } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormControlByType } from "./FormControlByType";

type FilterFormProps = {
  columns: Column[];
  filters: Partial<Task>;
  onFiltersChange: (filter: Partial<Task>) => void;
  onFilterDelete: (columnId: Column["id"]) => void;
};

export function FilterForm({ columns, filters, onFiltersChange, onFilterDelete }: FilterFormProps) {
  const filteredColumns = columns.filter((col) => col.id !== "title" && col.id in filters);

  const unfilteredColumns = columns.filter((col) => col.id !== "title" && !(col.id in filters));

  const handleSheetOpenChange = (open: boolean) => {
    if (open === true) {
      return;
    }

    const unsetFilterIds = Object.entries(filters).filter((entry) => entry[1] === undefined);
    unsetFilterIds.forEach(([columnId]) => onFilterDelete(columnId));
  };

  return (
    <Sheet onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button variant="default">Modify Filters</Button>
      </SheetTrigger>
      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Modify Filters</SheetTitle>
          <SheetDescription>
            Filter tasks by updating the values below. Click the + button to add more filters.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 divide-y divide-slate-200">
          {filteredColumns.length > 0 && (
            <div>
              <p className="mb-2 text-lg font-medium">Update Existing Filters</p>
              {filteredColumns.map((col) => (
                <div key={col.id} className="mb-6 flex flex-row-reverse items-center gap-4">
                  <div className="flex-1">
                    <FormControlByType
                      column={col}
                      defaultValue={filters[col.id]}
                      showRequiredIndicator={false}
                      onChange={(value) => onFiltersChange({ [col.id]: value })}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    variant="secondary"
                    className="text-2xl"
                    onClick={() => onFilterDelete(col.id)}
                  >
                    -
                  </Button>
                </div>
              ))}
            </div>
          )}
          {unfilteredColumns.length > 0 && (
            <div>
              <p className="mb-2 mt-4 text-lg font-medium">Add New Filters</p>
              {unfilteredColumns.map((col) => (
                <AddFilterForm key={col.id} column={col} onFiltersChange={onFiltersChange} />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

type AddFilterFormProps = {
  column: Column;
  onFiltersChange: FilterFormProps["onFiltersChange"];
};

function AddFilterForm({ column, onFiltersChange }: AddFilterFormProps) {
  const addFilterFormSchema = z.object({
    [column.id]: getSchemaForCol({ ...column, required: true }),
  });

  const form = useForm<z.infer<typeof addFilterFormSchema>>({
    resolver: zodResolver(addFilterFormSchema),
    defaultValues: {
      [column.id]:
        column.type === "checkbox" ? false : column.type === "enum" ? column.choices[0] : "",
    },
  });

  function handleSubmit(values: z.infer<typeof addFilterFormSchema>) {
    onFiltersChange(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mb-6 flex flex-row-reverse items-center gap-4"
      >
        <FormField
          control={form.control}
          name={column.id}
          render={({ field }) => (
            <div className="flex-1">
              <FormItemByType column={column} field={field} showRequiredIndicator={false} />
            </div>
          )}
        />
        <Button type="submit" size="icon" variant="secondary" className="text-lg">
          +
        </Button>
      </form>
    </Form>
  );
}
