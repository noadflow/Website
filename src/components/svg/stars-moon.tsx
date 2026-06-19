'use client'

import { useEffect, useRef } from 'react'
import { useMouseParallax } from '@/hooks/use-mouse-parallax'

// ============================================================
// StarsMoon — CTA section backdrop (premium redesign).
// Concentric expanding rings radiate outward from behind the text,
// a few elegant dots orbit slowly at different radii, and a soft
// central glow breathes. All line-art (stroke 2, round caps), theme-
// aware via CSS variables. The rings expand from the center so the
// text sits in clean negative space — nothing clutters the text.
// Subtle mouse parallax. Ambient, premium, calm.
// ============================================================

const VB_W = 1200
const VB_H = 360
const CX = VB_W / 2
const CY = VB_H / 2

// Orbiting dots at different radii + speeds (CSS spin animations).
const ORBITS = [
  { r: 140, speed: 45, delay: 0, dot: 3.5 },
  { r: 200, speed: 60, delay: -8, dot: 3 },
  { r: 260, speed: 75, delay: -15, dot: 2.5 },
  { r: 320, speed: 90, delay: -4, dot: 2 },
]

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
      field.style.transform = `translate3d(${(curX * 12).toFixed(2)}px, ${(curY * 8).toFixed(2)}px, 0)`
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
          <radialGradient id="cta-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="var(--svg-glow)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Parallax field: rings + orbits + glow */}
        <g ref={fieldRef}>
          {/* Soft central glow (breathes) */}
          <circle
            cx={CX} cy={CY} r="180"
            fill="url(#cta-core-glow)"
            className="nf-brain-breathe"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />

          {/* Concentric expanding rings — radiate outward from center,
              staggered so there's always one expanding. Clean, premium. */}
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={`ring-${i}`}
              cx={CX} cy={CY} r="60"
              fill="none"
              stroke="var(--svg-stroke)"
              strokeWidth="1.5"
              opacity="0"
              vectorEffect="non-scaling-stroke"
            >
              <animate
                attributeName="r"
                values="60;360"
                dur="10s"
                begin={`${i * 2.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.5;0"
                keyTimes="0;0.2;1"
                dur="10s"
                begin={`${i * 2.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* A couple of faint static guide rings for structure */}
          <circle cx={CX} cy={CY} r="140" fill="none" stroke="var(--svg-stroke)" strokeWidth="1" opacity="0.15" vectorEffect="non-scaling-stroke" />
          <circle cx={CX} cy={CY} r="260" fill="none" stroke="var(--svg-stroke)" strokeWidth="1" opacity="0.1" vectorEffect="non-scaling-stroke" />

          {/* Orbiting dots — slow, elegant, at different radii */}
          {ORBITS.map((o, i) => (
            <g
              key={`orbit-${i}`}
              className="nf-spin-slow"
              style={{
                transformBox: 'fill-box',
                transformOrigin: `${CX}px ${CY}px`,
                animationDuration: `${o.speed}s`,
                animationDelay: `${o.delay}s`,
              }}
            >
              <circle
                cx={CX + o.r} cy={CY} r={o.dot}
                fill="var(--svg-accent)"
                className="nf-brain-bubble"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            </g>
          ))}

          {/* A few small accent dots scattered at the outer edges
              (never near center, so text stays clean) */}
          {[
            { x: 120, y: 80, delay: 0 },
            { x: 1080, y: 80, delay: 1 },
            { x: 80, y: 280, delay: 2 },
            { x: 1120, y: 280, delay: 1.5 },
            { x: 200, y: 50, delay: 0.8 },
            { x: 1000, y: 50, delay: 2.2 },
          ].map((d, i) => (
            <circle
              key={`dot-${i}`}
              cx={d.x} cy={d.y} r="2.5"
              fill="var(--svg-stroke)"
              className="nf-brain-bubble"
              style={{ animationDelay: `${d.delay}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
