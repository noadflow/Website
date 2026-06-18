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

// ---------- Brain silhouette (top-down / axial view) ----------
// A symmetric egg-shaped brain: wider at the back (top of viewBox),
// narrower at the front (bottom), with gentle gyri bumps around the
// whole cortex. Built mathematically so it is perfectly bilaterally
// symmetric about x = 300 (no lopsided blob). Center (300, 300).
const BC = { x: 300, y: 300 }
const BRAIN_OUTLINE = (() => {
  // 48 sample points around the cortex. ry fixed; rx tapers so the
  // back (theta = -PI/2) is wide and the front (theta = +PI/2) is
  // narrower — the classic brain egg profile. A 12-lobe sine adds
  // soft, rounded gyri bumps (5% amplitude = visible but not spiky).
  const N = 48
  const RY = 158
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2 - Math.PI / 2 // start at top (back)
    const rxBase = 176 - 26 * Math.sin(t) // 202 at back, 150 at front
    // cos (even function) keeps bumps mirrored left<->right; sin would
    // bulge on one side where it dips on the other (asymmetric).
    const bump = 0.045 * Math.cos(8 * t) // 4 gentle gyri per hemisphere
    const rx = rxBase * (1 + bump)
    const ry = RY * (1 + bump)
    pts.push({
      x: BC.x + Math.cos(t) * rx,
      y: BC.y + Math.sin(t) * ry,
    })
  }
  // Smooth closed Catmull-Rom -> cubic Bezier through the 48 points.
  let d = ''
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % N]
    const p3 = pts[(i + 2) % N]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += i === 0 ? `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} ` : ''
    d += `C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} `
  }
  return d + 'Z'
})()

// ---------- Sulci (interior wrinkles) ----------
// Central longitudinal fissure (divides the two hemispheres) + a few
// curved cortical folds per hemisphere. All symmetric about x = 300.
const CENTRAL_FISSURE = 'M 300 146 C 297 200 303 250 300 300 C 297 350 303 400 300 454'
const SULCI = [
  // left hemisphere folds
  'M 258 168 C 240 210 232 250 214 282 C 196 314 186 344 176 374',
  'M 276 224 C 260 254 254 284 240 312 C 228 336 222 358 214 382',
  'M 244 250 C 226 280 220 312 206 340 C 196 360 190 378 182 398',
  // right hemisphere folds (mirror)
  'M 342 168 C 360 210 368 250 386 282 C 404 314 414 344 424 374',
  'M 324 224 C 340 254 346 284 360 312 C 372 336 378 358 386 382',
  'M 356 250 C 374 280 380 312 394 340 C 404 360 410 378 418 398',
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
  const step = 40
  // jittered grid; keep points inside the egg-shaped cortex. The brain
  // is wider at the back (top, y<300) and narrower at the front (bottom,
  // y>300), symmetric about x=300. Inset so nodes sit inside the outline.
  const insideBrain = (x: number, y: number) => {
    const dx = x - BC.x
    const dy = y - BC.y
    const rx = 176 - 0.165 * dy // 202 at top (back), 150 at bottom (front)
    const ry = 158
    if (rx <= 0) return false
    return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 0.80
  }
  for (let gx = 130; gx <= 470; gx += step) {
    for (let gy = 160; gy <= 445; gy += step) {
      const jx = (rand() - 0.5) * 26
      const jy = (rand() - 0.5) * 26
      const x = gx + jx
      const y = gy + jy
      if (!insideBrain(x, y)) continue
      // thin the central fissure corridor
      if (Math.abs(x - BC.x) < 12 && Math.abs(y - BC.y) < 120) {
        if (rand() < 0.78) continue
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
          cy="300"
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
          {/* Sulci folds — visible cortical wrinkles */}
          <g
            stroke="var(--svg-stroke)"
            strokeWidth="1.4"
            opacity="0.55"
            vectorEffect="non-scaling-stroke"
          >
            {SULCI.map((d, i) => (
              <path key={`sul-${i}`} d={d} />
            ))}
          </g>
          {/* Central longitudinal fissure (divides hemispheres) — bold */}
          <path
            d={CENTRAL_FISSURE}
            stroke="var(--svg-stroke)"
            strokeWidth="2"
            opacity="0.75"
            vectorEffect="non-scaling-stroke"
          />

          {/* Soft glow that follows the cursor through the cortex */}
          <circle cx={cx} cy={cy} r={PROX_R * 1.25} fill="url(#nn-cursor-glow)" />

          {/* ----- Axon connections (faint, so brain structure reads) ----- */}
          <g
            stroke="var(--svg-stroke)"
            strokeWidth="0.7"
            opacity="0.22"
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
