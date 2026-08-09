import { findPieceDiscipline } from './disciplines'

// The homepage. Six pieces, picked by hand, shown big and named — the old
// homepage showed four hover-swapped mosaics of ~15 anonymous thumbnails,
// which proved volume but never said what anything was or who it was for.
//
// This list is the only thing that decides what a first-time visitor sees, so
// it is deliberately a flat array in one file: reordering the homepage is
// moving a block, not editing a component.
export interface FeaturedWork {
  /** the piece — must be a src that already appears on a discipline page.
      Which discipline, and where in it, is looked up from this string, so a
      tile can never advertise one wall and open another. */
  src: string
  /** what the piece is */
  title: string
  /** who it was for; omit for self-initiated work. Spell it exactly as the
      project title in CASE_STUDIES — that string is the key its logomark is
      looked up under. */
  client?: string
  /** one line: what it was, or what it did */
  note: string
  /** promote to a full-width band instead of a half-width tile */
  wide?: boolean
  /** override the frame's shape. Default is the piece's own aspect ratio. */
  ratio?: number
}

export const FEATURED_WORKS: FeaturedWork[] = [
  {
    src: '/content/design/shaderweb.mp4',
    title: 'Shader Studio',
    note: 'A wall of live shaders, each one liftable as an embed.',
  },
  {
    src: '/content/monolith/announcement-1.webp',
    title: 'Monolith 2026',
    client: 'Radiants',
    note: "Solana Mobile's flagship event, $125K+ in prizes, 70+ pieces run end to end.",
  },
  {
    src: '/content/experiments/motion-01.mp4',
    title: 'world.',
    note: 'Drag to spin, type to drop a pin. A globe that collects what one word means to people.',
  },
  {
    src: '/content/whatsfordinner/home-1.webp',
    title: 'Website & App',
    client: "What's for Dinner",
    note: 'A live meal-planning SaaS, designed, built and run solo across eleven languages.',
  },
  {
    src: '/content/hydex/hydex-social.mp4',
    title: 'Logo Animation',
    client: 'Hydex',
    note: 'Logo animation for the Hydex mark, built to open decks and social posts.',
  },
  {
    src: '/content/experiments/Frame 2085660697.webp',
    title: 'Coinbase, restaged',
    note: 'An unsolicited redraw from the daily reps. No brief, no client.',
  },
]

// Fail loudly at import rather than rendering a tile whose click goes nowhere.
// Same contract as sec()/vid() in disciplines.ts: a piece that isn't on any
// discipline page has no position to scroll to, and that is invisible until
// someone clicks it.
for (const w of FEATURED_WORKS) {
  if (!findPieceDiscipline(w.src)) {
    throw new Error(`featured: "${w.title}" (${w.src}) is not on any discipline page`)
  }
}
