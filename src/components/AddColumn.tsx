import * as React from "react";
import { z } from "zod";
import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Column, DynamicColumn } from "../lib/definitions";
import { Remove } from "../types";
import { DYNAMIC_COLUMN_TYPES } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getColIdFromLabel } from "@/lib/utils";

type AddColumnProps = {
  columns: Column[];
  onColumnAdd: (column: Remove<DynamicColumn, "sort">) => void;
};

export function AddColumn({ columns, onColumnAdd }: AddColumnProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleColumnAdd = (column: Remove<DynamicColumn, "sort">) => {
    onColumnAdd(column);
    setIsOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">Add Column</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
            <DialogDescription>Choose a label and type for your column.</DialogDescription>
          </DialogHeader>
          <AddColumnForm columns={columns} onColumnAdd={handleColumnAdd} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} autoFocus={isOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary">Add Column</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add New Column</DrawerTitle>
          <DrawerDescription>Choose a label and type for your column.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <AddColumnForm columns={columns} onColumnAdd={handleColumnAdd} />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function AddColumnForm({ columns, onColumnAdd }: AddColumnProps) {
  const addColumnFormSchema = z.object({
    label: z
      .string()
      .trim()
      .min(1, { message: "Column should have label" })
      .refine((label) => !columns.find((col) => col.id === getColIdFromLabel(label)), {
        message: "Column with this label already exists",
      }),
    type: z.enum(["text", "number", "checkbox"], {
      message: "Column should be one of 'text', 'number', or 'checkbox' type",
    }),
  });

  const form = useForm<z.infer<typeof addColumnFormSchema>>({
    resolver: zodResolver(addColumnFormSchema),
    defaultValues: { label: "", type: "text" },
  });

  function handleSubmit(values: z.infer<typeof addColumnFormSchema>) {
    const { label, type } = values;
    onColumnAdd({ id: getColIdFromLabel(label), label, type, required: false });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Column Label{" "}
                <span className="text-sm text-red-600" aria-hidden>
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter Label" {...field} />
              </FormControl>
              <FormDescription className="sr-only">This is your column name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Column Type{" "}
                <span className="text-sm text-red-600" aria-hidden>
                  *
                </span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Column Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DYNAMIC_COLUMN_TYPES.map((type) => (
                    <SelectItem key={type.type} value={type.type}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="sr-only">
                This is the type of values the column will store
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" className="mt-4 w-full">
            Add Column
          </Button>
        </div>
      </form>
    </Form>
  );
}
