import { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

interface V2LightboxProps {
  images: string[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function V2Lightbox({ images, index, onClose, onNavigate }: V2LightboxProps) {
  const prev = useCallback(() => {
    onNavigate((index - 1 + images.length) % images.length)
  }, [index, images.length, onNavigate])

  const next = useCallback(() => {
    onNavigate((index + 1) % images.length)
  }, [index, images.length, onNavigate])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  // touch swipe (mobile): left/right steps next/prev, and vertical scroll
  // gestures page through too (swipe up → next, down → prev, feed-style) —
  // the grid behind tracks along via the scrollIntoView effect below.
  // Tracks a swipe so the subsequent click doesn't also fire (which would
  // close the lightbox).
  const touch = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    swiped.current = false
  }, [])
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true
      if (dx < 0) next(); else prev()
    } else if (Math.abs(dy) > 45 && Math.abs(dy) > Math.abs(dx)) {
      swiped.current = true
      if (dy < 0) next(); else prev()
    }
  }, [next, prev])

  // wheel/trackpad: scrolling flips through images. Deltas accumulate until a
  // threshold, then step once and cool down — so one trackpad flick advances a
  // single image instead of momentum skipping through five.
  useEffect(() => {
    let acc = 0
    let lockedUntil = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault() // lightbox owns the scroll — page tracks via scrollIntoView below
      const now = performance.now()
      if (now < lockedUntil) { acc = 0; return }
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      acc += d
      if (Math.abs(acc) > 90) {
        if (acc > 0) next(); else prev()
        acc = 0
        lockedUntil = now + 500 // swallow trailing momentum
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [next, prev])

  // when the active image changes: preload neighbors (instant left/right) and
  // scroll the page so the matching grid tile tracks the image — keeps you
  // oriented within the page while the grid shows through the sheer backdrop
  useEffect(() => {
    for (const i of [index - 1, index + 1]) {
      const img = new Image()
      img.src = images[(i + images.length) % images.length]
    }
    const tile = document.querySelector(`[data-lbsrc="${CSS.escape(images[index])}"]`)
    tile?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [index, images])

  return createPortal(
    <div
      className="v2-lightbox"
      onClick={() => { if (swiped.current) { swiped.current = false; return } onClose() }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button className="v2-lb-close" onClick={onClose}>Close ✕</button>

      {images.length > 1 && (
        <>
          <button
            className="v2-lb-nav v2-lb-prev"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            ←
          </button>
          <button
            className="v2-lb-nav v2-lb-next"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            →
          </button>
        </>
      )}

      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      {images.length > 1 && (
        <span className="v2-lb-counter">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
      )}
    </div>,
    document.body
  )
}
