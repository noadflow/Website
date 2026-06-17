'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

interface Sat {
  x: number
  y: number
  size: number
  ping: boolean
  delay: number
}

const SATELLITES: Sat[] = (() => {
  const count = 8
  const radius = 175
  // Vary sizes — warmer leads are larger, colder are smaller
  const sizes = [7, 5, 9, 4, 8, 6, 10, 5]
  const pings = [true, false, true, false, true, false, true, false]
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2
    return {
      x: 250 + Math.cos(a) * radius,
      y: 250 + Math.sin(a) * radius,
      size: sizes[i],
      ping: pings[i],
      delay: i * 0.5,
    }
  })
})()

export function LeadNetworkMap({ className }: { className?: string }) {
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
          <radialGradient id="ln-hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-accent)" stopOpacity="0.85" />
            <stop offset="60%" stopColor="var(--svg-accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--svg-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Orbit guide ring */}
        <circle cx="250" cy="250" r="175" stroke="var(--svg-glow)" strokeWidth="0.8" opacity="0.4" />

        {/* Whole-map parallax (subtle) */}
        <g style={{ transform: `translate3d(${x * 12}px, ${y * 12}px, 0)` }}>
          {/* Rotating satellite ring + connecting lines */}
          <g data-pivot className="nf-spin-slow" style={{ animationDuration: '60s' }}>
            {/* Tether lines from hub to each satellite */}
            {SATELLITES.map((s, i) => (
              <line
                key={`l-${i}`}
                x1="250"
                y1="250"
                x2={s.x}
                y2={s.y}
                stroke="var(--svg-glow)"
                strokeWidth="0.9"
                opacity="0.55"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {/* Satellites */}
            {SATELLITES.map((s, i) => (
              <g key={`s-${i}`}>
                {/* Expanding ping ring for active leads */}
                {s.ping && (
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r={s.size + 4}
                    fill="none"
                    stroke="var(--svg-accent)"
                    strokeWidth="1"
                    className="nf-ping-ring"
                    style={{
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      animationDelay: `${s.delay}s`,
                      animationDuration: '3.5s',
                    }}
                  />
                )}
                {/* Soft pulsing halo */}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={s.size + 5}
                  fill="none"
                  stroke="var(--svg-glow)"
                  strokeWidth="0.8"
                  className="nf-pulse-soft"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animationDelay: `${s.delay}s`,
                    animationDuration: '4.5s',
                  }}
                />
                {/* Node body — warm leads are filled accent, cold leads are soft fill */}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={s.size}
                  fill={s.ping ? 'var(--svg-accent)' : 'var(--svg-fill)'}
                  stroke="var(--svg-stroke)"
                  strokeWidth="1.1"
                />
              </g>
            ))}
          </g>

          {/* Central hub — pulses gently, has its own ping ring */}
          <g>
            <circle
              cx="250"
              cy="250"
              r="48"
              fill="url(#ln-hub-glow)"
              className="nf-pulse-soft"
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animationDuration: '3.5s',
              }}
            />
            <circle
              cx="250"
              cy="250"
              r="24"
              fill="none"
              stroke="var(--svg-accent)"
              strokeWidth="1.3"
              opacity="0.7"
            />
            <circle
              cx="250"
              cy="250"
              r="24"
              fill="none"
              stroke="var(--svg-accent)"
              strokeWidth="0.8"
              className="nf-ping-ring"
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animationDuration: '5s',
              }}
            />
            <circle cx="250" cy="250" r="12" fill="var(--svg-accent)" stroke="none" />
          </g>
        </g>
      </svg>
    </div>
  )
}
