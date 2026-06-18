'use client'

import { useEffect, useRef } from 'react'
import { useMouseParallax } from '@/hooks/use-mouse-parallax'

// ============================================================
// InterlockingGears — workflow automation.
//   • 3 interlocking gears (toothed rings, line-art, stroke 2, round
//     joins). Pitch circles are tangent so teeth visually mesh.
//   • Gears rotate continuously in OPPOSITE directions using
//     nf-spin-slow / nf-spin-rev (with transform-box: fill-box +
//     transform-origin: center so each pivots on its own center).
//     Adjacent gears spin opposite; the small gear spins faster
//     (speed ∝ 1/teeth) so teeth stay meshed.
//   • 6 small accent dots around the gears (nf-brain-bubble opacity
//     pulse, staggered).
//   • Soft radiating glow behind. Whole group floats gently.
//   • Subtle mouse/touch tilt (rAF lerp, direct DOM — no React state
//     on mousemove).
// All colors via CSS variables → switches with the theme.
// ============================================================

const CX = 150
const CY = 150

interface GearDef {
  cx: number
  cy: number
  pitchR: number
  teeth: number
  toothH: number
  hubR: number
  dir: 'fwd' | 'rev'
  duration: string
}

// 3 gears positioned so their pitch circles are tangent (visually meshing).
// Gear 1 ↔ Gear 2: distance 96 = 48+48 (both pitchR 48) ✓
// Gear 2 ↔ Gear 3: distance ≈ 78 < 48+32=80 → teeth slightly interlock ✓
// Speeds inversely proportional to tooth count (12:12:8 → 30s:30s:20s)
// so meshing teeth stay in sync. Directions alternate (fwd/rev/fwd).
const GEARS: GearDef[] = [
  { cx: 95, cy: 195, pitchR: 48, teeth: 12, toothH: 8, hubR: 10, dir: 'fwd', duration: '30s' },
  { cx: 191, cy: 195, pitchR: 48, teeth: 12, toothH: 8, hubR: 10, dir: 'rev', duration: '30s' },
  { cx: 225, cy: 125, pitchR: 32, teeth: 8, toothH: 6, hubR: 7, dir: 'fwd', duration: '20s' },
]

// Generate a clean square-wave gear silhouette path centered at (0, 0).
// With strokeLinejoin="round" the tooth corners soften → premium feel.
function gearPath(teeth: number, R_out: number, R_in: number): string {
  const N = teeth
  const step = (Math.PI * 2) / N
  const toothStart = 0.55 // fraction of step occupied by valley; rest is tooth tip
  const pts: string[] = []
  for (let i = 0; i < N; i++) {
    const a0 = i * step
    const a1 = a0 + step * toothStart
    const a2 = a0 + step
    pts.push(`${(R_in * Math.cos(a0)).toFixed(2)} ${(R_in * Math.sin(a0)).toFixed(2)}`)
    pts.push(`${(R_in * Math.cos(a1)).toFixed(2)} ${(R_in * Math.sin(a1)).toFixed(2)}`)
    pts.push(`${(R_out * Math.cos(a1)).toFixed(2)} ${(R_out * Math.sin(a1)).toFixed(2)}`)
    pts.push(`${(R_out * Math.cos(a2)).toFixed(2)} ${(R_out * Math.sin(a2)).toFixed(2)}`)
  }
  return 'M ' + pts.join(' L ') + ' Z'
}

// 6 accent dots scattered in the empty space around the gears.
const DOTS = [
  { x: 50, y: 80, delay: 0 },
  { x: 265, y: 70, delay: 0.6 },
  { x: 55, y: 255, delay: 1.2 },
  { x: 270, y: 255, delay: 1.8 },
  { x: 150, y: 55, delay: 0.9 },
  { x: 150, y: 270, delay: 1.5 },
]

export function InterlockingGears({ className }: { className?: string }) {
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
      curX += (tx_target - curX) * 0.08
      curY += (ty_target - curY) * 0.08
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
          <radialGradient id="gears-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.5" />
            <stop offset="55%" stopColor="var(--svg-glow)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft radiating glow behind — expands + fades, repeating */}
        <circle cx={CX} cy={CY} r="125" fill="url(#gears-glow)" className="nf-glow-radiate" />

        {/* Tilt group (outermost) → float group → content */}
        <g ref={tiltRef}>
          <g className="nf-brain-float">
            {/* Accent dots around the gears (nf-brain-bubble opacity pulse) */}
            {DOTS.map((d, i) => (
              <circle
                key={`d-${i}`}
                cx={d.x}
                cy={d.y}
                r="2"
                fill="var(--svg-accent)"
                stroke="none"
                className="nf-brain-bubble"
                style={{ animationDelay: `${d.delay}s` }}
              />
            ))}

            {/* Gears — each group translates to its center, then the inner
                group spins (transform-box: fill-box + transform-origin: center
                → pivots on the gear's own bbox center = its geometric center). */}
            {GEARS.map((g, i) => {
              const path = gearPath(g.teeth, g.pitchR + g.toothH, g.pitchR)
              return (
                <g key={`g-${i}`} transform={`translate(${g.cx} ${g.cy})`}>
                  <g
                    className={g.dir === 'fwd' ? 'nf-spin-slow' : 'nf-spin-rev'}
                    style={{
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      animationDuration: g.duration,
                    }}
                  >
                    {/* Gear silhouette (toothed ring, line-art, round joins) */}
                    <path
                      d={path}
                      fill="none"
                      stroke="var(--svg-stroke)"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Inner pitch ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={g.pitchR - 8}
                      fill="none"
                      stroke="var(--svg-stroke)"
                      strokeWidth="1.2"
                      opacity="0.45"
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Hub ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={g.hubR}
                      fill="none"
                      stroke="var(--svg-stroke)"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Hub center dot */}
                    <circle cx="0" cy="0" r={g.hubR * 0.4} fill="var(--svg-accent)" stroke="none" />
                  </g>
                </g>
              )
            })}
          </g>
        </g>
      </svg>
    </div>
  )
}
