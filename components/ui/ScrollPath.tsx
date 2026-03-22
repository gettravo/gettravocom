'use client'

import { useEffect, useRef } from 'react'

// Path threads through page sections with clean 90° turns (softened with tiny arcs).
// viewBox="0 0 100 100", x=0 left edge, x=100 right edge, y=0 top, y=100 bottom of page.
// r = corner radius in viewBox units
const R = 1.5

const PATH = `
  M 12 0
  L 12 ${7 - R}
  Q 12 7 ${12 + R} 7
  L ${82 - R} 7
  Q 82 7 82 ${7 + R}
  L 82 ${16 - R}
  Q 82 16 ${82 - R} 16
  L ${18 + R} 16
  Q 18 16 18 ${16 + R}
  L 18 ${24 - R}
  Q 18 24 ${18 + R} 24
  L ${76 - R} 24
  Q 76 24 76 ${24 + R}
  L 76 ${36 - R}
  Q 76 36 ${76 - R} 36
  L ${22 + R} 36
  Q 22 36 22 ${36 + R}
  L 22 ${48 - R}
  Q 22 48 ${22 + R} 48
  L ${78 - R} 48
  Q 78 48 78 ${48 + R}
  L 78 ${60 - R}
  Q 78 60 ${78 - R} 60
  L ${14 + R} 60
  Q 14 60 14 ${60 + R}
  L 14 ${70 - R}
  Q 14 70 ${14 + R} 70
  L ${86 - R} 70
  Q 86 70 86 ${70 + R}
  L 86 ${80 - R}
  Q 86 80 ${86 - R} 80
  L ${20 + R} 80
  Q 20 80 20 ${80 + R}
  L 20 ${90 - R}
  Q 20 90 ${20 + R} 90
  L ${50 - R} 90
  Q 50 90 50 ${90 + R}
  L 50 100
`.trim()

export default function ScrollPath() {
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const path = pathRef.current
    const dot = dotRef.current
    if (!path || !dot) return

    const totalLength = path.getTotalLength()
    path.style.strokeDasharray = `${totalLength}`
    path.style.strokeDashoffset = `${totalLength}`

    // Init dot at start
    const start = path.getPointAtLength(0)
    dot.setAttribute('cx', String(start.x))
    dot.setAttribute('cy', String(start.y))

    let raf: number

    function update() {
      if (!pathRef.current || !dotRef.current) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const progress = Math.min((scrollTop + window.innerHeight / 2) / docHeight, 1)
      const drawn = totalLength * progress
      pathRef.current.style.strokeDashoffset = `${totalLength - drawn}`
      const pt = pathRef.current.getPointAtLength(drawn)
      dotRef.current.setAttribute('cx', String(pt.x))
      dotRef.current.setAttribute('cy', String(pt.y))
    }

    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    // Draw initial state for current scroll position
    update()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <filter id="line-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="dot-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ghost path — full route, barely visible */}
      <path
        d={PATH}
        stroke="#FF5657"
        strokeWidth="0.15"
        strokeOpacity="0.08"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Drawn path — grows as user scrolls */}
      <path
        ref={pathRef}
        d={PATH}
        stroke="#FF5657"
        strokeWidth="0.2"
        strokeOpacity="0.45"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#line-glow)"
      />

      {/* Traveling dot at the tip */}
      <circle
        ref={dotRef}
        r="0.7"
        fill="#FF5657"
        opacity="0.9"
        filter="url(#dot-glow)"
      />
    </svg>
  )
}
