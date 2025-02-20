import * as React from "react";
import { Column, Task, ValueTypeForColumn } from "../lib/definitions";
import { Highlight } from "./Highlight";
import { Pill } from "./Pill";
import { TaskActionMenu } from "./TaskActionMenu";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColumnActionMenu } from "./ColumnActionMenu";
import { Button } from "./ui/button";

type TasksTableProps = {
  columns: Column[];
  onColumnSort: (column: Column["id"], sort: Column["sort"]) => void;
  onColumnDelete: (columnId: Column["id"]) => void;
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: number) => void;
  searchTerm: string;
};

export function TasksTable({
  columns,
  onColumnSort,
  onColumnDelete,
  tasks,
  onTaskUpdate,
  onTaskDelete,
  searchTerm,
}: TasksTableProps) {
  if (tasks.length === 0) {
    return <p className="my-8 text-base">No tasks found!</p>;
  }

  return (
    <div className="overflow-auto">
      <div className="space-y-3 text-base md:hidden">
        {tasks.map((task) => (
          <div key={task.id} className="border border-input bg-white px-6 py-4">
            <div className="flex items-center justify-between gap-4 border-b border-b-input pb-4">
              <p className="text-xl font-medium [overflow-wrap:anywhere]">
                <span className="sr-only">Title: </span>
                <Highlight term={searchTerm}>{task.title}</Highlight>
              </p>
              <TaskActionMenu
                task={task}
                columns={columns}
                onTaskUpdate={onTaskUpdate}
                onTaskDelete={onTaskDelete}
              />
            </div>
            <div className="mt-4 grid grid-cols-[1fr_2fr] gap-x-1.5 gap-y-4 pt-4">
              {columns.map((col) => {
                if (col.id === "title") {
                  return null;
                }

                return (
                  <React.Fragment key={col.id}>
                    <div className="text-zinc-600 [overflow-wrap:anywhere]">{col.label}</div>
                    <div>
                      {col.type === "enum" ? (
                        <Pill>
                          {(task[col.id] as ValueTypeForColumn[typeof col.type]).replace(/_/g, " ")}
                        </Pill>
                      ) : col.type === "checkbox" ? (
                        <div>{task[col.id] ? "Yes" : "No"}</div>
                      ) : (
                        <div className="[overflow-wrap:anywhere]">{task[col.id] || "-"}</div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <table className="hidden w-full table-fixed border-collapse overflow-auto text-left text-sm md:table">
        <caption className="sr-only">Tasks</caption>
        <thead className="sticky top-0 border-b border-b-zinc-400">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className={cn(
                  "border-x border-input bg-white px-4 py-5 font-medium first:sticky first:left-0 first:border-l-0 first:border-r-zinc-400 last:border-r-0",
                  "first:after:absolute first:after:inset-y-0 first:after:-right-4 first:after:left-full first:after:border-l first:after:border-l-zinc-400 first:after:bg-gradient-to-r first:after:from-input/25 first:after:to-transparent",
                  col.type === "text" ? "w-64" : "w-40",
                  col.id === "title" && (columns.length > 4 ? "w-64" : "w-auto"),
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex flex-1 items-center gap-1">
                    <span className="line-clamp-1 [overflow-wrap:anywhere]">{col.label}</span>
                    {col.sort && (
                      <Button
                        aria-label={`sorted ${col.sort === "asc" ? "ascending" : "desending"}`}
                        className="shrink-0 text-zinc-600"
                        size="icon"
                        variant="ghost"
                        onClick={() => onColumnSort(col.id, col.sort === "asc" ? "desc" : "asc")}
                      >
                        {col.sort === "asc" ? (
                          <ArrowUpNarrowWide size={15} />
                        ) : (
                          <ArrowDownNarrowWide size={15} />
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="shrink-0">
                    <ColumnActionMenu
                      column={col}
                      onColumnSort={(sort) => onColumnSort(col.id, sort)}
                      onColumnDelete={() => onColumnDelete(col.id)}
                    />
                  </div>
                </div>
              </th>
            ))}
            <th
              scope="col"
              aria-label="Actions"
              className="sticky right-0 w-16 border-l border-l-input bg-white after:absolute after:inset-y-0 after:-left-4 after:right-full after:border-r after:border-r-input after:bg-gradient-to-l after:from-input/25 after:to-transparent"
            />
          </tr>
        </thead>
        <tbody className="">
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="[&:first-child>td]:border-t-0 [&:first-child>th]:border-t-0 [&:last-child>td]:border-b-0 [&:last-child>th]:border-b-0 last:[&>td]:border-r-0"
            >
              {columns.map((col) =>
                col.id === "title" ? (
                  <th
                    key={col.id}
                    scope="row"
                    className="sticky left-0 z-10 border border-l-0 border-input border-r-zinc-400 bg-white px-4 py-5 font-medium after:absolute after:inset-y-0 after:-right-4 after:left-full after:border-l after:border-l-zinc-400 after:bg-gradient-to-r after:from-input/25 after:to-transparent"
                  >
                    <Highlight term={searchTerm}>{task.title}</Highlight>
                  </th>
                ) : (
                  <td
                    key={col.id}
                    className={"border border-input px-4 py-5 text-sm [overflow-wrap:anywhere]"}
                  >
                    {col.type === "enum" ? (
                      <div className="flex justify-center">
                        <Pill>
                          {(task[col.id] as ValueTypeForColumn[typeof col.type]).replace(/_/g, " ")}
                        </Pill>
                      </div>
                    ) : col.type === "checkbox" ? (
                      task[col.id] ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      (task[col.id] ?? "-")
                    )}
                  </td>
                ),
              )}
              <td className="sticky right-0 z-10 border border-input bg-white px-4 py-5 after:absolute after:inset-y-0 after:-left-4 after:right-full after:border-r after:border-r-input after:bg-gradient-to-l after:from-input/25 after:to-transparent">
                <TaskActionMenu
                  task={task}
                  columns={columns}
                  onTaskUpdate={onTaskUpdate}
                  onTaskDelete={onTaskDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
