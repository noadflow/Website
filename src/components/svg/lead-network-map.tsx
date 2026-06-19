'use client'

import { useTilt } from '@/hooks/use-tilt'

// ============================================================
// LeadNetworkMap — radar/sonar finding leads.
//   • Central origin node (the source) that gently breathes.
//   • 3 concentric expanding ping rings (nf-glow-radiate, staggered)
//     — the sonar pings radiating outward.
//   • 7 prospect dots on a ring around the center (nf-brain-bubble,
//     staggered) — opacity-pulse as the radar "detects" them.
//   • Thin radar sweep line rotating slowly (nf-spin-slow).
//   • Soft radiating glow behind everything.
//   • Subtle mouse/touch tilt (rAF lerp, direct DOM — no React state
//     on mousemove) + gentle float.
// All colors via CSS variables → switches with the theme.
// ============================================================

const CX = 150
const CY = 150
const RING_R = 82

// 7 prospect dots at varied radii (68–96) and angles around the radar
// center. Angles measured from north (12 o'clock), clockwise.
const PROSPECTS = [
  { angle: 25, r: 72 },
  { angle: 80, r: 92 },
  { angle: 140, r: 68 },
  { angle: 200, r: 96 },
  { angle: 250, r: 74 },
  { angle: 305, r: 88 },
  { angle: 350, r: 80 },
].map((p) => {
  const a = ((p.angle - 90) * Math.PI) / 180
  return { x: CX + p.r * Math.cos(a), y: CY + p.r * Math.sin(a) }
})

export function LeadNetworkMap({ className }: { className?: string }) {
  const { ref, tiltRef } = useTilt<SVGGElement>(CX, CY)

  return (
    <div ref={ref} className={className} style={{ overflow: 'visible' }}>
      <svg
        className="nf-brain-svg"
        viewBox="0 0 300 300"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="lead-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.5" />
            <stop offset="55%" stopColor="var(--svg-glow)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft radiating glow behind — expands + fades, repeating */}
        <circle cx={CX} cy={CY} r="125" fill="url(#lead-glow)" className="nf-glow-radiate" />

        {/* Tilt group (outermost) → float group → content */}
        <g ref={tiltRef}>
          <g className="nf-brain-float">
            {/* 2 staggered expanding ping rings — the sonar pings
                (use SMIL for reliable r+opacity animation, clearly visible) */}
            {[0, 2.4].map((delay, i) => (
              <circle
                key={`ping-${i}`}
                cx={CX}
                cy={CY}
                r={RING_R}
                fill="none"
                stroke="var(--svg-accent)"
                strokeWidth="2"
                opacity="0"
                vectorEffect="non-scaling-stroke"
              >
                <animate
                  attributeName="r"
                  values={`${RING_R};${RING_R + 50}`}
                  dur="5.5s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.8;0"
                  keyTimes="0;0.15;1"
                  dur="5.5s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}

            {/* Radar sweep line — rotates slowly, clearly visible */}
            <g transform={`translate(${CX} ${CY})`}>
              <g
                className="nf-spin-slow"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center bottom',
                  animationDuration: '9s',
                }}
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-(RING_R + 22)}
                  stroke="var(--svg-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.85"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </g>

            {/* Prospect dots — clearly visible found leads (gentle pulse) */}
            {PROSPECTS.map((p, i) => (
              <circle
                key={`p-${i}`}
                cx={p.x.toFixed(2)}
                cy={p.y.toFixed(2)}
                r="4"
                fill="var(--svg-accent)"
                stroke="none"
                opacity="0.85"
                className="nf-pulse-soft"
                style={{ animationDelay: `${i * 0.45}s`, animationDuration: '3.5s' }}
              />
            ))}

            {/* Central origin node — the radar source, breathing */}
            <g className="nf-brain-breathe">
              <circle
                cx={CX}
                cy={CY}
                r="8"
                fill="none"
                stroke="var(--svg-stroke)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={CX} cy={CY} r="3" fill="var(--svg-accent)" stroke="none" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
