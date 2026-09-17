"use client";

import Link from "next/link";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "accent" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-primary-light to-primary text-on-primary shadow-soft hover:shadow-glow-primary hover:-translate-y-0.5 active:translate-y-0 active:shadow-soft",
  accent:
    "bg-gradient-to-b from-accent-light to-accent text-on-accent shadow-soft hover:shadow-glow-accent hover:-translate-y-0.5 active:translate-y-0 active:shadow-soft",
  outline:
    "border border-border-strong text-foreground hover:bg-surface-2 hover:border-primary-light",
  ghost: "text-foreground-secondary hover:bg-surface-2 hover:text-foreground",
  danger:
    "bg-gradient-to-b from-danger-light to-danger text-on-danger shadow-soft hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  loading?: boolean;
}

export function Button({ variant = "primary", size = "md", href, loading, className, children, disabled, ...rest }: ButtonProps) {
  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const content = (
    <>
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>{children}</span>
      {loading && (
        <span
          className="absolute inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-busy={loading || undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  );
}
