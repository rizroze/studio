import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { claimAudio, releaseAudio } from './audioFocus'

// A control-free video: the tile autoplays (muted, the only way browsers allow
// it) while on screen and pauses off-screen. Click opens a clean fullscreen
// overlay — still no player chrome, but the click is user intent, so that one
// plays with sound. Used in the Experiments bento and every discipline's
// Motion block.
export function V2VideoTile({ src, dims, className }: { src: string; dims?: [number, number]; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const bigRef = useRef<HTMLVideoElement>(null)
  const [open, setOpen] = useState(false)
  const poster = src.replace(/\.mp4$/i, '-poster.webp')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // while the fullscreen copy is playing, the tile behind it stays put —
    // it's still on screen, so the observer would otherwise keep it running
    if (open) {
      el.pause()
      return
    }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.play().catch(() => {}); else el.pause() },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [open])

  // play with sound; if the browser refuses unmuted playback for any reason,
  // fall back to muted rather than showing a frozen frame
  useEffect(() => {
    if (!open) return
    const v = bigRef.current
    if (!v) return
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const openBig = () => { claimAudio(); setOpen(true) }
  const close = () => { setOpen(false); releaseAudio() }

  return (
    <>
      <button
        className={`v2-videotile${className ? ` ${className}` : ''}`}
        // same handle every image tile carries, so the homepage and the rail
        // minimap can scroll to a video the same way they scroll to a still.
        // Video srcs are never in a lightbox image list, so this can't collide.
        data-lbsrc={src}
        style={dims ? { aspectRatio: `${dims[0]} / ${dims[1]}` } : undefined}
        onClick={openBig}
        aria-label="Play video fullscreen"
      >
        <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" />
      </button>
      {open && createPortal(
        <div className="v2-video-overlay" onClick={close}>
          <button className="v2-lb-close" onClick={close}>Close ✕</button>
          <video ref={bigRef} className="v2-video-big" src={src} loop playsInline />
        </div>,
        document.body,
      )}
    </>
  )
}
