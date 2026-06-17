'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

interface Node {
  x: number
  y: number
  a: number
}

function ringNodes(count: number, radius: number, cx = 300, cy = 300): Node[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2
    return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius, a }
  })
}

const R1 = ringNodes(6, 95)
const R2 = ringNodes(9, 165)
const R3 = ringNodes(12, 235)

const ringPolygon = (nodes: Node[]) =>
  'M ' + nodes.map((n) => `${n.x.toFixed(1)} ${n.y.toFixed(1)}`).join(' L ') + ' Z'

const POLY1 = ringPolygon(R1)
const POLY2 = ringPolygon(R2)
const POLY3 = ringPolygon(R3)

// Anchor points for cursor attractor lines (mix of rings, spread around)
const ANCHORS = [R1[0], R1[3], R2[2], R2[6], R3[1], R3[5], R3[8]]

export function NeuralNetwork({ className }: { className?: string }) {
  const { ref, x, y } = useMouseParallax<HTMLDivElement>()
  // Cursor position in viewBox coordinates
  const cx = 300 + x * 580
  const cy = 300 + y * 580

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 600 600"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <radialGradient id="nn-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-accent)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="var(--svg-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--svg-accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nn-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--svg-glow)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--svg-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient breathing halo */}
        <circle
          cx="300"
          cy="300"
          r="285"
          fill="url(#nn-halo)"
          className="nf-breathe"
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '7s' }}
        />

        {/* Orbit guide circles (static, faint) */}
        <g stroke="var(--svg-glow)" strokeWidth="0.8" opacity="0.4">
          <circle cx="300" cy="300" r="95" />
          <circle cx="300" cy="300" r="165" />
          <circle cx="300" cy="300" r="235" />
        </g>

        {/* Cursor attractor lines (dynamic) */}
        <g stroke="var(--svg-accent)" strokeWidth="1" opacity="0.55">
          {ANCHORS.map((a, i) => {
            const mx = (cx + a.x) / 2
            const my = (cy + a.y) / 2
            // Bias control point slightly toward center for an elegant curve
            const ctrlX = mx + (300 - mx) * 0.22
            const ctrlY = my + (300 - my) * 0.22
            const d = `M ${cx.toFixed(1)} ${cy.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${a.x.toFixed(1)} ${a.y.toFixed(1)}`
            return <path key={i} d={d} vectorEffect="non-scaling-stroke" />
          })}
          {/* Cursor reticle */}
          <circle cx={cx} cy={cy} r="3" fill="var(--svg-accent)" stroke="none" opacity="0.75" />
          <circle
            cx={cx}
            cy={cy}
            r="9"
            fill="none"
            stroke="var(--svg-accent)"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </g>

        {/* Ring 3 (outermost) — most parallax depth */}
        <g style={{ transform: `translate3d(${x * 28}px, ${y * 28}px, 0)` }}>
          <g data-pivot className="nf-spin-slow" style={{ animationDuration: '64s' }}>
            <path
              d={POLY3}
              stroke="var(--svg-glow)"
              strokeWidth="0.8"
              opacity="0.5"
              vectorEffect="non-scaling-stroke"
            />
            {R3.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="9"
                  fill="none"
                  stroke="var(--svg-glow)"
                  strokeWidth="0.8"
                  className="nf-pulse-soft"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: '4.5s',
                  }}
                />
                <circle cx={p.x} cy={p.y} r="3.5" fill="var(--svg-stroke)" stroke="none" />
              </g>
            ))}
          </g>
        </g>

        {/* Ring 2 — medium parallax depth */}
        <g style={{ transform: `translate3d(${x * 18}px, ${y * 18}px, 0)` }}>
          <g data-pivot className="nf-spin-rev" style={{ animationDuration: '46s' }}>
            <path
              d={POLY2}
              stroke="var(--svg-glow)"
              strokeWidth="0.9"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
            />
            {R2.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="10"
                  fill="none"
                  stroke="var(--svg-accent)"
                  strokeWidth="0.9"
                  opacity="0.5"
                  className="nf-pulse-soft"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animationDelay: `${i * 0.35}s`,
                    animationDuration: '4s',
                  }}
                />
                <circle cx={p.x} cy={p.y} r="4" fill="var(--svg-stroke)" stroke="none" />
              </g>
            ))}
          </g>
        </g>

        {/* Ring 1 (inner) — least parallax depth */}
        <g style={{ transform: `translate3d(${x * 9}px, ${y * 9}px, 0)` }}>
          <g data-pivot className="nf-spin-slow" style={{ animationDuration: '30s' }}>
            <path
              d={POLY1}
              stroke="var(--svg-accent)"
              strokeWidth="1"
              opacity="0.7"
              vectorEffect="non-scaling-stroke"
            />
            {R1.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="11"
                  fill="var(--svg-fill)"
                  stroke="var(--svg-accent)"
                  strokeWidth="0.9"
                  className="nf-pulse-soft"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '3.5s',
                  }}
                />
                <circle cx={p.x} cy={p.y} r="4.5" fill="var(--svg-accent)" stroke="none" />
              </g>
            ))}
          </g>
        </g>

        {/* Central core — minimal parallax */}
        <g style={{ transform: `translate3d(${x * 5}px, ${y * 5}px, 0)` }}>
          <circle
            cx="300"
            cy="300"
            r="40"
            fill="url(#nn-core)"
            className="nf-pulse-soft"
            style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '3s' }}
          />
          <circle
            cx="300"
            cy="300"
            r="17"
            fill="none"
            stroke="var(--svg-accent)"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <circle cx="300" cy="300" r="9" fill="var(--svg-accent)" stroke="none" />
        </g>
      </svg>
    </div>
  )
}
