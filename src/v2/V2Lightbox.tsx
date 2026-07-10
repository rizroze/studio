import { useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IMAGE_DIMS } from './imageDims'
import { med } from './disciplines'

interface V2LightboxProps {
  images: string[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

// ---- FLIP flight: the image travels between its grid tile and its final
// centered rect, instead of the lightbox just fading in over the page ----

const FLIGHT_MS = 440
const FLIGHT_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)' // Apple sheet ease — fast start, long settle
// must match .v2-lightbox img box-shadow; zero-size twin so WAAPI can interpolate
const SHADOW_FULL = '0 40px 100px rgba(0, 0, 0, 0.28), 0 8px 24px rgba(0, 0, 0, 0.14)'
const SHADOW_NONE = '0 0px 0px rgba(0, 0, 0, 0), 0 0px 0px rgba(0, 0, 0, 0)'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// where the image sits in the page: the grid tile's <img> (bento/ratio grids),
// or the index view's side preview when it's showing this src
function sourceRect(src: string): DOMRect | null {
  const sel = `[data-lbsrc="${CSS.escape(src)}"] img`
  const el =
    document.querySelector<HTMLElement>(sel) ??
    (document.querySelector<HTMLImageElement>('.v2-index-preview img')?.getAttribute('src') === src
      ? document.querySelector<HTMLElement>('.v2-index-preview img')
      : null)
  if (!el) return null
  const r = el.getBoundingClientRect()
  // a collapsed or off-screen tile can't anchor a flight — fall back to fade
  if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > window.innerHeight) return null
  return r
}

// contain-fit into the lightbox padding box (5vh 6vw, max-height 90vh) —
// computed from precomputed dims. Sizes both the flight target and the frame
// itself: the med layer is only 640px wide, so shrink-wrapping the frame to it
// would land the flight big and then snap down to thumbnail size.
function fitSize(src: string): { width: number; height: number } | null {
  const d = IMAGE_DIMS[src]
  if (!d) return null
  const scale = Math.min(
    (window.innerWidth * 0.88) / d[0],
    (window.innerHeight * 0.9) / d[1],
    1, // never upscale past natural size
  )
  return { width: d[0] * scale, height: d[1] * scale }
}

function finalRect(src: string): DOMRect | null {
  const s = fitSize(src)
  if (!s) return null
  return new DOMRect(
    (window.innerWidth - s.width) / 2,
    (window.innerHeight - s.height) / 2,
    s.width,
    s.height,
  )
}

const rectFrame = (r: { left: number; top: number; width: number; height: number }, boxShadow: string) => ({
  left: `${r.left}px`,
  top: `${r.top}px`,
  width: `${r.width}px`,
  height: `${r.height}px`,
  boxShadow,
})

// the flying element: the med thumbnail (already cached by the grid), cover-fit
// so it starts with the tile's exact crop and ends uncropped (rect == native ratio)
function makeGhost(src: string): HTMLImageElement {
  const ghost = document.createElement('img')
  ghost.className = 'v2-lb-ghost'
  ghost.src = med(src)
  ghost.draggable = false
  document.body.appendChild(ghost)
  return ghost
}

export function V2Lightbox({ images, index, onClose, onNavigate }: V2LightboxProps) {
  // entered = open flight done (or skipped) → real img may show
  const [entered, setEntered] = useState(false)

  // explicit frame size from full-res dims — the med layer that shrink-wraps
  // the frame is only ~640px, so without this the flight lands large and the
  // revealed frame snaps down to thumbnail size on big screens
  const [frameSize, setFrameSize] = useState(() => fitSize(images[index]))
  useEffect(() => {
    const update = () => setFrameSize(fitSize(images[index]))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [images, index])
  const enteredRef = useRef(false)
  const flewRef = useRef(false) // flight ran → reveal img instantly under the ghost (no double-fade dip)
  const loadedRef = useRef(false) // full-res of the opening image decoded
  const ghostRef = useRef<HTMLImageElement | null>(null)
  const closingRef = useRef(false)

  const clearGhost = useCallback((fade = false) => {
    const g = ghostRef.current
    if (!g) return
    ghostRef.current = null
    if (fade) {
      g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease', fill: 'forwards' })
        .onfinish = () => g.remove()
    } else {
      g.remove()
    }
  }, [])

  const markEntered = useCallback(() => {
    enteredRef.current = true
    setEntered(true)
  }, [])

  // open flight — runs once on mount, before paint so the ghost starts on the tile
  useLayoutEffect(() => {
    const src = images[index]
    const from = sourceRect(src)
    const to = finalRect(src)
    if (reducedMotion() || !from || !to) {
      markEntered()
      return
    }
    const ghost = makeGhost(src)
    ghostRef.current = ghost
    flewRef.current = true
    const anim = ghost.animate(
      [rectFrame(from, SHADOW_NONE), rectFrame(to, SHADOW_FULL)],
      { duration: FLIGHT_MS, easing: FLIGHT_EASE, fill: 'forwards' },
    )
    anim.onfinish = () => {
      markEntered()
      // full-res already there → crossfade the ghost away; otherwise it stays
      // as a sharp-enough placeholder until onLoad clears it
      if (loadedRef.current) clearGhost(true)
    }
    return () => {
      if (ghostRef.current === ghost) ghostRef.current = null
      ghost.remove()
    }
    // mount-only: the flight belongs to the image that was clicked
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFullLoaded = useCallback(() => {
    loadedRef.current = true
    if (enteredRef.current) clearGhost(true)
  }, [clearGhost])

  // close flight — the image flies back into its tile while the backdrop fades.
  // scrollIntoView (below) has kept the current tile in view, so there's a
  // landing spot even after wheeling through the collection.
  const rootRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    clearGhost()
    const root = rootRef.current
    root?.classList.add('closing')
    const src = images[index]
    const live = root?.querySelector<HTMLElement>('.v2-lb-frame')
    const from = enteredRef.current && live ? live.getBoundingClientRect() : null
    const to = sourceRect(src)
    if (reducedMotion() || !from || !to || from.width < 4) {
      window.setTimeout(onClose, 200) // let the fade play out
      return
    }
    const ghost = makeGhost(src)
    ghost.animate(
      [rectFrame(from, SHADOW_FULL), rectFrame(to, SHADOW_NONE)],
      { duration: FLIGHT_MS, easing: FLIGHT_EASE, fill: 'forwards' },
    ).onfinish = () => {
      ghost.remove()
      onClose()
    }
  }, [images, index, onClose, clearGhost])

  // ---- zoom: click zooms toward the cursor (toward natural resolution),
  // moving the mouse pans, click again zooms out. Trackpad pinch (ctrl+wheel)
  // zooms continuously. Resets on navigation. ----
  const frameRef = useRef<HTMLDivElement>(null)
  const [zoomScale, setZoomScale] = useState(0) // 0 = not zoomed

  const setZoomOrigin = useCallback((e: { clientX: number; clientY: number }) => {
    const f = frameRef.current
    if (!f) return
    const r = f.getBoundingClientRect()
    f.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`)
    f.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`)
  }, [])

  const toggleZoom = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (zoomScale) {
      setZoomScale(0)
      return
    }
    const d = IMAGE_DIMS[images[index]]
    const w = frameRef.current?.getBoundingClientRect().width ?? 0
    // aim for 1:1 pixels; clamp so small images still zoom and huge decks stay usable
    const s = Math.min(Math.max(d && w ? d[0] / w : 2, 1.75), 4)
    setZoomOrigin(e)
    setZoomScale(s)
  }, [zoomScale, images, index, setZoomOrigin])

  const prev = useCallback(() => {
    clearGhost()
    markEntered()
    setZoomScale(0)
    onNavigate((index - 1 + images.length) % images.length)
  }, [index, images.length, onNavigate, clearGhost, markEntered])

  const next = useCallback(() => {
    clearGhost()
    markEntered()
    setZoomScale(0)
    onNavigate((index + 1) % images.length)
  }, [index, images.length, onNavigate, clearGhost, markEntered])

  // dialog focus management: move focus in on open, return it on close, and
  // keep Tab cycling inside the lightbox while it's up
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    rootRef.current?.querySelector<HTMLElement>('.v2-lb-close')?.focus()
    return () => previouslyFocused?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // first Escape backs out of zoom, second closes
        setZoomScale((z) => {
          if (!z) close()
          return 0
        })
      }
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Tab') {
        const focusables = Array.from(
          rootRef.current?.querySelectorAll<HTMLElement>('button') ?? [],
        )
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement
        if (e.shiftKey && (active === first || !rootRef.current?.contains(active))) {
          e.preventDefault(); last.focus()
        } else if (!e.shiftKey && (active === last || !rootRef.current?.contains(active))) {
          e.preventDefault(); first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, prev, next])

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
      // trackpad pinch arrives as ctrl+wheel — zoom toward the cursor instead of navigating
      if (e.ctrlKey) {
        setZoomOrigin(e)
        setZoomScale((z) => {
          const s = (z || 1) * Math.exp(-e.deltaY * 0.01)
          return s <= 1.05 ? 0 : Math.min(s, 4)
        })
        return
      }
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
  }, [next, prev, setZoomOrigin])

  // when the active image changes: preload neighbors (instant left/right) and
  // scroll the page so the matching grid tile tracks the image — keeps you
  // oriented within the page while the grid shows through the sheer backdrop
  useEffect(() => {
    for (const i of [index - 1, index + 1]) {
      const src = images[(i + images.length) % images.length]
      new Image().src = src
      // med too — off-screen grid tiles are lazy, so it may not be cached yet,
      // and it's what makes the next hard-scroll step switch instantly
      new Image().src = med(src)
    }
    const tile = document.querySelector(`[data-lbsrc="${CSS.escape(images[index])}"]`)
    tile?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [index, images])

  return createPortal(
    <div
      ref={rootRef}
      className="v2-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${images.length}`}
      onClick={() => { if (swiped.current) { swiped.current = false; return } close() }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button className="v2-lb-close" onClick={close}>Close ✕</button>

      {images.length > 1 && (
        <>
          <button
            className="v2-lb-nav v2-lb-prev"
            aria-label="Previous image"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            ←
          </button>
          <button
            className="v2-lb-nav v2-lb-next"
            aria-label="Next image"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            →
          </button>
        </>
      )}

      {/* med (cached by the grid) sizes the frame and switches instantly on
          hard scroll; the keyed full-res remounts transparent on top and drops
          in when decoded — so flicking through never waits on high-res loads */}
      <div
        ref={frameRef}
        className={`v2-lb-frame${frameSize ? ' sized' : ''}${zoomScale ? ' zoomed' : ''}`}
        // after a flight the frame appears at once beneath the still-opaque
        // ghost (invisible switch); only the ghost fades. Transitioning both
        // layers at once would dip to translucent and bleed the backdrop through.
        style={{
          opacity: entered ? 1 : 0,
          transition: flewRef.current ? 'none' : undefined,
          ...(frameSize ?? {}),
          ['--zs' as string]: zoomScale || 1,
        }}
        onClick={(e) => {
          if (swiped.current) { swiped.current = false; return }
          toggleZoom(e)
        }}
        onMouseMove={zoomScale ? setZoomOrigin : undefined}
      >
        <img className="v2-lb-med" src={med(images[index])} alt="" aria-hidden="true" draggable={false} />
        <img
          key={images[index]}
          className="v2-lb-img"
          src={images[index]}
          alt=""
          onLoad={onFullLoaded}
          ref={(el) => { if (el?.complete && el.naturalWidth) onFullLoaded() }}
          draggable={false}
        />
      </div>

      {images.length > 1 && (
        <span className="v2-lb-counter">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
      )}
    </div>,
    document.body
  )
}
