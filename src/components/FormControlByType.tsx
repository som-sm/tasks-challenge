import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Column, Task, ValueTypeForColumn } from "@/lib/definitions";
import { assertNever } from "@/lib/utils";

type FormControlByTypeProps = {
  column: Column;
  defaultValue?: Task[string];
  showRequiredIndicator?: boolean;
  onChange?: (value: ValueTypeForColumn[Column["type"]] | undefined) => void;
};

export function FormControlByType(props: FormControlByTypeProps) {
  const { column, showRequiredIndicator = true } = props;

  return (
    <div className={column.type === "checkbox" ? "flex items-center gap-2" : ""}>
      <Label htmlFor={column.id}>
        {column.label}{" "}
        {showRequiredIndicator && column.required && (
          <span className="text-sm text-red-600">*</span>
        )}
      </Label>
      <FormControl {...props} />
    </div>
  );
}

function FormControl({
  column,
  defaultValue,
  onChange,
}: Omit<FormControlByTypeProps, "showRequiredIndicator">) {
  if (column.type === "text" || column.type === "number") {
    return (
      <Input
        type={column.type}
        id={column.id}
        name={column.id}
        placeholder={`Enter ${column.label}`}
        required={column.required}
        defaultValue={defaultValue as ValueTypeForColumn[typeof column.type]}
        onChange={(e) => {
          const { value } = e.target;
          return onChange?.(
            value === "" ? undefined : column.type === "text" ? value : Number(value),
          );
        }}
      />
    );
  }

  if (column.type === "checkbox") {
    return (
      <Switch
        id={column.id}
        name={column.id}
        required={column.required}
        defaultChecked={defaultValue as ValueTypeForColumn[typeof column.type]}
        onCheckedChange={onChange}
      />
    );
  }

  if (column.type === "enum") {
    return (
      <Select
        name={column.id}
        required={column.required}
        defaultValue={defaultValue as ValueTypeForColumn[typeof column.type]}
        onValueChange={onChange}
      >
        <SelectTrigger className="capitalize">
          <SelectValue placeholder={`Select ${column.label}`} />
        </SelectTrigger>
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
