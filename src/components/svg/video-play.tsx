"use client";

import { useTilt } from "@/hooks/use-tilt";

// ============================================================
// VideoPlay — Done For You UGC Ads.
//   • Video player frame (rounded rect) centered in the viewBox.
//   • Play triangle inside a breathing play circle at dead center.
//   • Recording dot top-left inside the frame (live indicator).
//   • Timeline dots + duration pill below the frame.
//   • Soft radiating glow behind. Whole group floats gently.
//   • Subtle mouse/touch tilt (rAF lerp, direct DOM).
// All colors via CSS variables → switches with the theme.
// ============================================================

const CX = 150;
const CY = 150;

export function VideoPlay({ className }: { className?: string }) {
  const { ref, tiltRef } = useTilt<SVGGElement>(CX, CY);

  return (
    <div ref={ref} className={className} style={{ overflow: "visible" }}>
      <svg
        className="nf-brain-svg"
        viewBox="0 0 300 300"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="video-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.5" />
            <stop offset="55%" stopColor="var(--svg-glow)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft radiating glow behind — expands + fades, repeating */}
        <circle cx={CX} cy={CY} r="125" fill="url(#video-glow)" className="nf-glow-radiate" />

        {/* Tilt group → float group → content */}
        <g ref={tiltRef}>
          <g className="nf-brain-float">
            {/* Recording indicator — top-left inside frame, breathing */}
            <g className="nf-brain-breathe">
              <circle cx={80} cy={100} r="5" fill="var(--svg-accent)" stroke="none" />
            </g>

            {/* Video frame — rounded rect, centered at CX,CY */}
            <rect
              x={60}
              y={80}
              width={180}
              height={140}
              rx="14"
              ry="14"
              fill="none"
              stroke="var(--svg-stroke)"
              strokeWidth="2"
              opacity="0.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Play circle — dead center of frame, breathes */}
            <g className="nf-brain-breathe">
              <circle
                cx={CX}
                cy={CY}
                r="36"
                fill="none"
                stroke="var(--svg-accent)"
                strokeWidth="2.5"
                className="group-hover:stroke-foreground transition-all duration-300"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            {/* Play triangle — centered, pointing right */}
            <polygon
              points="134,132 134,168 162,150"
              fill="none"
              stroke="var(--svg-accent)"
              strokeWidth="3"
              strokeLinejoin="round"
              className="group-hover:fill-foreground fill-current transition-all duration-300"
              vectorEffect="non-scaling-stroke"
            />

            {/* Timeline dots — below frame */}
            {[100, 130, 160, 190].map((x) => (
              <circle
                key={`t-${x}`}
                cx={x}
                cy={240}
                r="2.5"
                fill="var(--svg-stroke)"
                stroke="none"
                opacity="0.45"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Duration pill — bottom right */}
            <rect
              x={200}
              y={252}
              width={42}
              height={12}
              rx="6"
              ry="6"
              fill="none"
              stroke="var(--svg-stroke)"
              strokeWidth="1.5"
              opacity="0.5"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}