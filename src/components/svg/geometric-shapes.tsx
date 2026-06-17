'use client'

import { useMouseParallax } from '@/hooks/use-mouse-parallax'

type ShapeType = 'circle' | 'square' | 'triangle' | 'hexagon' | 'plus'

interface ShapeDef {
  type: ShapeType
  cx: number
  cy: number
  size: number
  filled: boolean
  delay: number
  depth: number
  rotate: number
}

// Balanced composition of 5 geometric shapes with staggered breathing delays.
const SHAPES: ShapeDef[] = [
  { type: 'circle', cx: 115, cy: 130, size: 46, filled: true, delay: 0, depth: 14, rotate: 0 },
  { type: 'square', cx: 280, cy: 95, size: 50, filled: false, delay: 0.7, depth: 26, rotate: 12 },
  { type: 'triangle', cx: 410, cy: 165, size: 54, filled: true, delay: 1.4, depth: 18, rotate: 0 },
  { type: 'hexagon', cx: 175, cy: 285, size: 50, filled: false, delay: 2.1, depth: 30, rotate: 0 },
  { type: 'plus', cx: 365, cy: 300, size: 44, filled: true, delay: 2.8, depth: 22, rotate: 0 },
]

function shapePath(type: ShapeType, size: number): string {
  const s = size
  switch (type) {
    case 'square': {
      const r = s * 0.22
      return `M ${-s + r} ${-s} L ${s - r} ${-s} Q ${s} ${-s} ${s} ${-s + r} L ${s} ${s - r} Q ${s} ${s} ${s - r} ${s} L ${-s + r} ${s} Q ${-s} ${s} ${-s} ${s - r} L ${-s} ${-s + r} Q ${-s} ${-s} ${-s + r} ${-s} Z`
    }
    case 'triangle': {
      // Pointing up, roughly equilateral
      return `M 0 ${-s} L ${s * 0.87} ${s * 0.5} L ${-s * 0.87} ${s * 0.5} Z`
    }
    case 'hexagon': {
      const pts: string[] = []
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2
        pts.push(`${(Math.cos(a) * s).toFixed(2)} ${(Math.sin(a) * s).toFixed(2)}`)
      }
      return 'M ' + pts.join(' L ') + ' Z'
    }
    case 'plus': {
      const t = s * 0.32
      return `M ${-t} ${-s} L ${t} ${-s} L ${t} ${-t} L ${s} ${-t} L ${s} ${t} L ${t} ${t} L ${t} ${s} L ${-t} ${s} L ${-t} ${t} L ${-s} ${t} L ${-s} ${-t} L ${-t} ${-t} Z`
    }
    default:
      return ''
  }
}

export function GeometricShapes({ className }: { className?: string }) {
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
        {SHAPES.map((sh, i) => {
          const path = sh.type === 'circle' ? null : shapePath(sh.type, sh.size)
          return (
            <g key={i} style={{ transform: `translate3d(${x * sh.depth}px, ${y * sh.depth}px, 0)` }}>
              <g transform={`translate(${sh.cx} ${sh.cy}) rotate(${sh.rotate})`}>
                <g
                  data-pivot
                  className="nf-breathe"
                  style={{ animationDelay: `${sh.delay}s`, animationDuration: '5.5s' }}
                >
                  {sh.type === 'circle' ? (
                    <circle
                      cx="0"
                      cy="0"
                      r={sh.size}
                      fill={sh.filled ? 'var(--svg-fill)' : 'none'}
                      stroke="var(--svg-stroke)"
                      strokeWidth="1.3"
                      vectorEffect="non-scaling-stroke"
                    />
                  ) : (
                    <path
                      d={path as string}
                      fill={sh.filled ? 'var(--svg-fill)' : 'none'}
                      stroke="var(--svg-stroke)"
                      strokeWidth="1.3"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  {/* Small accent dot at center for filled non-plus shapes */}
                  {sh.filled && sh.type !== 'plus' && (
                    <circle cx="0" cy="0" r="2.5" fill="var(--svg-accent)" stroke="none" />
                  )}
                </g>
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
