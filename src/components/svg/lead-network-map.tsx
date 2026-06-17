'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

interface Prospect {
  x: number
  y: number
  fill: 'stroke' | 'accent'
  begin: string // SMIL fade-in begin time — timed so each dot "appears" as a ping reaches it
  delay: number // CSS float animation delay (staggered so dots don't bob in lockstep)
}

// 8 prospect dots at various radii (70-195) and angles around the radar center (250,250).
// Positions computed using angle from north (12 o'clock), clockwise:
//   x = 250 + r*sin(θ),  y = 250 - r*cos(θ)
// Ping rings expand r=0→210 over 4s, so a dot at radius r appears at ~begin = (r/210)*4s.
const PROSPECTS: Prospect[] = [
  { x: 301.4, y: 188.7, fill: 'accent', begin: '1.5s', delay: 0.0 }, // r=80,  θ=40°
  { x: 353.9, y: 310.0, fill: 'stroke', begin: '2.3s', delay: 0.6 }, // r=120, θ=120°
  { x: 175.0, y: 379.9, fill: 'accent', begin: '2.9s', delay: 1.2 }, // r=150, θ=210°
  { x: 160.7, y: 217.5, fill: 'stroke', begin: '1.8s', delay: 1.8 }, // r=95,  θ=290°
  { x: 397.2, y: 165.0, fill: 'accent', begin: '3.2s', delay: 0.4 }, // r=170, θ=60°
  { x: 273.9, y: 315.8, fill: 'stroke', begin: '1.3s', delay: 1.0 }, // r=70,  θ=160°
  { x: 128.7, y: 320.0, fill: 'accent', begin: '2.7s', delay: 1.5 }, // r=140, θ=240°
  { x: 283.9, y: 58.0,  fill: 'stroke', begin: '3.7s', delay: 2.0 }, // r=195, θ=10°
]

// 4 expanding ping rings, staggered 1s apart over a 4s duration = continuous pings.
const PING_BEGINS = ['0s', '1s', '2s', '3s']

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
          <radialGradient id="ln-origin-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-accent)" stopOpacity="0.85" />
            <stop offset="60%" stopColor="var(--svg-accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--svg-accent)" stopOpacity="0" />
          </radialGradient>
          {/* Sweep gradient: bright at the leading (top) tip, fading to nothing at the
              trailing (bottom) end. The line spans the full diameter so its bbox center
              is exactly the radar center, letting data-pivot rotation pivot correctly. */}
          <linearGradient id="ln-sweep-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--svg-accent)" stopOpacity="0.55" />
            <stop offset="45%" stopColor="var(--svg-accent)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--svg-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Faint static outer guide circle — frames the radar */}
        <circle
          cx="250"
          cy="250"
          r="210"
          fill="none"
          stroke="var(--svg-glow)"
          strokeWidth="0.9"
          opacity="0.3"
          vectorEffect="non-scaling-stroke"
        />

        {/* Whole-radar parallax drift toward cursor */}
        <g style={{ transform: `translate3d(${x * 10}px, ${y * 10}px, 0)` }}>
          {/* Expanding ping rings — THE key feature: r=0→210 + opacity 0.7→0, staggered */}
          {PING_BEGINS.map((b, i) => (
            <circle
              key={`ping-${i}`}
              cx="250"
              cy="250"
              r="0"
              fill="none"
              stroke="var(--svg-accent)"
              strokeWidth="1.1"
              vectorEffect="non-scaling-stroke"
            >
              <animate attributeName="r" from="0" to="210" dur="4s" begin={b} repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="4s" begin={b} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Radar sweep line — rotates 360° slowly.
              Three nested groups keep the three transform types (CSS translate3d
              parallax, SVG translate to radar center, CSS rotate animation) on
              separate elements so they compose cleanly. */}
          <g transform="translate(250 250)">
            <g data-pivot className="nf-spin-slow" style={{ animationDuration: '8s' }}>
              <line
                x1="0"
                y1="-210"
                x2="0"
                y2="210"
                stroke="url(#ln-sweep-grad)"
                strokeWidth="1.4"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </g>

          {/* Discovered prospect dots — fade in via SMIL (fill="freeze" so they remain)
              as pings reach their radius, then gently float in place via nf-float.
              Per-dot parallax wrapper adds slight depth. */}
          {PROSPECTS.map((p, i) => (
            <g key={`pr-${i}`} style={{ transform: `translate3d(${x * 4}px, ${y * 4}px, 0)` }}>
              <g className="nf-float" style={{ animationDelay: `${p.delay}s`, animationDuration: '5s' }}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill={p.fill === 'accent' ? 'var(--svg-accent)' : 'var(--svg-fill)'}
                  stroke="var(--svg-stroke)"
                  strokeWidth="1.1"
                  vectorEffect="non-scaling-stroke"
                  opacity="0"
                >
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    begin={p.begin}
                    dur="0.6s"
                    fill="freeze"
                  />
                </circle>
              </g>
            </g>
          ))}

          {/* Central origin node — radar source / "your business". Pulsing halo + solid core. */}
          <g>
            <circle
              cx="250"
              cy="250"
              r="40"
              fill="url(#ln-origin-glow)"
              className="nf-pulse-soft"
              style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '3.5s' }}
            />
            <circle cx="250" cy="250" r="5" fill="var(--svg-accent)" stroke="none" />
          </g>
        </g>
      </svg>
    </div>
  )
}
