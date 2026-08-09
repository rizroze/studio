import { findDiscipline } from './disciplines'

// The homepage. Six pieces, picked by hand, shown big and named — the old
// homepage showed four hover-swapped mosaics of ~15 anonymous thumbnails,
// which proved volume but never said what anything was or who it was for.
//
// This list is the only thing that decides what a first-time visitor sees, so
// it is deliberately a flat array of plain strings in one file: reordering the
// homepage is moving a block, not editing a component.
export interface FeaturedWork {
  /** the tile itself — a .webp still, or an .mp4 that autoplays muted in place */
  src: string
  /** what the piece is */
  title: string
  /** who it was for; omit for self-initiated work. Spell it exactly as the
      project title in CASE_STUDIES — that string is the key its logomark is
      looked up under. */
  client?: string
  /** discipline id the tile opens — must exist in DISCIPLINES */
  discipline: string
  /** one line: what it was, or what it did */
  note: string
  /** promote to a full-width band instead of a half-width tile */
  wide?: boolean
  /** override the frame's shape, e.g. 1 for a square piece or 16 / 9 for a
      wide one. Default is 4:3 for a tile and 16:9 for a `wide` band — the
      featured grid presents six pieces as equals, so it crops to a common
      shape rather than letting one tall piece set the height of a whole row
      (which is exactly how the old mosaic-free first draft read as broken). */
  ratio?: number
}

// PLACEHOLDER SELECTION — structure first, curation second. Every entry below
// points at a real file and renders correctly, but Riz picks the final six.
// Swapping one is a two-line edit: change `src` and the copy around it.
export const FEATURED_WORKS: FeaturedWork[] = [
  {
    src: '/content/wayy/web-01.webp',
    title: 'Website UI',
    client: 'WAYY',
    discipline: 'product',
    note: 'A prediction market for art, designed and built end to end and shipped inside a hackathon.',
  },
  {
    src: '/content/monolith/announcement-1.webp',
    title: 'Monolith 2026',
    client: 'Radiants',
    discipline: 'direction',
    note: "Solana Mobile's flagship event, $125K+ in prizes, 70+ pieces run end to end.",
  },
  {
    src: '/content/motion/radiants-twitter.mp4',
    title: 'Brand Introduction',
    client: 'Radiants',
    discipline: 'design',
    note: 'The identity introduced in motion: mark, type and palette assembled into one opening statement.',
  },
  {
    src: '/content/whatsfordinner/home-1.webp',
    title: 'Website & App',
    client: "What's for Dinner",
    discipline: 'product',
    note: 'A live meal-planning SaaS, designed, built and run solo across eleven languages.',
  },
  {
    src: '/content/design/maestro-one-place.webp',
    title: 'Brand Art',
    client: 'Maestro',
    discipline: 'design',
    note: 'Identity and product illustration for an agent-orchestration tool.',
  },
  {
    src: '/content/experiments/Frame 2085660679.webp',
    title: 'world.',
    discipline: 'experiments',
    note: 'From the daily reps. No brief, no client, no deadline but the next one.',
  },
]

// Fail loudly at import rather than rendering a tile whose arrow goes nowhere —
// same contract as sec()/vid() in disciplines.ts. A typo'd discipline id is
// otherwise invisible until someone clicks.
for (const w of FEATURED_WORKS) {
  if (!findDiscipline(w.discipline)) {
    throw new Error(`featured: "${w.title}" points at unknown discipline "${w.discipline}"`)
  }
}
