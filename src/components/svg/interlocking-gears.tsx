'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

interface GearDef {
  cx: number
  cy: number
  pitchR: number
  teeth: number
  toothH: number
  hubR: number
  dir: 'fwd' | 'rev'
  duration: string
  depth: number
}

// Three gears positioned so their pitch circles are tangent (visually meshing).
// Speed ratios are inversely proportional to tooth count, directions alternate.
const GEARS: GearDef[] = [
  { cx: 170, cy: 280, pitchR: 60, teeth: 12, toothH: 10, hubR: 12, dir: 'fwd', duration: '32s', depth: 16 },
  { cx: 270, cy: 280, pitchR: 40, teeth: 8, toothH: 8, hubR: 9, dir: 'rev', duration: '21s', depth: 26 },
  { cx: 270, cy: 210, pitchR: 30, teeth: 6, toothH: 7, hubR: 7, dir: 'fwd', duration: '16s', depth: 34 },
]

// Generate a clean square-wave gear silhouette path centered at (0,0)
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

// Ambient accent particles around the gears
const PARTICLES = [
  { x: 95, y: 150, r: 2.5, delay: 0 },
  { x: 385, y: 175, r: 3, delay: 1.2 },
  { x: 130, y: 390, r: 2, delay: 0.6 },
  { x: 360, y: 365, r: 2.5, delay: 1.8 },
  { x: 425, y: 250, r: 2, delay: 0.3 },
  { x: 75, y: 240, r: 2, delay: 2.1 },
  { x: 200, y: 120, r: 2.2, delay: 1.5 },
  { x: 330, y: 420, r: 2, delay: 0.9 },
]

export function InterlockingGears({ className }: { className?: string }) {
  const { ref, x, y } = useMouseParallax<HTMLDivElement>()

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 500 500"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Ambient particles */}
        {PARTICLES.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="var(--svg-glow)"
            className="nf-twinkle"
            style={{ animationDelay: `${p.delay}s`, animationDuration: '4s' }}
          />
        ))}

        {/* Gears */}
        {GEARS.map((g, i) => {
          const path = gearPath(g.teeth, g.pitchR + g.toothH, g.pitchR)
          return (
            <g key={i} style={{ transform: `translate3d(${x * g.depth}px, ${y * g.depth}px, 0)` }}>
              <g transform={`translate(${g.cx} ${g.cy})`}>
                <g
                  data-pivot
                  className={g.dir === 'fwd' ? 'nf-spin-slow' : 'nf-spin-rev'}
                  style={{ animationDuration: g.duration }}
                >
                  {/* Gear silhouette */}
                  <path
                    d={path}
                    fill="var(--svg-fill)"
                    stroke="var(--svg-stroke)"
                    strokeWidth="1.2"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Inner pitch ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r={g.pitchR - 7}
                    fill="none"
                    stroke="var(--svg-stroke)"
                    strokeWidth="0.7"
                    opacity="0.45"
                  />
                  {/* Spokes */}
                  {Array.from({ length: 6 }, (_, j) => {
                    const a = (j / 6) * Math.PI * 2
                    return (
                      <line
                        key={j}
                        x1={Math.cos(a) * g.hubR}
                        y1={Math.sin(a) * g.hubR}
                        x2={Math.cos(a) * (g.pitchR - 9)}
                        y2={Math.sin(a) * (g.pitchR - 9)}
                        stroke="var(--svg-stroke)"
                        strokeWidth="0.7"
                        opacity="0.35"
                        vectorEffect="non-scaling-stroke"
                      />
                    )
                  })}
                  {/* Hub */}
                  <circle cx="0" cy="0" r={g.hubR} fill="var(--svg-accent)" stroke="none" />
                  <circle cx="0" cy="0" r={g.hubR * 0.35} fill="var(--svg-fill)" stroke="none" />
                </g>
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
