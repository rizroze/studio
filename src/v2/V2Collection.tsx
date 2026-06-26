import { useState } from 'react'
import type { ProjectSection } from '../constants/projects'
import { V2Bento } from './V2Bento'
import { IMAGE_DIMS } from './imageDims'
import { med } from './disciplines'
import { useIsMobile } from './useMobile'

interface V2CollectionProps {
  section: ProjectSection
  grid?: 'dense' | 'ratio'
  cols?: number
  onOpenImage: (images: string[], index: number) => void
}

function fileName(path: string): string {
  return (path.split('/').pop() || path).toUpperCase()
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
  const active = hovered ?? 0

  // on mobile the side-preview can't hover — show the work directly as an image grid
  if (isMobile) {
    return <V2Bento gallery={section.gallery} cols={4} onOpenImage={onOpenImage} />
  }

  return (
    <div className="v2-index-layout">
      <div className={`v2-index ${hovered !== null ? 'has-hover' : ''}`}>
        {section.gallery.map((src, i) => (
          <button
            key={src}
            className={`v2-index-row ${active === i ? 'active' : ''}`}
            data-lbsrc={src}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onOpenImage(section.gallery, i)}
          >
            <span className="v2-index-num">{String(i + 1).padStart(3, '0')}</span>
            <span className="v2-index-file">{fileName(src)}</span>
          </button>
        ))}
      </div>

      <div className="v2-index-preview-col">
        <div className="v2-index-preview">
          <img src={section.gallery[active]} alt="" />
        </div>
        <div className="v2-index-caption">{fileName(section.gallery[active])}</div>
      </div>
    </div>
  )
}
