"use client";

import { cn } from "@/lib/utils";

/**
 * NoadFlow logo mark — "Half-Divided Compass".
 *
 * A bold outer circle split by a clean diagonal into two halves:
 *   - top-right half = primary color (foreground — white-ish in
 *     dark theme, dark grey in light theme)
 *   - bottom-left half = secondary color (light grey in both themes,
 *     implemented as foreground at ~38% opacity so it auto-adapts)
 *
 * Inside the outer ring, a smaller solid circle (primary color)
 * sits centered, and a tiny contrasting dot at the exact center
 * completes the "target / compass" feel.
 *
 * The whole mark rotates 180° smoothly on hover (configured on
 * the parent <button> via group-hover). Uses CSS-variable colors
 * so it switches with the theme. Used identically in header/footer.
 */
export function LogoMark({ className }: { className?: string }) {
  // Diagonal endpoints for the outer-circle split.
  // Circle is centered at (16, 16) with r=13; the 45° diagonal
  // hits the perimeter at (16 ± 13/√2, 16 ± 13/√2) ≈ (6.81, 6.81)
  // and (25.19, 25.19).
  const ax = 6.81;
  const ay = 6.81;
  const bx = 25.19;
  const by = 25.19;

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
        Bottom-left half — secondary color (light grey).
        Drawn first so the primary half overlays cleanly if there
        is any sub-pixel overlap at the diagonal seam. Foreground
        at 38% opacity gives a clearly-visible light grey on both
        dark cards (looks light grey against dark) and light cards
        (looks light grey against white).
      */}
      <path
        d={`M ${ax} ${ay} A 13 13 0 0 0 ${bx} ${by} L 16 16 Z`}
        fill="var(--fg)"
        fillOpacity="0.38"
      />

      {/*
        Top-right half — primary color (full foreground).
        White-ish in dark theme, dark grey in light theme.
      */}
      <path
        d={`M ${ax} ${ay} A 13 13 0 0 1 ${bx} ${by} L 16 16 Z`}
        fill="var(--fg)"
      />

      {/*
        Bold outer ring outline — defines the circle crisply
        against any backdrop. strokeWidth 1.6 reads as confident
        without choking at small sizes.
      */}
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="1.6"
      />

      {/*
        Centered inner solid circle — primary color, with a thin
        card-colored separator ring so it reads as a distinct
        inner element rather than blending into the halves.
      */}
      <circle cx="16" cy="16" r="4.2" fill="var(--card)" />
      <circle cx="16" cy="16" r="3.4" fill="var(--fg)" />

      {/*
        Tiny center dot — secondary (light grey) so it contrasts
        against the primary-colored inner circle. The "pin" at
        the heart of the compass.
      */}
      <circle
        cx="16"
        cy="16"
        r="1.1"
        fill="var(--fg)"
        fillOpacity="0.38"
      />
    </svg>
  );
}
