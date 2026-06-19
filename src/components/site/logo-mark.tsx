"use client";

import { cn } from "@/lib/utils";

/**
 * NoadFlow logo mark — "Node → Flow".
 *
 * A solid filled circle on the left (the "node") represents the
 * structured input — a task, a lead, a customer message. From its
 * right edge, a smooth flowing ribbon exits and becomes
 * progressively wavier as it travels right, symbolizing that
 * input being transformed into smooth, automated flow.
 *
 *   node (solid, structured)  →  flow (wavy, dynamic)
 *          "Noad"                     "Flow"
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
        Flowing ribbon — exits the node's right edge at (11.5, 16)
        and travels right with progressively larger waves:
          - small wave up   (peak ≈ y=14)
          - small wave down (dip  ≈ y=18)
          - bigger S-wave   (peak ≈ y=13, dip ≈ y=19)
          - short straight tail to the right edge
        The increasing amplitude reads as "structured → flowing".
      */}
      <path
        d="M 11.5 16
           C 14 16, 15 14, 17 16
           C 19 18, 20 18, 22 16
           C 24 13, 26 19, 28 16
           L 30 16"
        stroke="var(--accent)"
        strokeWidth="2.4"
        fill="none"
      />

      {/*
        Node — solid filled circle on the left. Accent-filled
        with a thin foreground outline so it stays visible on
        both light and dark themes.
      */}
      <circle cx="8" cy="16" r="3.6" fill="var(--accent)" />
      <circle
        cx="8"
        cy="16"
        r="3.6"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="0.6"
      />
    </svg>
  );
}
