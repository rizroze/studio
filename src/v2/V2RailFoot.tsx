import { useEffect, useState, type ReactNode } from 'react'
import { V2Loader } from './V2Loader'
import { V2Music } from './V2Music'

// References / Lab links. Desktop: in the rail foot. Mobile: up in the rail
// (home only), so a discipline view shows neither.
export function RailLinks({ onOpenReferences, onOpenLab }: { onOpenReferences: () => void; onOpenLab: () => void }) {
  return (
    <div className="v2-rail-links">
      <button className="v2-rail-link" onClick={onOpenReferences}>References</button>
      <button className="v2-rail-link" onClick={onOpenLab}>
        Lab
        <svg className="v2-lab-icon" viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6.7 2.3h2.6L9.1 5.4l3.2 6.8H3.7l3.2-6.8z" />
          <path d="M5.1 10h5.8" />
        </svg>
      </button>
      <a
        className="v2-rail-link"
        href="https://x.com/rizzytoday"
        target="_blank"
        rel="noopener noreferrer"
      >X</a>
    </div>
  )
}

// Third-party proof anchoring the bottom of the rail. Two citations on a slow
// rotator; the full set stays behind the References link just above, so this
// reads as a citation rather than a testimonial wall.
//
// Trimmed here rather than pulled from constants/testimonials.ts on purpose:
// the full quotes are three times too long for this slot, and each one needs
// its own pull-line. Keep them in sync by hand if the source quotes change.
//
// DEVOUR leads and never rotates out of the first-load slot — his line is
// about how the market perceives a project, which is the positioning. The
// other is craft praise, which sits lower.
const RAIL_QUOTES = [
  {
    quote:
      "He's not just a designer or content creator, he's someone who actively " +
      'helps shape how a project is perceived in the market.',
    cite: 'DEVOUR, CEO at Phase',
  },
  {
    quote:
      'Whether I have a strong idea of what I need or just a rough concept, he ' +
      'always delivers a professional grade product.',
    cite: 'Jerk Terror, CEO at Hydex',
  },
]

const ROTATE_MS = 9000
// half a dissolve. Long enough to read as a change of mind rather than a cut,
// and it runs twice per swap, so the whole thing takes ROTATE_MS's tail.
const FADE_MS = 420

export function RailQuote() {
  const [i, setI] = useState(0)
  // the quote actually on screen. It lags `i` by one fade so the words never
  // change while they are visible — a keyed remount cut the old one dead and
  // slid the new one in, which read as a jump rather than a transition
  const [shown, setShown] = useState(0)
  const [out, setOut] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (i === shown) return
    setOut(true)
    const t = window.setTimeout(() => {
      setShown(i)
      setOut(false)
    }, FADE_MS)
    return () => window.clearTimeout(t)
  }, [i, shown])

  // Auto-advance, unless hovered or the reader asked for less motion. Reading
  // a quote is the one thing on this page you can lose by having it move.
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(
      () => setI(n => (n + 1) % RAIL_QUOTES.length),
      ROTATE_MS,
    )
    return () => window.clearInterval(t)
  }, [paused])

  const go = (d: number) =>
    setI(n => (n + d + RAIL_QUOTES.length) % RAIL_QUOTES.length)
  const q = RAIL_QUOTES[shown]

  return (
    <figure
      className="v2-rail-quote"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`v2-rail-quote-slide${out ? ' is-out' : ''}`}>
        <blockquote>{q.quote}</blockquote>
        <figcaption>{q.cite}</figcaption>
      </div>
      <div className="v2-rail-quote-nav">
        <button type="button" onClick={() => go(-1)} aria-label="Previous quote">←</button>
        <button type="button" onClick={() => go(1)} aria-label="Next quote">→</button>
      </div>
    </figure>
  )
}

// The rail's bottom cluster: an optional lead block, then loader + Sound, then
// whatever trailing blocks the caller passes (RailLinks + RailQuote on desktop,
// RailQuote on mobile home). Rendered inside the rail on desktop; at the bottom
// of the page on mobile (single instance — V2Music owns audio state).
export function V2RailFoot({ children }: { children?: ReactNode }) {
  return (
    <div className="v2-rail-bottom">
      <div className="v2-rail-aux">
        <V2Loader />
        <V2Music />
      </div>
      {children}
    </div>
  )
}
