import { cn } from "@/lib/utils";

type PillProps = {
  variant?: "normal" | "relaxed";
  children: React.ReactNode;
  slot?: React.ReactNode;
};

export function Pill({ variant = "normal", children, slot }: PillProps) {
  return (
    <div
      className={cn(
        "relative isolate flex w-fit items-center gap-2 bg-zinc-50 px-4 py-1 text-xs font-medium",
        "after:absolute after:-inset-y-px after:-left-1 after:-right-1 after:-z-10 after:border-y after:border-y-zinc-200",
        "before:absolute before:-inset-x-px before:-bottom-1 before:-top-1 before:-z-10 before:border-x before:border-x-zinc-200 before:bg-transparent",
        variant === "relaxed" && "text-sm",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="max-w-40 overflow-hidden overflow-ellipsis whitespace-nowrap md:max-w-64">
          {children}
        </span>
        {slot}
      </div>
    </div>
  );
}
