'use client'

import { useEffect, useRef } from 'react'
import { useMouseParallax } from '@/hooks/use-mouse-parallax'

// ============================================================
// GeometricShapes — soft outlined shapes that breathe (Pricing band).
// Built on the brain SVG design language:
//   • stroke var(--svg-stroke), width 2, round caps/joins, fill none
//     (via the shared .nf-brain-line class)
//   • 5 line-art shapes: circle, rounded square, rounded triangle,
//     hexagon, plus — drawn as smooth paths with rounded joins
//   • each shape gently breathes (nf-brain-breathe) on a STAGGERED
//     delay so they never move in lockstep
//   • a soft radiating glow (nf-glow-radiate) sits behind the band
//   • subtle mouse tilt parallax: max ~5deg rotate + ~8px translate
//     via direct DOM rAF (0.08 lerp). No React state.
// Wide band viewBox 500 x 200, `preserveAspectRatio="xMidYMid slice"`
// so the band fills a wide container. Shapes sit on the y=100 axis
// so the slice's vertical crop never clips them.
// ============================================================

const VB_W = 500
const VB_H = 200
const CX = VB_W / 2 // tilt pivot (band center)
const CY = VB_H / 2

type ShapeType = 'circle' | 'square' | 'triangle' | 'hexagon' | 'plus'

interface ShapeDef {
  type: ShapeType
  cx: number
  cy: number
  size: number
  rotate: number
  delay: number
}

// 5 shapes spread across the band, staggered breathing delays.
const SHAPES: ShapeDef[] = [
  { type: 'circle',   cx: 60,  cy: 100, size: 32, rotate: 0,  delay: 0.0 },
  { type: 'square',   cx: 155, cy: 100, size: 30, rotate: 8,  delay: 1.1 },
  { type: 'triangle', cx: 250, cy: 100, size: 34, rotate: 0,  delay: 2.0 },
  { type: 'hexagon',  cx: 345, cy: 100, size: 32, rotate: 0,  delay: 0.7 },
  { type: 'plus',     cx: 440, cy: 100, size: 28, rotate: 0,  delay: 1.6 },
]

// Rounded square (centered at origin, half-size s, corner radius r).
function roundedSquare(s: number, r: number): string {
  return `M ${(-s + r).toFixed(2)} ${(-s).toFixed(2)} L ${(s - r).toFixed(2)} ${(-s).toFixed(2)} Q ${s.toFixed(2)} ${(-s).toFixed(2)} ${s.toFixed(2)} ${(-s + r).toFixed(2)} L ${s.toFixed(2)} ${(s - r).toFixed(2)} Q ${s.toFixed(2)} ${s.toFixed(2)} ${(s - r).toFixed(2)} ${s.toFixed(2)} L ${(-s + r).toFixed(2)} ${s.toFixed(2)} Q ${(-s).toFixed(2)} ${s.toFixed(2)} ${(-s).toFixed(2)} ${(s - r).toFixed(2)} L ${(-s).toFixed(2)} ${(-s + r).toFixed(2)} Q ${(-s).toFixed(2)} ${(-s).toFixed(2)} ${(-s + r).toFixed(2)} ${(-s).toFixed(2)} Z`
}

// Rounded equilateral triangle pointing up (centered at origin,
// circumradius r, corner radius cr). Corners are real quadratic
// curves so the rounding is visible — not just stroke-linejoin.
function roundedTriangle(r: number, cr: number): string {
  const verts: { x: number; y: number }[] = []
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 2
    verts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r })
  }
  const corners = verts.map((v, i) => {
    const prev = verts[(i + 2) % 3]
    const next = verts[(i + 1) % 3]
    const dPrev = Math.hypot(v.x - prev.x, v.y - prev.y)
    const dNext = Math.hypot(v.x - next.x, v.y - next.y)
    const entry = {
      x: v.x + ((prev.x - v.x) * cr) / dPrev,
      y: v.y + ((prev.y - v.y) * cr) / dPrev,
    }
    const exit = {
      x: v.x + ((next.x - v.x) * cr) / dNext,
      y: v.y + ((next.y - v.y) * cr) / dNext,
    }
    return { v, entry, exit }
  })
  let d = `M ${corners[0].entry.x.toFixed(2)} ${corners[0].entry.y.toFixed(2)} `
  for (let i = 0; i < 3; i++) {
    const cur = corners[i]
    const nxt = corners[(i + 1) % 3]
    d += `Q ${cur.v.x.toFixed(2)} ${cur.v.y.toFixed(2)} ${cur.exit.x.toFixed(2)} ${cur.exit.y.toFixed(2)} `
    d += `L ${nxt.entry.x.toFixed(2)} ${nxt.entry.y.toFixed(2)} `
  }
  return d + 'Z'
}

// Hexagon (centered at origin, circumradius r, point at top).
function hexagon(r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    pts.push(`${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`)
  }
  return 'M ' + pts.join(' L ') + ' Z'
}

// Plus shape (centered at origin, arm half-length s, arm half-thickness t).
function plus(s: number, t: number): string {
  return `M ${(-t).toFixed(2)} ${(-s).toFixed(2)} L ${t.toFixed(2)} ${(-s).toFixed(2)} L ${t.toFixed(2)} ${(-t).toFixed(2)} L ${s.toFixed(2)} ${(-t).toFixed(2)} L ${s.toFixed(2)} ${t.toFixed(2)} L ${t.toFixed(2)} ${t.toFixed(2)} L ${t.toFixed(2)} ${s.toFixed(2)} L ${(-t).toFixed(2)} ${s.toFixed(2)} L ${(-t).toFixed(2)} ${t.toFixed(2)} L ${(-s).toFixed(2)} ${t.toFixed(2)} L ${(-s).toFixed(2)} ${(-t).toFixed(2)} L ${(-t).toFixed(2)} ${(-t).toFixed(2)} Z`
}

function shapePath(type: ShapeType, size: number): string | null {
  switch (type) {
    case 'square':
      return roundedSquare(size, size * 0.24)
    case 'triangle':
      return roundedTriangle(size, size * 0.24)
    case 'hexagon':
      return hexagon(size)
    case 'plus':
      return plus(size, size * 0.34)
    default:
      return null // circle is drawn via <circle>
  }
}

export function GeometricShapes({ className }: { className?: string }) {
  const { ref: wrapRef, x, y } = useMouseParallax<HTMLDivElement>()
  const tiltRef = useRef<SVGGElement>(null) // mouse-tilt group wrapping all shapes

  const cur = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let raf = 0
    const apply = () => {
      raf = 0
      const tx = x
      const ty = y
      cur.current.x += (tx - cur.current.x) * 0.08
      cur.current.y += (ty - cur.current.y) * 0.08
      const el = tiltRef.current
      if (el) {
        // Gentle tilt: max ~5deg rotate around band center + ~8px translate.
        const rot = cur.current.x * 5
        const dx = cur.current.x * 8
        const dy = cur.current.y * 6
        el.setAttribute(
          'transform',
          `translate(${dx.toFixed(2)} ${dy.toFixed(2)}) rotate(${rot.toFixed(2)} ${CX} ${CY})`
        )
      }
      if (Math.abs(tx - cur.current.x) > 0.001 || Math.abs(ty - cur.current.y) > 0.001) {
        raf = requestAnimationFrame(apply)
      }
    }
    if (!raf) raf = requestAnimationFrame(apply)
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [x, y])

  return (
    <div ref={wrapRef} className={className} style={{ overflow: 'visible' }}>
      <svg
        className="nf-brain-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="gs-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.42" />
            <stop offset="60%" stopColor="var(--svg-glow)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft radiating glow filling the band behind the shapes */}
        <ellipse
          cx={CX}
          cy={CY}
          rx={VB_W * 0.55}
          ry={VB_H * 0.9}
          fill="url(#gs-glow)"
          className="nf-glow-radiate"
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animationDuration: '7s',
          }}
        />

        {/* Mouse-tilt group wrapping all shapes — tilts as one pane */}
        <g ref={tiltRef}>
          {SHAPES.map((sh, i) => {
            const path = shapePath(sh.type, sh.size)
            return (
              <g
                key={i}
                transform={`translate(${sh.cx} ${sh.cy}) rotate(${sh.rotate})`}
              >
                {/* Each shape breathes on its own staggered beat */}
                <g
                  className="nf-brain-breathe"
                  style={{
                    animationDelay: `${sh.delay}s`,
                    animationDuration: '6s',
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                  }}
                >
                  {sh.type === 'circle' ? (
                    <circle
                      cx="0"
                      cy="0"
                      r={sh.size}
                      className="nf-brain-line"
                      vectorEffect="non-scaling-stroke"
                    />
                  ) : (
                    <path
                      d={path as string}
                      className="nf-brain-line"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </g>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
