import type { Discipline, DisciplineVideo } from './disciplines'
import { V2Collection } from './V2Collection'
import { V2VideoTile } from './V2VideoTile'
import { projectLogo } from './clientLogos'
import { IMAGE_DIMS, WIDE_VIDEO_RATIO } from './imageDims'

// Square social cuts (1:1) pair up two-across; 16:9 takes the whole row.
// Passing dims down also fixes the tile's box before the video loads, so the
// grid doesn't reflow when metadata lands.
function VideoFigure({ v }: { v: DisciplineVideo }) {
  const dims = IMAGE_DIMS[v.src]
  const wide = !dims || dims[0] / dims[1] >= WIDE_VIDEO_RATIO
  return (
    <figure className={`v2-video${wide ? ' is-wide' : ''}`}>
      <V2VideoTile src={v.src} dims={dims} />
      <figcaption>
        {v.project} · {v.label}
        {v.note && <span className="v2-video-note">{v.note}</span>}
      </figcaption>
    </figure>
  )
}

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

      {discipline.collections.map(({ project, section, grid, cols, label, stats, video, liveUrl }, i) => {
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
              {liveUrl && (
                <a className="v2-disc-live" href={liveUrl} target="_blank" rel="noopener noreferrer">
                  Live ↗
                </a>
              )}
            </div>
          )}
          {section.description && <p className="v2-disc-desc">{section.description}</p>}
          {stats && <p className="v2-disc-stats">{stats}</p>}
          <V2Collection section={section} grid={grid} cols={cols} onOpenImage={onOpenImage} />
          {video && (
            <div className="v2-video-stack v2-video-inline">
              <VideoFigure v={video} />
            </div>
          )}
        </section>
        )
      })}

      {discipline.videos.length > 0 && (
        <section id="block-motion" className="v2-disc-block">
          <div className="v2-disc-label">
            <span className="v2-disc-project">{discipline.videosLabel ?? 'Motion'}</span>
          </div>
          <div className="v2-video-stack">
            {discipline.videos.map(v => (
              <VideoFigure key={v.src} v={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
