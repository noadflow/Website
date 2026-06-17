'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

// ============================================================
// NeuralNetwork — a brain.
// Recognizable brain silhouette (bumpy cortex outline + central
// fissure + sulci folds) filled with a dense network of ~55 nodes
// connected by curved axons. Travelling signal dots flow along the
// axons. Nodes react to the cursor: the ones near the mouse light
// up, grow, and turn accent-colored — a glowing cluster follows
// the cursor through the cortex.
// ============================================================

interface NNode {
  x: number
  y: number
  r: number
  hub: boolean
  delay: number
}

// ---------- Brain silhouette ----------
// A hand-crafted, genuinely brain-shaped outline: rounded frontal
// lobe at the front (left), rounded occipital pole at the back
// (right), temporal lobe curving under, and soft gyri bumps along
// the top. Drawn as smooth cubic Beziers so it reads instantly as a
// brain (not a star). Center ~ (300, 295).
const BC = { x: 300, y: 295 }
const BRAIN_OUTLINE =
  // Start at the front-bottom (frontal/temporal notch, lower-left),
  // trace clockwise: temporal underside -> occipital back -> top gyri
  // bumps -> frontal bulge -> back to start.
  'M 132 330 ' +
  // Temporal lobe curving under to the back-bottom
  'C 150 405 215 452 300 452 ' +
  'C 385 452 450 405 468 330 ' +
  // Occipital pole (back, right) rounding up
  'C 500 275 498 220 470 188 ' +
  // Top-right gyri bumps (soft, rounded)
  'C 460 168 444 170 436 186 ' +
  'C 428 170 412 170 404 188 ' +
  'C 396 170 380 170 372 190 ' +
  // Crown — central dimple (top of the longitudinal fissure)
  'C 362 168 344 170 336 192 ' +
  'C 328 170 312 170 304 192 ' +
  'C 296 170 280 170 272 192 ' +
  'C 264 170 248 170 240 190 ' +
  'C 232 170 216 170 208 188 ' +
  // Frontal lobe (front, left) bulging forward and down
  'C 196 168 184 172 176 192 ' +
  'C 150 220 140 275 132 330 Z'

// ---------- Sulci (interior wrinkles) ----------
// A few gentle curved folds inside each hemisphere + the central
// longitudinal fissure dividing the two hemispheres.
const CENTRAL_FISSURE =
  'M 300 178 C 296 230 304 280 300 295 C 296 340 305 390 300 438'
const SULCI = [
  // left hemisphere folds (frontal -> temporal)
  'M 250 195 C 232 235 224 275 206 305 C 188 335 178 360 168 388',
  'M 272 240 C 254 270 248 300 232 328 C 220 350 214 372 206 398',
  // right hemisphere folds (mirrored)
  'M 350 195 C 368 235 376 275 394 305 C 412 335 422 360 432 388',
  'M 328 240 C 346 270 352 300 368 328 C 380 350 386 372 394 398',
]

// ---------- Internal node network ----------
// Deterministic pseudo-random so the layout is stable across renders.
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

const NODES: NNode[] = (() => {
  const rand = rng(7)
  const out: NNode[] = []
  const step = 42
  // jittered grid across the brain bbox; keep points inside the cortex.
  // Inside-brain test approximates the hand-crafted silhouette: a tapered
  // blob widest through the middle (y~300) and rounded at top/bottom, with
  // the front (left, x<230) bulging a touch more and the back (right,
  // x>370) rounded. Inset by ~14px so nodes sit inside the outline.
  const insideBrain = (x: number, y: number) => {
    const dx = x - BC.x
    const dy = y - BC.y
    // vertical half-height shrinks toward top/bottom (rounded crown/base)
    const ry = 150 - (dy * dy) / 520
    if (ry <= 0) return false
    // horizontal half-width: bulges at front (dx<0) and back (dx>0),
    // narrows slightly at the very front tip.
    let rx = 196
    if (dx < 0) rx = 200 + Math.min(0, dx) * 0.12 // frontal bulge
    if (dx > 0) rx = 198 + Math.min(18, dx * 0.05) // occipital round
    // top crown is a bit narrower (the gyri bumps dip between hemispheres)
    if (dy < -90) rx -= 8
    return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 0.86
  }
  for (let gx = 130; gx <= 470; gx += step) {
    for (let gy = 185; gy <= 430; gy += step) {
      const jx = (rand() - 0.5) * 26
      const jy = (rand() - 0.5) * 26
      const x = gx + jx
      const y = gy + jy
      if (!insideBrain(x, y)) continue
      // thin the central fissure corridor
      if (Math.abs(x - BC.x) < 11 && Math.abs(y - BC.y) < 110) {
        if (rand() < 0.75) continue
      }
      out.push({
        x,
        y,
        r: 2.6 + rand() * 2.2,
        hub: rand() < 0.12,
        delay: rand() * 3,
      })
    }
  }
  return out
})()

// ---------- Edges (k-nearest) ----------
interface Edge {
  a: number
  b: number
  d: string
  dur: string
  begin: string
}
const EDGES: Edge[] = (() => {
  const edges: Edge[] = []
  const seen = new Set<string>()
  const dist = (i: number, j: number) =>
    Math.hypot(NODES[i].x - NODES[j].x, NODES[i].y - NODES[j].y)
  for (let i = 0; i < NODES.length; i++) {
    // 2 nearest neighbors
    const nbrs = NODES.map((_, j) => ({ j, d: i === j ? Infinity : dist(i, j) }))
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
    for (const { j, d: len } of nbrs) {
      if (len > 95) continue // only short local axons
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) continue
      seen.add(key)
      const p1 = NODES[i]
      const p2 = NODES[j]
      const mx = (p1.x + p2.x) / 2
      const my = (p1.y + p2.y) / 2
      const dx = p2.x - p1.x
      const dy = p2.y - p1.y
      const L = Math.hypot(dx, dy) || 1
      const sign = (i + j) % 2 === 0 ? 1 : -1
      const off = sign * (9 + (i % 3) * 4)
      const cx = mx + (-dy / L) * off
      const cy = my + (dx / L) * off
      const d = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
      edges.push({
        a: i,
        b: j,
        d,
        dur: (2.2 + (i % 5) * 0.4).toFixed(2) + 's',
        begin: ((i % 7) * 0.28).toFixed(2) + 's',
      })
    }
  }
  return edges
})()

// Travelling signal dots on a subset of edges (every 2nd edge).
const FLOW_EDGES = EDGES.filter((_, i) => i % 2 === 0)

// Cursor proximity radius (viewBox units). Nodes within this of the
// cursor light up + grow.
const PROX_R = 115

export function NeuralNetwork({ className }: { className?: string }) {
  const { ref, x, y } = useMouseParallax<HTMLDivElement>()

  // Cursor position in viewBox coordinates (viewBox is 600x600, square).
  const cx = 300 + x * 600
  const cy = 300 + y * 600
  // Global parallax shift for the whole brain (subtle).
  const px = x * 12
  const py = y * 12

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
          <radialGradient id="nn-bg-glow" cx="50%" cy="49%" r="55%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.4" />
            <stop offset="55%" stopColor="var(--svg-glow)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nn-cursor-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-accent)" stopOpacity="0.22" />
            <stop offset="60%" stopColor="var(--svg-accent)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--svg-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient breathing glow behind the brain */}
        <circle
          cx="300"
          cy="295"
          r="270"
          fill="url(#nn-bg-glow)"
          className="nf-breathe"
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animationDuration: '7s',
          }}
        />

        {/* Whole-brain parallax group: outline + folds + network shift together
            so travelling dots stay on their axons. */}
        <g style={{ transform: `translate3d(${px}px, ${py}px, 0)` }}>
          {/* ----- Brain silhouette ----- */}
          <path
            d={BRAIN_OUTLINE}
            fill="var(--svg-fill)"
            stroke="var(--svg-stroke)"
            strokeWidth="1.6"
            opacity="0.85"
            vectorEffect="non-scaling-stroke"
          />
          {/* Sulci folds */}
          <g
            stroke="var(--svg-stroke)"
            strokeWidth="1"
            opacity="0.32"
            vectorEffect="non-scaling-stroke"
          >
            {SULCI.map((d, i) => (
              <path key={`sul-${i}`} d={d} />
            ))}
          </g>
          {/* Central longitudinal fissure (divides hemispheres) */}
          <path
            d={CENTRAL_FISSURE}
            stroke="var(--svg-stroke)"
            strokeWidth="1.3"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Soft glow that follows the cursor through the cortex */}
          <circle cx={cx} cy={cy} r={PROX_R * 1.25} fill="url(#nn-cursor-glow)" />

          {/* ----- Axon connections ----- */}
          <g
            stroke="var(--svg-stroke)"
            strokeWidth="0.8"
            opacity="0.32"
            vectorEffect="non-scaling-stroke"
          >
            {EDGES.map((e, i) => (
              <path key={`e-${i}`} d={e.d} />
            ))}
          </g>

          {/* ----- Travelling signal dots ----- */}
          {FLOW_EDGES.map((e, i) => (
            <circle key={`f-${i}`} r="2.1" fill="var(--svg-accent)" opacity="0">
              <animateMotion
                path={e.d}
                dur={e.dur}
                begin={e.begin}
                repeatCount="indefinite"
                rotate="auto"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.88;1"
                dur={e.dur}
                begin={e.begin}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* ----- Nodes (per-node cursor proximity reaction) ----- */}
          {NODES.map((n, i) => {
            const dist = Math.hypot(n.x - cx, n.y - cy)
            const prox = Math.max(0, 1 - dist / PROX_R) // 1 at cursor, 0 at edge
            const scale = 1 + prox * 1.1
            const lit = prox > 0.25
            return (
              <g
                key={`n-${i}`}
                style={{
                  transform: `translate(${n.x}px, ${n.y}px) scale(${scale})`,
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                }}
              >
                {/* Halo (brightens near cursor) */}
                <circle
                  cx="0"
                  cy="0"
                  r={n.r + 5 + prox * 4}
                  fill="none"
                  stroke={lit ? 'var(--svg-accent)' : 'var(--svg-glow)'}
                  strokeWidth="0.9"
                  opacity={0.25 + prox * 0.7}
                  className="nf-pulse-soft"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animationDelay: `${n.delay}s`,
                    animationDuration: n.hub ? '3.2s' : '4.6s',
                  }}
                />
                {/* Node body */}
                <circle
                  cx="0"
                  cy="0"
                  r={n.r}
                  fill={
                    lit || n.hub ? 'var(--svg-accent)' : 'var(--svg-fill)'
                  }
                  stroke="var(--svg-stroke)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Inner dot */}
                <circle
                  cx="0"
                  cy="0"
                  r={n.r * 0.4}
                  fill={lit || n.hub ? 'var(--svg-fill)' : 'var(--svg-accent)'}
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
