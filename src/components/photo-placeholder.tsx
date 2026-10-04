import { cn } from "cn";

export function PhotoPlaceholder({
  className,
  label = "No photo yet",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] w-full items-end overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#f6d7b8,transparent_45%),linear-gradient(160deg,#e7b48a,#c4622d)]",
        className,
      )}
    >
      <span className="m-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium tracking-wide text-cocoa">
        {label}
      </span>
    </div>
  );
}
