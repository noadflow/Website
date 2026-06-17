'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

interface NNode {
  x: number
  y: number
  r: number
  hub: boolean
  delay: number
}

// Brain-like bilateral topology: 20 nodes arranged as left & right hemispheres
// plus a central bridge. NOT concentric rings — the silhouette suggests a brain.
// Left hemisphere lives around x=170-280, right around x=320-430, bridge at x=300.
// Y spread 150-460. Radii 3.5-6. Four "hub" nodes (r=6) filled with accent.
const NODES: NNode[] = [
  // Left hemisphere (0-7)
  { x: 210, y: 180, r: 4,   hub: false, delay: 0.0 }, // 0  L upper outer
  { x: 175, y: 250, r: 4.5, hub: false, delay: 0.6 }, // 1  L outer mid
  { x: 190, y: 330, r: 4,   hub: false, delay: 1.2 }, // 2  L outer lower
  { x: 230, y: 400, r: 4,   hub: false, delay: 1.8 }, // 3  L lower
  { x: 260, y: 220, r: 4.5, hub: false, delay: 0.4 }, // 4  L upper inner
  { x: 245, y: 290, r: 6,   hub: true,  delay: 0.2 }, // 5  L HUB
  { x: 260, y: 360, r: 4.5, hub: false, delay: 1.0 }, // 6  L lower inner
  { x: 220, y: 150, r: 3.5, hub: false, delay: 0.8 }, // 7  L top
  // Right hemisphere (8-15, mirror of 0-7)
  { x: 390, y: 180, r: 4,   hub: false, delay: 0.3 }, // 8  R upper outer
  { x: 425, y: 250, r: 4.5, hub: false, delay: 0.9 }, // 9  R outer mid
  { x: 410, y: 330, r: 4,   hub: false, delay: 1.5 }, // 10 R outer lower
  { x: 370, y: 400, r: 4,   hub: false, delay: 2.1 }, // 11 R lower
  { x: 340, y: 220, r: 4.5, hub: false, delay: 0.7 }, // 12 R upper inner
  { x: 355, y: 290, r: 6,   hub: true,  delay: 0.5 }, // 13 R HUB
  { x: 340, y: 360, r: 4.5, hub: false, delay: 1.1 }, // 14 R lower inner
  { x: 380, y: 150, r: 3.5, hub: false, delay: 1.3 }, // 15 R top
  // Central bridge (16-19) — corpus-callosum-like cross-links between hemispheres
  { x: 300, y: 250, r: 6,   hub: true,  delay: 0.1 }, // 16 UPPER BRIDGE HUB
  { x: 300, y: 350, r: 6,   hub: true,  delay: 1.7 }, // 17 LOWER BRIDGE HUB
  { x: 300, y: 150, r: 4,   hub: false, delay: 1.6 }, // 18 top bridge (sensory pole)
  { x: 300, y: 450, r: 4,   hub: false, delay: 2.4 }, // 19 bottom bridge (motor pole)
]

// 16 connections (indices into NODES) — bilateral chains + bridge cross-links.
const EDGES: [number, number][] = [
  [0, 4],   // L upper outer → L upper inner
  [4, 5],   // L upper inner → L hub
  [5, 6],   // L hub → L lower inner
  [6, 3],   // L lower inner → L lower
  [1, 5],   // L outer mid → L hub
  [2, 6],   // L outer lower → L lower inner
  [7, 0],   // L top → L upper outer
  [8, 12],  // R upper outer → R upper inner
  [12, 13], // R upper inner → R hub
  [13, 14], // R hub → R lower inner
  [14, 11], // R lower inner → R lower
  [9, 13],  // R outer mid → R hub
  [10, 14], // R outer lower → R lower inner
  [15, 8],  // R top → R upper outer
  [5, 16],  // L hub → upper bridge hub (cross-hemisphere)
  [13, 17], // R hub → lower bridge hub (cross-hemisphere)
]

// Precompute quadratic Bézier path d-strings + per-path animation timing.
// Control point is offset perpendicular to the segment midpoint (alternating
// direction for an organic feel), 14-20px magnitude.
const PATHS: { d: string; dur: string; begin: string }[] = EDGES.map(([a, b], i) => {
  const p1 = NODES[a]
  const p2 = NODES[b]
  const mx = (p1.x + p2.x) / 2
  const my = (p1.y + p2.y) / 2
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const L = Math.hypot(dx, dy) || 1
  const px = -dy / L // perpendicular unit
  const py = dx / L
  const sign = i % 2 === 0 ? 1 : -1
  const offset = sign * (14 + (i % 3) * 3) // 14, 17, or 20 px, alternating direction
  const cx = mx + px * offset
  const cy = my + py * offset
  const d = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  // Stagger durations 2.4s–4.2s, begin offsets 0s–1.8s
  const dur = (2.4 + (i % 5) * 0.45).toFixed(2) + 's'
  const begin = (i % 7) * 0.3 + 's'
  return { d, dur, begin }
})

export function NeuralNetwork({ className }: { className?: string }) {
  const { ref, x, y } = useMouseParallax<HTMLDivElement>()

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 600 600"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <radialGradient id="nn-bg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.35" />
            <stop offset="55%" stopColor="var(--svg-glow)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint central radial glow breathing behind the network */}
        <circle
          cx="300"
          cy="300"
          r="260"
          fill="url(#nn-bg-glow)"
          className="nf-breathe"
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '7s' }}
        />

        {/* Whole-network common parallax: connections + travelling dots + nodes all
            shift together so dots stay on the lines. Hub nodes get an extra small
            counter-shift (foreground, less movement); background nodes get an extra
            forward-shift (more movement). Depth-staggered but subtle. */}
        <g style={{ transform: `translate3d(${x * 14}px, ${y * 14}px, 0)` }}>
          {/* Connection paths (static within the common group so dots stay aligned) */}
          {PATHS.map((p, i) => (
            <path
              key={`p-${i}`}
              id={`nn-path-${i}`}
              d={p.d}
              stroke="var(--svg-stroke)"
              strokeWidth="0.9"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Travelling data-signal dots — one per connection. animateMotion moves the
              dot along the path; a paired opacity animation fades the dot in at the path
              start and out at the path end, masking the cycle reset so the flow reads as
              continuous "data packets" rather than visible teleport jumps. */}
          {PATHS.map((p, i) => (
            <circle key={`d-${i}`} r="2.2" fill="var(--svg-accent)" opacity="0">
              <animateMotion
                path={p.d}
                dur={p.dur}
                begin={p.begin}
                repeatCount="indefinite"
                rotate="auto"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.88;1"
                dur={p.dur}
                begin={p.begin}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Nodes — hub nodes (foreground, less parallax) vs background nodes (more parallax) */}
          {NODES.map((n, i) => {
            const extra = n.hub ? -7 : 7
            return (
              <g key={`n-${i}`} style={{ transform: `translate3d(${x * extra}px, ${y * extra}px, 0)` }}>
                {/* Soft pulsing halo (hub halos brighter via accent stroke) */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r + 5}
                  fill="none"
                  stroke={n.hub ? 'var(--svg-accent)' : 'var(--svg-glow)'}
                  strokeWidth="0.8"
                  opacity={n.hub ? 0.6 : 0.4}
                  className="nf-pulse-soft"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animationDelay: `${n.delay}s`,
                    animationDuration: n.hub ? '3.4s' : '4.4s',
                  }}
                />
                {/* Node body — hubs filled accent, others outlined with soft fill */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={n.hub ? 'var(--svg-accent)' : 'var(--svg-fill)'}
                  stroke="var(--svg-stroke)"
                  strokeWidth="1.1"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Inner solid dot at node center */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r * 0.4}
                  fill={n.hub ? 'var(--svg-fill)' : 'var(--svg-accent)'}
                  stroke="none"
                />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
