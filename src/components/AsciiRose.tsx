import { useEffect, useRef, useState } from 'react'

const ASCII_CHARS = ' .:-=+*#%@'
const ASCII_WIDTH = 140
const ASCII_HEIGHT = 95
const PADDING = 10
const IMAGE_WIDTH = ASCII_WIDTH - PADDING * 2
const IMAGE_HEIGHT = ASCII_HEIGHT - PADDING * 2

// Shared mouse state — HeroCursorField writes, AsciiRose reads
export const heroMouse = { x: 0, y: 0, active: false, heroRect: null as DOMRect | null }

/** Decorative ASCII rose — breathing + reacts to shared cursor */
export function AsciiRose() {
  const preRef = useRef<HTMLPreElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dataRef = useRef<ImageData | null>(null)
  const animRef = useRef(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = '/rizzyrose.png'
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      canvas.width = ASCII_WIDTH
      canvas.height = ASCII_HEIGHT
      ctx.drawImage(img, PADDING, PADDING, IMAGE_WIDTH, IMAGE_HEIGHT)
      dataRef.current = ctx.getImageData(0, 0, ASCII_WIDTH, ASCII_HEIGHT)
      setReady(true)

      let last = 0
      let visible = true
      const loop = (now: number) => {
        animRef.current = requestAnimationFrame(loop)
        if (!visible) return
        const interval = heroMouse.active ? 16 : 50
        if (now - last < interval) return
        last = now
        render()
      }
      animRef.current = requestAnimationFrame(loop)

      // Pause breathing when scrolled past hero (off-screen)
      const roseEl = preRef.current?.parentElement
      if (roseEl) {
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
        io.observe(roseEl)
      }
    }
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const render = () => {
    const pre = preRef.current
    const data = dataRef.current
    if (!pre || !data) return
    const d = data.data
    const t = Date.now() * 0.001

    // Convert hero mouse to rose-local coords
    let rmx = -999, rmy = -999
    if (heroMouse.active && heroMouse.heroRect && pre.parentElement) {
      const roseRect = pre.parentElement.getBoundingClientRect()
      rmx = ((heroMouse.x - (roseRect.left - heroMouse.heroRect.left)) / roseRect.width) * ASCII_WIDTH
      rmy = ((heroMouse.y - (roseRect.top - heroMouse.heroRect.top)) / roseRect.height) * ASCII_HEIGHT
    }

    let out = ''
    for (let y = 0; y < ASCII_HEIGHT; y++) {
      for (let x = 0; x < ASCII_WIDTH; x++) {
        const i = (y * ASCII_WIDTH + x) * 4
        const alpha = d[i + 3] / 255
        const raw = ((d[i] + d[i + 1] + d[i + 2]) / 3) * alpha

        // Skip empty pixels — no background fill
        if (raw < 8) { out += ' '; continue }

        let b = raw

        // Breathing
        const wave = Math.sin(x * 0.04 + y * 0.03 + t * 0.8) * 0.5 + 0.5
        b = Math.max(0, Math.min(255, b + wave * 18 - 9))

        // Cursor ripple — only on rose pixels
        if (heroMouse.active) {
          const dx = x - rmx
          const dy = y - rmy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const ripple = Math.sin(dist * 0.3 - t * 3) * 0.5 + 0.5
          const intensity = Math.max(0, 1 - dist / 18)
          b = Math.max(0, Math.min(255, b + ripple * intensity * 120))
        }

        out += ASCII_CHARS[Math.floor((b / 255) * (ASCII_CHARS.length - 1))]
      }
      out += '\n'
    }
    pre.textContent = out
  }

  return (
    <>
      <div className={`ascii-rose ${ready ? 'ready' : ''}`}>
        <pre ref={preRef} aria-hidden="true" />
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  )
}

/** Full-hero cursor ripple — Canvas ASCII characters for smooth tracking */
const DOT_SPACING = 12
const FIELD_CHARS = [' ', '.', ':', '-', '=', '+', '*', '#']

export function HeroCursorField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1, y: -1, active: false })
  const animRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.parentElement!.getBoundingClientRect()
      sizeRef.current = { w: rect.width, h: rect.height }
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // Only run rAF loop while mouse is active — idle = no GPU work
    // The loop self-starts on mouseMove and stops when mouse leaves

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const render = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { w, h } = sizeRef.current
    const { x: mx, y: my, active } = mouseRef.current

    ctx.clearRect(0, 0, w, h)
    if (!active) return

    const t = Date.now() * 0.001
    const cols = Math.ceil(w / DOT_SPACING)
    const rows = Math.ceil(h / DOT_SPACING)

    // Rose zone — left 22%, vertical center
    const roseX = w * 0.22
    const roseY = h * 0.45
    const roseRadius = Math.min(w, h) * 0.28

    ctx.font = '8px "Fragment Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * DOT_SPACING + DOT_SPACING / 2
        const py = r * DOT_SPACING + DOT_SPACING / 2
        const dx = px - mx
        const dy = py - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Fade out near rose
        const dRose = Math.sqrt((px - roseX) ** 2 + (py - roseY) ** 2)
        const roseFade = Math.min(1, Math.max(0, (dRose - roseRadius * 0.5) / (roseRadius * 0.5)))

        // Ripple rings
        const ripple = Math.sin(dist * 0.04 - t * 3) * 0.5 + 0.5
        const falloff = Math.max(0, 1 - dist / 250)
        let intensity = ripple * falloff * 0.6

        // Bright core
        if (dist < 40) intensity += (1 - dist / 40) * 0.6

        intensity *= roseFade
        if (intensity < 0.03) continue

        const charIdx = Math.floor(Math.min(intensity, 1) * (FIELD_CHARS.length - 1))
        const char = FIELD_CHARS[charIdx]
        if (char === ' ') continue

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(intensity * 0.7, 0.5)})`
        ctx.fillText(char, px, py)
      }
    }
  }

  const startLoop = () => {
    if (animRef.current) return
    const loop = () => {
      animRef.current = requestAnimationFrame(loop)
      render()
    }
    animRef.current = requestAnimationFrame(loop)
  }

  const stopLoop = () => {
    cancelAnimationFrame(animRef.current)
    animRef.current = 0
    // Clear canvas on leave
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseRef.current.x = x
    mouseRef.current.y = y
    mouseRef.current.active = true
    // Share with ASCII rose
    heroMouse.x = x
    heroMouse.y = y
    heroMouse.active = true
    heroMouse.heroRect = rect
    startLoop()
  }

  const handleMouseLeave = () => {
    mouseRef.current.active = false
    heroMouse.active = false
    stopLoop()
  }

  return (
    <div
      className="hero-cursor-field"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
