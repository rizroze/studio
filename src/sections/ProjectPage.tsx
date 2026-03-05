import { useEffect, useState, useCallback } from 'react'
import type { CaseStudyData } from '../constants/projects'
import { CASE_STUDIES } from '../constants/projects'

interface ProjectPageProps {
  project: CaseStudyData
  onClose: () => void
  onSelectProject: (slug: string) => void
}

export function ProjectPage({ project, onClose, onSelectProject }: ProjectPageProps) {
  const otherProjects = CASE_STUDIES.filter(p => p.slug !== project.slug)
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null)

  const openLightbox = useCallback((images: string[], index: number) => {
    setLightbox({ images, index })
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])

  const lightboxPrev = useCallback(() => {
    setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null)
  }, [])

  const lightboxNext = useCallback(() => {
    setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [project.slug])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) {
        if (e.key === 'Escape') closeLightbox()
        else if (e.key === 'ArrowLeft') lightboxPrev()
        else if (e.key === 'ArrowRight') lightboxNext()
        return
      }
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, lightbox, closeLightbox, lightboxPrev, lightboxNext])

  return (
    <div className="project-page">
      <div className="project-page-back">
        <button className="project-back-btn" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M6 4L3 7L6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to work
        </button>
      </div>

      <div className="project-page-hero" style={{ backgroundColor: project.color }}>
        <img src={project.thumbnail} alt={project.title} className="project-page-thumb" />
      </div>

      <div className="project-page-body">
        <div className="project-page-header">
          <h1 className="project-page-title">{project.title}</h1>
          <span className="project-page-client">{project.client}</span>
        </div>

        <div className="project-page-tags">
          {project.tags.map(tag => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>

        <div className="project-page-section">
          <h3>Brief</h3>
          <p>{project.brief}</p>
        </div>

        <div className="project-page-section">
          <h3>Challenge</h3>
          <p>{project.challenge}</p>
        </div>

        <div className="project-page-section">
          <h3>Solution</h3>
          <p>{project.solution}</p>
        </div>

        <div className="project-page-stack">
          {project.stack.map(s => (
            <span key={s} className="stack-tag">{s}</span>
          ))}
        </div>

        <div className="project-page-section">
          <h3>Result</h3>
          <p>{project.result}</p>
        </div>

        {project.video && (
          <div className="project-video-wrap">
            {project.videoLabel && (
              <span className="project-video-label">{project.videoLabel}</span>
            )}
            <video
              src={project.video}
              controls
              autoPlay
              loop
              muted
              preload="auto"
              playsInline
              className="project-video"
            />
          </div>
        )}

        {project.gallery.length > 0 && (
          <div className="project-page-gallery gallery-deck">
            {project.gallery.map((img, i) => (
              <div key={i} className="project-page-gallery-item gallery-clickable" onClick={() => openLightbox(project.gallery, i)}>
                <img src={img} alt={`${project.title} ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}

        {project.sections && project.sections.map((section, i) => (
          <div key={i} className="project-page-subsection">
            <h2 className="project-subsection-title">{section.title}</h2>
            <p className="project-subsection-desc">{section.description}</p>
            {section.gallery.length > 0 && (
              <div className={`project-page-gallery ${section.layout === 'squares' ? 'gallery-squares' : section.layout === 'landscape' ? 'gallery-landscape' : section.layout === 'deck' ? 'gallery-deck' : ''}`}>
                {section.gallery.map((img, j) => (
                  <div key={j} className={`project-page-gallery-item ${section.layout === 'squares' ? 'gallery-item-square' : ''} ${section.wideIndices?.includes(j) ? 'gallery-item-wide' : ''} gallery-clickable`} onClick={() => openLightbox(section.gallery, j)}>
                    <img src={img} alt={`${section.title} ${j + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="deck-lightbox" onClick={closeLightbox}>
          <div className="deck-lightbox-inner" onClick={e => e.stopPropagation()}>
            <img src={lightbox.images[lightbox.index]} alt={`Slide ${lightbox.index + 1}`} className="deck-lightbox-img" />
            <span className="deck-lightbox-counter">{lightbox.index + 1} / {lightbox.images.length}</span>
            {lightbox.images.length > 1 && (
              <>
                <button className="deck-lightbox-arrow deck-lightbox-prev" onClick={lightboxPrev} aria-label="Previous slide">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="deck-lightbox-arrow deck-lightbox-next" onClick={lightboxNext} aria-label="Next slide">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </>
            )}
            <button className="deck-lightbox-close" onClick={closeLightbox} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      )}

      <div className="project-page-more">
        <h2 className="section-title">More work</h2>
        <div className="work-grid">
          {otherProjects.map(p => (
            <div
              key={p.slug}
              className="project-card-studio"
              onClick={() => onSelectProject(p.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') onSelectProject(p.slug) }}
            >
              <div className="project-card-thumb" style={{ backgroundColor: p.color }}>
                <img src={p.thumbnail} alt={p.title} loading="lazy" />
              </div>
              <div className="project-card-info">
                <h3 className="project-card-title">{p.title}</h3>
                <p className="project-card-client">{p.client}</p>
                <div className="project-card-tags">
                  {p.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
