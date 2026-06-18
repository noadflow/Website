'use client'

import { useTilt } from '@/hooks/use-tilt'

// ============================================================
// ChatBubbles — 24/7 customer support.
//   • 3 stacked rounded chat bubbles (line-art, stroke 2) with little
//     tails. One bubble has 3 typing dots (nf-brain-bubble opacity
//     pulse, staggered → classic typing wave).
//   • A small clock circle with 2 hands + 4 tick marks, pulsing softly
//     via nf-brain-breathe (the "24/7" indicator).
//   • Soft radiating glow behind. Whole group floats gently.
//   • Subtle mouse/touch tilt (rAF lerp, direct DOM — no React state
//     on mousemove).
// All colors via CSS variables → switches with the theme.
// ============================================================

const CX = 150
const CY = 150

interface Bubble {
  x: number
  y: number
  w: number
  h: number
  tail: 'bl' | 'br' | 'tl'
  typing: boolean
  lines: number[] // widths of text lines inside the bubble
}

const BUBBLES: Bubble[] = [
  { x: 30, y: 95, w: 140, h: 58, tail: 'bl', typing: false, lines: [100, 75] },
  { x: 130, y: 168, w: 140, h: 58, tail: 'br', typing: true, lines: [] },
  { x: 40, y: 240, w: 120, h: 46, tail: 'tl', typing: false, lines: [85] },
]

// Tail = 2 line segments forming a triangle tip (no fill, pure line-art).
function tailPath(b: Bubble): string {
  const { x, y, w, h, tail } = b
  if (tail === 'bl') return `M ${x + 14} ${y + h} L ${x + 8} ${y + h + 14} L ${x + 30} ${y + h}`
  if (tail === 'br') return `M ${x + w - 30} ${y + h} L ${x + w - 8} ${y + h + 14} L ${x + w - 14} ${y + h}`
  return `M ${x + 14} ${y} L ${x + 8} ${y - 14} L ${x + 30} ${y}` // tl
}

const CLOCK_CX = 240
const CLOCK_CY = 58
const CLOCK_R = 22

// 4 tick directions at 12, 3, 6, 9 o'clock
const TICK_DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

export function ChatBubbles({ className }: { className?: string }) {
  const { ref, tiltRef } = useTilt<SVGGElement>(CX, CY)

  const tickR_out = CLOCK_R - 3
  const tickR_in = CLOCK_R - 7

  return (
    <div ref={ref} className={className} style={{ overflow: 'visible' }}>
      <svg
        className="nf-brain-svg"
        viewBox="0 0 300 300"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="chat-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.5" />
            <stop offset="55%" stopColor="var(--svg-glow)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft radiating glow behind — expands + fades, repeating */}
        <circle cx={CX} cy={CY} r="125" fill="url(#chat-glow)" className="nf-glow-radiate" />

        {/* Tilt group (outermost) → float group → content */}
        <g ref={tiltRef}>
          <g className="nf-brain-float">
            {/* Chat bubbles */}
            {BUBBLES.map((b, i) => (
              <g key={`b-${i}`}>
                {/* Tail (line-art, no fill) */}
                <path
                  d={tailPath(b)}
                  fill="none"
                  stroke="var(--svg-stroke)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Body */}
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx="14"
                  ry="14"
                  fill="none"
                  stroke="var(--svg-stroke)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Content: typing dots or text lines */}
                {b.typing ? (
                  [0, 1, 2].map((j) => (
                    <circle
                      key={`d-${j}`}
                      cx={b.x + 35 + j * 26}
                      cy={b.y + b.h / 2}
                      r="3.5"
                      fill="var(--svg-accent)"
                      stroke="none"
                      className="nf-brain-bubble"
                      style={{ animationDelay: `${j * 0.4}s` }}
                    />
                  ))
                ) : (
                  b.lines.map((lw, j) => (
                    <line
                      key={`l-${j}`}
                      x1={b.x + 18}
                      y1={b.y + 20 + j * 20}
                      x2={b.x + 18 + lw}
                      y2={b.y + 20 + j * 20}
                      stroke="var(--svg-stroke)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.7"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))
                )}
              </g>
            ))}

            {/* 24/7 Clock — top right, breathing softly (nf-brain-breathe) */}
            <g className="nf-brain-breathe">
              <circle
                cx={CLOCK_CX}
                cy={CLOCK_CY}
                r={CLOCK_R}
                fill="none"
                stroke="var(--svg-stroke)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              {/* 4 tick marks at 12, 3, 6, 9 */}
              {TICK_DIRS.map((dir, i) => (
                <line
                  key={`t-${i}`}
                  x1={CLOCK_CX + dir[0] * tickR_out}
                  y1={CLOCK_CY + dir[1] * tickR_out}
                  x2={CLOCK_CX + dir[0] * tickR_in}
                  y2={CLOCK_CY + dir[1] * tickR_in}
                  stroke="var(--svg-stroke)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {/* Hour hand (short, pointing to ~10 o'clock) */}
              <line
                x1={CLOCK_CX}
                y1={CLOCK_CY}
                x2={CLOCK_CX - 8}
                y2={CLOCK_CY - 8}
                stroke="var(--svg-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* Minute hand (longer, pointing to ~2 o'clock) */}
              <line
                x1={CLOCK_CX}
                y1={CLOCK_CY}
                x2={CLOCK_CX + 13}
                y2={CLOCK_CY - 7}
                stroke="var(--svg-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* Center dot */}
              <circle cx={CLOCK_CX} cy={CLOCK_CY} r="2" fill="var(--svg-accent)" stroke="none" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
