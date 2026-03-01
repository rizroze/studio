export interface ProjectSection {
  title: string
  description: string
  gallery: string[]
  layout?: 'grid' | 'squares' | 'masonry'  // grid = default 3-col, squares = small 1:1, masonry = mixed
}

export interface CaseStudyData {
  slug: string
  title: string
  client: string
  tags: string[]
  thumbnail: string
  color: string
  gallery: string[]
  previewGallery?: string[]  // curated images for the card preview (overrides gallery/sections)
  video?: string
  videoLabel?: string
  sections?: ProjectSection[]
  category: 'brand' | 'web' | 'motion' | 'mobile'
  description: string
  brief: string
  challenge: string
  solution: string
  stack: string[]
  result: string
  resultMetric: string
}

// Which projects appear on the hero bookshelf (order matters — maps to BOOK_COLORS/SPINE_LOGOS)
export const BOOKSHELF_SLUGS = ['radiants', 'wayy', 'hydex', 'fullport'] as const

export const CASE_STUDIES: CaseStudyData[] = [
  {
    slug: 'radiants',
    title: 'Radiants',
    client: 'Brand & Content Direction',
    tags: ['Intern Lead'],
    thumbnail: '/content/logos/radiants-pixel-dark.svg',
    color: '#FCE184',
    gallery: [],
    previewGallery: [
      '/content/radiants/radspaces/radspaces-55.webp',
      '/content/radiants/radspaces/radspaces-56.webp',
      '/content/radiants/brand/yeehaw.webp',
      '/content/radiants/community/burn-event.webp',
      '/content/radiants/radspaces/radspaces-57.webp',
      '/content/radiants/brand/brand-art.webp',
    ],
    sections: [
      {
        title: 'PFP Art',
        description: 'Custom pixel art profile pictures for the Radiants community. Each one hand-crafted in the signature sun-yellow palette.',
        layout: 'squares',
        gallery: [
          '/content/radiants/pfps/chadbudd.webp',
          '/content/radiants/pfps/lucky-rizz.webp',
          '/content/radiants/pfps/rad-bastard.webp',
        ],
      },
      {
        title: 'RadSpaces',
        description: 'Weekly branded content for RadSpaces, the community podcast and Twitter Spaces. Each post designed to stop the scroll with a unique visual direction.',
        gallery: [
          '/content/radiants/radspaces/radspaces-55.webp',
          '/content/radiants/radspaces/radspaces-56.webp',
          '/content/radiants/radspaces/radspaces-57.webp',
          '/content/radiants/radspaces/radspaces-54-google.webp',
          '/content/radiants/radspaces/radspaces-54-tools.webp',
        ],
      },
      {
        title: 'Community & Events',
        description: 'Event graphics, community moments, and recurring content. From the first-ever Burn Event to weekly co-working days and vibecoding sessions.',
        gallery: [
          '/content/radiants/community/burn-event.webp',
          '/content/radiants/community/vibecode.webp',
          '/content/radiants/community/coworking.webp',
          '/content/radiants/community/dinner.webp',
          '/content/radiants/community/radgangz.webp',
          '/content/radiants/community/be-rad.webp',
        ],
      },
      {
        title: 'Brand Art',
        description: 'Original illustrations, photo treatments, and brand pieces that define the Radiants visual identity.',
        gallery: [
          '/content/radiants/brand/yeehaw.webp',
          '/content/radiants/brand/brand-art.webp',
          '/content/radiants/brand/photo-1.webp',
          '/content/radiants/brand/photo-2.webp',
          '/content/radiants/brand/photo-3.webp',
        ],
      },
      {
        title: 'Monolith 2026',
        description: 'Full content campaign for Solana Mobile\'s flagship event. Announcement threads, FAQ graphics, social cards, and post-event recaps covering the Vibecoding workshop and hackathon highlights.',
        gallery: [
          '/content/monolith/announcement-1.webp',
          '/content/monolith/announcement-3.webp',
          '/content/monolith/faq-1.webp',
          '/content/monolith/share-thumbnail.webp',
          '/content/monolith/content-1.webp',
          '/content/monolith/vibecoding-1.webp',
          '/content/monolith/workshop.webp',
        ],
      },
      {
        title: 'Seeker Hackathon',
        description: 'Ran the entire content campaign. Prize announcements, FAQ threads, countdown graphics, milestone celebrations, and sponsor thank-yous. 500+ signups.',
        gallery: [
          '/content/seeker/prize.webp',
          '/content/seeker/faq-1.webp',
          '/content/seeker/categories.webp',
          '/content/seeker/500-signups.webp',
          '/content/seeker/submissions.webp',
          '/content/seeker/sponsors.webp',
          '/content/seeker/app-screenshot.webp',
        ],
      },
    ],
    category: 'brand',
    description: '3 years content lead. Created hundreds of content pieces, NFT art, and brand motion. Kept things rad.',
    brief: 'Keep the creative vision alive across everything RadiantsDAO does. Social content, brand assets, vibes, and community identity.',
    challenge: 'Radiants does a lot. NFT drops, community tools, content campaigns, product launches. Everything needed to look and feel like Radiants without slowing anyone down.',
    solution: 'Built the DNA Design System from scratch. Created hundreds of social graphics, NFT art, pixel characters, event promos, and brand motion videos. Established a recognizable visual language (sun-yellow, pixel aesthetic, retro energy) that scales across every format.',
    stack: ['Figma', 'Remotion', 'React', 'CSS', 'After Effects', 'Midjourney'],
    result: 'A brand that stays consistent across every touchpoint. From Twitter posts to hackathon booths to product UI.',
    resultMetric: '3 years Content Direction'
  },
  {
    slug: 'wayy',
    title: 'WAYY',
    client: 'Art Prediction Market',
    tags: ['Product Design', 'Solana', 'Prediction Market', 'Full Stack'],
    thumbnail: '/content/logos/wayy-logomark-black.webp',
    color: '#F5B731',
    gallery: [
      '/content/wayy/deck-title.webp',
      '/content/wayy/deck-problem.webp',
      '/content/wayy/deck-solution.webp',
      '/content/wayy/deck-product.webp',
      '/content/wayy/deck-tokenomics.webp',
      '/content/wayy/deck-roadmap.webp',
      '/content/wayy/web-home.webp',
      '/content/wayy/web-markets.webp',
      '/content/wayy/web-battle.webp',
    ],
    previewGallery: [
      '/content/wayy/deck-title.webp',
      '/content/wayy/deck-problem.webp',
      '/content/wayy/deck-solution.webp',
      '/content/wayy/deck-product.webp',
      '/content/wayy/deck-tokenomics.webp',
      '/content/wayy/deck-roadmap.webp',
    ],
    video: '/content/wayy/wayy-social.mp4',
    videoLabel: 'Social Launch Video',
    category: 'web',
    description: 'Built the first prototype with 2 devs. After a long pause, revamped the entire product into an art prediction market. Redesigned and rebuilt in 1 week. Founder.',
    brief: 'Take a prediction market concept from prototype to live Solana product. Twice.',
    challenge: 'Started this as a tool for covering all the needs of an on-chain creator. Built the first version with 2 developers, then put it on a shelf and forgot about it. The Solana Graveyard hackathon made me want to rework it. The whole product needed to be rethought as an art prediction market. New UI, new flows, new on-chain logic, and shipped fast.',
    solution: 'Redesigned and rebuilt the entire frontend in 1 week. Next.js 16, Prisma + MongoDB, Solana wallet adapter. Retro pixel design system with real-time battles, escrow wallets, and two-step transaction signing.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'MongoDB', 'Solana', 'Zustand', 'GSAP'],
    result: 'A live prediction market on Solana Devnet. From prototype to full product revamp.',
    resultMetric: 'Full product revamp in 1 week. Founder.'
  },
  {
    slug: 'hydex',
    title: 'Hydex',
    client: 'DeFi',
    tags: ['Brand Identity', 'Pitch Deck', 'Presentation Design'],
    thumbnail: '/content/hydex-logo-white.png',
    color: '#34A853',
    gallery: [
      '/content/hydex/deck-cover.webp',
      '/content/hydex/deck-problem.webp',
      '/content/hydex/deck-solution.webp',
      '/content/hydex/deck-architecture.webp',
      '/content/hydex/deck-tokenomics.webp',
      '/content/hydex/deck-market.webp',
      '/content/hydex/deck-team.webp',
    ],
    previewGallery: [
      '/content/hydex/deck-cover.webp',
      '/content/hydex/deck-problem.webp',
      '/content/hydex/deck-solution.webp',
      '/content/hydex/deck-architecture.webp',
      '/content/hydex/deck-tokenomics.webp',
      '/content/hydex/deck-market.webp',
    ],
    video: '/content/hydex/hydex-social.mp4',
    videoLabel: 'Brand Motion',
    category: 'brand',
    description: 'Pitch deck and logo animation for a DeFi privacy bridge. Two deck iterations with data visualization, branded typography, and motion elements.',
    brief: 'Design an investor-ready pitch deck and brand direction for a Solana DeFi protocol looking to raise their seed round.',
    challenge: 'Translating dense DeFi mechanics and market data into a compelling visual narrative that builds conviction with investors in under 10 minutes.',
    solution: 'Custom-designed deck with branded typography, infographics, and a clear narrative arc. Each slide moves from problem to solution to traction, with motion elements for the live presentation. Two iterations, refining the story and visuals across rounds of feedback.',
    stack: ['Figma', 'After Effects', 'Custom Typography'],
    result: 'A deck that helped the team secure meetings and communicate their vision with clarity and confidence.',
    resultMetric: 'Pitch deck and logo animation that secured investor meetings.'
  },
  {
    slug: 'fullport',
    title: 'Fullport',
    client: 'Solana Portfolio Tracker',
    tags: ['Mobile App', 'React Native', 'Solana', 'Portfolio Tracker'],
    thumbnail: '/content/logos/fullport-briefcase.svg',
    color: '#1a1a2e',
    gallery: [
      '/content/fullport/slide-title.webp',
      '/content/fullport/slide-problem.webp',
      '/content/fullport/slide-solution.webp',
      '/content/fullport/slide-features.webp',
      '/content/fullport/slide-staking.webp',
      '/content/fullport/slide-tech.webp',
      '/content/fullport/slide-seeker.webp',
      '/content/fullport/slide-cta.webp',
    ],
    previewGallery: [
      '/content/fullport/slide-title.webp',
      '/content/fullport/slide-problem.webp',
      '/content/fullport/slide-solution.webp',
      '/content/fullport/slide-features.webp',
      '/content/fullport/slide-staking.webp',
      '/content/fullport/slide-tech.webp',
    ],
    video: '/content/fullport/fullport-demo.mp4',
    videoLabel: 'App Demo',
    category: 'mobile',
    description: 'Solana portfolio tracker built for the Seeker mobile device. Shipped as an APK for the Monolith 2026 hackathon.',
    brief: 'Build a native mobile portfolio tracker for the Solana Seeker device. Real-time token balances, prices, and portfolio analytics.',
    challenge: 'Building a performant mobile app from scratch in hackathon timeframe, with real Solana data via Helius DAS API and smooth animations on mobile hardware.',
    solution: 'React Native + Expo SDK 54 with Reanimated 4 for buttery 60fps animations. Zustand + TanStack Query for state and caching. Liquid glass design system adapted for mobile with dark theme, frosted glass cards, and smooth transitions.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'Helius API', 'Reanimated'],
    result: 'Working APK shipped within hackathon deadline. Real portfolio data, smooth animations, and a polished mobile experience.',
    resultMetric: 'Shipped working APK at Monolith hackathon.'
  },
]
