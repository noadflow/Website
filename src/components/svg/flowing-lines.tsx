'use client'

import { useEffect, useRef } from 'react'
import { useMouseParallax } from '@/hooks/use-mouse-parallax'

// ============================================================
// FlowingLines — abstract flowing sine-wave band (About page).
// Built on the brain SVG design language:
//   • stroke var(--svg-stroke), width 2, round caps/joins, fill none
//     (via the shared .nf-brain-line class)
//   • each wave gently breathes (nf-brain-breathe) with a staggered
//     delay so the band undulates as a whole, never in lockstep
//   • a soft radiating halo (nf-glow-radiate) behind the field +
//     a cursor-following soft glow that tracks the pointer
//   • subtle mouse parallax — the line field drifts gently, the
//     cursor glow follows more strongly. Both applied via direct
//     DOM transforms in a rAF loop (0.08 lerp). No React state.
// Wide band viewBox 1200 x 300 so it fills a wide container with
// `preserveAspectRatio="xMidYMid slice"` (only ~30vu cropped top/bottom).
// ============================================================

const VB_W = 1200
const VB_H = 300
const CX = VB_W / 2
const CY = VB_H / 2

interface WaveDef {
  y: number
  amp: number
  periods: number
  phase: number
  delay: number
  opacity: number
}

// 5 flowing sine-wave lines spread vertically across the band.
const WAVES: WaveDef[] = [
  { y: 55,  amp: 16, periods: 3.0, phase: 0,                delay: 0.0, opacity: 0.95 },
  { y: 105, amp: 22, periods: 3.5, phase: Math.PI / 3,      delay: 1.2, opacity: 0.70 },
  { y: 160, amp: 14, periods: 4.0, phase: Math.PI / 2,      delay: 2.1, opacity: 1.00 },
  { y: 210, amp: 24, periods: 3.0, phase: Math.PI,          delay: 0.8, opacity: 0.65 },
  { y: 255, amp: 16, periods: 4.5, phase: Math.PI * 1.3,    delay: 1.6, opacity: 0.85 },
]

// Build a smooth sine-wave path using cubic Béziers whose control
// points are derived from the analytical tangent of the sine
// (slope = amp·ω·cos), giving a near-perfect sine with only 4
// segments per period — smooth, premium curves.
function sineWavePath(def: WaveDef, width: number): string {
  const segs = Math.max(8, Math.round(def.periods * 4))
  const segW = width / segs
  const omega = (2 * Math.PI * def.periods) / width
  const yAt = (x: number) => def.y + Math.sin(omega * x + def.phase) * def.amp
  const sAt = (x: number) => def.amp * omega * Math.cos(omega * x + def.phase)
  let d = ''
  for (let i = 0; i <= segs; i++) {
    const x = i * segW
    const y = yAt(x)
    if (i === 0) {
      d += `M ${x.toFixed(2)} ${y.toFixed(2)}`
    } else {
      const x0 = (i - 1) * segW
      const y0 = yAt(x0)
      const s0 = sAt(x0)
      const s1 = sAt(x)
      const c1x = x0 + segW / 3
      const c1y = y0 + (s0 * segW) / 3
      const c2x = x - segW / 3
      const c2y = y - (s1 * segW) / 3
      d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${x.toFixed(2)} ${y.toFixed(2)}`
    }
  }
  return d
}

// Precompute the static wave paths at module scope (only transforms animate).
const PATHS = WAVES.map((w) => sineWavePath(w, VB_W))

export function FlowingLines({ className }: { className?: string }) {
  const { ref: wrapRef, x, y } = useMouseParallax<HTMLDivElement>()
  const linesRef = useRef<SVGGElement>(null) // the wave field (subtle parallax)
  const glowRef = useRef<SVGGElement>(null) // cursor-following glow (stronger parallax)

  // Eased "current" values persist across effect re-runs.
  const cur = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let raf = 0
    const apply = () => {
      raf = 0
      const tx = x
      const ty = y
      cur.current.x += (tx - cur.current.x) * 0.08
      cur.current.y += (ty - cur.current.y) * 0.08
      const lines = linesRef.current
      const glow = glowRef.current
      // Wave field drifts subtly with the cursor.
      if (lines) {
        const lx = cur.current.x * 10
        const ly = cur.current.y * 8
        lines.setAttribute(
          'transform',
          `translate(${lx.toFixed(2)} ${ly.toFixed(2)})`
        )
      }
      // The cursor glow follows more strongly — it reads as a soft halo
      // tracking the pointer across the band.
      if (glow) {
        const gx = cur.current.x * 32
        const gy = cur.current.y * 24
        glow.setAttribute(
          'transform',
          `translate(${gx.toFixed(2)} ${gy.toFixed(2)})`
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
          <radialGradient id="fl-cursor-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.55" />
            <stop offset="60%" stopColor="var(--svg-glow)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fl-band-ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft ambient band glow centered on the field (static) */}
        <ellipse
          cx={CX}
          cy={CY}
          rx={VB_W * 0.5}
          ry={VB_H * 0.55}
          fill="url(#fl-band-ambient)"
        />

        {/* Cursor-following soft glow — radiates + tracks the pointer */}
        <g ref={glowRef}>
          <circle
            cx={CX}
            cy={CY}
            r="135"
            fill="url(#fl-cursor-glow)"
            className="nf-glow-radiate"
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animationDuration: '6s',
            }}
          />
        </g>

        {/* Flowing sine-wave field — each wave breathes on its own staggered beat */}
        <g ref={linesRef}>
          {PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              className="nf-brain-line nf-brain-breathe"
              vectorEffect="non-scaling-stroke"
              style={{
                opacity: WAVES[i].opacity,
                animationDelay: `${WAVES[i].delay}s`,
                animationDuration: '6s',
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
