import type { Discipline } from './disciplines'
import { V2Collection } from './V2Collection'
import { V2VideoTile } from './V2VideoTile'
import { projectLogo } from './clientLogos'

interface V2DisciplineProps {
  discipline: Discipline
  onHome: () => void
  onOpenImage: (images: string[], index: number) => void
}

export function V2Discipline({ discipline, onHome, onOpenImage }: V2DisciplineProps) {
  return (
    <div>
      <div className="v2-crumb">
        <button onClick={onHome}>Work</button>
        <span className="v2-crumb-sep">/</span>
        <span>{discipline.label}</span>
      </div>

      <div className="v2-head">
        <h1 className="v2-head-title">{discipline.label}</h1>
        <p className="v2-head-desc">{discipline.blurb}</p>
        {discipline.description && <p className="v2-head-note">{discipline.description}</p>}
      </div>

      {discipline.collections.map(({ project, section, grid, cols, label, stats }, i) => {
        const logo = projectLogo(project)
        return (
        <section key={`${project}-${section.title}`} id={`block-${i}`} className="v2-disc-block">
          {project && (
            <div className="v2-disc-label">
              {logo && (
                <img
                  className={`v2-disc-logo${logo.invert ? ' invert' : ''}`}
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                />
              )}
              <span className="v2-disc-project">{project}</span>
              <span className="v2-disc-sep">·</span>
              <span className="v2-disc-title">{label ?? section.title}</span>
            </div>
          )}
          {section.description && <p className="v2-disc-desc">{section.description}</p>}
          {stats && <p className="v2-disc-stats">{stats}</p>}
          <V2Collection section={section} grid={grid} cols={cols} onOpenImage={onOpenImage} />
        </section>
        )
      })}

      {discipline.videos.length > 0 && (
        <section id="block-motion" className="v2-disc-block">
          <div className="v2-disc-label">
            <span className="v2-disc-project">Motion</span>
          </div>
          <div className="v2-video-stack">
            {discipline.videos.map(v => (
              <figure key={v.src} className="v2-video">
                <V2VideoTile src={v.src} />
                <figcaption>{v.project} · {v.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
