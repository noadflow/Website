"use client";

import { cn } from "@/lib/utils";

/**
 * NoadFlow logo mark — "Smooth Compass".
 *
 * A simple 4-point compass rose with a BOLD outline and genuinely
 * rounded petal tips. North is slightly elongated and accent-filled
 * so the compass reads as directional at a glance.
 *
 * Smoothness technique: each petal is a lens/leaf shape drawn with
 * cubic Béziers whose control points are spread WIDE (≈4px) relative
 * to the tip. This makes the curve approach the tip gradually and
 * round off naturally instead of pinching to a sharp point.
 *
 * Bold outline: every stroke uses a thicker width than the previous
 * logo iteration (1.6–2.0 instead of 0.6–1.2). Round caps + joins
 * throughout. CSS-variable colors so it switches with the theme.
 * Used identically in header and footer.
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
      {/*
        Outer ring — bold, single stroke. The defining outline
        of the compass.
      */}
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="var(--fg)"
        strokeWidth="2.4"
        fill="none"
      />

      {/*
        Compass petals — 4 rounded lens/leaf shapes pointing N/E/S/W.
        North is slightly longer and accent-filled. The control
        points on each side of the tip are spread wide (≈4px) so
        the tip rounds off naturally — no sharp points.
      */}
      {/* North — longer, accent-filled */}
      <path
        d="M16 3.5
           C18.4 8, 17.8 13, 16 14.6
           C14.2 13, 13.6 8, 16 3.5 Z"
        fill="var(--accent)"
        stroke="var(--fg)"
        strokeWidth="1.8"
      />
      {/* South — shorter, soft fill */}
      <path
        d="M16 28.5
           C17.2 24, 16.9 19, 16 17.4
           C15.1 19, 14.8 24, 16 28.5 Z"
        fill="var(--fg)"
        fillOpacity="0.5"
        stroke="var(--fg)"
        strokeWidth="1.8"
      />
      {/* East — short, soft fill */}
      <path
        d="M28.5 16
           C24 17.2, 19 16.9, 17.4 16
           C19 15.1, 24 14.8, 28.5 16 Z"
        fill="var(--fg)"
        fillOpacity="0.5"
        stroke="var(--fg)"
        strokeWidth="1.8"
      />
      {/* West — short, soft fill */}
      <path
        d="M3.5 16
           C8 14.8, 13 15.1, 14.6 16
           C13 16.9, 8 17.2, 3.5 16 Z"
        fill="var(--fg)"
        fillOpacity="0.5"
        stroke="var(--fg)"
        strokeWidth="1.8"
      />

      {/*
        Center hub — small filled circle at the pivot point.
        Accent-filled with a bold foreground outline.
      */}
      <circle cx="16" cy="16" r="2.4" fill="var(--accent)" />
      <circle
        cx="16"
        cy="16"
        r="2.4"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="1.6"
      />
    </svg>
  );
}
