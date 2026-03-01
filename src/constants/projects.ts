export interface ProjectSection {
  title: string
  description: string
  gallery: string[]
  layout?: 'grid' | 'squares' | 'landscape' | 'deck'  // grid = default columns, squares = 1:1 grid, landscape = 2-col grid, deck = 3-col grid
  wideIndices?: number[]  // gallery item indices that span full row width
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
      '/content/radiants/community/ts.webp',
      '/content/radiants/community/image-1.webp',
      '/content/radiants/community/image.webp',
      '/content/radiants/community/57now.webp',
    ],
    sections: [
      {
        title: 'Community & Events',
        description: 'Weekly branded content, event graphics, and community moments. From RadSpaces podcast posts to the first-ever Burn Event, co-working days, and vibecoding sessions.',
        layout: 'deck',
        gallery: [
          // 2026
          '/content/radiants/community/ts.webp',               // Jan 2026
          '/content/radiants/community/image-1.webp',           // Jan 2026
          '/content/radiants/community/image.webp',             // Jan 2026
          '/content/radiants/community/57now.webp',             // Dec 2025 — RadSpaces #57
          '/content/radiants/community/rad57upcoming.webp',     // Dec 2025
          '/content/radiants/community/rad56.webp',             // Nov 2025 — RadSpaces #56
          '/content/radiants/community/rad55.webp',             // Nov 2025 — RadSpaces #55
          '/content/radiants/community/dela.webp',              // Nov 2025
          '/content/radiants/community/this.webp',              // Nov 2025
          '/content/radiants/community/rad522.webp',            // Nov 2025 — RadSpaces #52
          '/content/radiants/community/rad52.webp',             // Nov 2025
          '/content/radiants/community/rad51-now.webp',         // Oct 2025 — RadSpaces #51
          '/content/radiants/community/rad-51.webp',            // Oct 2025
          '/content/radiants/community/dolero50-2.webp',        // Oct 2025 — RadSpaces #50
          '/content/radiants/community/rad50.webp',             // Oct 2025
          '/content/radiants/community/49.webp',                // Oct 2025 — RadSpaces #49
          '/content/radiants/community/rad48-1hr.webp',         // Oct 2025 — RadSpaces #48
          '/content/radiants/community/radspaces48.webp',       // Oct 2025
          '/content/radiants/community/1231231.webp',           // Sep 2025
          // 2025
          '/content/radiants/community/frame-1000005468.webp',  // Apr 2025
          '/content/radiants/community/frame-1000005467.webp',  // Apr 2025
          // 2024
          '/content/radiants/community/11422.webp',             // Apr 2024
          '/content/radiants/community/private-event.webp',     // Mar 2024
          '/content/radiants/community/rad-dinner.webp',        // Mar 2024
        ],
      },
      {
        title: 'Brand Art',
        description: 'Original illustrations, photo treatments, and brand pieces that define the Radiants visual identity.',
        layout: 'deck',
        wideIndices: [9],
        gallery: [
          // square
          '/content/radiants/brand-art/132.webp',
          '/content/radiants/brand-art/6days.webp',
          '/content/radiants/brand-art/be-rad.webp',
          '/content/radiants/brand-art/breakpointrad.webp',
          '/content/radiants/brand-art/frame-2085660600.webp',
          '/content/radiants/brand-art/radintern.webp',
          '/content/radiants/brand-art/radpep.webp',
          '/content/radiants/brand-art/radsss.webp',
          '/content/radiants/brand-art/radzcominnggez.gif',
          // landscape
          '/content/radiants/brand-art/radfam2024-dinga.webp',
          '/content/radiants/brand-art/sprite-00021.gif',
          '/content/radiants/brand-art/image-2.webp',
          '/content/radiants/brand-art/rad1.webp',
          '/content/radiants/brand-art/radgangz.webp',
          '/content/radiants/brand-art/frame-2085660589.webp',
          '/content/radiants/brand-art/5daysleft.webp',
          '/content/radiants/brand-art/frame_2085660586.webp',
          '/content/radiants/brand-art/gameboi-rad.webp',
          '/content/radiants/brand-art/screenshot-2024-09-14-at-02.55.19.webp',
          '/content/radiants/brand-art/rad_missing.webp',
          '/content/radiants/brand-art/rad-desertfunk.webp',
          '/content/radiants/brand-art/radskellu.webp',
          // portrait
          '/content/radiants/brand-art/mfrad.webp',
          '/content/radiants/brand-art/screenshot-2025-10-28-at-20.01.56.webp',
          '/content/radiants/brand-art/raddz.webp',
        ],
      },
      {
        title: 'Monolith 2026',
        description: 'Full content campaign for Solana Mobile\'s flagship event. Announcement threads, FAQ graphics, social cards, and post-event recaps covering the workshops.',
        layout: 'landscape',
        gallery: [
          '/content/monolith/announcement-1.webp',
          '/content/monolith/announcement-3.webp',
          '/content/monolith/monolith-announce-2.webp',
          '/content/monolith/monolith-announce-5.webp',
          '/content/monolith/faq-1.webp',
          '/content/monolith/monolith-faq-2.webp',
          '/content/monolith/share-thumbnail.webp',
          '/content/monolith/content-1.webp',
          '/content/monolith/monolith-content-2.webp',
          '/content/monolith/vibecoding-1.webp',
          '/content/monolith/monolith-vibecoding-2.webp',
          '/content/monolith/monolith-vibecoding-5.webp',
          '/content/monolith/workshop.webp',
          '/content/monolith/monolith-workshop-1.webp',
          '/content/monolith/monolith-workshop-2.webp',
          '/content/monolith/monolith-space.webp',
        ],
      },
      {
        title: 'Seeker Hackathon',
        description: 'Ran the entire content campaign graphics — stayed in the audience\'s feed and mind throughout. Prize announcements, FAQ threads, countdowns, milestone celebrations, and sponsor shoutouts. 500+ signups.',
        layout: 'squares',
        gallery: [
          '/content/seeker/prize.webp',
          '/content/seeker/faq-1.webp',
          '/content/seeker/seeker-faq-2.webp',
          '/content/seeker/500-signups.webp',
          '/content/seeker/seeker-100-signups.webp',
          '/content/seeker/submissions.webp',
          '/content/seeker/sponsors.webp',
          '/content/seeker/seeker-bonk.webp',
          '/content/seeker/seeker-3123.webp',
          '/content/seeker/seeker-closed.webp',
          '/content/seeker/seeker-come.webp',
          '/content/seeker/seeker-judging.webp',
          '/content/seeker/seeker-github.webp',
          '/content/seeker/seeker-rise.webp',
          '/content/seeker/seeker-subs-3.webp',
          '/content/seeker/seeker-worldwide.webp',
        ],
      },
      {
        title: 'PFP Art',
        description: 'Custom pixel art profile pictures for the Radiants community. Each one hand-crafted in the signature sun-yellow palette.',
        layout: 'squares',
        gallery: [
          '/content/radiants/pfps/blonde.webp',
          '/content/radiants/pfps/brz.webp',
          '/content/radiants/pfps/chadbuddha.webp',
          '/content/radiants/pfps/devourcousin.webp',
          '/content/radiants/pfps/dro.webp',
          '/content/radiants/pfps/dude.webp',
          '/content/radiants/pfps/haidaa.webp',
          '/content/radiants/pfps/hodja.webp',
          '/content/radiants/pfps/jankie.webp',
          '/content/radiants/pfps/kolomb.webp',
          '/content/radiants/pfps/maurice.webp',
          '/content/radiants/pfps/rad-bastard-2.webp',
          '/content/radiants/pfps/radgarl.webp',
          '/content/radiants/pfps/robba.webp',
          '/content/radiants/pfps/uncle.webp',
          '/content/radiants/pfps/wakeupneo.webp',
        ],
      },
    ],
    category: 'brand',
    description: '3 years content lead. Created hundreds of content pieces.\nKept things rad.',
    brief: 'Keep the creative vision alive across everything RadiantsDAO does. Social content, brand assets, vibes, and community identity.',
    challenge: 'Radiants does a lot. NFT drops, community tools, content campaigns, product launches. Everything needed to feel like RAD without slowing anyone down.',
    solution: 'Expanded the brand\'s visual language. Created hundreds of social graphics, NFT art, pixel characters, infographics, pitchdecks, memes, motion. Everything RAD.',
    stack: ['Figma', 'Remotion', 'React', 'CSS', 'After Effects', 'Midjourney'],
    result: 'A brand that stays consistent across every touchpoint. From Twitter posts to hackathon booths.',
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
      '/content/wayy/deck-01.webp',
      '/content/wayy/deck-02.webp',
      '/content/wayy/deck-03.webp',
      '/content/wayy/deck-04.webp',
      '/content/wayy/deck-05.webp',
      '/content/wayy/deck-06.webp',
      '/content/wayy/deck-07.webp',
      '/content/wayy/deck-08.webp',
      '/content/wayy/deck-09.webp',
      '/content/wayy/deck-10.webp',
      '/content/wayy/deck-11.webp',
      '/content/wayy/deck-12.webp',
      '/content/wayy/deck-13.webp',
      '/content/wayy/deck-14.webp',
    ],
    previewGallery: [
      '/content/wayy/deck-01.webp',
      '/content/wayy/deck-02.webp',
      '/content/wayy/deck-03.webp',
      '/content/wayy/deck-06.webp',
    ],
    video: '/content/wayy/wayy-social.mp4',
    videoLabel: 'Social Launch Video',
    category: 'web',
    description: 'Built the first prototype with 2 devs. After a long pause, revamped the entire product into an art prediction market. Redesigned and rebuilt in 1 week. Founder.',
    brief: 'Take a prediction market concept from prototype to live Solana product. Twice.',
    challenge: 'Started this as a tool for covering all the needs of an on-chain creator. Built the first version with 2 developers, then put it on a shelf and forgot about it. The Solana Graveyard hackathon made me want to rework it. The whole product needed to be rethought as an art prediction market. New UI, new flows, new on-chain logic, and shipped fast.',
    solution: 'Redesigned and rebuilt the entire frontend in 1 week. Next.js 16, Prisma + MongoDB, Solana wallet adapter. Retro pixel design system with real-time battles, escrow wallets, and two-step transaction signing.',
    sections: [
      {
        title: 'Website UI',
        description: 'The live product interface. Contest browsing, sealed betting, leaderboards, artist profiles, and real-time battle views.',
        layout: 'landscape',
        gallery: [
          '/content/wayy/web-01.webp',
          '/content/wayy/web-02.webp',
          '/content/wayy/web-03.webp',
          '/content/wayy/web-04.webp',
          '/content/wayy/web-05.webp',
          '/content/wayy/web-06.webp',
          '/content/wayy/web-07.webp',
          '/content/wayy/web-08.webp',
          '/content/wayy/web-09.webp',
        ],
      },
    ],
    stack: ['Next.js', 'TypeScript', 'Prisma', 'MongoDB', 'Solana', 'Zustand', 'GSAP'],
    result: 'A live prediction market on Solana Devnet. From prototype to full product revamp.',
    resultMetric: 'Full product revamp in 1 week. Founder.'
  },
  {
    slug: 'hydex',
    title: 'Hydex',
    client: 'DeFi',
    tags: ['Pitch Deck', 'Presentation Design'],
    thumbnail: '/content/hydex-logo-white.png',
    color: '#34A853',
    gallery: [
      '/content/hydex/deck-01.webp',
      '/content/hydex/deck-02.webp',
      '/content/hydex/deck-03.webp',
      '/content/hydex/deck-04.webp',
      '/content/hydex/deck-05.webp',
      '/content/hydex/deck-06.webp',
      '/content/hydex/deck-07.webp',
      '/content/hydex/deck-08.webp',
      '/content/hydex/deck-09.webp',
      '/content/hydex/deck-10.webp',
      '/content/hydex/deck-11.webp',
      '/content/hydex/deck-12.webp',
      '/content/hydex/deck-13.webp',
      '/content/hydex/deck-14.webp',
      '/content/hydex/deck-15.webp',
    ],
    previewGallery: [
      '/content/hydex/deck-01.webp',
      '/content/hydex/deck-02.webp',
      '/content/hydex/deck-03.webp',
      '/content/hydex/deck-04.webp',
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
    client: 'Solana Portfolio Tracker — Mobile App',
    tags: ['Mobile App', 'React Native', 'Solana', 'Portfolio Tracker'],
    thumbnail: '/content/logos/fullport-briefcase.svg',
    color: '#1a1a2e',
    gallery: [
      '/content/fullport/slide-01.webp',
      '/content/fullport/slide-02.webp',
      '/content/fullport/slide-03.webp',
      '/content/fullport/slide-04.webp',
      '/content/fullport/slide-05.webp',
      '/content/fullport/slide-06.webp',
      '/content/fullport/slide-07.webp',
      '/content/fullport/slide-08.webp',
    ],
    previewGallery: [
      '/content/fullport/slide-01.webp',
      '/content/fullport/slide-02.webp',
      '/content/fullport/slide-03.webp',
      '/content/fullport/slide-04.webp',
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
