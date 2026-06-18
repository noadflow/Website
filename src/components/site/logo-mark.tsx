"use client";

import { cn } from "@/lib/utils";

/**
 * NoadFlow logo mark — a minimalist compass rose.
 * Four directional points; the north point is elongated and sharper.
 * Uses CSS-variable colors so it switches with the theme.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("block", className)}
      fill="none"
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="16" cy="16" r="13" stroke="var(--fg)" strokeWidth="1.2" opacity="0.9" />
      {/* Faint inner ring */}
      <circle cx="16" cy="16" r="9.5" stroke="var(--fg)" strokeWidth="0.6" opacity="0.28" />

      {/* Compass needle — 4-point star, north elongated & sharp */}
      {/* North point (long, sharp, accent-filled) */}
      <path
        d="M16 2.2 L18 16 L16 14.4 L14 16 Z"
        fill="var(--accent)"
        stroke="var(--fg)"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* South point (shorter, soft) */}
      <path
        d="M16 26.4 L17.6 16 L16 17.2 L14.4 16 Z"
        fill="var(--fg)"
        opacity="0.42"
        strokeLinejoin="round"
      />
      {/* East point (short) */}
      <path
        d="M26.4 16 L16 17.6 L17.2 16 L16 14.4 Z"
        fill="var(--fg)"
        opacity="0.42"
        strokeLinejoin="round"
      />
      {/* West point (short) */}
      <path
        d="M5.6 16 L16 14.4 L14.8 16 L16 17.6 Z"
        fill="var(--fg)"
        opacity="0.42"
        strokeLinejoin="round"
      />

      {/* Cardinal tick marks */}
      <g stroke="var(--fg)" strokeWidth="0.9" strokeLinecap="round" opacity="0.55">
        <line x1="16" y1="0.8" x2="16" y2="2.6" />
        <line x1="16" y1="29.4" x2="16" y2="31.2" />
        <line x1="0.8" y1="16" x2="2.6" y2="16" />
        <line x1="29.4" y1="16" x2="31.2" y2="16" />
      </g>

      {/* Center hub */}
      <circle cx="16" cy="16" r="2" fill="var(--accent)" />
      <circle cx="16" cy="16" r="2" fill="none" stroke="var(--fg)" strokeWidth="0.7" />
    </svg>
  );
}
