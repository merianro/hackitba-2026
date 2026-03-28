import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        {
          // size
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
          // variant
          "bg-sky-500 text-white hover:bg-sky-400 active:bg-sky-600 shadow-lg shadow-sky-500/25":
            variant === "primary" && !disabled,
          "bg-white/10 text-white border border-white/20 hover:bg-white/20 active:bg-white/10":
            variant === "secondary" && !disabled,
          "text-slate-300 hover:text-white hover:bg-white/10":
            variant === "ghost" && !disabled,
          "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30":
            variant === "danger" && !disabled,
          "opacity-40 cursor-not-allowed": disabled,
        },
        className
      )}
    >
      {children}
    </button>
  );
}
