'use client'

import { useEffect, useRef } from 'react'
import { useMouseParallax } from '@/hooks/use-mouse-parallax'

// ============================================================
// StarsMoon — floating particles + a soft glowing orb (CTA backdrop).
// Built on the brain SVG design language:
//   • ~14 small circle "particles" of varying sizes scattered across
//     the band, each pulsing opacity (nf-brain-bubble, staggered)
//   • a few particles also drift upward (nf-drift-up) for ambient motion
//   • a central glowing orb that breathes (nf-brain-breathe) drawn as
//     concentric line-art outlines + a center dot, with a radiating
//     halo (nf-glow-radiate) and a constant soft glow behind it
//   • subtle layered mouse PARALLAX (no tilt — it's an ambient backdrop):
//     back particles drift least, the orb mid, front particles most.
//     All via direct DOM rAF (0.08 lerp). No React state.
// Wide band viewBox 600 x 300, `preserveAspectRatio="xMidYMid meet"`
// (centered backdrop — content sits on top in the CTA card).
// ============================================================

const VB_W = 600
const VB_H = 300
const ORB_X = VB_W / 2
const ORB_Y = VB_H / 2
const ORB_R = 36

interface Particle {
  x: number
  y: number
  r: number
  delay: number
  drift: boolean
  driftDur: string
  pulseDur: string
  layer: 'back' | 'front'
}

// 14 particles scattered across the band, split into back/front layers
// for parallax depth. Smaller ones tend to be in the back layer.
const PARTICLES: Particle[] = [
  { x: 55,  y: 55,  r: 2.4, delay: 0.0, drift: false, driftDur: '12s',   pulseDur: '3.6s', layer: 'back'  },
  { x: 120, y: 95,  r: 1.8, delay: 0.6, drift: true,  driftDur: '11s',   pulseDur: '4.0s', layer: 'back'  },
  { x: 195, y: 50,  r: 3.2, delay: 1.1, drift: false, driftDur: '13s',   pulseDur: '3.4s', layer: 'front' },
  { x: 240, y: 110, r: 2.0, delay: 0.3, drift: true,  driftDur: '12.5s', pulseDur: '4.4s', layer: 'back'  },
  { x: 80,  y: 210, r: 2.8, delay: 1.4, drift: false, driftDur: '11.5s', pulseDur: '3.2s', layer: 'front' },
  { x: 165, y: 245, r: 1.6, delay: 0.8, drift: true,  driftDur: '12s',   pulseDur: '4.2s', layer: 'back'  },
  { x: 230, y: 215, r: 2.4, delay: 1.8, drift: false, driftDur: '13s',   pulseDur: '3.8s', layer: 'front' },
  { x: 370, y: 50,  r: 2.0, delay: 0.5, drift: true,  driftDur: '12.5s', pulseDur: '4.0s', layer: 'back'  },
  { x: 440, y: 90,  r: 2.6, delay: 1.2, drift: false, driftDur: '11s',   pulseDur: '3.6s', layer: 'front' },
  { x: 510, y: 55,  r: 1.7, delay: 0.2, drift: true,  driftDur: '13s',   pulseDur: '4.4s', layer: 'back'  },
  { x: 545, y: 130, r: 3.0, delay: 1.6, drift: false, driftDur: '12s',   pulseDur: '3.4s', layer: 'front' },
  { x: 385, y: 235, r: 2.2, delay: 0.9, drift: true,  driftDur: '11.5s', pulseDur: '3.8s', layer: 'back'  },
  { x: 470, y: 215, r: 2.4, delay: 1.5, drift: false, driftDur: '12.5s', pulseDur: '4.0s', layer: 'front' },
  { x: 540, y: 245, r: 1.9, delay: 0.4, drift: true,  driftDur: '12s',   pulseDur: '3.6s', layer: 'back'  },
]

export function StarsMoon({ className }: { className?: string }) {
  const { ref: wrapRef, x, y } = useMouseParallax<HTMLDivElement>()
  const backRef = useRef<SVGGElement>(null)
  const orbRef = useRef<SVGGElement>(null)
  const frontRef = useRef<SVGGElement>(null)

  const cur = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let raf = 0
    const apply = () => {
      raf = 0
      const tx = x
      const ty = y
      cur.current.x += (tx - cur.current.x) * 0.08
      cur.current.y += (ty - cur.current.y) * 0.08
      // Layered parallax: back particles drift least, orb mid, front most.
      // No rotation — this is an ambient backdrop.
      const set = (el: SVGGElement | null, factor: number) => {
        if (!el) return
        const dx = cur.current.x * factor
        const dy = cur.current.y * factor
        el.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`)
      }
      set(backRef.current, 8)
      set(orbRef.current, 14)
      set(frontRef.current, 24)
      if (Math.abs(tx - cur.current.x) > 0.001 || Math.abs(ty - cur.current.y) > 0.001) {
        raf = requestAnimationFrame(apply)
      }
    }
    if (!raf) raf = requestAnimationFrame(apply)
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [x, y])

  const renderParticle = (p: Particle, i: number) => {
    // Particles are FILLED dots — override the .nf-brain-bubble class's
    // default `fill:none; stroke:...` via inline style (style beats class).
    const dot = (
      <circle
        r={p.r}
        className="nf-brain-bubble"
        vectorEffect="non-scaling-stroke"
        style={{
          fill: 'var(--svg-accent)',
          stroke: 'none',
          animationDelay: `${p.delay}s`,
          animationDuration: p.pulseDur,
        }}
      />
    )
    return (
      <g key={i} transform={`translate(${p.x} ${p.y})`}>
        {p.drift ? (
          <g
            className="nf-drift-up"
            style={{
              animationDelay: `${p.delay}s`,
              animationDuration: p.driftDur,
            }}
          >
            {dot}
          </g>
        ) : (
          dot
        )}
      </g>
    )
  }

  return (
    <div ref={wrapRef} className={className} style={{ overflow: 'visible' }}>
      <svg
        className="nf-brain-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="sm-orb-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.5" />
            <stop offset="60%" stopColor="var(--svg-glow)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sm-orb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Back-layer particles — smallest parallax depth */}
        <g ref={backRef}>
          {PARTICLES.filter((p) => p.layer === 'back').map(renderParticle)}
        </g>

        {/* Central glowing orb — mid parallax depth */}
        <g ref={orbRef}>
          {/* Radiating halo (expands + fades, repeating) */}
          <circle
            cx={ORB_X}
            cy={ORB_Y}
            r={ORB_R * 3.2}
            fill="url(#sm-orb-halo)"
            className="nf-glow-radiate"
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animationDuration: '6s',
            }}
          />
          {/* Constant soft glow behind the orb */}
          <circle
            cx={ORB_X}
            cy={ORB_Y}
            r={ORB_R * 2.1}
            fill="url(#sm-orb-core)"
          />
          {/* Breathing orb — concentric line-art outlines + center dot */}
          <g
            className="nf-brain-breathe"
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animationDuration: '7s',
            }}
          >
            <circle
              cx={ORB_X}
              cy={ORB_Y}
              r={ORB_R}
              className="nf-brain-line"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={ORB_X}
              cy={ORB_Y}
              r={ORB_R * 0.55}
              className="nf-brain-line"
              vectorEffect="non-scaling-stroke"
              style={{ opacity: 0.5 }}
            />
            <circle
              cx={ORB_X}
              cy={ORB_Y}
              r="2.5"
              fill="var(--svg-accent)"
              stroke="none"
            />
          </g>
        </g>

        {/* Front-layer particles — largest parallax depth */}
        <g ref={frontRef}>
          {PARTICLES.filter((p) => p.layer === 'front').map(renderParticle)}
        </g>
      </svg>
    </div>
  )
}
