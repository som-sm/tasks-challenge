export type Task = {
  id: number;

  // Three mandatory columns
  title: string;
  status: string;
  priority: string;

  // Dynamic columns
  [column: string]: string | number | boolean | undefined;
};

export type ValueTypeForColumn = {
  text: string;
  number: number;
  checkbox: boolean;
  enum: string;
};

type BaseColumn = {
  id: string;
  label: string;
  required: boolean;
  sort?: "asc" | "desc";
};

export type DynamicColumnTypes = Exclude<keyof ValueTypeForColumn, "enum">;

export type Column = BaseColumn &
  ({ type: DynamicColumnTypes } | { type: "enum"; choices: string[] });

export type DynamicColumn = Extract<Column, { type: DynamicColumnTypes }> & { required: false };
