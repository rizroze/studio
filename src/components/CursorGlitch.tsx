import { useEffect, useRef } from 'react'

export function CursorGlitch() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  useEffect(() => {
    if (isTouch) return

    const container = containerRef.current
    if (!container) return

    const onDown = (e: MouseEvent) => {
      const wave = document.createElement('div')
      wave.className = 'click-wave'
      wave.style.left = e.clientX + 'px'
      wave.style.top = e.clientY + 'px'
      container.appendChild(wave)
      wave.addEventListener('animationend', () => wave.remove())
    }

    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [])

  if (isTouch) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2147483647,
      }}
    />
  )
}
