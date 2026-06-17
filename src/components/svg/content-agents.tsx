'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

interface TextLine {
  y: number
  width: number
}

// 6 thin horizontal lines stacked vertically — staggered widths read as text paragraphs.
// Last line is shortest (being typed); the blinking cursor sits at its end.
const TEXT_LINES: TextLine[] = [
  { y: 150, width: 360 },
  { y: 185, width: 340 },
  { y: 220, width: 355 },
  { y: 255, width: 300 },
  { y: 290, width: 330 },
  { y: 325, width: 180 }, // last line shortest — being typed
]

const LINE_X = 70

interface Platform {
  x: number
  y: number
  delay: string
}

// 6 platform icons positioned around / within the text block. Each drifts upward
// and fades out via .nf-drift-up (12s cycle). Staggered delays (0,2,4,6,8,10s)
// produce continuous emission — like content being published and sent into the world.
const PLATFORMS: Platform[] = [
  { x: 100, y: 100, delay: '0s' },
  { x: 220, y: 250, delay: '2s' },
  { x: 370, y: 130, delay: '4s' },
  { x: 160, y: 340, delay: '6s' },
  { x: 420, y: 220, delay: '8s' },
  { x: 290, y: 80,  delay: '10s' },
]

export function ContentAgents({ className }: { className?: string }) {
  const { ref, x, y } = useMouseParallax<HTMLDivElement>()
  const lastLine = TEXT_LINES[TEXT_LINES.length - 1]
  const cursorX = LINE_X + lastLine.width + 4
  const cursorY = lastLine.y

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 500 460"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Document frame + text lines + cursor — subtle shared parallax toward cursor */}
        <g style={{ transform: `translate3d(${x * 6}px, ${y * 6}px, 0)` }}>
          {/* Faint document / paper frame grounding the text block */}
          <rect
            x="50"
            y="110"
            width="400"
            height="260"
            rx="14"
            ry="14"
            fill="var(--svg-fill)"
            stroke="var(--svg-glow)"
            strokeWidth="1"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Text lines (paragraphs) */}
          {TEXT_LINES.map((line, i) => (
            <line
              key={`t-${i}`}
              x1={LINE_X}
              y1={line.y}
              x2={LINE_X + line.width}
              y2={line.y}
              stroke="var(--svg-stroke)"
              strokeWidth="2.4"
              opacity="0.72"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Blinking cursor at the end of the last (shortest) line */}
          <line
            x1={cursorX}
            y1={cursorY - 7}
            x2={cursorX}
            y2={cursorY + 7}
            stroke="var(--svg-accent)"
            strokeWidth="2.4"
            className="nf-caret"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Floating platform icons — drift up & fade (nf-drift-up), deeper parallax for depth.
            animationFillMode: 'backwards' applies the 0% keyframe (opacity 0, translateY 24px)
            during the staggered animation-delay window, so icons stay invisible until their
            spawn moment — no flash of the resting icon before its delay elapses. */}
        {PLATFORMS.map((p, i) => (
          <g key={`p-${i}`} style={{ transform: `translate3d(${x * 14}px, ${y * 14}px, 0)` }}>
            <g
              className="nf-drift-up"
              style={{ animationDelay: p.delay, animationFillMode: 'backwards' }}
            >
              {/* Outer platform circle (outlined) */}
              <circle
                cx={p.x}
                cy={p.y}
                r="11"
                fill="var(--svg-fill)"
                stroke="var(--svg-stroke)"
                strokeWidth="1.1"
                vectorEffect="non-scaling-stroke"
              />
              {/* Inner avatar dot (accent) */}
              <circle cx={p.x} cy={p.y} r="4" fill="var(--svg-accent)" stroke="none" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
