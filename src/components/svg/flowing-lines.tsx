'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

// viewBox width — every wave is an integer number of periods over this width,
// so translating by exactly PERIOD loops seamlessly.
const PERIOD = 600

interface LineDef {
  y: number
  amp: number
  n: number // number of complete periods across PERIOD
  phase: number
  opacity: number
  dashDur: string
  flowDur: string
  depth: number
  dashLen: number
}

const LINES: LineDef[] = [
  { y: 60, amp: 16, n: 3, phase: 0, opacity: 0.9, dashDur: '6s', flowDur: '18s', depth: 24, dashLen: 28 },
  { y: 120, amp: 22, n: 2, phase: 1.0, opacity: 0.7, dashDur: '8s', flowDur: '24s', depth: 18, dashLen: 22 },
  { y: 180, amp: 13, n: 4, phase: 2.0, opacity: 0.95, dashDur: '5s', flowDur: '15s', depth: 32, dashLen: 34 },
  { y: 240, amp: 26, n: 3, phase: 3.0, opacity: 0.6, dashDur: '10s', flowDur: '28s', depth: 14, dashLen: 26 },
  { y: 300, amp: 18, n: 5, phase: 4.0, opacity: 0.8, dashDur: '7s', flowDur: '20s', depth: 28, dashLen: 30 },
]

// Wide path (2x viewBox) so the horizontal translate can reveal fresh wave continuously.
const WAVE_WIDTH = 1200

function wavePath(yBase: number, amp: number, n: number, phase: number): string {
  const freq = (2 * Math.PI * n) / PERIOD
  const pts: string[] = []
  for (let xp = 0; xp <= WAVE_WIDTH; xp += 6) {
    const y = yBase + Math.sin(xp * freq + phase) * amp
    pts.push(`${xp.toFixed(1)} ${y.toFixed(1)}`)
  }
  return 'M ' + pts.join(' L ')
}

// Precompute static paths at module scope (they don't change — only transforms animate)
const PATHS = LINES.map((ln) => wavePath(ln.y, ln.amp, ln.n, ln.phase))

export function FlowingLines({ className }: { className?: string }) {
  const { ref, x, y } = useMouseParallax<HTMLDivElement>()
  // Cursor position in viewBox coordinates
  const cursorX = 300 + x * 600
  const cursorY = 180 + y * 360

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 600 360"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <radialGradient id="fl-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <style>{`
          @keyframes nf-fl-flow { from { transform: translateX(0); } to { transform: translateX(-${PERIOD}px); } }
          ${LINES.map((ln, i) => `@keyframes nf-fl-dash-${i} { to { stroke-dashoffset: -${ln.dashLen * 3}; } }`).join('\n')}
        `}</style>

        {/* Cursor glow + expanding ripple ring + cursor dot */}
        <g style={{ transform: `translate3d(${x * 8}px, ${y * 8}px, 0)` }}>
          <circle cx={cursorX} cy={cursorY} r="75" fill="url(#fl-glow)" />
          <circle
            cx={cursorX}
            cy={cursorY}
            r="22"
            fill="none"
            stroke="var(--svg-accent)"
            strokeWidth="0.9"
            className="nf-ping-ring"
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animationDuration: '2.6s',
            }}
          />
          <circle cx={cursorX} cy={cursorY} r="3" fill="var(--svg-accent)" stroke="none" />
        </g>

        {/* Flowing lines — each shifted by its own parallax depth */}
        {LINES.map((ln, i) => (
          <g
            key={i}
            style={{ transform: `translate3d(${x * ln.depth * 0.4}px, ${y * ln.depth * 0.4}px, 0)` }}
          >
            <g style={{ animation: `nf-fl-flow ${ln.flowDur} linear infinite` }}>
              {/* Faint base line */}
              <path
                d={PATHS[i]}
                stroke="var(--svg-stroke)"
                strokeWidth="1.1"
                opacity={ln.opacity * 0.35}
                vectorEffect="non-scaling-stroke"
              />
              {/* Bright dashed energy line with travelling dashoffset */}
              <path
                d={PATHS[i]}
                stroke="var(--svg-accent)"
                strokeWidth="1.3"
                opacity={ln.opacity}
                strokeDasharray={`${ln.dashLen} ${ln.dashLen * 2.2}`}
                vectorEffect="non-scaling-stroke"
                style={{ animation: `nf-fl-dash-${i} ${ln.dashDur} linear infinite` }}
              />
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
