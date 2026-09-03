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
  /** what the piece is. Omit when the discipline tag at the end of the row
      already says it — the caption is a one-liner and "What's for Dinner ·
      Website & App · Product" is three labels for two facts. */
  title?: string
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
  /** scale the media inside its frame, to eat padding baked into the source.
      Screen mockups often export with a backdrop and a drop shadow around the
      artwork; on a white page that reads as a border on the tile rather than
      as part of the piece. Display only — the file itself is untouched, and
      the discipline page still shows it whole. */
  zoom?: number
}

export const FEATURED_WORKS: FeaturedWork[] = [
  {
    src: '/content/motion/flash-trade-social.mp4',
    // no title: the row ends in the Motion tag, and "Launch Film" next to it
    // was a third label for the same fact
    client: 'Flash Trade',
    // says what kind of motion, which this row's tag doesn't — it ends in
    // MOTION, not LAUNCH FILM. On the Motion wall the caption already says it,
    // so the note there is the one word this row can't carry.
    note: 'A self-initiated product launch film.',
  },
  {
    src: '/content/design/shaderweb.mp4',
    // the piece's name, not its category — the discipline tag on the right of
    // the same row already says Design, and "Brand Design · Design" said it twice
    title: 'Shaderweb',
    note: 'Brand assets that run instead of sitting in a folder. Live shaders, liftable as embeds.',
  },
  {
    src: '/content/hydex/hydex-social.mp4',
    title: 'Logo Animation',
    client: 'Hydex',
    note: 'Logo animation for the Hydex mark, built to open decks and social posts.',
  },
  {
    src: '/content/experiments/motion-01.mp4',
    title: 'world.',
    // the idea leads; the controls follow. The tile can't be played from here,
    // so opening on "drag to spin" was an instruction for a thing you can't do yet
    note: 'A globe that collects what one word means to people. Spin it, type, drop a pin.',
  },
  {
    src: '/content/experiments/Frame 2085660697.webp',
    title: 'Coinbase, redesigned',
    note: 'A redesign nobody asked for. It just felt like it should look this way.',
  },
  {
    src: '/content/monolith/announcement-1.webp',
    title: 'Solana Mobile',
    client: 'Radiants',
    note: "Solana Mobile's flagship event, $125K+ in prizes, 70+ pieces run end to end.",
  },
]

// Fail loudly at import rather than rendering a tile whose click goes nowhere.
// Same contract as sec()/vid() in disciplines.ts: a piece that isn't on any
// discipline page has no position to scroll to, and that is invisible until
// someone clicks it.
for (const w of FEATURED_WORKS) {
  if (!findPieceDiscipline(w.src)) {
    throw new Error(`featured: "${w.title ?? w.client ?? w.src}" (${w.src}) is not on any discipline page`)
  }
}
