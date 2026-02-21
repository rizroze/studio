import { useState, useRef, useCallback } from 'react'
import type { CaseStudyData } from '../constants/projects'

interface ProjectCardProps {
  project: CaseStudyData
  onViewProject: (slug: string) => void
}

export function ProjectCard({ project, onViewProject }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (!expanded) {
      setExpanded(true)
    }
  }

  const handleViewProject = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewProject(project.slug)
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card || expanded) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${y * -12}deg)`
  }, [expanded])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = ''
  }, [])

  return (
    <div className="project-card-tilt-wrap">
      <div
        ref={cardRef}
        className={`project-card-studio ${expanded ? 'expanded' : ''}`}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
      >
        <div className="project-card-thumb">
          <img src={project.thumbnail} alt={project.title} />
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
            {project.gallery.length > 1 && (
              <div className="preview-gallery">
                {project.gallery.map((img, i) => (
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
