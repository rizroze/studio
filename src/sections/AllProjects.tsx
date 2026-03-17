import { useEffect } from 'react'
import { CASE_STUDIES } from '../constants/projects'
import { ProjectCard } from '../components/ProjectCard'

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
            <ProjectCard key={p.slug} project={p} onViewProject={onViewProject} />
          ))}
        </div>
      </div>
    </div>
  )
}
