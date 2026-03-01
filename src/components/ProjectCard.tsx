import { useState, useRef, useCallback, useEffect } from 'react'
import type { CaseStudyData } from '../constants/projects'

interface ProjectCardProps {
  project: CaseStudyData
  onViewProject: (slug: string) => void
}

export function ProjectCard({ project, onViewProject }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const rectRef = useRef<DOMRect | null>(null)

  const handleClick = () => {
    if (!expanded) {
      setExpanded(true)
      cancelAnimationFrame(rafRef.current)
      const card = cardRef.current
      if (card) card.style.transform = ''
    }
  }

  const handleViewProject = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewProject(project.slug)
  }

  const handleMouseEnter = useCallback(() => {
    const wrap = wrapRef.current
    if (!wrap || expanded) return
    rectRef.current = wrap.getBoundingClientRect()
  }, [expanded])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current
    const rect = rectRef.current
    if (!card || !rect || expanded) return

    cancelAnimationFrame(rafRef.current)
    const clientX = e.clientX
    const clientY = e.clientY
    rafRef.current = requestAnimationFrame(() => {
      const x = (clientX - rect.left) / rect.width - 0.5
      const y = (clientY - rect.top) / rect.height - 0.5
      card.style.transform = `rotateY(${x * 12}deg) rotateX(${y * -12}deg)`
    })
  }, [expanded])

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const card = cardRef.current
    if (!card) return
    card.style.transform = ''
    rectRef.current = null
  }, [])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Curated preview images for the card — previewGallery > gallery > sections
  const previewImages = project.previewGallery
    ?? (project.gallery.length > 0
      ? project.gallery
      : project.sections?.flatMap(s => s.gallery).slice(0, 6) ?? [])

  return (
    <div
      ref={wrapRef}
      className="project-card-tilt-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={`project-card-studio ${expanded ? 'expanded' : ''}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
      >
        <div className="project-card-thumb" style={{ backgroundColor: project.color }}>
          <img src={project.thumbnail} alt={project.title} loading="lazy" />
        </div>
        <div className="project-card-info">
          <h3 className="project-card-title">{project.title}</h3>
          <p className="project-card-client">{project.client}</p>
          <div className="project-card-tags">
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} className="project-tag">{tag}</span>
            ))}
          </div>
          {project.resultMetric && (
            <p className="project-card-result">{project.resultMetric}</p>
          )}
        </div>

        <div className={`project-card-preview ${expanded ? 'open' : ''}`}>
          <div className="project-card-preview-inner">
            {previewImages.length > 1 && (
              <div className="preview-gallery">
                {previewImages.slice(0, 6).map((img, i) => (
                  <div key={i} className="preview-gallery-item">
                    <img src={img} alt={`${project.title} ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
            <p className="preview-description">{project.description}</p>
            <button className="preview-view-btn" onClick={handleViewProject}>
              View project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
