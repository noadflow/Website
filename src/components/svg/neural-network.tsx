'use client'

import { memo, useEffect, useRef } from 'react'
import { BRAIN_SVG } from './brain-svg-data'

// ============================================================
// NeuralNetwork — the user's DD.svg brain (nodes + lines + 2 gears)
// matched to the site theme via CSS variables, with the two gears
// CONSTANTLY ROTATING (meshed gears turn in opposite directions).
// Travelling signal dots run along the brain's internal lines, and
// nodes near the cursor grow bigger (mouse + touch). The brain SVG
// is rendered once (memoized); only the gears + runners + glow are
// updated each frame via direct DOM refs (no React re-renders).
// ============================================================

const VB_W = 612
const VB_H = 1024

// Gear positions (from the DD.svg). Two meshed gears inside the brain.
// Gear 1 (larger, upper-left): center ~ (233, 390), outer r ~ 52
// Gear 2 (smaller, lower-right): center ~ (324, 430), outer r ~ 34
// They overlap slightly so they read as meshed.
interface GearCfg {
  cx: number
  cy: number
  teeth: number
  outerR: number
  innerR: number
  hubR: number
  dir: 1 | -1 // rotation direction
  speed: number // seconds per revolution
}
const GEARS: GearCfg[] = [
  { cx: 233, cy: 390, teeth: 12, outerR: 56, innerR: 44, hubR: 14, dir: 1, speed: 18 },
  { cx: 312, cy: 432, teeth: 10, outerR: 38, innerR: 30, hubR: 9, dir: -1, speed: 13 },
]

const Brain = memo(function Brain() {
  return <g dangerouslySetInnerHTML={{ __html: BRAIN_SVG }} />
})

// Build a gear path: a toothed ring with a center hub hole.
// The gear is drawn centered at (0,0) and translated/rotated by the
// parent <g>. Teeth are trapezoidal bumps around the inner ring.
function gearPath(cfg: GearCfg): string {
  const { teeth, outerR, innerR, hubR } = cfg
  const tw = (Math.PI * 2) / teeth // tooth angle width
  const toothTip = outerR
  const toothBase = innerR
  const halfTip = tw * 0.28
  const halfBase = tw * 0.38
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a = i * tw
    // four corners of one trapezoidal tooth
    const a1 = a - halfBase
    const a2 = a - halfTip
    const a3 = a + halfTip
    const a4 = a + halfBase
    const p1 = [Math.cos(a1) * toothBase, Math.sin(a1) * toothBase]
    const p2 = [Math.cos(a2) * toothTip, Math.sin(a2) * toothTip]
    const p3 = [Math.cos(a3) * toothTip, Math.sin(a3) * toothTip]
    const p4 = [Math.cos(a4) * toothBase, Math.sin(a4) * toothBase]
    if (i === 0) d += `M ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} `
    else d += `L ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} `
    d += `L ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} L ${p3[0].toFixed(1)} ${p3[1].toFixed(1)} L ${p4[0].toFixed(1)} ${p4[1].toFixed(1)} `
  }
  d += 'Z '
  // outer ring done; cut a center hub hole (counter-clockwise circle)
  d += `M ${hubR} 0 `
  const segs = 16
  for (let i = 1; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2
    d += `L ${(Math.cos(a) * hubR).toFixed(1)} ${(Math.sin(a) * hubR).toFixed(1)} `
  }
  d += 'Z'
  return d
}

export function NeuralNetwork({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const gearRefs = useRef<(SVGGElement | null)[]>([])
  // Runner dots that travel along the brain's internal lines.
  const brainGroupRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    const brainGroup = brainGroupRef.current
    if (!el || !brainGroup) return

    // ---- Constant gear rotation via rAF (direct DOM, no re-renders) ----
    let raf = 0
    let startT = performance.now()
    const gearStarts = GEARS.map((_, i) => (i * 137) % 360) // staggered start angles

    // ---- Travelling runner dots along the brain's internal lines ----
    // The DD.svg is one big filled path (no separate <line> elements),
    // so we generate a few connection lines between spread points on
    // the brain and run dots along them.
    interface Runner {
      el: SVGCircleElement
      x1: number; y1: number; x2: number; y2: number
      len: number
      speed: number
      pos: number
    }
    const runners: Runner[] = []
    try {
      const svgNS = 'http://www.w3.org/2000/svg'
      // Brain bbox in its own viewBox (612x1024). Spread endpoints.
      const pts = [
        { x: 180, y: 280 }, { x: 300, y: 250 }, { x: 420, y: 300 },
        { x: 460, y: 420 }, { x: 420, y: 540 }, { x: 300, y: 580 },
        { x: 180, y: 540 }, { x: 140, y: 420 }, { x: 250, y: 360 },
        { x: 360, y: 380 }, { x: 320, y: 480 }, { x: 220, y: 470 },
      ]
      const pairs: [number, number][] = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
        [8, 9], [9, 10], [10, 11], [11, 8], [1, 8], [2, 9], [5, 10], [6, 11],
      ]
      for (let i = 0; i < pairs.length; i++) {
        const a = pts[pairs[i][0]]
        const b = pts[pairs[i][1]]
        const len = Math.hypot(b.x - a.x, b.y - a.y)
        const dot = document.createElementNS(svgNS, 'circle') as SVGCircleElement
        dot.setAttribute('r', '4')
        dot.setAttribute('fill', 'var(--svg-accent)')
        dot.setAttribute('opacity', '0.9')
        brainGroup.appendChild(dot)
        runners.push({
          el: dot,
          x1: a.x, y1: a.y, x2: b.x, y2: b.y,
          len,
          speed: 25 + (i % 5) * 6,
          pos: (i / pairs.length) * len,
        })
      }
    } catch {
      /* skip runners on error */
    }

    const apply = (now: number) => {
      const elapsed = (now - startT) / 1000
      // Rotate gears
      for (let i = 0; i < GEARS.length; i++) {
        const g = gearRefs.current[i]
        if (!g) continue
        const angle = gearStarts[i] + (elapsed / GEARS[i].speed) * 360 * GEARS[i].dir
        g.setAttribute('transform', `translate(${GEARS[i].cx} ${GEARS[i].cy}) rotate(${angle})`)
      }
      // Move runners along their lines (linear interpolation, wrap)
      for (const r of runners) {
        r.pos += r.speed * 0.016 // ~speed per frame at 60fps
        if (r.pos >= r.len) r.pos -= r.len
        const t = r.pos / r.len
        r.el.setAttribute('cx', String(r.x1 + (r.x2 - r.x1) * t))
        r.el.setAttribute('cy', String(r.y1 + (r.y2 - r.y1) * t))
      }
      raf = requestAnimationFrame(apply)
    }
    raf = requestAnimationFrame(apply)

    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={wrapRef} className={className} style={{ touchAction: 'none' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="nn-ambient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.3" />
            <stop offset="60%" stopColor="var(--svg-glow)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient breathing glow behind the brain */}
        <circle
          cx={VB_W / 2}
          cy={420}
          r="380"
          fill="url(#nn-ambient)"
          className="nf-breathe"
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '7s' }}
        />

        <g ref={brainGroupRef}>
          <Brain />
        </g>

        {/* The two gears — constantly rotating, drawn ON TOP of the brain */}
        {GEARS.map((g, i) => (
          <g
            key={i}
            ref={(el) => { gearRefs.current[i] = el }}
            transform={`translate(${g.cx} ${g.cy})`}
          >
            <path
              d={gearPath(g)}
              fill="var(--svg-stroke)"
              fillRule="evenodd"
              opacity="0.95"
            />
            {/* Center hub accent ring */}
            <circle cx="0" cy="0" r={g.hubR + 3} fill="none" stroke="var(--svg-accent)" strokeWidth="1.5" opacity="0.7" />
            <circle cx="0" cy="0" r={g.hubR * 0.5} fill="var(--svg-accent)" opacity="0.5" />
          </g>
        ))}
      </svg>
    </div>
  )
}
