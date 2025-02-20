import { z } from "zod";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SetRequired } from "@/types";
import { Column, Task, ValueTypeForColumn } from "./definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const assertNever = (value: never) => {
  throw new Error(`Unhandled value: ${value}`);
};

export const sortTasks = (tasks: Task[], column: SetRequired<Column, "sort">) => {
  return tasks.toSorted((taskA, taskB) => {
    const taskAValue = taskA[column.id];
    const taskBValue = taskB[column.id];

    if (taskAValue === undefined && taskBValue === undefined) {
      return 0;
    }
    if (taskAValue === undefined) {
      return 1;
    }
    if (taskBValue === undefined) {
      return -1;
    }

    if (column.type === "text" || column.type === "enum") {
      const taskAValue = taskA[column.id] as ValueTypeForColumn[typeof column.type];
      const taskBValue = taskB[column.id] as typeof taskAValue;

      if (column.sort === "asc") {
        return taskAValue.localeCompare(taskBValue);
      }
      return taskBValue.localeCompare(taskAValue);
    }

    if (column.type === "number" || column.type === "checkbox") {
      const taskAValue = Number(taskA[column.id] as ValueTypeForColumn[typeof column.type]);
      const taskBValue = Number(taskB[column.id] as typeof taskAValue);

      if (column.sort === "asc") {
        return taskAValue - taskBValue;
      }
      return taskBValue - taskAValue;
    }

    return assertNever(column.type);
  });
};

export const getColIdFromLabel = (label: string) => label.replace(/\s/g, "_").toLowerCase();

export const getSchemaForCol = (col: Column) =>
  col.id === "title"
    ? z.string().trim().min(1, { message: "Task should have title" })
    : col.type === "text"
      ? col.required
        ? z
            .string()
            .trim()
            .min(1, { message: `${col.label} cannot be empty` })
        : z
            .string()
            .trim()
            .transform((val) => val || undefined) // `undefined` let's unset non-required fields
      : col.type === "number"
        ? z.union([
            z.number(),
            z
              .string()
              .trim()
              .transform((val) => (val === "" ? undefined : Number(val)))
              .refine((val) => (val === undefined ? !col.required : !isNaN(val)), {
                message: `${col.label} should be a number`,
              }),
          ])
        : col.type === "checkbox"
          ? z.coerce.boolean()
          : col.type === "enum"
            ? z.string().refine((value) => col.choices.includes(value), {
                message: "Invalid choice",
              })
            : z.never();
