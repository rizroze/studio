import { useState, useRef, useCallback } from 'react'
import { track } from '@vercel/analytics'
import type { PricingTier } from '../constants/services'

// Clean line SVG icons
function StartIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
  )
}

function BuildIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
      <line x1="14" y1="4" x2="10" y2="20" opacity="0.4"/>
    </svg>
  )
}

function StudioIcon({ color }: { color: string }) {
  // Gem with flat top like 💎
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6,3 18,3 22,10 12,22 2,10"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
      <line x1="6" y1="3" x2="8" y2="10"/>
      <line x1="18" y1="3" x2="16" y2="10"/>
      <line x1="8" y1="10" x2="12" y2="22"/>
      <line x1="16" y1="10" x2="12" y2="22"/>
      <line x1="12" y1="3" x2="12" y2="10" opacity="0.3"/>
    </svg>
  )
}

const TIER_CONFIG: Record<string, { icon: typeof StartIcon; accent: string }> = {
  'Start': { icon: StartIcon, accent: '#FCE184' },
  'Build': { icon: BuildIcon, accent: '#ef4444' },
  'Studio': { icon: StudioIcon, accent: '#ffffff' },
}

interface PricingCardProps {
  tier: PricingTier
}

export function PricingCard({ tier }: PricingCardProps) {
  const config = TIER_CONFIG[tier.name] || TIER_CONFIG['Start']
  const Icon = config.icon
  const accent = config.accent

  const [flipped, setFlipped] = useState(false)
  const touchStartY = useRef(0)
  const touchMoved = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
    touchMoved.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
      touchMoved.current = true
    }
  }, [])

  const handleTap = useCallback(() => {
    if (touchMoved.current) return
    setFlipped(f => !f)
  }, [])

  return (
    <div
      className={`pricing-flip-wrap ${tier.featured ? 'featured' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onClick={handleTap}
    >
      <div className={`pricing-flip-inner ${flipped ? 'flipped' : ''}`}>
        {/* Front face */}
        <div className="pricing-flip-front">


          <div className="pricing-front-header">
            <div className="pricing-icon">
              <Icon color={accent} />
            </div>
            <div>
              <h3 className="pricing-name">{tier.name}</h3>
              <span className="pricing-timeline">{tier.timeline}</span>
            </div>
          </div>

          <p className="pricing-tagline">{tier.tagline}</p>

          <div className="pricing-divider" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />

          <div className="pricing-features-grid">
            {tier.features.map(f => (
              <div key={f} className="pricing-feature-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>{f.replace('Everything in Start', '+ Start tier').replace('Everything in Build', '+ Build tier')}</span>
              </div>
            ))}
          </div>

          <p className="pricing-desc">{tier.description}</p>
          <div className="pricing-accent-bar-bottom" style={{ background: accent }} />
        </div>

        {/* Back face — CTA only */}
        <div className="pricing-flip-back">

          <div className="pricing-accent-bar-bottom" style={{ background: accent }} />
          <h4 className="pricing-back-title">{tier.name}</h4>
          <p className="pricing-back-desc">{tier.audience}</p>
          <a
            href={tier.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pricing-cta"
            style={{ background: accent, borderColor: accent, color: '#000' }}
            onClick={(e) => { e.stopPropagation(); track('cta_click', { location: 'pricing', tier: tier.name }) }}
          >
            {tier.cta}
          </a>
        </div>
      </div>
    </div>
  )
}
