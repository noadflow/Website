"use client";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("block", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" stroke="var(--fg)" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="3.4" fill="var(--accent)" />
      <circle cx="16" cy="3.2" r="1.9" fill="var(--fg)" />
      <circle cx="28.8" cy="16" r="1.9" fill="var(--fg)" />
      <circle cx="16" cy="28.8" r="1.9" fill="var(--fg)" />
      <circle cx="3.2" cy="16" r="1.9" fill="var(--fg)" />
      <line x1="16" y1="16" x2="16" y2="3.2" stroke="var(--fg)" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="16" x2="28.8" y2="16" stroke="var(--fg)" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="16" x2="16" y2="28.8" stroke="var(--fg)" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="16" x2="3.2" y2="16" stroke="var(--fg)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
