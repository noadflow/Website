"use client";

import { cn } from "@/lib/utils";

/**
 * NoadFlow logo mark — a soft, rounded compass rose.
 * Four directional points with rounded tips (no sharp edges);
 * the north point is slightly elongated. Uses round line caps +
 * joins and CSS-variable colors so it switches with the theme.
 * Used identically in the header and footer.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("block", className)}
      fill="none"
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer ring (soft, thin) */}
      <circle cx="16" cy="16" r="13" stroke="var(--fg)" strokeWidth="1.2" opacity="0.9" />
      {/* Faint inner ring */}
      <circle cx="16" cy="16" r="9.5" stroke="var(--fg)" strokeWidth="0.6" opacity="0.28" />

      {/* Compass needle — 4-point star with ROUNDED tips.
          Each point is a smooth lens/leaf shape (quadratic Béziers)
          instead of sharp triangles. North is slightly elongated. */}
      {/* North point (longer, accent-filled, rounded tip) */}
      <path
        d="M16 3 C16.8 9, 16.8 13, 16 14.6 C15.2 13, 15.2 9, 16 3 Z"
        fill="var(--accent)"
        stroke="var(--fg)"
        strokeWidth="0.6"
      />
      {/* South point (shorter, soft, rounded) */}
      <path
        d="M16 29 C16.6 23, 16.6 19, 16 17.4 C15.4 19, 15.4 23, 16 29 Z"
        fill="var(--fg)"
        opacity="0.42"
      />
      {/* East point (short, rounded) */}
      <path
        d="M29 16 C23 16.6, 19 16.6, 17.4 16 C19 15.4, 23 15.4, 29 16 Z"
        fill="var(--fg)"
        opacity="0.42"
      />
      {/* West point (short, rounded) */}
      <path
        d="M3 16 C9 15.4, 13 15.4, 14.6 16 C13 16.6, 9 16.6, 3 16 Z"
        fill="var(--fg)"
        opacity="0.42"
      />

      {/* Cardinal tick marks (rounded caps) */}
      <g stroke="var(--fg)" strokeWidth="0.9" opacity="0.55">
        <line x1="16" y1="1.2" x2="16" y2="2.8" />
        <line x1="16" y1="29.2" x2="16" y2="30.8" />
        <line x1="1.2" y1="16" x2="2.8" y2="16" />
        <line x1="29.2" y1="16" x2="30.8" y2="16" />
      </g>

      {/* Center hub (soft, rounded) */}
      <circle cx="16" cy="16" r="2.2" fill="var(--accent)" />
      <circle cx="16" cy="16" r="2.2" fill="none" stroke="var(--fg)" strokeWidth="0.7" />
    </svg>
  );
}
