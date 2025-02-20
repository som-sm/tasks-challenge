import { Input } from "@/components/ui/input";

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function Search({ value, onChange }: SearchProps) {
  return (
    <Input
      type="search"
      placeholder="Search Title"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
