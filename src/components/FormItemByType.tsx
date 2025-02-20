import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Column, ValueTypeForColumn } from "@/lib/definitions";
import { assertNever } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";

type FormItemByTypeProps = {
  column: Column;
  showRequiredIndicator?: boolean;
  field: ControllerRenderProps<{ [x: string]: string | number | boolean | undefined }, string>;
};

export function FormItemByType(props: FormItemByTypeProps) {
  const { column, showRequiredIndicator = true } = props;

  return (
    <FormItem className={column.type === "checkbox" ? "flex items-center gap-2 space-y-0" : ""}>
      <FormLabel>
        {column.label}{" "}
        {showRequiredIndicator && column.required && (
          <span className="text-sm text-red-600" aria-hidden>
            *
          </span>
        )}
      </FormLabel>
      <FormItemByTypeFormControl {...props} />
      <FormDescription className="sr-only">Task's ${column.label}</FormDescription>
      <FormMessage />
    </FormItem>
  );
}

function FormItemByTypeFormControl({
  column,
  field,
}: Omit<FormItemByTypeProps, "showRequiredIndicator">) {
  if (column.type === "text" || column.type === "number") {
    return (
      <>
        <FormControl>
          <Input
            placeholder={`Enter ${column.label}`}
            type={column.type}
            {...(field as ControllerRenderProps<
              Record<string, ValueTypeForColumn[typeof column.type]>,
              string
            >)}
          />
        </FormControl>
      </>
    );
  }

  if (column.type === "checkbox") {
    const { value, onChange } = field as ControllerRenderProps<
      Record<string, ValueTypeForColumn[typeof column.type]>,
      string
    >;
    return (
      <FormControl>
        <Switch checked={value} onCheckedChange={onChange} />
      </FormControl>
    );
  }

  if (column.type === "enum") {
    const { value, onChange } = field as ControllerRenderProps<
      Record<string, ValueTypeForColumn[typeof column.type]>,
      string
    >;
    return (
      <Select onValueChange={onChange} value={value}>
        <FormControl>
          <SelectTrigger className="capitalize">
            <SelectValue placeholder={`Select ${column.label}`} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {column.choices.map((choice) => (
            <SelectItem key={choice} value={choice} className="capitalize">
              {choice.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return assertNever(column.type);
}
