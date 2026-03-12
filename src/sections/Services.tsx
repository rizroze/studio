import { PricingCard } from '../components/PricingCard'
import { PRICING_TIERS } from '../constants/services'

export function Services() {
  return (
    <section id="services" className="section">
      <h2 className="section-title-xl" data-reveal>Pick a scope. Get everything.</h2>

      <div className="pricing-cards" data-reveal-stagger>
        {PRICING_TIERS.map(tier => (
          <PricingCard key={tier.name} tier={tier} />
        ))}
      </div>

      <p className="pricing-footer-note" data-reveal>
        Accepts SOL, USDC, and traditional payments. 50% upfront, 50% on delivery.
      </p>
    </section>
  )
}
