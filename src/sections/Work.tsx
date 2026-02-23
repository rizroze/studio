import { ProjectCard } from '../components/ProjectCard'
import { CASE_STUDIES } from '../constants/projects'

interface WorkProps {
  onViewProject: (slug: string) => void
  onViewAll: () => void
}

export function Work({ onViewProject, onViewAll }: WorkProps) {
  return (
    <section id="work" className="work-section">
      <div className="work-header">
        <h2 className="section-title-xl" data-reveal>Stuff that actually shipped.</h2>
        <button className="view-all-btn" onClick={onViewAll} data-reveal>
          View all
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className="work-grid" data-reveal-stagger>
        {CASE_STUDIES.map(project => (
          <ProjectCard key={project.slug} project={project} onViewProject={onViewProject} />
        ))}
      </div>
    </section>
  )
}
