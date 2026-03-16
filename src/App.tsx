import { useState, useCallback, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { CursorGlitch } from './components/CursorGlitch'
import { ScrollReveal } from './components/ScrollReveal'
import { GsapAnimations } from './components/GsapAnimations'
import { GlassFilter } from './components/GlassFilter'
import { ScrollNav } from './components/ScrollNav'
import { Hero } from './sections/Hero'
import { Work } from './sections/Work'
import { Testimonials, TestimonialBanner } from './sections/Testimonials'
import { Services } from './sections/Services'
import { About } from './sections/About'
import { Discovery } from './sections/Discovery'
import { FAQ } from './sections/FAQ'
import { ProjectPage } from './sections/ProjectPage'
import { AllProjects } from './sections/AllProjects'
import { CASE_STUDIES } from './constants/projects'
import { Agentation } from 'agentation'

type View = { type: 'home' } | { type: 'project'; slug: string } | { type: 'all-projects' }

function viewFromPath(path: string): View {
  if (path.startsWith('/work/')) {
    const slug = path.slice(6)
    if (CASE_STUDIES.some(p => p.slug === slug)) return { type: 'project', slug }
  }
  if (path === '/work') return { type: 'all-projects' }
  return { type: 'home' }
}

function pathFromView(v: View): string {
  if (v.type === 'project') return `/work/${v.slug}`
  if (v.type === 'all-projects') return '/work'
  return '/'
}

export function App() {
  const [view, setView] = useState<View>(() => viewFromPath(window.location.pathname))
  const [transitioning, setTransitioning] = useState(false)
  const scrollBarRef = useRef<HTMLDivElement>(null)
  const backToTopRef = useRef<HTMLButtonElement>(null)
  const pendingView = useRef<View | null>(null)
  const isPopState = useRef(false)

  // Remove loading screen once app is ready
  useEffect(() => {
    const loader = document.getElementById('loader')
    if (loader) {
      loader.classList.add('loader-exit')
      setTimeout(() => loader.remove(), 350)
    }
  }, [])

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      isPopState.current = true
      const next = viewFromPath(window.location.pathname)
      pendingView.current = next
      setTransitioning(true)
      setTimeout(() => {
        setView(next)
        window.scrollTo({ top: 0 })
        requestAnimationFrame(() => {
          setTransitioning(false)
          isPopState.current = false
        })
      }, 250)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const transitionTo = useCallback((next: View) => {
    pendingView.current = next
    setTransitioning(true)
    setTimeout(() => {
      setView(next)
      if (!isPopState.current) {
        history.pushState(null, '', pathFromView(next))
      }
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

  // Scroll progress + back to top — direct DOM updates, zero re-renders
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight
        const progress = h > 0 ? window.scrollY / h : 0
        const pastFold = window.scrollY > window.innerHeight
        if (scrollBarRef.current) {
          scrollBarRef.current.style.transform = `scaleX(${progress})`
        }
        if (backToTopRef.current) {
          backToTopRef.current.style.display = pastFold ? '' : 'none'
        }
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
      <div className="scroll-progress" ref={scrollBarRef} />
      <div className="grain-overlay" />
      <CursorGlitch />
      <Nav onLogoClick={goHome} />
      <ScrollReveal />
      {view.type === 'home' && <ScrollNav />}
      {view.type === 'home' && <GsapAnimations />}
      <main className={`page-content ${transitioning ? 'page-exit' : 'page-enter'}`}>
        {view.type === 'home' && (
          <>
            <Hero />
            <Work onViewProject={openProject} onViewAll={openAllProjects} />
            <Testimonials />
            <Services />
            <About />
            <Discovery />
            <FAQ />
            <TestimonialBanner />
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

      <button
        ref={backToTopRef}
        className="back-to-top"
        style={{ display: 'none' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 12V4M5 7L8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <Analytics />
      <SpeedInsights />
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
