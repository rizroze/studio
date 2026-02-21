import { useEffect } from 'react'
import type { CaseStudyData } from '../constants/projects'
import { CASE_STUDIES } from '../constants/projects'

interface ProjectPageProps {
  project: CaseStudyData
  onClose: () => void
  onSelectProject: (slug: string) => void
}

export function ProjectPage({ project, onClose, onSelectProject }: ProjectPageProps) {
  const otherProjects = CASE_STUDIES.filter(p => p.slug !== project.slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [project.slug])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

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

      <div className="project-page-hero">
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

        {project.gallery.length > 0 && (
          <div className="project-page-gallery">
            {project.gallery.map((img, i) => (
              <div key={i} className="project-page-gallery-item">
                <img src={img} alt={`${project.title} ${i + 1}`} />
              </div>
            ))}
          </div>
        )}

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
      </div>

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
              <div className="project-card-thumb">
                <img src={p.thumbnail} alt={p.title} />
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
