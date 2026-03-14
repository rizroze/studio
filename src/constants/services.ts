export interface PricingTier {
  name: string
  audience: string
  tagline: string
  description: string
  features: string[]
  featured?: boolean
  cta: string
  bookingUrl: string
  timeline: string
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Start',
    audience: 'For teams launching something new',
    tagline: 'Ship your brand with confidence.',
    description: 'A water-tight brand identity you can ship with confidence. Logo, colors, type, and a social kit ready for launch day.',
    features: [
      'Logo & visual identity',
      'Color palette & typography',
      'Brand guidelines document',
      'Content direction system',
      '2 revision rounds'
    ],
    cta: 'Book a call',
    bookingUrl: 'https://cal.com/rizzytoday',
    timeline: '1–2 weeks'
  },
  {
    name: 'Build',
    audience: 'For teams ready to convert',
    tagline: 'Your brand becomes a live product.',
    description: 'Brand identity plus a custom coded website. Designed, built, and deployed by one person. Your brand turns into a live product.',
    features: [
      'Everything in Start',
      'Custom website (React)',
      'Responsive + mobile-first',
      'Animation & micro-interactions',
      'CMS integration',
      '3 revision rounds'
    ],
    featured: true,
    cta: 'Book a call',
    bookingUrl: 'https://cal.com/rizzytoday',
    timeline: '2–4 weeks'
  },
  {
    name: 'Studio',
    audience: 'For teams that need a creative director',
    tagline: 'One person owns your entire creative stack.',
    description: 'Full creative direction. Brand, website, motion, design system, and ongoing support. One person owns the entire creative stack.',
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
