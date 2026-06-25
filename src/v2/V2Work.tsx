import { useState } from 'react'
import { DISCIPLINES, disciplineMosaic, thumb } from './disciplines'
import { V2Mosaic } from './V2Mosaic'

interface V2WorkProps {
  onOpenDiscipline: (id: string) => void
}

export function V2Work({ onOpenDiscipline }: V2WorkProps) {
  const [active, setActive] = useState(0)
  const discipline = DISCIPLINES[active]
  // every image in the discipline, served as low-res thumbnails for fast loading
  const mosaic = disciplineMosaic(discipline, Infinity).map(thumb)

  return (
    <div className="v2-home-split v2-fade">
      <div className="v2-home-names">
        <div className="v2-crumb">
          <span>Selected Work</span>
          <span className="v2-crumb-sep">—</span>
          <span>{DISCIPLINES.length} disciplines</span>
        </div>

        <div className="v2-work">
          {DISCIPLINES.map((d, i) => (
            <button
              key={d.id}
              className={`v2-work-row ${active === i ? 'active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => onOpenDiscipline(d.id)}
            >
              <span className="v2-work-name">{d.label}</span>
              <span className="v2-arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      <div className="v2-home-preview">
        <div className="v2-home-caption">
          <span>{discipline.blurb}</span>
          <span>{discipline.collections.length} sets</span>
        </div>
        <V2Mosaic
          images={mosaic}
          runKey={discipline.id}
          cols={discipline.previewCols ?? 6}
          onOpen={() => onOpenDiscipline(discipline.id)}
        />
      </div>
    </div>
  )
}
