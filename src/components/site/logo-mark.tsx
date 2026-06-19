"use client";

import { cn } from "@/lib/utils";

/**
 * NoadFlow logo mark — "Droplet + Ripple".
 *
 * A single soft rounded droplet at the top represents one task,
 * lead, or customer message entering the system. Beneath it,
 * three concentric ripple arcs spread outward — symbolizing the
 * automated effects that ripple out from each input (responses
 * sent, workflows triggered, follow-ups scheduled).
 *
 * The droplet has a rounded (not pointed) apex thanks to cubic
 * Bézier control points placed nearly horizontal at the top, so
 * the curve flattens briefly before curving back down. All
 * strokes use round caps + joins. Uses CSS-variable colors so
 * it switches with the theme. Used identically in header/footer.
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
        Droplet — smooth rounded teardrop. Apex at (16, 4) is
        rounded (not pointed) because the cubic Bézier control
        points on either side are placed nearly horizontal, so
        the curve flattens briefly at the top before curving
        down. Body is a semicircle (radius 5) centered at (16, 13),
        bottom at y=18.
      */}
      <path
        d="M 16 4
           C 17.6 4.6, 21 9, 21 13
           A 5 5 0 1 1 11 13
           C 11 9, 14.4 4.6, 16 4 Z"
        fill="var(--accent)"
        stroke="var(--fg)"
        strokeWidth="0.6"
      />

      {/*
        Three concentric ripples — bottom halves of circles
        centered at (16, 20), just below the droplet. Each
        larger ripple is slightly thinner and more transparent,
        so the eye reads them as fading outward like real water
        ripples losing energy.
      */}
      <path
        d="M 13 20 A 3 3 0 0 1 19 20"
        stroke="var(--fg)"
        strokeWidth="1.3"
        opacity="0.75"
      />
      <path
        d="M 11 20 A 5 5 0 0 1 21 20"
        stroke="var(--fg)"
        strokeWidth="1.2"
        opacity="0.5"
      />
      <path
        d="M 9 20 A 7 7 0 0 1 23 20"
        stroke="var(--fg)"
        strokeWidth="1.1"
        opacity="0.28"
      />
    </svg>
  );
}
