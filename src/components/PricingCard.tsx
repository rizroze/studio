import { useState, useRef, useCallback } from 'react'
import { track } from '@vercel/analytics'
import type { PricingTier } from '../constants/services'

// Modern line icons (hugeicons-inspired)
function StartIcon({ color }: { color: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 3.5c.6 4.4 1.1 5.9 5.5 6.5-4.4.6-4.9 2.1-5.5 6.5-.6-4.4-1.1-5.9-5.5-6.5 4.4-.6 4.9-2.1 5.5-6.5Z"/>
      <path d="M18.5 14.5c.25 1.8.5 2.4 2.3 2.6-1.8.25-2.05.85-2.3 2.65-.25-1.8-.5-2.4-2.3-2.65 1.8-.2 2.05-.85 2.3-2.6Z"/>
    </svg>
  )
}

function BuildIcon({ color }: { color: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 6.5 21 12l-5.5 5.5"/>
      <path d="M8.5 6.5 3 12l5.5 5.5"/>
    </svg>
  )
}

function StudioIcon({ color }: { color: string }) {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 9.5 7 4h10l3.5 5.5L12 21 3.5 9.5Z"/>
      <path d="M3.5 9.5h17"/>
      <path d="M8 9.5 12 21l4-11.5"/>
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

          <p className="pricing-desc">{tier.description}</p>

          <div className="pricing-features-grid">
            {tier.features.map(f => (
              <div key={f} className="pricing-feature-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>{f.replace('Everything in Start', '+ Start tier').replace('Everything in Build', '+ Build tier')}</span>
              </div>
            ))}
          </div>
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
