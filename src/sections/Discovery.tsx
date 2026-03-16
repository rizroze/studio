import { useState, useRef, useCallback } from 'react'
import { WordReveal } from '../components/WordReveal'

interface SliderCard {
  leftLabel: string
  rightLabel: string
  leftTags: string
  rightTags: string
  defaultValue: number
  icon: React.ReactNode
}

function SliderIcon1() {
  // Gradient circle — "loud" vibe
  return (
    <div className="discovery-icon" style={{ background: '#1a1a1a' }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <defs>
          <radialGradient id="g1" cx="45%" cy="40%">
            <stop offset="0%" stopColor="#e8a87c" />
            <stop offset="50%" stopColor="#c77dba" />
            <stop offset="100%" stopColor="#8b6e8f" />
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="14" fill="url(#g1)" />
      </svg>
    </div>
  )
}

function SliderIcon2() {
  // Rounded color blocks — "playful" vibe
  return (
    <div className="discovery-icon" style={{ background: '#e8e5e0' }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="14" width="12" height="6" rx="2" fill="#7a8a7a" />
        <rect x="26" y="14" width="12" height="6" rx="2" fill="#9a9ab8" />
        <rect x="10" y="24" width="12" height="6" rx="2" fill="#8a9a7a" />
        <rect x="26" y="24" width="12" height="6" rx="2" fill="#b8a878" />
      </svg>
    </div>
  )
}

function SliderIcon3() {
  // Crypto ticker — "dense" vibe
  return (
    <div className="discovery-icon" style={{ background: '#b8b8b0' }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <text x="8" y="18" fill="#2a5a2a" fontFamily="Fragment Mono, monospace" fontSize="8" fontWeight="600">BTC  67,241</text>
        <text x="8" y="28" fill="#2a5a2a" fontFamily="Fragment Mono, monospace" fontSize="8" fontWeight="600">ETH   3,841</text>
        <text x="8" y="38" fill="#2a5a2a" fontFamily="Fragment Mono, monospace" fontSize="8" fontWeight="600">SOL   142.8</text>
      </svg>
    </div>
  )
}

function DiscoverySlider({ card }: { card: SliderCard }) {
  const [value, setValue] = useState(card.defaultValue)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

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
      {card.icon}
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

const SLIDERS: SliderCard[] = [
  {
    leftLabel: 'Loud',
    rightLabel: 'Quiet',
    leftTags: 'gradients, neon, bold',
    rightTags: 'muted, white space',
    defaultValue: 55,
    icon: <SliderIcon1 />,
  },
  {
    leftLabel: 'Playful',
    rightLabel: 'Serious',
    leftTags: 'figma, slack, rounded',
    rightTags: 'sharp, structured',
    defaultValue: 55,
    icon: <SliderIcon2 />,
  },
  {
    leftLabel: 'Dense',
    rightLabel: 'Spacious',
    leftTags: 'bloomberg, info-heavy',
    rightTags: 'apple.com, breathing room',
    defaultValue: 52,
    icon: <SliderIcon3 />,
  },
]

export function Discovery() {
  return (
    <section className="section discovery-section">
      <WordReveal text="What it's like to work with me." className="section-title-xl" tag="h2" />
      <p className="discovery-subtitle" data-reveal>
        After our call, this lands on your screen — an interactive questionnaire built just for you. Not a form. A conversation that makes sure you get exactly what you need.
      </p>
      <div className="discovery-sliders" data-reveal-stagger>
        {SLIDERS.map((card, i) => (
          <DiscoverySlider key={i} card={card} />
        ))}
      </div>
      <p className="discovery-footnote" data-reveal>These are just 3 of many. Every questionnaire is different.</p>
    </section>
  )
}
