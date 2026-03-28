import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, glow, children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6",
        { "shadow-xl shadow-sky-500/10 ring-1 ring-sky-500/20": glow },
        className
      )}
    >
      {children}
    </div>
  );
}
