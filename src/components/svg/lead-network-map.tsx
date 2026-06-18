'use client'

import { useEffect, useRef } from 'react'
import { useMouseParallax } from '@/hooks/use-mouse-parallax'

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
  const { ref, x, y } = useMouseParallax<HTMLDivElement>()
  const tiltRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const tilt = tiltRef.current
    if (!tilt) return
    let raf = 0
    let curX = 0
    let curY = 0

    const apply = () => {
      raf = 0
      const tx_target = x
      const ty_target = y
      // ease toward target for smooth, lagging tilt
      curX += (tx_target - curX) * 0.08
      curY += (ty_target - curY) * 0.08
      // gentle tilt: max ~6deg rotate + ~10px translate
      const rot = curX * 6
      const tx = curX * 10
      const ty = curY * 10
      tilt.setAttribute(
        'transform',
        `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${rot.toFixed(2)} ${CX} ${CY})`
      )
      if (Math.abs(tx_target - curX) > 0.001 || Math.abs(ty_target - curY) > 0.001) {
        raf = requestAnimationFrame(apply)
      }
    }
    raf = requestAnimationFrame(apply)

    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [x, y])

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
            {/* Faint outer guide ring — frames the radar */}
            <circle
              cx={CX}
              cy={CY}
              r={RING_R + 28}
              fill="none"
              stroke="var(--svg-glow)"
              strokeWidth="1"
              opacity="0.35"
              vectorEffect="non-scaling-stroke"
            />

            {/* 3 staggered expanding ping rings — the sonar pings */}
            {[0, 1.6, 3.2].map((delay, i) => (
              <circle
                key={`ping-${i}`}
                cx={CX}
                cy={CY}
                r={RING_R}
                fill="none"
                stroke="var(--svg-stroke)"
                strokeWidth="2"
                className="nf-glow-radiate"
                style={{ animationDelay: `${delay}s` }}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Radar sweep line — rotates slowly around the radar center.
                Drawn from (0, 0) to (0, -R) inside a group translated to
                (CX, CY); transform-origin: center bottom (bottom-center of
                the line's bbox) makes CSS rotation pivot at (CX, CY). */}
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
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.6"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </g>

            {/* Prospect dots — opacity pulse, staggered (nf-brain-bubble) */}
            {PROSPECTS.map((p, i) => (
              <circle
                key={`p-${i}`}
                cx={p.x.toFixed(2)}
                cy={p.y.toFixed(2)}
                r="3.5"
                fill="var(--svg-accent)"
                stroke="none"
                className="nf-brain-bubble"
                style={{ animationDelay: `${i * 0.45}s` }}
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
