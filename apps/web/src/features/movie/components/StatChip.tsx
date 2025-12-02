export function StatChip({
  label,
  value,
  size = "md",
}: {
  label: string;
  value: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={`flex flex-col items-start justify-center rounded-[4px] bg-card/75 p-4 backdrop-blur-sm border border-border/10 ${size === "sm" ? "min-w-[120px]" : "w-full"}`}
    >
      <span className="mb-1 text-xs font-bold uppercase text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
