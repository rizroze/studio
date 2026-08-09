import { useEffect, useMemo, useRef, useState } from 'react'
import type { Discipline } from './disciplines'
import { disciplinePieces, thumb, videoPoster } from './disciplines'

// A piece's 240px preview. Videos stand in with the thumbnail of their poster
// frame, which the generator already writes alongside every .mp4.
const tile = (src: string) => thumb(/\.mp4$/i.test(src) ? videoPoster(src) : src)

// Which collection a piece belongs to, so the caption can name the section the
// visitor is currently inside without a second scroll-spy.
function sectionIndex(d: Discipline): Map<string, string> {
  const m = new Map<string, string>()
  d.collections.forEach((c) => {
    const label = c.label ?? c.section.title
    c.section.gallery.forEach((s) => m.set(s, label))
    if (c.video) m.set(c.video.src, label)
  })
  const motion = d.videosLabel ?? 'Motion'
  d.videos.forEach((v) => m.set(v.src, motion))
  return m
}

interface V2RailMapProps {
  discipline: Discipline
  onJump: (src: string) => void
}

// The rail's in-page nav, as a wall instead of a list. A three-item list of
// section names told you the shape of a discipline but hid its size; at 110
// pieces that omission is the whole story. These tiles are ~50px, far too
// small to browse — that's fine, this is a minimap. It answers "how much is
// here" and "where am I" at a glance, and clicking jumps to the piece.
export function V2RailMap({ discipline, onJump }: V2RailMapProps) {
  const pieces = useMemo(() => disciplinePieces(discipline), [discipline])
  const sections = useMemo(() => sectionIndex(discipline), [discipline])
  const [active, setActive] = useState(0)
  const gridRef = useRef<HTMLDivElement>(null)

  // Track the piece under the read line with one observer over a thin band,
  // rather than measuring every tile on every scroll frame — at 110 tiles that
  // would be 110 layout reads per frame.
  useEffect(() => {
    const seen = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)))
        if (!seen.size) return
        // the topmost of whatever is crossing the band
        let best: Element | null = null
        let bestTop = Infinity
        seen.forEach((el) => {
          const t = el.getBoundingClientRect().top
          if (t < bestTop) { bestTop = t; best = el }
        })
        const src = (best as Element | null)?.getAttribute('data-lbsrc')
        if (src) {
          const i = pieces.indexOf(src)
          if (i >= 0) setActive(i)
        }
      },
      { rootMargin: '-38% 0px -55% 0px', threshold: 0 },
    )
    // the discipline body mounts in the same commit, so query after paint
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll('.v2-main [data-lbsrc]').forEach((el) => io.observe(el))
    })
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [pieces])

  // keep the lit tile in view without dragging the page with it
  useEffect(() => {
    const el = gridRef.current?.children[active] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const label = sections.get(pieces[active]) ?? discipline.label

  return (
    <nav className="v2-rail-map">
      <span className="v2-rail-nav-head">
        {label}
        <span className="v2-rail-map-pos">{active + 1}/{pieces.length}</span>
      </span>
      {/* keyed on the discipline so the stagger replays on every tab switch —
          the wall reassembling is what makes the switch legible in the rail */}
      <div className="v2-rail-map-grid" ref={gridRef} key={discipline.id}>
        {pieces.map((src, i) => (
          <button
            key={`${src}-${i}`}
            className={`v2-rail-map-cell${i === active ? ' active' : ''}`}
            // capped so a 110-piece wall doesn't finish assembling nine seconds
            // after you arrived; past the cap they all land together
            style={{ animationDelay: `${Math.min(i, 40) * 14}ms` }}
            onClick={() => onJump(src)}
            aria-label={sections.get(src) ?? discipline.label}
          >
            <img src={tile(src)} alt="" loading="lazy" decoding="async" draggable={false} />
          </button>
        ))}
      </div>
    </nav>
  )
}
