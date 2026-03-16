import { useRef, useCallback, useEffect } from 'react'
import { WordReveal } from '../components/WordReveal'

// Direct DOM morphing — matches questionnaire.html exactly
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpRGB = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, t: number) =>
  `rgb(${Math.round(lerp(r1, r2, t))},${Math.round(lerp(g1, g2, t))},${Math.round(lerp(b1, b2, t))})`

interface SliderConfig {
  leftLabel: string
  rightLabel: string
  leftTags: string
  rightTags: string
  defaultValue: number
  canvasHTML: string
  canvasStyle: string
  morph: (canvas: HTMLElement, t: number) => void
}

const SLIDERS: SliderConfig[] = [
  {
    leftLabel: 'Loud',
    rightLabel: 'Quiet',
    leftTags: 'gradients, neon, bold',
    rightTags: 'muted, white space',
    defaultValue: 35,
    canvasStyle: 'background:linear-gradient(135deg,#4a1a8a,#1a3a6a);',
    canvasHTML: '<div data-orb style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f472b6,#fbbf24);box-shadow:0 0 20px rgba(244,114,182,0.5);"></div>',
    morph(cv, t) {
      const orb = cv.querySelector('[data-orb]') as HTMLElement
      if (!orb) return
      cv.style.background = t < 0.15
        ? lerpRGB(30, 15, 60, 20, 20, 30, t / 0.15)
        : lerpRGB(20, 20, 30, 18, 18, 18, (t - 0.15) / 0.85)
      const orbSize = t < 0.1 ? lerp(80, 46, t / 0.1) : lerp(46, 12, (t - 0.1) / 0.9)
      orb.style.width = orbSize + 'px'
      orb.style.height = orbSize + 'px'
      orb.style.borderRadius = t < 0.08 ? lerp(16, 50, t / 0.08) + 'px' : '50%'
      const sat = lerp(80, 0, t)
      const light = lerp(65, 8, t)
      orb.style.background = t < 0.7
        ? `linear-gradient(135deg, hsl(330,${sat}%,${light}%), hsl(45,${sat}%,${light}%))`
        : lerpRGB(60, 60, 60, 10, 10, 10, (t - 0.7) / 0.3)
      const glow = lerp(24, 0, Math.min(t * 3, 1))
      orb.style.boxShadow = `0 0 ${glow}px rgba(244,114,182,${lerp(0.5, 0, Math.min(t * 3, 1))})`
    },
  },
  {
    leftLabel: 'Playful',
    rightLabel: 'Serious',
    leftTags: 'figma, slack, rounded',
    rightTags: 'sharp, structured',
    defaultValue: 55,
    canvasStyle: 'background:#fef3c7; border-radius:20px; border-color:#fde68a;',
    canvasHTML: `<div data-shapes style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
      <span data-s="0" style="width:16px;height:16px;border-radius:50%;background:#ef4444;display:block;"></span>
      <span data-s="1" style="width:16px;height:16px;border-radius:50%;background:#3b82f6;display:block;"></span>
      <span data-s="2" style="width:16px;height:16px;border-radius:50%;background:#10b981;display:block;"></span>
      <span data-s="3" style="width:16px;height:16px;border-radius:50%;background:#f59e0b;display:block;"></span>
    </div>`,
    morph(cv, t) {
      cv.style.borderRadius = lerp(22, 4, t) + 'px'
      cv.style.background = t < 0.5
        ? lerpRGB(254, 243, 199, 200, 210, 220, t * 2)
        : lerpRGB(200, 210, 220, 30, 41, 59, (t - 0.5) * 2)
      cv.style.borderColor = t < 0.5
        ? `rgba(253,230,138,${lerp(1, 0, t * 2)})`
        : `rgba(148,163,184,${lerp(0, 0.2, (t - 0.5) * 2)})`
      const colors = [
        { r: [239, 150, 100, 80, 71], g: [68, 80, 110, 100, 85], b: [68, 90, 120, 120, 105] },
        { r: [59, 100, 130, 120, 100], g: [130, 130, 140, 130, 116], b: [246, 200, 170, 150, 137] },
        { r: [16, 80, 120, 110, 100], g: [185, 160, 140, 130, 116], b: [129, 120, 120, 120, 137] },
        { r: [245, 200, 160, 130, 100], g: [158, 140, 130, 130, 116], b: [11, 50, 100, 120, 137] },
      ]
      const idx = Math.min(Math.floor(t * 5), 4)
      const frac = (t * 5) - idx
      const next = Math.min(idx + 1, 4)
      const shapes = cv.querySelectorAll('[data-s]') as NodeListOf<HTMLElement>
      const shapesWrap = cv.querySelector('[data-shapes]') as HTMLElement
      if (shapesWrap) shapesWrap.style.gap = lerp(6, 4, t) + 'px'
      shapes.forEach((s, i) => {
        const c = colors[i]
        s.style.background = `rgb(${Math.round(lerp(c.r[idx], c.r[next], frac))},${Math.round(lerp(c.g[idx], c.g[next], frac))},${Math.round(lerp(c.b[idx], c.b[next], frac))})`
        s.style.borderRadius = lerp(50, 2, t) + '%'
        s.style.width = lerp(16, 36, t) + 'px'
        s.style.height = lerp(16, 4, t) + 'px'
      })
    },
  },
  {
    leftLabel: 'Dense',
    rightLabel: 'Spacious',
    leftTags: 'bloomberg, info-heavy',
    rightTags: 'apple.com, breathing room',
    defaultValue: 52,
    canvasStyle: 'background:#0d0d0d; padding:10px; align-items:flex-start; justify-content:flex-start; flex-direction:column;',
    canvasHTML: `<div data-lines style="font-family:'Fragment Mono',monospace; font-size:7px; line-height:1.4; color:#4ade80; width:100%;">
      <div data-line>BTC <span style="float:right;">67,241</span></div>
      <div data-line>ETH <span style="float:right;">3,841</span></div>
      <div data-line>SOL <span style="float:right;">142.8</span></div>
      <div data-line style="color:#ef4444;">DOGE <span style="float:right;">0.082</span></div>
      <div data-line>AVAX <span style="float:right;">38.2</span></div>
    </div>`,
    morph(cv, t) {
      const lines = cv.querySelector('[data-lines]') as HTMLElement
      if (!lines) return
      cv.style.background = lerpRGB(13, 13, 13, 250, 250, 250, t)
      const rows = lines.querySelectorAll('[data-line]') as NodeListOf<HTMLElement>
      const visible = Math.max(1, Math.round(lerp(5, 1, t)))
      rows.forEach((r, i) => {
        r.style.opacity = i < visible ? '1' : '0'
        r.style.height = i < visible ? 'auto' : '0'
        r.style.overflow = 'hidden'
      })
      lines.style.fontSize = lerp(7, 14, t) + 'px'
      lines.style.color = t < 0.3
        ? '#4ade80'
        : t < 0.6
          ? lerpRGB(74, 222, 128, 40, 40, 40, (t - 0.3) / 0.3)
          : lerpRGB(40, 40, 40, 120, 120, 120, (t - 0.6) / 0.4)
      lines.style.textAlign = t > 0.7 ? 'center' : 'left'
      cv.style.justifyContent = t > 0.7 ? 'center' : 'flex-start'
      cv.style.alignItems = t > 0.7 ? 'center' : 'flex-start'
    },
  },
]

function DiscoverySlider({ card }: { card: SliderConfig }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const valueRef = useRef(card.defaultValue)

  // Direct DOM updates — no React state, no re-renders, instant
  const applyValue = useCallback((v: number) => {
    valueRef.current = v
    const t = v / 100
    if (fillRef.current) fillRef.current.style.width = `${v}%`
    if (thumbRef.current) thumbRef.current.style.left = `${v}%`
    if (canvasRef.current) card.morph(canvasRef.current, t)
  }, [card])

  useEffect(() => {
    applyValue(card.defaultValue)
  }, [applyValue, card.defaultValue])

  const updateFromPointer = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    applyValue(pct)
  }, [applyValue])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updateFromPointer(e.clientX)
  }, [updateFromPointer])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    updateFromPointer(e.clientX)
  }, [updateFromPointer])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div className="discovery-slider-card" data-reveal>
      <div
        ref={(el) => {
          (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = el
          if (el) el.style.cssText += card.canvasStyle
        }}
        className="discovery-icon"
        dangerouslySetInnerHTML={{ __html: card.canvasHTML }}
      />
      <div className="discovery-slider-content">
        <div className="discovery-slider-labels">
          <span className="discovery-label-left">{card.leftLabel}</span>
          <span className="discovery-label-right">{card.rightLabel}</span>
        </div>
        <div
          className="discovery-track"
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div className="discovery-track-fill" ref={fillRef} />
          <div className="discovery-thumb" ref={thumbRef} />
        </div>
        <div className="discovery-slider-tags">
          <span className="discovery-tag">{card.leftTags}</span>
          <span className="discovery-tag">{card.rightTags}</span>
        </div>
      </div>
    </div>
  )
}

export function Discovery() {
  return (
    <section className="section discovery-section">
      <WordReveal text="Your project starts here." className="section-title-xl" tag="h2" />
      <p className="discovery-subtitle" data-reveal>
        After our call, this lands on your screen — an interactive questionnaire built just for you. Not a form. A conversation that makes sure you get exactly what you need.
      </p>
      <div className="discovery-sliders" data-reveal-stagger>
        {SLIDERS.map((card, i) => (
          <DiscoverySlider key={i} card={card} />
        ))}
      </div>
      {/* Peek at 4th slider — fades out to hint there's more */}
      <div className="discovery-peek" data-reveal>
        <div className="discovery-slider-card">
          <div className="discovery-icon" style={{ background: '#333', flexDirection: 'column' }}>
            <div style={{ fontFamily: "'Urbanist',sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: '#fff' }}>Aa</div>
            <div style={{ fontSize: 8, marginTop: 4, color: 'rgba(255,255,255,0.4)', fontFamily: "'Fragment Mono',monospace" }}>mode</div>
          </div>
          <div className="discovery-slider-content">
            <div className="discovery-slider-labels">
              <span className="discovery-label-left">Dark</span>
              <span className="discovery-label-right">Light</span>
            </div>
            <div className="discovery-track" style={{ pointerEvents: 'none' }}>
              <div className="discovery-track-fill" style={{ width: '50%' }} />
              <div className="discovery-thumb" style={{ left: '50%' }} />
            </div>
            <div className="discovery-slider-tags">
              <span className="discovery-tag">linear, rizzy.today</span>
              <span className="discovery-tag">notion, apple</span>
            </div>
          </div>
        </div>
        <div className="discovery-peek-fade" />
      </div>
      <p className="discovery-footnote" data-reveal>A brand psychology test disguised as a questionnaire. Try dragging the sliders.</p>
    </section>
  )
}
