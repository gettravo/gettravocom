'use client'

import { useEffect, useRef } from 'react'

export default function ScrollPath() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const totalLength = path.getTotalLength()
    path.style.strokeDasharray = `${totalLength}`
    path.style.strokeDashoffset = `${totalLength}`

    let raf: number

    function update() {
      if (!pathRef.current) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const progress = Math.min((scrollTop + window.innerHeight / 2) / docHeight, 1)
      pathRef.current.style.strokeDashoffset = `${totalLength * (1 - progress)}`
    }

    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

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
        <filter id="path-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        ref={pathRef}
        d="M 50 0 L 50 100"
        stroke="#FF5657"
        strokeWidth="0.2"
        strokeOpacity="0.35"
        fill="none"
        strokeLinecap="round"
        filter="url(#path-glow)"
      />
    </svg>
  )
}
