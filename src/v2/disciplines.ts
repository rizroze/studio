import { CASE_STUDIES } from '../constants/projects'
import type { ProjectSection } from '../constants/projects'

export interface DisciplineCollection {
  project: string                 // project title, for the label
  section: ProjectSection         // the resolved section (gallery + display)
  grid: 'dense' | 'ratio'         // dense = fixed yeezy squares; ratio = masonry (native ratio)
  cols?: number                   // dense grids: columns across (default 4)
  label?: string                  // override the displayed collection title
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
  collections: DisciplineCollection[]
  videos: DisciplineVideo[]
  previewCols?: number     // homepage mosaic density (default 6)
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

// Taxonomy — reuses existing CASE_STUDIES sections, no new content.
export const DISCIPLINES: Discipline[] = [
  {
    id: 'direction',
    label: 'Direction',
    blurb: 'Content · Campaigns · Social',
    collections: [
      sec('radiants', 'Community & Events'),
      sec('radiants', 'Monolith 2026'),
      sec('radiants', 'Seeker Hackathon'),
    ],
    videos: [],
  },
  {
    id: 'design',
    label: 'Design',
    blurb: 'Brand · Illustration · Decks',
    collections: [
      sec('radiants', 'Brand Art', 'dense', 4),
      sec('radiants', 'PFP Art', 'dense', 8),
      { ...sec('hydex', 'Hydex'), label: 'Pitch Deck' },
      { ...sec('hydex', 'Hydex Router'), label: 'Pitch Deck — Router' },
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
      sec('wayy', 'Website UI'),
      sec('whatsfordinner', 'Landing Page'),
      sec('whatsfordinner', 'Onboarding Flow'),
      sec('whatsfordinner', 'Meal Plan Dashboard'),
    ],
    videos: [vid('wayy'), vid('fullport'), vid('whatsfordinner')],
  },
]

export function findDiscipline(id: string): Discipline | undefined {
  return DISCIPLINES.find(d => d.id === id)
}

// Low-res preview variant (240px .thumb.jpg generated alongside each webp).
// Falls back to the original for gif/svg (no thumbnail generated).
export function thumb(src: string): string {
  return src.replace(/\.(webp|png|jpe?g)$/i, '.thumb.jpg')
}

// Spread of images across a discipline's collections — for the homepage hover mosaic.
export function disciplineMosaic(d: Discipline, max = 12): string[] {
  const perCollection = Math.max(1, Math.ceil(max / d.collections.length))
  const picked: string[] = []
  d.collections.forEach(c => {
    picked.push(...c.section.gallery.slice(0, perCollection))
  })
  return picked.slice(0, max)
}
