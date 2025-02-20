import { DynamicColumnTypes } from "./definitions";

export const DYNAMIC_COLUMN_TYPES = [
  { type: "number", label: "Number" },
  { type: "text", label: "Text" },
  { type: "checkbox", label: "Checkbox" },
] as const satisfies { type: DynamicColumnTypes; label: string }[];
