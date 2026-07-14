import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// A control-free video: it autoplays (muted) while on screen, pauses off-screen,
// and shows no player chrome. Click opens a clean fullscreen overlay — again no
// controls, just the video big. Used in the Experiments bento and every
// discipline's Motion block.
export function V2VideoTile({ src, dims, className }: { src: string; dims?: [number, number]; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [open, setOpen] = useState(false)
  const poster = src.replace(/\.mp4$/i, '-poster.webp')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.play().catch(() => {}); else el.pause() },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        className={`v2-videotile${className ? ` ${className}` : ''}`}
        style={dims ? { aspectRatio: `${dims[0]} / ${dims[1]}` } : undefined}
        onClick={() => setOpen(true)}
        aria-label="Play video fullscreen"
      >
        <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" />
      </button>
      {open && createPortal(
        <div className="v2-video-overlay" onClick={() => setOpen(false)}>
          <button className="v2-lb-close" onClick={() => setOpen(false)}>Close ✕</button>
          <video className="v2-video-big" src={src} autoPlay loop muted playsInline />
        </div>,
        document.body,
      )}
    </>
  )
}
