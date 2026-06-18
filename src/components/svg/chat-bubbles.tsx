'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

interface Bubble {
  x: number
  y: number
  w: number
  h: number
  delay: number
  depth: number
  typing: boolean
  lines: [number, number][]
  tail: 'left' | 'right'
}

const BUBBLES: Bubble[] = [
  {
    x: 50,
    y: 120,
    w: 190,
    h: 72,
    delay: 0,
    depth: 16,
    typing: false,
    lines: [
      [130, 0.9],
      [90, 0.55],
    ],
    tail: 'left',
  },
  {
    x: 230,
    y: 230,
    w: 210,
    h: 88,
    delay: 0.8,
    depth: 28,
    typing: true,
    lines: [],
    tail: 'right',
  },
  {
    x: 110,
    y: 350,
    w: 180,
    h: 66,
    delay: 1.6,
    depth: 22,
    typing: false,
    lines: [
      [120, 0.85],
      [80, 0.5],
    ],
    tail: 'left',
  },
]

export function ChatBubbles({ className }: { className?: string }) {
  const { ref, x, y } = useMouseParallax<HTMLDivElement>()

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 500 500"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <radialGradient id="cb-clock-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Chat bubbles — each parallaxed by its own depth for layered feel */}
        {BUBBLES.map((b, i) => {
          const tailPath =
            b.tail === 'left'
              ? `M ${b.x + 16} ${b.y + b.h} L ${b.x + 2} ${b.y + b.h + 18} L ${b.x + 36} ${b.y + b.h} Z`
              : `M ${b.x + b.w - 36} ${b.y + b.h} L ${b.x + b.w - 2} ${b.y + b.h + 18} L ${b.x + b.w - 16} ${b.y + b.h} Z`
          return (
            <g key={i} style={{ transform: `translate3d(${x * b.depth}px, ${y * b.depth}px, 0)` }}>
              <g
                className="nf-float"
                style={{ animationDelay: `${b.delay}s`, animationDuration: '6.5s' }}
              >
                {/* Tail */}
                <path
                  d={tailPath}
                  fill="var(--svg-fill)"
                  stroke="var(--svg-stroke)"
                  strokeWidth="1.1"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                />
                {/* Bubble body */}
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx="14"
                  ry="14"
                  fill="var(--svg-fill)"
                  stroke="var(--svg-stroke)"
                  strokeWidth="1.1"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Content: typing dots OR text lines */}
                {b.typing ? (
                  <g>
                    <circle
                      cx={b.x + 32}
                      cy={b.y + b.h / 2}
                      r="4"
                      fill="var(--svg-stroke)"
                      className="nf-twinkle"
                      style={{ animationDelay: '0s', animationDuration: '1.2s' }}
                    />
                    <circle
                      cx={b.x + 54}
                      cy={b.y + b.h / 2}
                      r="4"
                      fill="var(--svg-stroke)"
                      className="nf-twinkle"
                      style={{ animationDelay: '0.2s', animationDuration: '1.2s' }}
                    />
                    <circle
                      cx={b.x + 76}
                      cy={b.y + b.h / 2}
                      r="4"
                      fill="var(--svg-stroke)"
                      className="nf-twinkle"
                      style={{ animationDelay: '0.4s', animationDuration: '1.2s' }}
                    />
                  </g>
                ) : (
                  b.lines.map((ln, j) => (
                    <line
                      key={j}
                      x1={b.x + 20}
                      y1={b.y + 24 + j * 22}
                      x2={b.x + 20 + ln[0]}
                      y2={b.y + 24 + j * 22}
                      stroke="var(--svg-stroke)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity={ln[1]}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))
                )}
              </g>
            </g>
          )
        })}

        {/* 24/7 Clock — top right, gentle parallax */}
        <g style={{ transform: `translate3d(${x * 10}px, ${y * 10}px, 0)` }}>
          <circle
            cx="400"
            cy="130"
            r="62"
            fill="url(#cb-clock-glow)"
            className="nf-pulse-soft"
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animationDuration: '4s',
            }}
          />
          <g
            className="nf-pulse-soft"
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animationDuration: '4s',
            }}
          >
            <circle
              cx="400"
              cy="130"
              r="48"
              fill="var(--svg-fill)"
              stroke="var(--svg-stroke)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            {/* 12 tick marks (longer at 12/3/6/9) */}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2 - Math.PI / 2
              const major = i % 3 === 0
              const r1 = 42
              const r2 = major ? 33 : 38
              return (
                <line
                  key={i}
                  x1={400 + Math.cos(a) * r1}
                  y1={130 + Math.sin(a) * r1}
                  x2={400 + Math.cos(a) * r2}
                  y2={130 + Math.sin(a) * r2}
                  stroke="var(--svg-stroke)"
                  strokeWidth={major ? 1.4 : 0.8}
                  strokeLinecap="round"
                />
              )
            })}
            {/* Hour hand */}
            <line
              x1="400"
              y1="130"
              x2="400"
              y2="108"
              stroke="var(--svg-accent)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Minute hand */}
            <line
              x1="400"
              y1="130"
              x2="423"
              y2="130"
              stroke="var(--svg-accent)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="400" cy="130" r="2.6" fill="var(--svg-accent)" stroke="none" />
          </g>
          {/* 24/7 label */}
          <text
            x="400"
            y="205"
            textAnchor="middle"
            fill="var(--svg-accent)"
            fontSize="14"
            fontWeight="600"
            fontFamily="var(--font-sans), sans-serif"
            letterSpacing="3"
          >
            24/7
          </text>
        </g>
      </svg>
    </div>
  )
}
