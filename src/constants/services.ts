export interface PricingTier {
  name: string
  price: string
  audience: string
  description: string
  features: string[]
  featured?: boolean
  cta: string
  bookingUrl: string
  timeline: string
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Sprint',
    price: '$5,000',
    audience: 'For teams launching something new',
    description: 'A water-tight brand identity you can ship with confidence. Logo, colors, type, and a social kit — ready for launch day.',
    features: [
      'Logo & visual identity',
      'Color palette & typography',
      'Brand guidelines document',
      'Social media templates',
      '2 revision rounds'
    ],
    cta: 'Book a call',
    bookingUrl: 'https://cal.com/rizzytoday',
    timeline: '2–3 weeks'
  },
  {
    name: 'Build',
    price: '$12,000',
    audience: 'For teams ready to convert',
    description: 'Brand identity plus a custom coded website — designed, built, and deployed by one person. Your brand turns into a live product.',
    features: [
      'Everything in Sprint',
      'Custom website (React)',
      'Responsive + mobile-first',
      'Animation & micro-interactions',
      'CMS integration',
      '3 revision rounds'
    ],
    featured: true,
    cta: 'Book a call',
    bookingUrl: 'https://cal.com/rizzytoday',
    timeline: '4–6 weeks'
  },
  {
    name: 'Studio',
    price: '$20,000',
    audience: 'For teams that need a creative director',
    description: 'Full creative direction — brand, website, motion, design system, and ongoing support. One person owns the entire creative stack.',
    features: [
      'Everything in Build',
      'Design system & component library',
      'Motion graphics package',
      'Pitch deck design',
      'Content direction & strategy',
      'Ongoing support (1 month)',
      'Unlimited revisions'
    ],
    cta: 'Book a call',
    bookingUrl: 'https://cal.com/rizzytoday',
    timeline: '6–8 weeks'
  }
]
