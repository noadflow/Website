"use client";

import { cn } from "@/lib/utils";

/**
 * NoadFlow logo mark — "Half-Divided Target".
 *
 * Recreated from the user's reference:
 *   - Outer circle split by a visible diagonal line into two
 *     colored halves (lower-left → upper-right diagonal).
 *   - Solid inner circle (card-colored) sits on top, covering
 *     the center — creates the "target" look.
 *   - Tiny center dot (primary-colored) sits inside the inner
 *     circle.
 *   - No outer outline; the halves themselves define the edge.
 *
 * Theme adaptation (per user spec):
 *   - Dark theme:  half1 = white,        half2 = light grey
 *   - Light theme: half1 = dark grey,    half2 = light grey
 *                  (opposite of dark — primary swaps to dark)
 *
 *   The inner circle is always the card/background color so it
 *   contrasts against both halves in both themes. The center dot
 *   always matches half1 (the primary). The diagonal line is
 *   always the card color so it reads as a clean dividing line.
 *
 * The whole mark rotates 180° smoothly on hover (configured on
 * the parent <button> via group-hover:rotate-180). Used
 * identically in header and footer.
 */
export function LogoMark({ className }: { className?: string }) {
  // Outer circle: r=13, center (16,16). Diagonal goes from
  // lower-left edge (7:30 position) through center to upper-right
  // edge (1:30 position). At 45°, the perimeter points are at
  // (16 ± 13/√2, 16 ± 13/√2) ≈ (6.81, 25.19) and (25.19, 6.81).
  const lx = 6.81; // lower-left x
  const ly = 25.19; // lower-left y
  const ux = 25.19; // upper-right x
  const uy = 6.81; // upper-right y

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
        Lower-right half — secondary color (light grey in both
        themes). Drawn first so the primary half overlays cleanly
        at the diagonal seam. Foreground at 35% opacity gives a
        clear light grey on both dark and light cards.
      */}
      <path
        d={`M ${ux} ${uy} A 13 13 0 0 1 ${lx} ${ly} L 16 16 Z`}
        fill="var(--fg)"
        fillOpacity="0.35"
      />

      {/*
        Upper-left half — primary color (white in dark theme,
        dark grey in light theme). Full-opacity foreground.
      */}
      <path
        d={`M ${lx} ${ly} A 13 13 0 0 1 ${ux} ${uy} L 16 16 Z`}
        fill="var(--fg)"
      />

      {/*
        Diagonal division line — card-colored, thin. Drawn on top
        of the two halves so the split reads as a clean line. The
        inner circle (next) will cover the middle portion, leaving
        the line visible only on the outer ring — matching the
        reference image.
      */}
      <line
        x1={lx}
        y1={ly}
        x2={ux}
        y2={uy}
        stroke="var(--card)"
        strokeWidth="1.4"
      />

      {/*
        Inner solid circle — card-colored. Sits on top of the
        halves + diagonal line, creating the "target" look.
        Radius 4.5 ≈ 35% of outer radius (reference shows ~33%).
      */}
      <circle cx="16" cy="16" r="4.5" fill="var(--card)" />

      {/*
        Center dot — primary color, matching the upper-left half.
        Radius 1.5 ≈ 12% of outer radius (reference shows ~10%).
      */}
      <circle cx="16" cy="16" r="1.5" fill="var(--fg)" />
    </svg>
  );
}
