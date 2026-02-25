import { useState, useCallback, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { CursorGlitch } from './components/CursorGlitch'
import { ScrollReveal } from './components/ScrollReveal'
import { GsapAnimations } from './components/GsapAnimations'
import { GlassFilter } from './components/GlassFilter'
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
  const [transitioning, setTransitioning] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const pendingView = useRef<View | null>(null)

  // Remove loading screen once app is ready
  useEffect(() => {
    const loader = document.getElementById('loader')
    if (loader) {
      loader.classList.add('loader-exit')
      setTimeout(() => loader.remove(), 400)
    }
  }, [])

  const transitionTo = useCallback((next: View) => {
    pendingView.current = next
    setTransitioning(true)
    setTimeout(() => {
      setView(next)
      window.scrollTo({ top: 0 })
      requestAnimationFrame(() => setTransitioning(false))
    }, 250)
  }, [])

  const openProject = useCallback((slug: string) => {
    transitionTo({ type: 'project', slug })
  }, [transitionTo])

  const openAllProjects = useCallback(() => {
    transitionTo({ type: 'all-projects' })
  }, [transitionTo])

  const goHome = useCallback(() => {
    transitionTo({ type: 'home' })
  }, [transitionTo])

  // Scroll progress + back to top (rAF-throttled)
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(h > 0 ? window.scrollY / h : 0)
        setShowBackToTop(window.scrollY > window.innerHeight)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const currentProject = view.type === 'project'
    ? CASE_STUDIES.find(p => p.slug === view.slug)
    : null

  return (
    <>
      <GlassFilter />
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />
      <div className="grain-overlay" />
      <CursorGlitch />
      <Nav onLogoClick={goHome} />
      <ScrollReveal />
      {view.type === 'home' && <GsapAnimations />}
      <main className={`page-content ${transitioning ? 'page-exit' : 'page-enter'}`}>
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

      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M5 7L8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <Analytics />
      <SpeedInsights />
    </>
  )
}
