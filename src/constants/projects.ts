export interface CaseStudyData {
  slug: string
  title: string
  client: string
  tags: string[]
  thumbnail: string
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
    thumbnail: '/content/logos/radiant-logo.webp',
    gallery: ['/content/logos/radiant-logo.webp', '/content/logos/rad-BLACK.webp'],
    category: 'brand',
    description: 'Full brand identity and design system for a Solana-native NFT ecosystem. 3+ years of creative direction across social, tools, and motion.',
    brief: 'Build and maintain the entire visual identity for a Solana-native NFT ecosystem — from pixel art design system to brand motion videos.',
    challenge: 'Radiants needed a cohesive brand that could span a retro pixel aesthetic, a full design system (DNA), community tools, and promotional content — all while staying nimble enough to evolve with the project.',
    solution: 'Created the DNA Design System with semantic tokens, retro lift interactions, and Joystix typography. Built PFP background changer tools, brand motion videos in Remotion, and maintained creative direction across all touchpoints for 3+ years.',
    stack: ['Figma', 'Remotion', 'React', 'CSS', 'After Effects'],
    result: 'A recognizable, consistent brand presence across social, tools, and video — built to last and easy to extend.',
    resultMetric: '3-year partnership. 50+ deliverables.'
  },
  {
    slug: 'wayy',
    title: 'WAYY',
    client: 'RadiantsDAO',
    tags: ['Product UI', 'Solana', 'Prediction Market', 'Full Stack'],
    thumbnail: '/content/logos/wayy-logomark.png',
    gallery: ['/content/logos/wayy-logo-black.png', '/content/logos/wayy-logomark.png'],
    category: 'web',
    description: 'Designed and built the frontend for a prediction market on Solana. Trading-style interface with real wallet transactions and live battles.',
    brief: 'Design and build the frontend for a prediction market where users bet on art outcomes using SOL.',
    challenge: 'Creating a trading-style interface that feels fast and intuitive while handling real Solana transactions, wallet connections, and live countdown timers.',
    solution: 'Built with Next.js 16, Prisma + MongoDB, and Solana wallet adapter. Retro pixel design system (Radiants DNA) with instant state changes, real-time battle rounds, and two-step transaction signing.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'MongoDB', 'Solana', 'Zustand', 'GSAP'],
    result: 'A fully functional prediction market MVP with wallet integration, live battles, and escrow-based payouts on Solana Devnet.',
    resultMetric: 'Concept to live Solana product in 8 weeks.'
  },
  {
    slug: 'hydex',
    title: 'Hydex',
    client: 'Hydex',
    tags: ['Brand Identity', 'Pitch Deck', 'Presentation Design'],
    thumbnail: '/content/hydex-logo-white.png',
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
    thumbnail: '/content/logos/fullport-logo.svg',
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
