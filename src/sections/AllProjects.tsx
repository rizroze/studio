import { useEffect } from 'react'
import { CASE_STUDIES } from '../constants/projects'

interface AllProjectsProps {
  onBack: () => void
  onViewProject: (slug: string) => void
}

export function AllProjects({ onBack, onViewProject }: AllProjectsProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="all-projects-page">
      <div className="project-page-back">
        <button className="project-back-btn" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M6 4L3 7L6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>

      <div className="section" style={{ paddingTop: 40 }}>
        <h1 className="section-title" style={{ fontSize: 32, marginBottom: 32 }}>All Work</h1>
        <div className="work-grid">
          {CASE_STUDIES.map(p => (
            <div
              key={p.slug}
              className="project-card-studio"
              onClick={() => onViewProject(p.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') onViewProject(p.slug) }}
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
