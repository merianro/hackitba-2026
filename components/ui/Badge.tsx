import { clsx } from "clsx";

interface BadgeProps {
  label: string;
  variant?: "blue" | "green" | "amber" | "red" | "purple" | "neutral";
  size?: "sm" | "md";
}

export function Badge({ label, variant = "blue", size = "sm" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-semibold tracking-wide",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        {
          "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30": variant === "blue",
          "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30": variant === "green",
          "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30": variant === "amber",
          "bg-red-500/15 text-red-300 ring-1 ring-red-500/30": variant === "red",
          "bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/30": variant === "purple",
          "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30": variant === "neutral",
        }
      )}
    >
      {label}
    </span>
  );
}
