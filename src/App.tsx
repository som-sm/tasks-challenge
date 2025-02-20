import * as React from "react";
import { useLocalStorage } from "usehooks-ts";
import { SetOptional } from "type-fest";
import { mockColumns, mockTasks } from "./lib/mocks";
import { Remove } from "./types";
import { Column, DynamicColumn, Task, ValueTypeForColumn } from "./lib/definitions";
import { sortTasks } from "./lib/utils";
import { TasksTable } from "./components/TasksTable";
import { AddColumn } from "./components/AddColumn";
import { CreateTaskForm } from "./components/CreateTaskForm";
import { Search } from "./components/Search.";
import { Pagination } from "./components/Pagination";
import { FilterForm } from "./components/FilterForm";
import { FilterPills } from "./components/FilterPills";
import { MobileColumnAction } from "./components/MobileColumnAction";

export default function App() {
  const [tasks, setTasks] = useLocalStorage("gfe/tasks", mockTasks);
  const [columns, setColumns] = useLocalStorage("gfe/columns", mockColumns);
  const [filters, setFilters] = useLocalStorage<Partial<Task>>("gfe/filters", {});
  const [pageInfo, setPageInfo] = React.useState({ currentPage: 1, pageSize: 10 });
  const [searchTerm, setSearchTerm] = React.useState("");

  const searchFilteredTasks = React.useMemo(
    () => tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm, tasks],
  );

  const filteredTasks = React.useMemo(() => {
    return searchFilteredTasks.filter((task) => {
      return Object.entries(filters).every(([columnId, filterValue]) => {
        const column = columns.find((col) => col.id === columnId)!;

        if (column.type === "checkbox") {
          return (task[columnId] ?? false) === filterValue;
        }
        if (filterValue === undefined) {
          return true;
        }
        if (column.type === "text") {
          const taskValue = task[columnId] as ValueTypeForColumn[typeof column.type] | undefined;
          return taskValue
            ?.toLowerCase()
            .includes((filterValue as ValueTypeForColumn[typeof column.type]).toLowerCase());
        }
        return task[columnId] === filterValue;
      });
    });
  }, [searchFilteredTasks, filters, columns]);

  const totalPages = Math.ceil(filteredTasks.length / pageInfo.pageSize);

  if (pageInfo.currentPage > totalPages) {
    setPageInfo({ ...pageInfo, currentPage: totalPages });
  }

  const sortedTasks = React.useMemo(() => {
    const activeSortColumn = columns.find((col) => col.sort);
    if (!activeSortColumn) {
      return filteredTasks;
    }
    return sortTasks(filteredTasks, { ...activeSortColumn, sort: activeSortColumn.sort! });
  }, [columns, filteredTasks]);

  const paginatedTasks = React.useMemo(() => {
    const start = (pageInfo.currentPage - 1) * pageInfo.pageSize;
    const end = start + pageInfo.pageSize;
    return sortedTasks.slice(start, end);
  }, [pageInfo, sortedTasks]);

  const handleColumnAdd = (column: Remove<DynamicColumn, "sort">) => {
    setColumns([...columns, column]);
  };

  const handleColumnSort = (columnId: Column["id"], sort: Column["sort"]) => {
    setColumns((columns) =>
      columns.map((col) => ({ ...col, sort: col.id === columnId ? sort : undefined })),
    );
    setPageInfo((pageInfo) => ({ ...pageInfo, currentPage: 1 }));
  };

  const handleTaskUpdate = (task: SetOptional<Task, "id">) => {
    if (!task.id) {
      setTasks((tasks) => [{ ...task, id: Date.now() }, ...tasks]);
      setPageInfo((pageInfo) => ({ ...pageInfo, currentPage: 1 }));
      return;
    }

    setTasks((tasks) => tasks.map((t) => (t.id === task.id ? (task as Task) : t)));
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks((tasks) => tasks.filter((t) => t.id !== taskId));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPageInfo((pageInfo) => ({ ...pageInfo, currentPage: 1 }));
  };

  const handleFiltersChange = (filter: Partial<Task>) => {
    setFilters((filters) => ({ ...filters, ...filter }));
    setPageInfo((pageInfo) => ({ ...pageInfo, currentPage: 1 }));
  };

  const handleFilterDelete = (columnId: Column["id"]) => {
    setFilters((filters) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [columnId]: _, ...rest } = filters;
      return rest;
    });
    setPageInfo((pageInfo) => ({ ...pageInfo, currentPage: 1 }));
  };

  const handleColumnDelete = (columnId: Column["id"]) => {
    setColumns((columns) => columns.filter((col) => col.id !== columnId));
    handleFilterDelete(columnId);
  };

  return (
    <main className="mx-auto flex h-dvh max-w-6xl flex-col p-4">
      <h1 className="mb-6 flex items-center text-3xl font-normal uppercase tracking-tight [word-spacing:0.375rem]">
        Great Frontend Challenge
      </h1>
      <div className="mb-4">
        <Search value={searchTerm} onChange={handleSearchChange} />
      </div>
      <div className="mb-4 flex items-center justify-between border-b border-b-input pb-4">
        <FilterPills columns={columns} filters={filters} onFilterDelete={handleFilterDelete} />
        <div className="ml-auto">
          <FilterForm
            columns={columns}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onFilterDelete={handleFilterDelete}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 pb-6">
        <div className="md:hidden">
          <MobileColumnAction
            columns={columns}
            onColumnSort={handleColumnSort}
            onColumnDelete={handleColumnDelete}
          />
        </div>
        <AddColumn columns={columns} onColumnAdd={handleColumnAdd} />
        <CreateTaskForm columns={columns} onTaskUpdate={handleTaskUpdate} />
      </div>
      <div className="flex-1">
        <TasksTable
          columns={columns}
          onColumnSort={handleColumnSort}
          onColumnDelete={handleColumnDelete}
          tasks={paginatedTasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          searchTerm={searchTerm}
        />
      </div>
      {totalPages > 0 && (
        <div className="sticky bottom-0 z-50 -mx-4 -mb-4 mt-4 border-t border-t-input bg-white p-4">
          <Pagination
            pageInfo={pageInfo}
            totalPages={totalPages}
            onPageInfoChange={(pageInfo) => {
              document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
              setPageInfo(pageInfo);
            }}
          />
        </div>
      )}
    </main>
  );
}
