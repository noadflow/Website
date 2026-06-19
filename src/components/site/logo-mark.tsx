"use client";

import { cn } from "@/lib/utils";

/**
 * NoadFlow logo mark — "Compass Needle" (recreated from reference).
 *
 * Structure (matches the user's reference image):
 *   1. Outer circle split diagonally (lower-left → upper-right)
 *      into two colored halves. No outer outline — the halves
 *      themselves define the edge.
 *   2. A vertical NEEDLE (thin diamond, pointed at both ends)
 *      overlaid in the center, in the card color so it shows
 *      clearly against both halves. This is what makes it a
 *      compass, not a pokeball.
 *   3. A small dot at the pivot point (where the needle's
 *      waist sits), in the primary color.
 *
 * Theme adaptation (per user spec):
 *   - Dark theme:  upper-left half = white,      lower-right half = light grey
 *   - Light theme: upper-left half = dark grey,  lower-right half = light grey
 *                  (opposite of dark — primary swaps to dark)
 *
 *   The needle is always the card color (dark in dark theme,
 *   white in light theme) so it contrasts against both halves.
 *   The center dot is always the primary color (matches the
 *   upper-left half).
 *
 * The whole mark rotates 180° smoothly on hover (configured on
 * the parent <button> via group-hover:rotate-180). Used
 * identically in header and footer.
 */
export function LogoMark({ className }: { className?: string }) {
  // Outer circle: r=13, center (16,16). Diagonal goes from
  // lower-left edge to upper-right edge at 45°. Perimeter points
  // at 45° are at (16 ± 13/√2, 16 ∓ 13/√2) ≈ (6.81, 25.19) and
  // (25.19, 6.81).
  const lx = 6.81; // lower-left x
  const ly = 25.19; // lower-left y
  const ux = 25.19; // upper-right x
  const uy = 6.81; // upper-right y

  // Needle vertices — a thin vertical diamond, pointed at top
  // and bottom, narrow waist at the center. Extends from near
  // the top of the circle to near the bottom.
  const nTipY = 3.5; // top tip (just inside the circle top)
  const bTipY = 28.5; // bottom tip
  const wRight = 18.4; // right waist x
  const wLeft = 13.6; // left waist x
  const waistY = 16; // waist y (center)

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
        Diagonal division line — card-colored, thin. Visible
        across the outer ring (the needle covers the middle
        portion). Sits on top of the two halves.
      */}
      <line
        x1={lx}
        y1={ly}
        x2={ux}
        y2={uy}
        stroke="var(--card)"
        strokeWidth="1.2"
      />

      {/*
        THE NEEDLE — vertical diamond, pointed at top and bottom,
        narrow waist at center. Card-colored so it shows clearly
        against both halves. This is what makes it a compass,
        not a pokeball.
      */}
      <path
        d={`M 16 ${nTipY}
            L ${wRight} ${waistY}
            L 16 ${bTipY}
            L ${wLeft} ${waistY}
            Z`}
        fill="var(--card)"
      />

      {/*
        Center dot — primary color at the needle's pivot point.
        Small radius so it reads as a pivot, not a button.
      */}
      <circle cx="16" cy="16" r="1.4" fill="var(--fg)" />
    </svg>
  );
}
