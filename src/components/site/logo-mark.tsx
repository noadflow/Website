"use client";

import { cn } from "@/lib/utils";

/**
 * NoadFlow logo mark — "Converging Streams".
 *
 * Three soft wavy streams on the left represent the three core
 * services NoadFlow offers:
 *   - top stream    → Lead Generation Agents
 *   - middle stream → Customer Support Agents
 *   - bottom stream → Workflow Automation
 *
 * They converge into a single rounded node (the AI core that
 * unifies them), then flow out as one thick accent-colored
 * ribbon — symbolizing many chaotic business processes becoming
 * one smooth, automated flow.
 *
 * Every stroke uses round caps + joins and smooth cubic Béziers
 * so nothing ever comes to a sharp point. Uses CSS-variable
 * colors so it switches with the theme. Used identically in
 * header and footer.
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
        Three converging streams — each starts at the left edge
        at a different height and curves smoothly toward the
        convergence node at (20, 16). All use round caps so the
        stream ends are soft.
      */}
      {/* Top stream — Lead Generation */}
      <path
        d="M 2 8 C 6 6.5, 9 9.5, 12 9 S 17 13.5, 20 16"
        stroke="var(--fg)"
        strokeWidth="1.5"
        opacity="0.55"
      />
      {/* Middle stream — Customer Support (most direct) */}
      <path
        d="M 2 16 C 6 15.5, 9 16.5, 12 16 S 17 16, 20 16"
        stroke="var(--fg)"
        strokeWidth="1.5"
        opacity="0.75"
      />
      {/* Bottom stream — Workflow Automation */}
      <path
        d="M 2 24 C 6 25.5, 9 22.5, 12 23 S 17 18.5, 20 16"
        stroke="var(--fg)"
        strokeWidth="1.5"
        opacity="0.55"
      />

      {/*
        Convergence node — the AI core where three streams
        become one. Soft, rounded, accent-filled.
      */}
      <circle cx="20" cy="16" r="2.3" fill="var(--accent)" />
      <circle
        cx="20"
        cy="16"
        r="2.3"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="0.6"
      />

      {/*
        Merged flowing ribbon — the single unified output.
        Thicker than the input streams, accent-colored, with a
        gentle wave so it feels like it's actually flowing.
      */}
      <path
        d="M 22.3 16 C 25 14, 27 18, 30 16"
        stroke="var(--accent)"
        strokeWidth="3.2"
      />
    </svg>
  );
}
