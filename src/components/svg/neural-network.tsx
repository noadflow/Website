'use client'

import { memo, useEffect, useRef } from 'react'
import { BRAIN_SVG } from './brain-svg-data'

// ============================================================
// NeuralNetwork — the user's cazxca.svg line-art brain with
// radiating "bubble" terminals. Subtle, premium animations:
//   • Bubbles gently pulse (scale + opacity) — nf-brain-bubble class
//     is already applied to those paths in the SVG data.
//   • A soft glow behind the brain radiates outward + fades, repeating.
//   • The brain itself gently floats + breathes (idle "alive" feel).
//   • Mouse/touch: the brain gently tilts toward the cursor (parallax)
//     — smooth, not exaggerated. Direct DOM updates via rAF (no React
//     re-renders).
// All colors use CSS variables so it switches with the theme.
// ============================================================

// The brain artwork's actual rendered center (measured via getBBox on
// all brain paths) is (140, 139) in the SVG's coordinate space — NOT
// the nominal viewBox center (142.4, 140.9) and NOT (111, 123). We
// build the outer viewBox CENTERED ON THE ARTWORK'S TRUE CENTER (140,
// 139) with generous PAD on every side. This makes the brain sit
// perfectly centered in its column (aligned with the headline), while
// the padding keeps all radiating glow + bubble terminals fully visible.
const PAD = 10
const ART_CX = 140 // artwork true center (measured)
const ART_CY = 139
const ART_W = 308 // artwork bbox width
const ART_H = 279 // artwork bbox height
const VB_W = ART_W + PAD * 2
const VB_H = ART_H + PAD * 2
const VB_X = ART_CX - VB_W / 2
const VB_Y = ART_CY - VB_H / 2
const BC = { x: ART_CX, y: ART_CY } // brain center (for tilt pivot)

const Brain = memo(function Brain() {
  // The brain group floats (outer) + breathes (inner) so the two
  // transforms compose. Bubbles inside already carry nf-brain-bubble.
  return (
    <g className="nf-brain-float">
      <g
        className="nf-brain-breathe"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        dangerouslySetInnerHTML={{ __html: BRAIN_SVG }}
      />
    </g>
  )
})

export function NeuralNetwork({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<SVGGElement>(null) // mouse-tilt group (outermost)

  useEffect(() => {
    const el = wrapRef.current
    const tilt = tiltRef.current
    if (!el || !tilt) return
    let raf = 0
    let targetX = 0 // normalized -0.5..0.5
    let targetY = 0
    let curX = 0
    let curY = 0

    const apply = () => {
      raf = 0
      // ease toward target for smooth, lagging tilt
      curX += (targetX - curX) * 0.08
      curY += (targetY - curY) * 0.08
      // gentle tilt: max ~6deg rotate + ~10px translate
      const rot = curX * 6
      const tx = curX * 10
      const ty = curY * 10
      tilt.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) rotate(${rot.toFixed(2)} ${BC.x} ${BC.y})`)
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        raf = requestAnimationFrame(apply)
      }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(apply) }

    const setFromClient = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect()
      const cxp = rect.left + rect.width / 2
      const cyp = rect.top + rect.height / 2
      targetX = Math.max(-0.5, Math.min(0.5, (clientX - cxp) / rect.width))
      targetY = Math.max(-0.5, Math.min(0.5, (clientY - cyp) / rect.height))
      kick()
    }

    // ---- Mouse ----
    const onMouseMove = (e: MouseEvent) => setFromClient(e.clientX, e.clientY)
    const onMouseLeave = () => { targetX = 0; targetY = 0; kick() }
    // ---- Touch ----
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) setFromClient(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) setFromClient(e.touches[0].clientX, e.touches[0].clientY)
      // don't preventDefault — let the page scroll normally; the tilt is subtle
    }
    const onTouchEnd = () => { targetX = 0; targetY = 0; kick() }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return (
    <div ref={wrapRef} className={className} style={{ overflow: 'visible' }}>
      <svg
        className="nf-brain-svg"
        viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="nn-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.55" />
            <stop offset="60%" stopColor="var(--svg-glow)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft radiating glow behind the brain — expands + fades, repeating */}
        <circle cx={BC.x} cy={BC.y} r="130" fill="url(#nn-glow)" className="nf-glow-radiate" />

        {/* Mouse/touch tilt group (outermost) → brain float → brain breathe */}
        <g ref={tiltRef}>
          <Brain />
        </g>
      </svg>
    </div>
  )
}
