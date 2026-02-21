import { useEffect, useRef, useState } from 'react'

const ASCII_CHARS = ' .:-=+*#%@'
const ASCII_WIDTH = 140
const ASCII_HEIGHT = 95
const PADDING = 10
const IMAGE_WIDTH = ASCII_WIDTH - PADDING * 2
const IMAGE_HEIGHT = ASCII_HEIGHT - PADDING * 2

export function AsciiRose() {
  const preRef = useRef<HTMLPreElement>(null)
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageDataRef = useRef<ImageData | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, isHovering: false })
  const animationIdRef = useRef(0)
  const [ready, setReady] = useState(false)

  const renderStaticFrame = () => {
    if (!preRef.current || !imageDataRef.current) return
    const data = imageDataRef.current.data
    let output = ''
    for (let y = 0; y < ASCII_HEIGHT; y++) {
      for (let x = 0; x < ASCII_WIDTH; x++) {
        const i = (y * ASCII_WIDTH + x) * 4
        const brightness = ((data[i] + data[i + 1] + data[i + 2]) / 3) * (data[i + 3] / 255)
        output += ASCII_CHARS[Math.floor((brightness / 255) * (ASCII_CHARS.length - 1))]
      }
      output += '\n'
    }
    preRef.current.textContent = output
  }

  const renderAnimatedFrame = () => {
    if (!preRef.current || !imageDataRef.current) return
    const data = imageDataRef.current.data
    const time = Date.now() * 0.001
    let output = ''

    for (let y = 0; y < ASCII_HEIGHT; y++) {
      for (let x = 0; x < ASCII_WIDTH; x++) {
        const i = (y * ASCII_WIDTH + x) * 4
        let brightness = ((data[i] + data[i + 1] + data[i + 2]) / 3) * (data[i + 3] / 255)

        const dx = x - mouseRef.current.x
        const dy = y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const wave = Math.sin(distance * 0.3 - time * 3) * 0.5 + 0.5
        const intensity = Math.max(0, 1 - distance / 15)
        brightness = Math.max(0, Math.min(255, brightness + wave * intensity * 100))

        output += ASCII_CHARS[Math.floor((brightness / 255) * (ASCII_CHARS.length - 1))]
      }
      output += '\n'
    }
    preRef.current.textContent = output
  }

  const startAnimation = () => {
    renderAnimatedFrame()
    const loop = () => {
      if (!mouseRef.current.isHovering) return
      renderAnimatedFrame()
      animationIdRef.current = requestAnimationFrame(loop)
    }
    animationIdRef.current = requestAnimationFrame(loop)
  }

  const stopAnimation = () => {
    cancelAnimationFrame(animationIdRef.current)
    renderStaticFrame()
  }

  useEffect(() => {
    const img = new Image()
    img.src = '/rizzyrose.png'

    img.onload = () => {
      const canvas = hiddenCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      canvas.width = ASCII_WIDTH
      canvas.height = ASCII_HEIGHT
      ctx.clearRect(0, 0, ASCII_WIDTH, ASCII_HEIGHT)
      ctx.drawImage(img, PADDING, PADDING, IMAGE_WIDTH, IMAGE_HEIGHT)
      imageDataRef.current = ctx.getImageData(0, 0, ASCII_WIDTH, ASCII_HEIGHT)

      renderStaticFrame()
      setReady(true)
    }

    return () => cancelAnimationFrame(animationIdRef.current)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * ASCII_WIDTH
    mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * ASCII_HEIGHT
    if (!mouseRef.current.isHovering) {
      mouseRef.current.isHovering = true
      startAnimation()
    }
  }

  const handleMouseLeave = () => {
    mouseRef.current.isHovering = false
    stopAnimation()
  }

  return (
    <>
      <div
        className={`ascii-rose ${ready ? 'ready' : ''}`}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <pre ref={preRef} aria-hidden="true" />
      </div>
      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
    </>
  )
}
