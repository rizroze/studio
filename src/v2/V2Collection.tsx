import { useState } from 'react'
import type { ProjectSection } from '../constants/projects'
import { V2Bento } from './V2Bento'

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

function RatioGrid({ section, onOpenImage }: V2CollectionProps) {
  return (
    <div className="v2-grid v2-grid-ratio">
      {section.gallery.map((src, i) => (
        <button
          key={src}
          className="v2-grid-item"
          style={{ '--i': i } as React.CSSProperties}
          onClick={() => onOpenImage(section.gallery, i)}
        >
          <img src={src} alt="" loading="lazy" draggable={false} />
        </button>
      ))}
    </div>
  )
}

function IndexView({ section, onOpenImage }: V2CollectionProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const active = hovered ?? 0

  return (
    <div className="v2-index-layout">
      <div className={`v2-index ${hovered !== null ? 'has-hover' : ''}`}>
        {section.gallery.map((src, i) => (
          <button
            key={src}
            className={`v2-index-row ${active === i ? 'active' : ''}`}
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
