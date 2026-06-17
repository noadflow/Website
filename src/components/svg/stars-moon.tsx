'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

interface Star {
  x: number
  y: number
  size: number
  delay: number
  depth: number
  drift: boolean
}

// 12 stars of varying sizes scattered across the field.
// Smaller stars get larger parallax depth (move more); the moon moves least.
const STARS: Star[] = [
  { x: 80, y: 80, size: 6, delay: 0, depth: 30, drift: false },
  { x: 160, y: 50, size: 4, delay: 0.5, depth: 38, drift: true },
  { x: 250, y: 95, size: 5, delay: 1.0, depth: 34, drift: false },
  { x: 330, y: 60, size: 7, delay: 1.5, depth: 32, drift: true },
  { x: 410, y: 105, size: 4, delay: 0.3, depth: 40, drift: false },
  { x: 460, y: 50, size: 5, delay: 0.8, depth: 36, drift: true },
  { x: 60, y: 200, size: 5, delay: 1.2, depth: 36, drift: false },
  { x: 200, y: 250, size: 4, delay: 0.6, depth: 40, drift: true },
  { x: 360, y: 280, size: 6, delay: 1.8, depth: 34, drift: false },
  { x: 450, y: 230, size: 4, delay: 0.4, depth: 42, drift: true },
  { x: 130, y: 340, size: 5, delay: 1.5, depth: 38, drift: false },
  { x: 290, y: 360, size: 4, delay: 0.9, depth: 40, drift: true },
]

// 4-point sparkle star path, drawn centered at (0,0)
function sparklePath(size: number): string {
  const s = size
  const w = s * 0.28 // inner waist for sharp points
  return `M 0 ${-s} L ${w} ${-w} L ${s} 0 L ${w} ${w} L 0 ${s} L ${-w} ${w} L ${-s} 0 L ${-w} ${-w} Z`
}

export function StarsMoon({ className }: { className?: string }) {
  const { ref, x, y } = useMouseParallax<HTMLDivElement>()

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 500 400"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          {/* Crescent moon: white disc minus an offset black disc carves the crescent */}
          <mask id="sm-moon-mask">
            <rect width="500" height="400" fill="black" />
            <circle cx="120" cy="120" r="52" fill="white" />
            <circle cx="142" cy="108" r="46" fill="black" />
          </mask>
          <radialGradient id="sm-moon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Crescent moon — least parallax (farthest depth) */}
        <g style={{ transform: `translate3d(${x * 6}px, ${y * 6}px, 0)` }}>
          <circle
            cx="120"
            cy="120"
            r="82"
            fill="url(#sm-moon-glow)"
            className="nf-pulse-soft"
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animationDuration: '5s',
            }}
          />
          <circle
            cx="120"
            cy="120"
            r="52"
            fill="var(--svg-accent)"
            mask="url(#sm-moon-mask)"
          />
        </g>

        {/* Stars — varied parallax depth (small stars move more) */}
        {STARS.map((s, i) => (
          <g key={i} style={{ transform: `translate3d(${x * s.depth}px, ${y * s.depth}px, 0)` }}>
            <g transform={`translate(${s.x} ${s.y})`}>
              {s.drift ? (
                // Drifting sparks float upward and fade, layered with twinkle
                <g
                  className="nf-drift-up"
                  style={{ animationDelay: `${s.delay}s`, animationDuration: '11s' }}
                >
                  <path
                    d={sparklePath(s.size)}
                    fill="var(--svg-accent)"
                    stroke="none"
                    className="nf-twinkle"
                    style={{ animationDelay: `${s.delay * 0.7}s`, animationDuration: '3.5s' }}
                  />
                </g>
              ) : (
                <path
                  d={sparklePath(s.size)}
                  fill="var(--svg-accent)"
                  stroke="none"
                  className="nf-twinkle"
                  style={{ animationDelay: `${s.delay}s`, animationDuration: '3s' }}
                />
              )}
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
