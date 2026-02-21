import type { PricingTier } from '../constants/services'

interface PricingCardProps {
  tier: PricingTier
}

export function PricingCard({ tier }: PricingCardProps) {
  return (
    <div className={`pricing-flip-wrap ${tier.featured ? 'featured' : ''}`}>
      <div className="pricing-flip-inner">
        {/* Front face */}
        <div className="pricing-flip-front">
          <div className="pricing-name-row">
            <h3 className="pricing-name">{tier.name}</h3>
            <span className="pricing-timeline">{tier.timeline}</span>
          </div>
          <p className="pricing-audience">{tier.audience}</p>
          <div className="pricing-divider" />
          <div className="pricing-price">{tier.price}</div>
          <p className="pricing-desc">{tier.description}</p>
        </div>

        {/* Back face */}
        <div className="pricing-flip-back">
          <h4 className="pricing-back-title">What's included</h4>
          <ul className="pricing-features-back">
            {tier.features.map(f => (
              <li key={f}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {f}
              </li>
            ))}
          </ul>
          <a
            href={tier.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`pricing-cta ${tier.featured ? 'featured' : ''}`}
          >
            {tier.cta}
          </a>
        </div>
      </div>
    </div>
  )
}
