'use client'

import { useTilt } from '@/hooks/use-tilt'

// ============================================================
// ContentAgents — AI writing + publishing content.
//   • 5 thin horizontal rounded lines (staggered widths, stroke 2) —
//     reads as text paragraphs being written.
//   • A blinking cursor at the end of the last (shortest) line — uses
//     the existing .nf-caret class (1s blink).
//   • 4 small circle "platform" icons drifting upward + fading out
//     (nf-drift-up, staggered) — like content being published and sent
//     into the world. Positioned on the sides so they never overlap
//     the text.
//   • Soft radiating glow behind. Whole group floats gently.
//   • Subtle mouse/touch tilt (rAF lerp, direct DOM — no React state
//     on mousemove).
// All colors via CSS variables → switches with the theme.
// ============================================================

const CX = 150
const CY = 150

const LINE_X = 50
// 5 text lines (paragraphs); last is shortest — being typed.
const TEXT_LINES = [
  { y: 100, width: 200 },
  { y: 130, width: 175 },
  { y: 160, width: 210 },
  { y: 190, width: 165 },
  { y: 220, width: 95 },
]

// 4 platform icons on the sides of the text block. Each drifts upward
// +48px and fades out (nf-drift-up, 12s). Staggered 3s apart for
// continuous emission. Positioned at x=28 (left) / x=272 (right) so
// they never overlap the text (which spans x=50–260).
const PLATFORMS = [
  { x: 28, y: 245, delay: '0s' },
  { x: 272, y: 250, delay: '3s' },
  { x: 28, y: 165, delay: '6s' },
  { x: 272, y: 170, delay: '9s' },
]

export function ContentAgents({ className }: { className?: string }) {
  const { ref, tiltRef } = useTilt<SVGGElement>(CX, CY)

  const lastLine = TEXT_LINES[TEXT_LINES.length - 1]
  const cursorX = LINE_X + lastLine.width + 4
  const cursorY = lastLine.y

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
          <radialGradient id="content-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.5" />
            <stop offset="55%" stopColor="var(--svg-glow)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft radiating glow behind — expands + fades, repeating */}
        <circle cx={CX} cy={CY} r="125" fill="url(#content-glow)" className="nf-glow-radiate" />

        {/* Tilt group (outermost) → float group → content */}
        <g ref={tiltRef}>
          <g className="nf-brain-float">
            {/* Text lines (paragraphs) */}
            {TEXT_LINES.map((line, i) => (
              <line
                key={`t-${i}`}
                x1={LINE_X}
                y1={line.y}
                x2={LINE_X + line.width}
                y2={line.y}
                stroke="var(--svg-stroke)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.75"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Blinking cursor at end of last (shortest) line — .nf-caret (1s blink) */}
            <line
              x1={cursorX}
              y1={cursorY - 7}
              x2={cursorX}
              y2={cursorY + 7}
              stroke="var(--svg-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              className="nf-caret"
              vectorEffect="non-scaling-stroke"
            />

            {/* Platform icons drifting upward + fading (nf-drift-up, staggered).
                animationFillMode: 'backwards' applies the 0% keyframe (opacity 0)
                during the staggered delay window so icons stay invisible until
                their spawn moment — no flash of the resting icon before delay. */}
            {PLATFORMS.map((p, i) => (
              <g
                key={`p-${i}`}
                className="nf-drift-up"
                style={{ animationDelay: p.delay, animationFillMode: 'backwards' }}
              >
                {/* Outer platform circle (outlined) */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="9"
                  fill="none"
                  stroke="var(--svg-stroke)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Inner accent dot */}
                <circle cx={p.x} cy={p.y} r="3" fill="var(--svg-accent)" stroke="none" />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
