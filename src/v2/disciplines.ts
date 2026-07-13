import { CASE_STUDIES } from '../constants/projects'
import type { ProjectSection } from '../constants/projects'
import { EXPERIMENTS_GALLERY } from './experiments'

export interface DisciplineCollection {
  project: string                 // project title, for the label ('' = standalone, no label row)
  section: ProjectSection         // the resolved section (gallery + display)
  grid: 'dense' | 'ratio' | 'justified'  // dense = fixed yeezy squares; ratio = masonry; justified = full-width rows, native ratio, no crop
  cols?: number                   // dense grids: columns across (default 4)
  label?: string                  // override the displayed collection title
  stats?: string                  // outcome line — verifiable numbers only, ' · ' separated
}

export interface DisciplineVideo {
  project: string
  src: string
  label: string
}

export interface Discipline {
  id: string
  label: string
  blurb: string            // the range, shown as caption
  description?: string     // a longer line under the blurb on the discipline page
  collections: DisciplineCollection[]
  videos: DisciplineVideo[]
  previewCols?: number     // homepage mosaic density (default 6)
  previewRatio?: boolean   // homepage mosaic respects native ratios (masonry) instead of square crop
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

function vid(slug: string): DisciplineVideo {
  const project = CASE_STUDIES.find(p => p.slug === slug)
  if (!project?.video) throw new Error(`disciplines: missing video ${slug}`)
  return { project: project.title, src: project.video, label: project.videoLabel ?? 'Motion' }
}

// Standalone gallery not tied to a CASE_STUDIES project (e.g. Experiments).
// project: '' so V2Discipline skips the "Project — Title" label row.
function standalone(title: string, gallery: string[], grid: 'dense' | 'ratio' | 'justified' = 'justified'): DisciplineCollection {
  return { project: '', section: { title, description: '', gallery }, grid }
}

// Taxonomy — reuses existing CASE_STUDIES sections, no new content.
export const DISCIPLINES: Discipline[] = [
  {
    id: 'direction',
    label: 'Direction',
    blurb: 'Content · Campaigns · Social',
    collections: [
      { ...sec('radiants', 'Community & Events'), stats: '2024–2026 · weekly cadence · RadSpaces to ep. 57 · one cohesive brand' },
      { ...sec('radiants', 'Monolith 2026'), stats: 'Solana Mobile flagship event · $125K+ prize pool · +132 pieces end-to-end' },
      { ...sec('radiants', 'Seeker Hackathon'), stats: '+500 signups · +230 pieces, launch to end' },
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
      { ...sec('hydex', 'Hydex'), label: 'Pitch Deck' },
      { ...sec('hydex', 'Hydex Router'), label: 'Pitch Deck', project: 'Hydex Router' },
      sec('wayy', 'Pitch Deck'),
      sec('fullport', 'Pitch Deck'),
    ],
    videos: [
      { project: 'Radiants', src: '/content/motion/radiants-twitter.mp4', label: 'Social Motion' },
      { project: 'WE', src: '/content/motion/we-split.mp4', label: 'Split Animation' },
      { project: 'Cloak', src: '/content/motion/cloak-socials.mp4', label: 'Social Motion' },
      vid('hydex'),
    ],
  },
  {
    id: 'product',
    label: 'Product',
    blurb: 'Interfaces · Apps · Shipped',
    previewCols: 4,
    collections: [
      { ...sec('wayy', 'Website UI'), stats: 'Solana prediction market · design to deployment' },
      { ...sec('whatsfordinner', 'Landing Page'), stats: 'Live SaaS · designed, built & run solo · 11 languages' },
      sec('whatsfordinner', 'Onboarding Flow'),
      sec('whatsfordinner', 'Meal Plan Dashboard'),
    ],
    videos: [vid('wayy'), vid('fullport'), vid('whatsfordinner')],
  },
  // Experiments — daily creative output. Self-gating: the tile only appears
  // once images exist (drop them in public/content/experiments/ + `npm run
  // experiments`). Justified bento keeps every native ratio, fits them all.
  ...(EXPERIMENTS_GALLERY.length ? [{
    id: 'experiments',
    label: 'Experiments',
    blurb: 'Daily · Studies · Ads',
    description: 'Daily reps. Some become ads. The rest just keep the hand sharp.',
    previewRatio: true,
    collections: [standalone('Experiments', EXPERIMENTS_GALLERY, 'ratio')],
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

// Spread of images across a discipline's collections — for the homepage hover
// mosaic. Includes motion via poster stills so the videos show up too.
export function disciplineMosaic(d: Discipline, max = 12): string[] {
  const perCollection = Math.max(1, Math.ceil(max / d.collections.length))
  const picked: string[] = []
  d.collections.forEach(c => {
    picked.push(...c.section.gallery.slice(0, perCollection))
  })
  d.videos.forEach(v => picked.push(videoPoster(v.src)))
  return picked.slice(0, max)
}
