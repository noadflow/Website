'use client'

import { useEffect, useRef } from 'react'
import { useMouseParallax } from '@/hooks/use-mouse-parallax'

// ============================================================
// StarsMoon — CTA section backdrop.
// Small "streets" (short line segments) drawn with line-art, each
// with a dot at one end, arranged in a wide band AROUND the text
// area (left/right margins + top/bottom) so text visibility is
// never hindered. The dots gently pulse opacity; the whole field
// has a subtle mouse parallax. Soft, ambient, premium.
// ============================================================

const VB_W = 1200
const VB_H = 360
// Text safe-zone: the central region where the heading + button sit.
// Streets only render OUTSIDE this zone (left/right margins + top/bottom).
const SAFE_X1 = 320
const SAFE_X2 = 880
const SAFE_Y1 = 90
const SAFE_Y2 = 270

interface Street {
  x1: number; y1: number; x2: number; y2: number
  delay: number
}

// Deterministic pseudo-random
function rng(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff }
}

// Generate ~40 short line "streets" + dots, all OUTSIDE the safe zone.
const STREETS: Street[] = (() => {
  const rand = rng(42)
  const out: Street[] = []
  const make = (x1: number, y1: number) => {
    const len = 20 + rand() * 50
    const ang = rand() * Math.PI * 2
    out.push({
      x1, y1,
      x2: x1 + Math.cos(ang) * len,
      y2: y1 + Math.sin(ang) * len,
      delay: rand() * 4,
    })
  }
  // Left margin (x < SAFE_X1)
  for (let i = 0; i < 12; i++) make(rand() * (SAFE_X1 - 40) + 20, rand() * VB_H)
  // Right margin (x > SAFE_X2)
  for (let i = 0; i < 12; i++) make(SAFE_X2 + 20 + rand() * (VB_W - SAFE_X2 - 40), rand() * VB_H)
  // Top band (y < SAFE_Y1, x between safe)
  for (let i = 0; i < 8; i++) make(SAFE_X1 + rand() * (SAFE_X2 - SAFE_X1), rand() * (SAFE_Y1 - 20) + 10)
  // Bottom band (y > SAFE_Y2, x between safe)
  for (let i = 0; i < 8; i++) make(SAFE_X1 + rand() * (SAFE_X2 - SAFE_X1), SAFE_Y2 + 10 + rand() * (VB_H - SAFE_Y2 - 20))
  return out
})()

export function StarsMoon({ className }: { className?: string }) {
  const { ref, x, y } = useMouseParallax<HTMLDivElement>()
  const fieldRef = useRef<SVGGElement>(null)

  // Stable parallax: one long-running rAF, reads latest x/y from a ref.
  const target = useRef({ x: 0, y: 0 })
  useEffect(() => { target.current.x = x; target.current.y = y }, [x, y])
  useEffect(() => {
    const field = fieldRef.current
    if (!field) return
    let raf = 0
    let curX = 0
    let curY = 0
    const apply = () => {
      curX += (target.current.x - curX) * 0.06
      curY += (target.current.y - curY) * 0.06
      field.style.transform = `translate3d(${(curX * 16).toFixed(2)}px, ${(curY * 10).toFixed(2)}px, 0)`
      raf = requestAnimationFrame(apply)
    }
    raf = requestAnimationFrame(apply)
    return () => { if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <div ref={ref} className={className} style={{ overflow: 'visible' }}>
      <svg
        className="nf-brain-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <radialGradient id="cta-ambient" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.22" />
            <stop offset="60%" stopColor="var(--svg-glow)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft ambient glow behind everything */}
        <circle cx={VB_W / 2} cy={VB_H / 2} r="340" fill="url(#cta-ambient)" className="nf-glow-radiate" />

        {/* The streets + dots field (parallax layer) */}
        <g ref={fieldRef}>
          {STREETS.map((s, i) => (
            <g key={i}>
              {/* Street line segment */}
              <line
                x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                stroke="var(--svg-stroke)"
                strokeWidth="2"
                opacity="0.5"
                vectorEffect="non-scaling-stroke"
              />
              {/* Dot at the street's start (pulses opacity) */}
              <circle
                cx={s.x1} cy={s.y1} r="3"
                fill="var(--svg-accent)"
                className="nf-brain-bubble"
                style={{ animationDelay: `${s.delay}s` }}
              />
              {/* Smaller dot at the street's end */}
              <circle
                cx={s.x2} cy={s.y2} r="2"
                fill="var(--svg-stroke)"
                opacity="0.6"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
