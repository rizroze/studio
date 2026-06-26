import { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { PLAYLIST } from '../constants/music'

const DEVICE_W = 196
const DEVICE_H = 326
const K = 0.05                  // spring stiffness toward rest (per 60fps-frame)
const DAMP = 0.9                // velocity damping (swing decay)
const MAXV = 20                 // speed cap (px per 60fps-frame) — drop reads as a fall

// A draggable iPod hanging from a springy cable. Fling it and it swings and
// settles; the cable sags when slack and pulls taut when stretched.
export function V2LabIpod({ onClose }: { onClose: () => void }) {
  const [track, setTrack] = useState(0)
  const [playing, setPlaying] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const deviceRef = useRef<HTMLDivElement>(null)
  const cableRef = useRef<SVGPathElement>(null)

  // physics (in refs — the rAF loop writes the DOM directly, no re-render)
  const anchor = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })        // device center
  const vel = useRef({ x: 0, y: 0 })
  const rest = useRef({ x: 0, y: 0 })
  const restLen = useRef(0)                 // slack cable length (kept loose & sloppy)
  const dragRef = useRef<{ ox: number; oy: number; px: number; py: number } | null>(null)

  // audio — same engine as the rail player
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio()
    const a = audioRef.current
    if (a.src !== window.location.origin + encodeURI(PLAYLIST[track].src)) a.src = PLAYLIST[track].src
    if (playing) a.play().catch(() => setPlaying(false))
    else a.pause()
  }, [track, playing])

  useEffect(() => {
    const a = audioRef.current
    return () => { a?.pause() }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onEnded = () => setTrack(t => (t + 1) % PLAYLIST.length)
    a.addEventListener('ended', onEnded)
    return () => a.removeEventListener('ended', onEnded)
  }, [])

  // set up anchor/rest from viewport and run the physics loop
  useEffect(() => {
    const setAnchor = () => {
      const W = window.innerWidth, H = window.innerHeight
      // hung from the top-right, resting down in the bottom-right corner
      anchor.current = { x: W - 90, y: 16 }
      rest.current = { x: W - DEVICE_W / 2 - 54, y: H - DEVICE_H / 2 - 40 }
      const restTopY = rest.current.y - DEVICE_H / 2 + 6
      // keep the cable ~30% longer than the straight-line distance → always slack & sloppy
      restLen.current = Math.hypot(rest.current.x - anchor.current.x, restTopY - anchor.current.y) * 1.3
    }
    setAnchor()
    // start up at the hook and let the spring drop it into the bottom-right —
    // it falls in and swings to a settle on the cable
    pos.current = { x: anchor.current.x, y: anchor.current.y + 12 }
    vel.current = { x: 0, y: 0 }
    window.addEventListener('resize', setAnchor)

    let raf = 0
    let last = 0
    const tick = (now: number) => {
      // delta-time in 60fps-frame units, so the fall/swing is the same speed
      // on 60Hz and 120Hz displays (was twice as fast — looked instant — on 120Hz)
      if (!last) last = now
      let dt = (now - last) / 16.667
      last = now
      if (dt > 3) dt = 3
      const d = dragRef.current
      if (!d) {
        // spring toward rest + damping → swingy settle (integrated with dt)
        vel.current.x += (rest.current.x - pos.current.x) * K * dt
        vel.current.y += (rest.current.y - pos.current.y) * K * dt
        vel.current.x *= Math.pow(DAMP, dt)
        vel.current.y *= Math.pow(DAMP, dt)
        // cap speed so the entrance drop reads as a fall, not an instant snap
        const sp = Math.hypot(vel.current.x, vel.current.y)
        if (sp > MAXV) { vel.current.x = vel.current.x / sp * MAXV; vel.current.y = vel.current.y / sp * MAXV }
        pos.current.x += vel.current.x * dt
        pos.current.y += vel.current.y * dt
      }
      const dev = deviceRef.current
      if (dev) dev.style.transform = `translate3d(${pos.current.x - DEVICE_W / 2}px, ${pos.current.y - DEVICE_H / 2}px, 0)`

      // cable: a loose, S-shaped headphone cord from anchor → top of device.
      // two control points pushed to opposite sides (perpendicular) make the S;
      // slack adds sideways wobble + downward droop, so it swings sloppily
      const ax = anchor.current.x, ay = anchor.current.y
      const bx = pos.current.x, by = pos.current.y - DEVICE_H / 2 + 6
      const dx = bx - ax, dy = by - ay
      const dist = Math.hypot(dx, dy) || 1
      const slack = Math.max(0, restLen.current - dist)
      const ux = -dy / dist, uy = dx / dist          // perpendicular unit
      const amp = 24 + slack * 0.4                    // sideways bow of the S
      const droop = slack * 0.22
      const p1x = ax + dx * 0.33 + ux * amp
      const p1y = ay + dy * 0.33 + uy * amp + droop
      const p2x = ax + dx * 0.66 - ux * amp
      const p2y = ay + dy * 0.66 - uy * amp + droop
      cableRef.current?.setAttribute('d', `M ${ax} ${ay} C ${p1x} ${p1y} ${p2x} ${p2y} ${bx} ${by}`)

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', setAnchor) }
  }, [])

  // drag the device body
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    dragRef.current = { ox: e.clientX - pos.current.x, oy: e.clientY - pos.current.y, px: e.clientX, py: e.clientY }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    pos.current.x = e.clientX - d.ox
    pos.current.y = e.clientY - d.oy
    vel.current.x = e.clientX - d.px
    vel.current.y = e.clientY - d.py
    d.px = e.clientX
    d.py = e.clientY
  }, [])

  const onPointerUp = useCallback(() => { dragRef.current = null }, [])

  const t = PLAYLIST[track]
  const toggle = () => setPlaying(p => !p)
  const next = () => { setTrack(t => (t + 1) % PLAYLIST.length); setPlaying(true) }
  const prev = () => { setTrack(t => (t - 1 + PLAYLIST.length) % PLAYLIST.length); setPlaying(true) }
  const stop = (e: React.PointerEvent) => e.stopPropagation()

  return createPortal(
    <div className="lab-layer">
      <button className="lab-dismiss" onClick={onClose} aria-label="Close lab">Close ✕</button>

      <svg className="lab-cable" width="100%" height="100%">
        <circle className="lab-cable-pin" r="5" cx={anchor.current.x} cy={anchor.current.y} />
        <path ref={cableRef} className="lab-cable-line" fill="none" />
      </svg>

      <div
        ref={deviceRef}
        className={`lab-ipod ${playing ? 'playing' : ''}`}
        style={{ width: DEVICE_W, height: DEVICE_H }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="lab-ipod-screen">
          <img className="lab-ipod-cover" src={t.cover} alt="" draggable={false} />
          <div className="lab-ipod-meta">
            <span className="lab-ipod-title">{t.title}</span>
            <span className="lab-ipod-artist">{t.artist}</span>
          </div>
        </div>

        <div className="lab-ipod-wheel" onPointerDown={stop}>
          <button className="lab-wheel-btn lab-wheel-prev" onClick={prev} aria-label="Previous">⏮</button>
          <button className="lab-wheel-btn lab-wheel-next" onClick={next} aria-label="Next">⏭</button>
          <button className="lab-wheel-btn lab-wheel-menu" aria-label="Menu" onClick={onClose}>MENU</button>
          <button className="lab-wheel-center" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? '❚❚' : '▶'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
