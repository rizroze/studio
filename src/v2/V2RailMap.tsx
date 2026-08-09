import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Discipline } from './disciplines'
import { med, thumb, videoPoster } from './disciplines'
import { IMAGE_DIMS } from './imageDims'

// A piece's 240px preview. Videos stand in with the thumbnail of their poster
// frame, which the generator already writes alongside every .mp4.
const still = (src: string) => (/\.mp4$/i.test(src) ? videoPoster(src) : src)
const tile = (src: string) => thumb(still(src))

// Hovering a 45px tile should tell you what it is. The card is portalled to the
// body because the grid scrolls (overflow clips) and the rail is narrow, so the
// preview has to live outside both.
type Peek = { src: string; top: number; left: number }

function PeekCard({ peek }: { peek: Peek }) {
  const dims = IMAGE_DIMS[still(peek.src)]
  const W = 260
  const h = dims ? (W * dims[1]) / dims[0] : W * 0.7
  const top = Math.min(Math.max(peek.top - h / 2, 12), window.innerHeight - h - 12)
  return createPortal(
    <div className="v2-rail-peek" style={{ left: peek.left, top, width: W }}>
      <img src={med(still(peek.src))} alt="" style={{ aspectRatio: dims ? `${dims[0]} / ${dims[1]}` : undefined }} />
    </div>,
    document.body,
  )
}

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

// Tiles in the order they are actually seen, with where each one sits in the
// scrolling content. Gallery order is NOT that order: the masonry grid is CSS
// multi-column, which fills column one top to bottom before starting column
// two, so gallery item 2 can sit two thirds of the way down the page next to
// item 40. A minimap in gallery order lights up cells at random as you scroll.
type Row = { src: string; top: number }

function measure(main: HTMLElement): Row[] {
  const base = main.getBoundingClientRect().top - main.scrollTop
  const rows = Array.from(main.querySelectorAll('[data-lbsrc]')).map((el) => {
    const r = el.getBoundingClientRect()
    return { src: el.getAttribute('data-lbsrc') as string, top: r.top - base, left: r.left }
  })
  // group into visual bands before sorting left to right, or two tiles whose
  // tops differ by a pixel would order by that pixel instead of by column
  rows.sort((a, b) => Math.round(a.top / 24) - Math.round(b.top / 24) || a.left - b.left)
  return rows.map(({ src, top }) => ({ src, top }))
}

interface V2RailMapProps {
  discipline: Discipline
  onJump: (src: string) => void
}

// The rail's in-page nav, as a wall instead of a list. A three-item list of
// section names told you the shape of a discipline but hid its size; at 110
// pieces that omission is the whole story. These tiles are ~45px, far too
// small to browse — that's fine, this is a minimap. It answers "how much is
// here" and "where am I" at a glance, and clicking jumps to the piece.
export function V2RailMap({ discipline, onJump }: V2RailMapProps) {
  const sections = useMemo(() => sectionIndex(discipline), [discipline])
  const [rows, setRows] = useState<Row[]>([])
  const [active, setActive] = useState(0)
  const [peek, setPeek] = useState<Peek | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Measure once per layout rather than per scroll frame. Positions can't move
  // while you scroll, and every tile's box is fixed by an inline aspect-ratio
  // before its image decodes, so one pass after paint is enough — 110 live
  // getBoundingClientRect calls per frame is not a thing worth doing.
  useEffect(() => {
    const main = document.querySelector('.v2-main') as HTMLElement | null
    if (!main) return
    let raf = requestAnimationFrame(() => setRows(measure(main)))
    // column count changes with width, which reshuffles the whole visual order
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setRows(measure(main)))
    })
    ro.observe(main)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [discipline])

  // With the rows in visual order, "where am I" is the last one whose top has
  // passed the read line — monotonic with scroll, so the marker walks the wall
  // instead of hopping around it.
  useEffect(() => {
    const main = document.querySelector('.v2-main') as HTMLElement | null
    if (!main || !rows.length) return
    let ticking = false
    const update = () => {
      ticking = false
      const line = main.scrollTop + window.innerHeight * 0.35
      let i = 0
      while (i + 1 < rows.length && rows[i + 1].top <= line) i++
      setActive(i)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    main.addEventListener('scroll', onScroll, { passive: true })
    return () => main.removeEventListener('scroll', onScroll)
  }, [rows])

  // keep the lit tile in view without dragging the page with it
  useEffect(() => {
    const el = gridRef.current?.children[active] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!rows.length) return <nav className="v2-rail-map" />

  const label = sections.get(rows[active]?.src) ?? discipline.label

  return (
    <nav className="v2-rail-map">
      <span className="v2-rail-nav-head">
        {label}
        <span className="v2-rail-map-pos">{active + 1}/{rows.length}</span>
      </span>
      {/* keyed on the discipline so the stagger replays on every tab switch —
          the wall reassembling is what makes the switch legible in the rail */}
      <div
        className="v2-rail-map-grid"
        ref={gridRef}
        key={discipline.id}
        onMouseLeave={() => setPeek(null)}
      >
        {rows.map((row, i) => (
          <button
            key={`${row.src}-${i}`}
            className={`v2-rail-map-cell${i === active ? ' active' : ''}`}
            // capped so a 110-piece wall doesn't finish assembling nine seconds
            // after you arrived; past the cap they all land together
            style={{ animationDelay: `${Math.min(i, 40) * 14}ms` }}
            onClick={() => onJump(row.src)}
            onMouseEnter={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              // anchored to the rail's right edge, not the tile's, so the card
              // doesn't jitter sideways as you sweep across a row
              const rail = e.currentTarget.closest('.v2-rail')?.getBoundingClientRect()
              setPeek({ src: row.src, top: r.top + r.height / 2, left: (rail?.right ?? r.right) + 14 })
            }}
            aria-label={sections.get(row.src) ?? discipline.label}
          >
            <img src={tile(row.src)} alt="" loading="lazy" decoding="async" draggable={false} />
          </button>
        ))}
      </div>
      {peek && <PeekCard peek={peek} />}
    </nav>
  )
}
