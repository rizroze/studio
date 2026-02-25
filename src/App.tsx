import { useState, useCallback } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { CursorGlitch } from './components/CursorGlitch'
import { ScrollReveal } from './components/ScrollReveal'
import { Hero } from './sections/Hero'
import { Work } from './sections/Work'
import { Testimonials } from './sections/Testimonials'
import { Services } from './sections/Services'
import { About } from './sections/About'
import { FAQ } from './sections/FAQ'
import { ProjectPage } from './sections/ProjectPage'
import { AllProjects } from './sections/AllProjects'
import { CASE_STUDIES } from './constants/projects'

type View = { type: 'home' } | { type: 'project'; slug: string } | { type: 'all-projects' }

export function App() {
  const [view, setView] = useState<View>({ type: 'home' })

  const openProject = useCallback((slug: string) => {
    setView({ type: 'project', slug })
  }, [])

  const openAllProjects = useCallback(() => {
    setView({ type: 'all-projects' })
  }, [])

  const goHome = useCallback(() => {
    setView({ type: 'home' })
  }, [])

  const currentProject = view.type === 'project'
    ? CASE_STUDIES.find(p => p.slug === view.slug)
    : null

  return (
    <>
      <div className="grain-overlay" />
      <CursorGlitch />
      <Nav onLogoClick={goHome} />
      <ScrollReveal />
      <main>
        {view.type === 'home' && (
          <>
            <Hero />
            <Work onViewProject={openProject} onViewAll={openAllProjects} />
            <Testimonials />
            <Services />
            <About />
            <FAQ />
          </>
        )}

        {view.type === 'project' && currentProject && (
          <ProjectPage
            project={currentProject}
            onClose={goHome}
            onSelectProject={openProject}
          />
        )}

        {view.type === 'all-projects' && (
          <AllProjects onBack={goHome} onViewProject={openProject} />
        )}
      </main>
      <Footer />
      <Analytics />
    </>
  )
}
