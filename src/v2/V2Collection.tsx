import { useState, useEffect, useRef } from 'react'
import type { ProjectSection } from '../constants/projects'
import { V2Bento } from './V2Bento'
import { IMAGE_DIMS } from './imageDims'
import { med } from './disciplines'
import { useIsMobile } from './useMobile'
import { indexLabel } from './indexLabels'

interface V2CollectionProps {
  section: ProjectSection
  grid?: 'dense' | 'ratio'
  cols?: number
  onOpenImage: (images: string[], index: number) => void
}

export function V2Collection({ section, grid = 'ratio', cols, onOpenImage }: V2CollectionProps) {
  if (section.display === 'index') {
    return <IndexView section={section} onOpenImage={onOpenImage} />
  }
  if (grid === 'dense') {
    return <V2Bento gallery={section.gallery} cols={cols ?? 4} onOpenImage={onOpenImage} />
  }
  return <RatioGrid section={section} onOpenImage={onOpenImage} />
}

const markIn = (e: React.SyntheticEvent<HTMLImageElement>) => e.currentTarget.classList.add('in')
const refIn = (img: HTMLImageElement | null) => {
  if (img?.complete) requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('in')))
}

function RatioGrid({ section, onOpenImage }: V2CollectionProps) {
  return (
    <div className="v2-grid v2-grid-ratio">
      {section.gallery.map((src, i) => {
        const d = IMAGE_DIMS[src]
        return (
          <button
            key={src}
            className="v2-grid-item"
            data-lbsrc={src}
            onClick={() => onOpenImage(section.gallery, i)}
          >
            <img
              className="v2-fadeimg"
              ref={refIn}
              onLoad={markIn}
              src={med(src)}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              style={d ? { aspectRatio: `${d[0]} / ${d[1]}` } : undefined}
            />
          </button>
        )
      })}
    </div>
  )
}

function IndexView({ section, onOpenImage }: V2CollectionProps) {
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState<number | null>(null)
  const [scrolledIdx, setScrolledIdx] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  // hover wins when you point at a row; otherwise the preview tracks the scroll
  const active = hovered ?? scrolledIdx

  // scroll-spy: as the names scroll past a read line, the preview follows the
  // nearest one — so scrolling (not just hovering) updates the right side
  useEffect(() => {
    if (isMobile) return
    const main = document.querySelector('.v2-main')
    let ticking = false
    const update = () => {
      ticking = false
      const rows = Array.from(listRef.current?.children ?? []) as HTMLElement[]
      if (!rows.length) return
      const line = window.innerHeight * 0.42
      let best = 0, bestDist = Infinity
      rows.forEach((r, i) => {
        const rect = r.getBoundingClientRect()
        const d = Math.abs(rect.top + rect.height / 2 - line)
        if (d < bestDist) { bestDist = d; best = i }
      })
      setScrolledIdx(best)
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    update()
    main?.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      main?.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScroll)
    }
  }, [isMobile, section.gallery.length])

  // Make hover previews instant AND sharp: preload the med immediately (cheap —
  // it's the instant backdrop), then preload the full-res on idle so the sharp
  // image is already cached by the time you hover. Desktop only; mobile uses the
  // bento and shouldn't burn data on previews it never shows.
  useEffect(() => {
    if (isMobile) return
    const gallery = section.gallery
    gallery.forEach(src => { new Image().src = med(src) })
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }
    const run = () => gallery.forEach(src => { const im = new Image(); im.decoding = 'async'; im.src = src })
    const id = w.requestIdleCallback ? w.requestIdleCallback(run) : window.setTimeout(run, 300)
    return () => { if (w.cancelIdleCallback) w.cancelIdleCallback(id); else clearTimeout(id) }
  }, [isMobile, section.gallery])

  // on mobile the side-preview can't hover — show the work directly as an image grid
  if (isMobile) {
    return <V2Bento gallery={section.gallery} cols={4} onOpenImage={onOpenImage} />
  }

  return (
    <div className="v2-index-layout">
      <div
        className={`v2-index ${hovered !== null ? 'has-hover' : ''}`}
        ref={listRef}
        onMouseLeave={() => setHovered(null)}
      >
        {section.gallery.map((src, i) => (
          <button
            key={src}
            className={`v2-index-row ${active === i ? 'active' : ''}`}
            data-lbsrc={src}
            onMouseEnter={() => setHovered(i)}
            onClick={() => onOpenImage(section.gallery, i)}
          >
            <span className="v2-index-num">{String(i + 1).padStart(3, '0')}</span>
            <span className="v2-index-file">{indexLabel(src)}</span>
          </button>
        ))}
      </div>

      <div className="v2-index-preview-col">
        <div className="v2-index-preview" style={{ backgroundImage: `url("${med(section.gallery[active])}")` }}>
          {/* key per src so it remounts (transparent) instead of holding the
              previous full-res while the new one loads — the med backdrop fills
              the gap instantly, so the swap feels immediate */}
          <img key={section.gallery[active]} src={section.gallery[active]} alt="" decoding="async" />
        </div>
        <div className="v2-index-caption">{indexLabel(section.gallery[active])}</div>
      </div>
    </div>
  )
}
