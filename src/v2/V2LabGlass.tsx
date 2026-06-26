import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

// Chromium-only: backdrop-filter: url() displacement. Others get clean frost.
const isChromium = typeof navigator !== 'undefined' && /Chrome\//.test(navigator.userAgent)

interface GlassCfg {
  width: number; height: number; radius: number
  scale: number; border: number; blur: number
}

const DEFAULT: GlassCfg = { width: 340, height: 230, radius: 28, scale: -150, border: 0.07, blur: 11 }

// Build the displacement map on a Canvas (feImage can't apply blur/blend to SVG
// data URIs, but Canvas does it natively). Padded with neutral gray so feImage
// fills the extended filter region without stretching. (Crown-jewel technique.)
function buildMap(c: GlassCfg): string {
  const pad = Math.ceil(Math.abs(c.scale) * 0.5)
  const W = c.width + pad * 2, H = c.height + pad * 2
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const ctx = cv.getContext('2d')!
  ctx.fillStyle = 'rgb(128,128,128)'
  ctx.fillRect(0, 0, W, H)
  const ox = pad, oy = pad
  ctx.save()
  ctx.beginPath(); ctx.roundRect(ox, oy, c.width, c.height, c.radius); ctx.clip()
  ctx.fillStyle = '#000'; ctx.fillRect(ox, oy, c.width, c.height)
  const rg = ctx.createLinearGradient(ox + c.width, oy, ox, oy)
  rg.addColorStop(0, '#000'); rg.addColorStop(1, '#f00')
  ctx.fillStyle = rg; ctx.fillRect(ox, oy, c.width, c.height)
  ctx.globalCompositeOperation = 'difference'
  const bg = ctx.createLinearGradient(ox, oy, ox, oy + c.height)
  bg.addColorStop(0, '#000'); bg.addColorStop(1, '#00f')
  ctx.fillStyle = bg; ctx.fillRect(ox, oy, c.width, c.height)
  ctx.globalCompositeOperation = 'source-over'
  const b = Math.min(c.width, c.height) * (c.border * 0.5)
  ctx.filter = `blur(${c.blur}px)`
  ctx.fillStyle = 'hsla(0,0%,50%,0.93)'
  ctx.beginPath(); ctx.roundRect(ox + b, oy + b, c.width - b * 2, c.height - b * 2, c.radius); ctx.fill()
  ctx.restore()
  return cv.toDataURL()
}

export function V2LabGlass({ onClose }: { onClose: () => void }) {
  const [cfg, setCfg] = useState<GlassCfg>(DEFAULT)
  const slabRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<SVGFilterElement>(null)
  const feImageRef = useRef<SVGFEImageElement>(null)
  const rRef = useRef<SVGFEDisplacementMapElement>(null)
  const gRef = useRef<SVGFEDisplacementMapElement>(null)
  const bRef = useRef<SVGFEDisplacementMapElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const drag = useRef<{ ox: number; oy: number } | null>(null)

  // center on mount
  useEffect(() => {
    pos.current = { x: window.innerWidth / 2 - cfg.width / 2, y: window.innerHeight / 2 - cfg.height / 2 }
    if (slabRef.current) slabRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // apply config to the live filter (Chromium)
  useEffect(() => {
    if (!isChromium) return
    const uri = buildMap(cfg)
    const f = filterRef.current
    if (f) {
      const maxD = Math.abs(cfg.scale) * 0.5
      const px = Math.ceil((maxD / cfg.width) * 100)
      const py = Math.ceil((maxD / cfg.height) * 100)
      f.setAttribute('x', `-${px}%`); f.setAttribute('y', `-${py}%`)
      f.setAttribute('width', `${100 + px * 2}%`); f.setAttribute('height', `${100 + py * 2}%`)
    }
    feImageRef.current?.setAttribute('href', uri)
    rRef.current?.setAttribute('scale', String(cfg.scale))
    gRef.current?.setAttribute('scale', String(cfg.scale + 12))
    bRef.current?.setAttribute('scale', String(cfg.scale + 24))
  }, [cfg])

  const onDown = useCallback((e: React.PointerEvent) => {
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    drag.current = { ox: e.clientX - pos.current.x, oy: e.clientY - pos.current.y }
  }, [])
  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return
    pos.current = { x: e.clientX - drag.current.ox, y: e.clientY - drag.current.oy }
    if (slabRef.current) slabRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
  }, [])
  const onUp = useCallback(() => { drag.current = null }, [])

  const set = (k: keyof GlassCfg) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCfg(c => ({ ...c, [k]: Number(e.target.value) }))

  return createPortal(
    <div className="lab-layer">
      <button className="lab-dismiss" onClick={onClose} aria-label="Close lab">Close ✕</button>

      {isChromium && (
        <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
          <defs>
            <filter ref={filterRef} id="lab-glass-displacement" colorInterpolationFilters="sRGB">
              <feImage ref={feImageRef} result="map" preserveAspectRatio="none" />
              <feDisplacementMap ref={rRef} in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" result="dR" />
              <feColorMatrix in="dR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="R" />
              <feDisplacementMap ref={gRef} in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" result="dG" />
              <feColorMatrix in="dG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="G" />
              <feDisplacementMap ref={bRef} in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" result="dB" />
              <feColorMatrix in="dB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="B" />
              <feBlend in="R" in2="G" mode="screen" result="rg" />
              <feBlend in="rg" in2="B" mode="screen" />
            </filter>
          </defs>
        </svg>
      )}

      <div
        ref={slabRef}
        className={`lab-glass-slab ${isChromium ? 'has-displace' : ''}`}
        style={{ width: cfg.width, height: cfg.height, borderRadius: cfg.radius }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />

      <div className="lab-glass-config">
        <span className="lab-glass-title">Liquid Glass</span>
        <label>Refraction <input type="range" min={-300} max={0} value={cfg.scale} onChange={set('scale')} /></label>
        <label>Frost <input type="range" min={1} max={24} value={cfg.blur} onChange={set('blur')} /></label>
        <label>Radius <input type="range" min={0} max={120} value={cfg.radius} onChange={set('radius')} /></label>
        <label>Size <input type="range" min={180} max={520} value={cfg.width}
          onChange={e => setCfg(c => ({ ...c, width: Number(e.target.value), height: Math.round(Number(e.target.value) * 0.68) }))} /></label>
        {!isChromium && <span className="lab-glass-note">Displacement is Chromium-only — showing clean frost.</span>}
      </div>
    </div>,
    document.body,
  )
}
