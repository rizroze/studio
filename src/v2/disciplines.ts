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
  video?: DisciplineVideo         // plays directly under this collection, instead of the trailing block
  liveUrl?: string                // the shipped thing, reachable — rendered as a "Live" link
  spansRow?: string[]             // masonry only: srcs that break out as a full-width band
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

// Drop one `extra` in after every `every` items of `base`, so a handful of
// videos punctuate a long wall of stills instead of clustering. Anything left
// over once the stills run out is appended, so nothing is ever silently lost.
function weave(base: string[], extras: string[], every: number): string[] {
  const out: string[] = []
  let e = 0
  base.forEach((item, i) => {
    out.push(item)
    if ((i + 1) % every === 0 && e < extras.length) out.push(extras[e++])
  })
  return [...out, ...extras.slice(e)]
}

// The Design page opens with the work, not a client. My own pieces lead —
// Shaderweb, Maestro, Slickback, the pet UI — then the Radiants brand art
// follows in the same grid, uncredited here (it keeps its own section on the
// Radiants side). Masonry rather than the square bento: this set runs from
// 16:9 slides to a 4:5 poster to square art, and the motion sits inline at
// its own ratio instead of being cropped to a cell.
const DESIGN_OPENING: string[] = [
  '/content/design/shaderweb.mp4',
  '/content/design/maestro-one-place.webp',
  '/content/design/maestro-agent-queue.webp',
  '/content/design/shader-grid.mp4',
  '/content/design/maestro-agentic-orchestration.webp',
  '/content/design/maestro-mark.webp',
  '/content/design/shader-studio-post-processing.webp',
  '/content/design/perp-trading.mp4',
  '/content/design/slickback-menswear.webp',
  '/content/design/library.mp4',
  '/content/design/riz-jr-pet.webp',
  ...(CASE_STUDIES.find(p => p.slug === 'radiants')
    ?.sections?.find(s => s.title === 'Brand Art')?.gallery ?? []),
]

// The rest of the motion in Experiments. Videos aren't pipeline-handled, so
// they're declared here; the stills come from EXPERIMENTS_GALLERY.
const EXPERIMENTS_MOTION = [
  '/content/experiments/liquid-glass-opensource.mp4',
  '/content/experiments/radish-node.mp4',
  '/content/experiments/dimension-fm.mp4',
  '/content/experiments/gorilla.mp4',
  '/content/experiments/liquid-glass-nav.mp4',
  '/content/experiments/dot-spiral.mp4',
  '/content/experiments/arc.mp4',
  '/content/experiments/workspace.mp4',
]

// Experiments bento: the "world." motion piece leads as a full-width band
// (column-span: all breaks it out of the masonry columns — it has to come
// first or the cover would balance alone above it), then the "world." cover
// pinned by the pipeline, then the rest of the daily output.
//
// The remaining motion is woven through the stills rather than stacked behind
// them: ten videos in a row reads as a showreel, and the feed is meant to read
// as daily output with motion recurring as you scroll.
const EXPERIMENTS_BENTO = EXPERIMENTS_GALLERY.length
  ? ['/content/experiments/motion-01.mp4', ...weave(EXPERIMENTS_GALLERY, EXPERIMENTS_MOTION, 3)]
  : []

// Taxonomy — reuses existing CASE_STUDIES sections, no new content.
export const DISCIPLINES: Discipline[] = [
  {
    id: 'design',
    label: 'Design',
    blurb: 'Brand · Illustration · Decks',
    collections: [
      {
        project: '',             // no client label — this grid spans all of them
        label: 'Brand Art',
        section: {
          title: 'Brand Art',
          description: 'Illustration, photo treatment, product and identity work, across client brands and my own.',
          gallery: DESIGN_OPENING,
        },
        grid: 'ratio',
      },
      { ...sec('radiants', 'PFP Art', 'dense', 8), stats: '16 hand-drawn pixel portraits' },
      { ...sec('hydex', 'Hydex'), label: 'Pitch Deck' },
      { ...sec('hydex', 'Hydex Router'), label: 'Pitch Deck', project: 'Hydex Router' },
      sec('wayy', 'Pitch Deck'),
      sec('fullport', 'Pitch Deck'),
    ],
    videos: [],
  },
  // Motion was a video block at the foot of Design, which filed the launch work
  // as an afterthought to the stills. It's a discipline, so it gets a wall.
  // Second rather than first on purpose: DISCIPLINES[0] is the default works
  // tab and where /works and any unrecognized /works/<typo> land, and this is
  // the shortest page here — it shouldn't be the one a stray URL opens.
  {
    id: 'motion',
    label: 'Motion',
    blurb: 'Launch films · Logo animation · Titles',
    collections: [],
    // The page has one block, so its heading would otherwise repeat the h1.
    // 'Brand Motion' names the category instead, and it's what the rail minimap
    // captions these tiles with.
    videosLabel: 'Brand Motion',
    videos: [
      {
        project: 'Flash Trade',
        src: '/content/motion/flash-trade-social.mp4',
        label: 'Launch Film',
        // uncommissioned, and it says so: the client slot on this wall is how a
        // paid credit looks, and a reference check that finds no engagement
        // costs more than the disclosure ever could
        note: 'A self-initiated product launch film.',
      },
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
        liveUrl: CASE_STUDIES.find(p => p.slug === 'wayy')?.liveUrl,
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
        stats: 'Live SaaS · designed, built & run solo',
        liveUrl: CASE_STUDIES.find(p => p.slug === 'whatsfordinner')?.liveUrl,
        video: vid('whatsfordinner', 'A run through the product: generate a day from the hero, five-step onboarding, then the weekly plan with its grocery list.'),
      },
      {
        ...sec('corner', 'Landing Page'),
        stats: 'Human-verified publishing · founding edition live',
        liveUrl: CASE_STUDIES.find(p => p.slug === 'corner')?.liveUrl,
      },
      // Its own section rather than a tile in the Experiments feed: it's a
      // screen of body copy, illegible at column width, and leading a grid of
      // one is the only place a full-width band costs no gap.
      {
        project: '',
        label: 'Wikipedia, reimagined',
        section: {
          title: 'Wikipedia, reimagined',
          description: 'A concept, not a shipped product: the encyclopedia rebuilt around asking rather than searching. Text and image from Wikipedia (CC BY-SA).',
          gallery: ['/content/wikipedia/wikipedia.mp4'],
        },
        grid: 'ratio',
        spansRow: ['/content/wikipedia/wikipedia.mp4'],
      },
    ],
    // product walkthroughs, not motion-design work — that lives on /works/motion
    videosLabel: 'Walkthroughs',
    videos: [
      vid('fullport', 'Solana portfolio tracker for the Seeker phone, built solo in React Native and Expo. Balances, metadata and prices arrive in a single Helius DAS call. Working APK shipped inside the Monolith hackathon deadline.'),
    ],
  },
  {
    id: 'direction',
    label: 'Direction',
    blurb: 'Content · Campaigns · Social',
    collections: [
      { ...sec('radiants', 'Community & Events'), stats: '2024–2026 · 2 hackathon campaigns' },
      { ...sec('radiants', 'Monolith 2026'), stats: 'Solana Mobile flagship event · $125K+ prize pool' },
      { ...sec('radiants', 'Seeker Hackathon'), stats: '+500 signups, launch to close' },
    ],
    videos: [],
  },
  // Experiments — daily creative output. Self-gating: the tile only appears
  // once images exist (drop them in public/content/experiments/ + `npm run
  // experiments`). Justified bento keeps every native ratio, fits them all.
  ...(EXPERIMENTS_GALLERY.length ? [{
    id: 'experiments',
    label: 'Experiments',
    blurb: 'Self-initiated · Daily · Studies',
    description: 'Daily reps, no client brief. Some become ads. The rest just keep the hand sharp.',
    collections: [{
      ...standalone('Experiments', EXPERIMENTS_BENTO, 'ratio'),
      // Only the piece that LEADS the feed can span the row: `column-span: all`
      // forces a column break, so anything further down leaves the columns above
      // it stopped short and a band of white across the grid.
      spansRow: ['/content/experiments/motion-01.mp4'],
    }],
    videos: [],
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

// Every piece on a discipline page, in render order: collection galleries, any
// video pinned under a collection, then the trailing motion block. This is the
// list the rail minimap draws and the homepage resolves clicks against, so it
// has to match what V2Discipline actually renders.
export function disciplinePieces(d: Discipline): string[] {
  const out: string[] = []
  d.collections.forEach(c => {
    out.push(...c.section.gallery)
    if (c.video) out.push(c.video.src)
  })
  d.videos.forEach(v => out.push(v.src))
  return out
}

// Where a given piece lives. The homepage stores only a src per featured work
// and looks the discipline up here, so a tile can never advertise one wall and
// open another.
export function findPieceDiscipline(src: string): Discipline | undefined {
  return DISCIPLINES.find(d => disciplinePieces(d).includes(src))
}
