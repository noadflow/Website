"use client";

import { cn } from "@/lib/utils";

/**
 * NoadFlow logo mark — a soft, rounded compass rose.
 * Four directional petals with genuinely rounded tips
 * (control points spread wide so the curve doesn't pinch
 * to a point). North is slightly elongated. Uses round
 * line caps + joins and CSS-variable colors so it switches
 * with the theme. Used identically in the header and footer.
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
      <circle cx="16" cy="16" r="13" stroke="var(--fg)" strokeWidth="1.2" opacity="0.85" />
      {/* Faint inner ring */}
      <circle cx="16" cy="16" r="9.5" stroke="var(--fg)" strokeWidth="0.6" opacity="0.25" />

      {/*
        Compass petals — each is a smooth lens/leaf shape with a
        genuinely rounded tip. The control points are spread WIDE
        (≈4px) relative to the tip, so the curve approaches the
        tip gradually instead of pinching to a sharp point.
        North is slightly elongated and accent-filled.
      */}
      {/* North (longer, accent-filled) */}
      <path
        d="M16 4 C18.4 8, 17.8 13, 16 14.6 C14.2 13, 13.6 8, 16 4 Z"
        fill="var(--accent)"
        stroke="var(--fg)"
        strokeWidth="0.6"
      />
      {/* South (shorter, soft, rounded) */}
      <path
        d="M16 28 C17.2 24, 16.9 19, 16 17.4 C15.1 19, 14.8 24, 16 28 Z"
        fill="var(--fg)"
        opacity="0.42"
      />
      {/* East (short, rounded) */}
      <path
        d="M28 16 C24 17.2, 19 16.9, 17.4 16 C19 15.1, 24 14.8, 28 16 Z"
        fill="var(--fg)"
        opacity="0.42"
      />
      {/* West (short, rounded) */}
      <path
        d="M4 16 C8 14.8, 13 15.1, 14.6 16 C13 16.9, 8 17.2, 4 16 Z"
        fill="var(--fg)"
        opacity="0.42"
      />

      {/* Cardinal tick marks (rounded caps, soft) */}
      <g stroke="var(--fg)" strokeWidth="1" opacity="0.45" strokeLinecap="round">
        <line x1="16" y1="1.6" x2="16" y2="2.8" />
        <line x1="16" y1="29.2" x2="16" y2="30.4" />
        <line x1="1.6" y1="16" x2="2.8" y2="16" />
        <line x1="29.2" y1="16" x2="30.4" y2="16" />
      </g>

      {/* Center hub (soft, rounded) */}
      <circle cx="16" cy="16" r="2.3" fill="var(--accent)" />
      <circle cx="16" cy="16" r="2.3" fill="none" stroke="var(--fg)" strokeWidth="0.7" />
    </svg>
  );
}
