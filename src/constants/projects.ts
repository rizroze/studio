export interface CaseStudyData {
  slug: string
  title: string
  client: string
  tags: string[]
  thumbnail: string
  color: string
  gallery: string[]
  category: 'brand' | 'web' | 'motion' | 'mobile'
  description: string
  brief: string
  challenge: string
  solution: string
  stack: string[]
  result: string
  resultMetric: string
}

export const CASE_STUDIES: CaseStudyData[] = [
  {
    slug: 'radiants',
    title: 'Radiants',
    client: 'RadiantsDAO',
    tags: ['Creative Direction', 'Design System', 'Motion', 'Brand Identity'],
    thumbnail: '/content/logos/radiants-pixel.svg',
    color: '#FCE184',
    gallery: ['/content/logos/radiant-logo.webp', '/content/logos/rad-BLACK.webp'],
    category: 'brand',
    description: '3 years as creative director. Hundreds of content pieces, NFTs, pitchdecks, infographics. Ran content management for 2 Solana Mobile hackathons. Kept it rad. Still keeping it.',
    brief: 'Keep the creative vision alive across everything this organization does — social, tools, content, events, and brand evolution.',
    challenge: 'Radiants does a lot — NFT drops, hackathons, community tools, content campaigns, product launches. Everything needed to look and feel like Radiants without slowing anyone down.',
    solution: 'Built the DNA Design System from scratch. Created hundreds of content pieces, NFT art, pitch decks, infographics, and brand motion videos. Ran content management for 2 Solana Mobile hackathons. 3 years in and still the creative director.',
    stack: ['Figma', 'Remotion', 'React', 'CSS', 'After Effects', 'Midjourney'],
    result: 'A brand that stays consistent across every touchpoint — from Twitter posts to hackathon booths to product UI.',
    resultMetric: '3 years as Creative Director. Hundreds of deliverables.'
  },
  {
    slug: 'wayy',
    title: 'WAYY',
    client: 'RadiantsDAO',
    tags: ['Product Design', 'Solana', 'Prediction Market', 'Full Stack'],
    thumbnail: '/content/logos/wayy-logomark.png',
    color: '#F5B731',
    gallery: ['/content/logos/wayy-logo-black.png', '/content/logos/wayy-logomark.png'],
    category: 'web',
    description: 'Built the first prototype with 2 devs. After a long pause, revamped the entire product into an art prediction market — redesigned and rebuilt in 1 week. Co-founder.',
    brief: 'Take a prediction market concept from prototype to live Solana product — twice.',
    challenge: 'The first version was a rough prototype. When it was time to come back, the whole product needed to be rethought as an art prediction market — new UI, new flows, new on-chain logic — and shipped fast.',
    solution: 'Redesigned and rebuilt the entire frontend in 1 week. Next.js 16, Prisma + MongoDB, Solana wallet adapter. Retro pixel design system with real-time battles, escrow wallets, and two-step transaction signing.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'MongoDB', 'Solana', 'Zustand', 'GSAP'],
    result: 'A live prediction market on Solana Devnet — from prototype to full product revamp.',
    resultMetric: 'Full product revamp in 1 week. Co-founder.'
  },
  {
    slug: 'hydex',
    title: 'Hydex',
    client: 'Hydex',
    tags: ['Brand Identity', 'Pitch Deck', 'Presentation Design'],
    thumbnail: '/content/hydex-logo-white.png',
    color: '#34A853',
    gallery: ['/content/pitchdeck-2.webp', '/content/pitchdeck-3.webp', '/content/pitchdeck-6.webp', '/content/pitchdeck-8.webp'],
    category: 'brand',
    description: 'Brand identity and investor pitch deck for a DeFi protocol. Custom slides with data visualization, branded typography, and motion elements.',
    brief: 'Design an investor-ready pitch deck and brand direction for a Solana DeFi protocol looking to raise their seed round.',
    challenge: 'Translating dense DeFi mechanics and market data into a compelling visual narrative that builds conviction with investors in under 10 minutes.',
    solution: 'Custom-designed deck with branded typography, infographics, and a clear narrative arc. Each slide moves from problem to solution to traction, with motion elements for the live presentation.',
    stack: ['Figma', 'After Effects', 'Custom Typography'],
    result: 'A deck that helped the team secure meetings and communicate their vision with clarity and confidence.',
    resultMetric: 'Pitch deck that secured investor meetings.'
  },
  {
    slug: 'fullport',
    title: 'Fullport',
    client: 'Monolith Hackathon',
    tags: ['Mobile App', 'React Native', 'Solana', 'Portfolio Tracker'],
    thumbnail: '/content/logos/fullport-briefcase.svg',
    color: '#1a1a2e',
    gallery: ['/content/logos/fullport-logo.svg'],
    category: 'mobile',
    description: 'Solana portfolio tracker built for the Seeker mobile device. Shipped as an APK for the Monolith 2026 hackathon.',
    brief: 'Build a native mobile portfolio tracker for the Solana Seeker device — real-time token balances, prices, and portfolio analytics.',
    challenge: 'Building a performant mobile app from scratch in hackathon timeframe, with real Solana data via Helius DAS API and smooth animations on mobile hardware.',
    solution: 'React Native + Expo SDK 54 with Reanimated 4 for buttery 60fps animations. Zustand + TanStack Query for state and caching. Liquid glass design system adapted for mobile — dark theme, frosted glass cards, smooth transitions.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'Helius API', 'Reanimated'],
    result: 'Working APK shipped within hackathon deadline. Real portfolio data, smooth animations, and a polished mobile experience.',
    resultMetric: 'Shipped working APK at Monolith hackathon.'
  }
]
