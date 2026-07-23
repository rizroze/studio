import { CASE_STUDIES } from '../constants/projects'
import type { ProjectSection } from '../constants/projects'
import { EXPERIMENTS_GALLERY } from './experiments'

export interface DisciplineCollection {
  project: string                 // project title, for the label ('' = standalone, no label row)
  section: ProjectSection         // the resolved section (gallery + display)
  grid: 'dense' | 'ratio'         // dense = fixed yeezy squares; ratio = masonry (native ratio)
  cols?: number                   // dense grids: columns across (default 4)
  label?: string                  // override the displayed collection title
  stats?: string                  // outcome line — verifiable numbers only, ' · ' separated
  previewImages?: string[]        // homepage-mosaic picks for this collection (else section.gallery)
  video?: DisciplineVideo         // plays directly under this collection, instead of the trailing block
}

export interface DisciplineVideo {
  project: string
  src: string
  label: string
  note?: string            // one-line description under the caption
}

export interface Discipline {
  id: string
  label: string
  blurb: string            // the range, shown as caption
  description?: string     // a longer line under the blurb on the discipline page
  collections: DisciplineCollection[]
  videos: DisciplineVideo[]
  videosLabel?: string     // heading for the video block (default 'Motion')
  previewCols?: number     // homepage mosaic density (default 6)
  previewImages?: string[] // hand-picked homepage mosaic (overrides the auto per-collection spread)
}

// Pull a section out of a project by title
function sec(slug: string, title: string, grid: 'dense' | 'ratio' = 'ratio', cols?: number): DisciplineCollection {
  const project = CASE_STUDIES.find(p => p.slug === slug)
  const section = project?.sections?.find(s => s.title === title)
  if (!project || !section) {
    throw new Error(`disciplines: missing ${slug} / ${title}`)
  }
  return { project: project.title, section, grid, cols }
}

function vid(slug: string, note?: string): DisciplineVideo {
  const project = CASE_STUDIES.find(p => p.slug === slug)
  if (!project?.video) throw new Error(`disciplines: missing video ${slug}`)
  return { project: project.title, src: project.video, label: project.videoLabel ?? 'Motion', note }
}

// Standalone gallery not tied to a CASE_STUDIES project (e.g. Experiments).
// project: '' so V2Discipline skips the "Project — Title" label row.
function standalone(title: string, gallery: string[], grid: 'dense' | 'ratio' = 'ratio'): DisciplineCollection {
  return { project: '', section: { title, description: '', gallery }, grid }
}

// Fold several sections of one project into a single collection. The discipline
// page prints the project name on every collection, so a project split into
// three sections reads as three separate projects in the list. Galleries are
// pulled from CASE_STUDIES so projects.ts stays the source of truth — the
// project page keeps its own finer-grained section breakdown.
// `description` is required rather than optional: the merged section replaces
// the source sections' own copy, and leaving it empty silently strips the
// blurb from the discipline page (V2Discipline only renders it when non-empty).
function merge(slug: string, titles: string[], label: string, description: string, grid: 'dense' | 'ratio' = 'ratio'): DisciplineCollection {
  const project = CASE_STUDIES.find(p => p.slug === slug)
  if (!project) throw new Error(`disciplines: missing ${slug}`)
  const gallery = titles.flatMap(t => {
    const section = project.sections?.find(s => s.title === t)
    if (!section) throw new Error(`disciplines: missing ${slug} / ${t}`)
    return section.gallery
  })
  return { project: project.title, section: { title: label, description, gallery }, grid }
}

// Experiments bento: the "world." motion piece leads as a full-width band
// (column-span: all breaks it out of the masonry columns — it has to come
// first or the cover would balance alone above it), then the "world." cover
// pinned by the pipeline, then the rest of the daily output.
const EXPERIMENTS_BENTO = EXPERIMENTS_GALLERY.length
  ? ['/content/experiments/motion-01.mp4', ...EXPERIMENTS_GALLERY]
  : []

// Taxonomy — reuses existing CASE_STUDIES sections, no new content.
export const DISCIPLINES: Discipline[] = [
  {
    id: 'direction',
    label: 'Direction',
    blurb: 'Content · Campaigns · Social',
    collections: [
      { ...sec('radiants', 'Community & Events'), stats: '2024–2026 · weekly cadence · one cohesive brand' },
      { ...sec('radiants', 'Monolith 2026'), stats: 'Solana Mobile flagship event · $125K+ prize pool · +70 pieces end-to-end' },
      { ...sec('radiants', 'Seeker Hackathon'), stats: '+500 signups · +110 pieces, launch to end' },
    ],
    videos: [],
  },
  {
    id: 'design',
    label: 'Design',
    blurb: 'Brand · Illustration · Decks',
    collections: [
      { ...sec('radiants', 'Brand Art', 'dense', 4), stats: '2+ years · hundreds of pieces across every format' },
      { ...sec('radiants', 'PFP Art', 'dense', 8), stats: '16 hand-drawn pixel portraits' },
      // mosaic leads with the "How Hydex Works" 3-layer architecture slide
      // (deck-06) instead of the bridge cover — the deck page order is untouched
      { ...sec('hydex', 'Hydex'), label: 'Pitch Deck', previewImages: [
        '/content/hydex-brand/deck-06.webp',
        '/content/hydex-brand/deck-02.webp',
        '/content/hydex-brand/deck-03.webp',
      ] },
      { ...sec('hydex', 'Hydex Router'), label: 'Pitch Deck', project: 'Hydex Router' },
      sec('wayy', 'Pitch Deck'),
      sec('fullport', 'Pitch Deck'),
    ],
    videosLabel: 'Motion Design',
    videos: [
      {
        project: 'Radiants',
        src: '/content/motion/radiants-twitter.mp4',
        label: 'Brand Introduction',
        note: 'The identity introduced in motion: mark, type and palette assembled into one opening statement, cut for social.',
      },
      {
        project: 'WeSplit',
        src: '/content/motion/we-split.mp4',
        label: 'Logo Animation',
        note: 'The WeSplit mark building and splitting, the product idea carried by the logo itself.',
      },
      {
        project: 'Cloak',
        src: '/content/motion/cloak-socials.mp4',
        label: 'Launch Teaser',
        note: 'Launch teaser cut for social, holding the reveal until the last beat.',
      },
      {
        ...vid('hydex', 'Logo animation for the Hydex mark, built to open decks and social posts.'),
        label: 'Logo Animation', // overrides the project's default 'Brand Motion'
      },
    ],
  },
  {
    id: 'product',
    label: 'Product',
    blurb: 'Interfaces · Apps · Shipped',
    // each project's walkthrough plays right under its own screens; only
    // Fullport, which has no stills here, falls through to the trailing block
    collections: [
      {
        ...sec('wayy', 'Website UI'),
        stats: 'Solana prediction market · design to deployment',
        video: vid('wayy', 'Designed and built end to end. Next.js and MongoDB, wallet sign-in, and a two-step signing flow that escrows every bet on-chain and pays the winners back out. Shipped for the Solana Graveyard Hackathon.'),
      },
      // landing + onboarding + dashboard as one set: split across three
      // collections it read as three separate projects in the list and the nav
      {
        ...merge(
          'whatsfordinner',
          ['Landing Page', 'Onboarding Flow', 'Meal Plan Dashboard'],
          'Website & App',
          "An AI meal planner that turns a few preferences into a week of meals, recipes and a grocery list. Designed, built and run solo end to end: marketing site, onboarding, dashboard, billing, and a Sunday cron that regenerates every subscriber's plan.",
        ),
        stats: 'Live SaaS · designed, built & run solo · 11 languages',
        video: vid('whatsfordinner', 'A run through the product: generate a day from the hero, five-step onboarding, then the weekly plan with its grocery list.'),
      },
    ],
    // product walkthroughs, not motion-design work — Design keeps 'Motion'
    videosLabel: 'Walkthroughs',
    videos: [
      vid('fullport', 'Solana portfolio tracker for the Seeker phone, built solo in React Native and Expo. Balances, metadata and prices arrive in a single Helius DAS call. Working APK shipped inside the Monolith hackathon deadline.'),
    ],
  },
  // Experiments — daily creative output. Self-gating: the tile only appears
  // once images exist (drop them in public/content/experiments/ + `npm run
  // experiments`). Justified bento keeps every native ratio, fits them all.
  ...(EXPERIMENTS_GALLERY.length ? [{
    id: 'experiments',
    label: 'Experiments',
    blurb: 'Self-initiated · Daily · Studies',
    description: 'Daily reps, no client brief. Some become ads. The rest just keep the hand sharp.',
    collections: [standalone('Experiments', EXPERIMENTS_BENTO, 'ratio')],
    videos: [],
    // hand-picked teaser: the full daily wall clusters the WeSplit campaign, so
    // the homepage mosaic spreads subjects/colors and keeps WeSplit to a few.
    // The two coinbase pieces (laptop mockup + "Everything") sit up top as the
    // blue anchors; capped at 15 desktop / 16 mobile, so both always land inside.
    previewImages: [
      '/content/experiments/Frame 2085660679.webp', // world. — teal globe cover
      '/content/experiments/motion-01.mp4',         // world. motion companion (poster still)
      '/content/experiments/Frame 2085660700.webp', // coinbase — laptop mockup (blue)
      '/content/experiments/Frame 2085660639.webp', // Zcash Phoenix +771% — orange
      '/content/experiments/Frame 7 1.webp',        // WeSplit — last supper (green)
      '/content/experiments/Frame 2085660660.webp', // BREAKPOINT — purple
      '/content/experiments/Frame 2085660648.webp', // Early is a state of mind — sunset
      '/content/experiments/Frame 2085660694.webp', // coinbase — Everything (blue)
      '/content/experiments/Frame 2085660667.webp', // Palantir — b&w
      '/content/experiments/Frame 2085660633.webp', // Phantom — trading tools (purple)
      '/content/experiments/Frame 2085660627.webp', // Breakpoint London — crowd
      '/content/experiments/Frame 4 1.webp',        // WeSplit — collage (b&w)
      '/content/experiments/Frame 2085660642.webp', // sunrise — phone cases (color)
      '/content/experiments/Frame 2085660631.webp', // TIME / Helius — b&w
      '/content/experiments/Frame 2085660656.webp', // Breakpoint pass — red
      '/content/experiments/Frame 2085660646.webp', // sunrise — keychain (pink)
      '/content/experiments/Frame 2085660659.webp', // I ♥ London VIP — purple
    ],
  } satisfies Discipline] : []),
]

export function findDiscipline(id: string): Discipline | undefined {
  return DISCIPLINES.find(d => d.id === id)
}

// Low-res preview variant (240px .thumb.jpg generated alongside each webp).
// Falls back to the original for gif/svg (no thumbnail generated).
export function thumb(src: string): string {
  return src.replace(/\.(webp|png|jpe?g)$/i, '.thumb.jpg')
}

// Medium variant (640px .med.jpg) for grid display — fast decode, sharp enough.
// Full-res original is still used in the lightbox. Animated gifs kept as-is.
export function med(src: string): string {
  return src.replace(/\.webp$/i, '.med.jpg')
}

// Poster still for a video (a frame grabbed at build time) so motion can
// appear in the image-only previews.
export function videoPoster(src: string): string {
  return src.replace(/\.mp4$/i, '-poster.webp')
}

// Spread of images across a discipline's collections — for the homepage hover
// mosaic. Includes motion via poster stills so the videos show up too.
export function disciplineMosaic(d: Discipline, max = 12): string[] {
  // hand-curated override (kept separate from the deck/gallery narrative order)
  if (d.previewImages?.length) {
    return d.previewImages.slice(0, max).map(s => (/\.mp4$/i.test(s) ? videoPoster(s) : s))
  }
  const perCollection = Math.max(1, Math.ceil(max / d.collections.length))
  const picked: string[] = []
  d.collections.forEach(c => {
    // a gallery may hold a video (Experiments) — show its poster still, not the mp4
    const src = c.previewImages ?? c.section.gallery
    picked.push(...src.slice(0, perCollection).map(s => (/\.mp4$/i.test(s) ? videoPoster(s) : s)))
  })
  d.videos.forEach(v => picked.push(videoPoster(v.src)))
  return picked.slice(0, max)
}
