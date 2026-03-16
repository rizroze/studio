import { useState, useRef, useCallback, useMemo } from 'react'
import { WordReveal } from '../components/WordReveal'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpRGB = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, t: number) =>
  `rgb(${Math.round(lerp(r1, r2, t))},${Math.round(lerp(g1, g2, t))},${Math.round(lerp(b1, b2, t))})`

// Loud ↔ Quiet: gradient orb morphs size + saturation + glow
function VolumeIcon({ t }: { t: number }) {
  const orbSize = t < 0.1 ? lerp(56, 36, t / 0.1) : lerp(36, 10, (t - 0.1) / 0.9)
  const sat = lerp(80, 0, t)
  const light = lerp(65, 8, t)
  const glow = lerp(24, 0, Math.min(t * 3, 1))
  const glowAlpha = lerp(0.5, 0, Math.min(t * 3, 1))

  const bg = t < 0.15
    ? lerpRGB(30, 15, 60, 20, 20, 30, t / 0.15)
    : lerpRGB(20, 20, 30, 18, 18, 18, (t - 0.15) / 0.85)

  const orbBg = t < 0.7
    ? `linear-gradient(135deg, hsl(330,${sat}%,${light}%), hsl(45,${sat}%,${light}%))`
    : lerpRGB(60, 60, 60, 10, 10, 10, (t - 0.7) / 0.3)

  return (
    <div className="discovery-icon" style={{ background: bg, transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
      <div style={{
        width: orbSize,
        height: orbSize,
        borderRadius: t < 0.08 ? lerp(16, 50, t / 0.08) + 'px' : '50%',
        background: orbBg,
        boxShadow: `0 0 ${glow}px rgba(244,114,182,${glowAlpha})`,
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  )
}

// Playful ↔ Serious: colorful circles → monochrome rectangles
function MoodIcon({ t }: { t: number }) {
  const bg = t < 0.5
    ? lerpRGB(254, 243, 199, 200, 210, 220, t * 2)
    : lerpRGB(200, 210, 220, 30, 41, 59, (t - 0.5) * 2)

  const radius = lerp(22, 4, t)

  const colors = [
    { r: [239, 150, 100, 80, 71], g: [68, 80, 110, 100, 85], b: [68, 90, 120, 120, 105] },
    { r: [59, 100, 130, 120, 100], g: [130, 130, 140, 130, 116], b: [246, 200, 170, 150, 137] },
    { r: [16, 80, 120, 110, 100], g: [185, 160, 140, 130, 116], b: [129, 120, 120, 120, 137] },
    { r: [245, 200, 160, 130, 100], g: [158, 140, 130, 130, 116], b: [11, 50, 100, 120, 137] },
  ]

  const idx = Math.min(Math.floor(t * 5), 4)
  const frac = (t * 5) - idx
  const next = Math.min(idx + 1, 4)

  const shapes = useMemo(() => colors.map((c, i) => {
    const color = `rgb(${Math.round(lerp(c.r[idx], c.r[next], frac))},${Math.round(lerp(c.g[idx], c.g[next], frac))},${Math.round(lerp(c.b[idx], c.b[next], frac))})`
    return (
      <div key={i} style={{
        width: lerp(16, 36, t),
        height: lerp(16, 4, t),
        borderRadius: lerp(50, 2, t) + '%',
        background: color,
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }} />
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [t])

  return (
    <div className="discovery-icon" style={{
      background: bg,
      borderRadius: radius,
      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: lerp(6, 4, t), justifyContent: 'center', alignItems: 'center' }}>
        {shapes}
      </div>
    </div>
  )
}

// Dense ↔ Spacious: packed data lines → single centered line
function DensityIcon({ t }: { t: number }) {
  const bg = lerpRGB(13, 13, 13, 250, 250, 250, t)
  const lineColor = t < 0.3
    ? '#4ade80'
    : t < 0.6
      ? lerpRGB(74, 222, 128, 40, 40, 40, (t - 0.3) / 0.3)
      : lerpRGB(40, 40, 40, 120, 120, 120, (t - 0.6) / 0.4)

  const lines = ['BTC  67,241', 'ETH   3,841', 'SOL   142.8', 'DOGE  0.148', 'AVAX  28.41']
  const visible = Math.max(1, Math.round(lerp(5, 1, t)))
  const fontSize = lerp(7, 9, t)

  return (
    <div className="discovery-icon" style={{
      background: bg,
      justifyContent: t > 0.7 ? 'center' : 'flex-start',
      alignItems: t > 0.7 ? 'center' : 'flex-start',
      padding: t > 0.7 ? 0 : 8,
      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <div style={{
        fontFamily: "'Fragment Mono', monospace",
        fontSize,
        fontWeight: 600,
        color: lineColor,
        textAlign: t > 0.7 ? 'center' : 'left',
        lineHeight: 1.6,
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            opacity: i < visible ? 1 : 0,
            height: i < visible ? 'auto' : 0,
            overflow: 'hidden',
            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

interface SliderConfig {
  leftLabel: string
  rightLabel: string
  leftTags: string
  rightTags: string
  defaultValue: number
  renderIcon: (t: number) => React.ReactNode
}

function DiscoverySlider({ card }: { card: SliderConfig }) {
  const [value, setValue] = useState(card.defaultValue)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const t = value / 100

  const updateValue = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    setValue(pct * 100)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updateValue(e.clientX)
  }, [updateValue])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    updateValue(e.clientX)
  }, [updateValue])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div className="discovery-slider-card" data-reveal>
      {card.renderIcon(t)}
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
          <div className="discovery-track-fill" style={{ width: `${value}%` }} />
          <div className="discovery-thumb" style={{ left: `${value}%` }} />
        </div>
        <div className="discovery-slider-tags">
          <span className="discovery-tag">{card.leftTags}</span>
          <span className="discovery-tag">{card.rightTags}</span>
        </div>
      </div>
    </div>
  )
}

const SLIDERS: SliderConfig[] = [
  {
    leftLabel: 'Loud',
    rightLabel: 'Quiet',
    leftTags: 'gradients, neon, bold',
    rightTags: 'muted, white space',
    defaultValue: 35,
    renderIcon: (t) => <VolumeIcon t={t} />,
  },
  {
    leftLabel: 'Playful',
    rightLabel: 'Serious',
    leftTags: 'figma, slack, rounded',
    rightTags: 'sharp, structured',
    defaultValue: 55,
    renderIcon: (t) => <MoodIcon t={t} />,
  },
  {
    leftLabel: 'Dense',
    rightLabel: 'Spacious',
    leftTags: 'bloomberg, info-heavy',
    rightTags: 'apple.com, breathing room',
    defaultValue: 52,
    renderIcon: (t) => <DensityIcon t={t} />,
  },
]

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
      <p className="discovery-footnote" data-reveal>A brand psychology test disguised as a questionnaire. Try dragging the sliders.</p>
    </section>
  )
}
