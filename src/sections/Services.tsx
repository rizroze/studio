import { PricingCard } from '../components/PricingCard'
import { PRICING_TIERS } from '../constants/services'
import { WordReveal } from '../components/WordReveal'

export function Services() {
  return (
    <section id="services" className="section">
      <WordReveal text="Pick a scope. Get everything." className="section-title-xl" tag="h2" />

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
