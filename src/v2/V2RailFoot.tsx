import type { ReactNode } from 'react'
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
    </div>
  )
}

// One line of third-party proof, anchoring the very bottom of the rail. The
// full set stays behind the References link just above it, so this is the
// teaser that makes anyone go look rather than a testimonial wall.
export function RailQuote() {
  return (
    <figure className="v2-rail-quote">
      <blockquote>
        "He's not just a designer or content creator, he's someone who actively
        helps shape how a project is perceived in the market."
      </blockquote>
      <figcaption>DEVOUR, CEO at Phase</figcaption>
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
