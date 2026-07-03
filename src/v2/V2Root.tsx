import { useState, useEffect, useCallback } from 'react'
import { findDiscipline } from './disciplines'
import { V2Identity } from './V2Identity'
import { V2Work } from './V2Work'
import { V2Discipline } from './V2Discipline'
import { V2Lightbox } from './V2Lightbox'
import { V2References } from './V2References'
import { V2Lab } from './V2Lab'
import { V2LabIpod } from './V2LabIpod'
import { V2LabGlass } from './V2LabGlass'
import { V2LabPet } from './V2LabPet'
import '../styles-v2.css'

type Toy = 'ipod' | 'glass' | 'pet'

type V2View =
  | { view: 'home' }
  | { view: 'discipline'; id: string }

type Lightbox = { images: string[]; index: number } | null

// / → home, /<branchId> → discipline
function parsePath(): V2View {
  const parts = window.location.pathname.split('/').filter(Boolean) // [id?]
  const id = parts[0]
  if (id && findDiscipline(id)) return { view: 'discipline', id }
  return { view: 'home' }
}

function buildPath(v: V2View): string {
  return v.view === 'discipline' ? `/${v.id}` : '/'
}

// the Lab is its own URL: /lab (and legacy /?lab from older links)
function isLabPath(): boolean {
  return window.location.pathname === '/lab' || new URLSearchParams(window.location.search).has('lab')
}

export function V2Root() {
  const [state, setState] = useState<V2View>(() => parsePath())
  const [lightbox, setLightbox] = useState<Lightbox>(null)
  const [references, setReferences] = useState(false)
  const [lab, setLab] = useState(() => isLabPath())
  const [labToy, setLabToy] = useState<Toy | null>(null)
  const [activeBlock, setActiveBlock] = useState(0)

  // canonicalize the legacy /?lab to /lab
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('lab')) {
      window.history.replaceState(null, '', '/lab')
    }
  }, [])

  // every view starts at the top — desktop scrolls .v2-main, mobile scrolls
  // the window, and the browser's own back/forward scroll restoration would
  // otherwise drop you mid-page
  const scrollTop = useCallback(() => {
    document.querySelector('.v2-main')?.scrollTo({ top: 0 })
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    const onPop = () => { setState(parsePath()); setLab(isLabPath()); setActiveBlock(0); scrollTop() }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [scrollTop])

  const navigate = useCallback((next: V2View) => {
    window.history.pushState(null, '', buildPath(next))
    setState(next)
    setLab(false)
    setActiveBlock(0)
    scrollTop()
  }, [scrollTop])

  const openLab = useCallback(() => { window.history.pushState(null, '', '/lab'); setLab(true) }, [])
  const closeLab = useCallback(() => {
    window.history.pushState(null, '', buildPath(state))
    setLab(false)
  }, [state])

  // scroll-spy: highlight the block currently under the top of the content pane
  useEffect(() => {
    if (state.view !== 'discipline') return
    const main = document.querySelector('.v2-main') as HTMLElement | null
    if (!main) return
    let ticking = false
    const update = () => {
      ticking = false
      const blocks = Array.from(main.querySelectorAll('[id^="block-"]')) as HTMLElement[]
      // trigger line at ~38% of the viewport (resolution-independent) — a section
      // activates as its heading reaches the upper-third, not once it's scrolled
      // almost to the very top (which felt late on tall screens)
      const line = window.innerHeight * 0.38
      let active = 0
      blocks.forEach((b, i) => {
        if (b.getBoundingClientRect().top <= line) active = i
      })
      setActiveBlock(active)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    // desktop scrolls the content pane; mobile scrolls the window
    main.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      main.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScroll)
    }
  }, [state])

  const goHome = useCallback(() => navigate({ view: 'home' }), [navigate])

  const discipline = state.view === 'discipline' ? findDiscipline(state.id) : undefined

  const openImage = useCallback((images: string[], index: number) => {
    setLightbox({ images, index })
  }, [])

  const jumpTo = useCallback((i: number) => {
    const id = discipline && i >= discipline.collections.length ? 'block-motion' : `block-${i}`
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [discipline])

  const nav = discipline
    ? [
        ...discipline.collections.map(c => ({ label: c.label ?? c.section.title, project: c.project })),
        ...(discipline.videos.length ? [{ label: 'Motion', project: 'Video' }] : []),
      ]
    : undefined

  return (
    <div id="v2-root">
      <V2Identity
        onHome={goHome}
        onOpenReferences={() => setReferences(true)}
        onOpenLab={openLab}
        nav={nav}
        navTitle={discipline?.label}
        activeNav={activeBlock}
        onJump={jumpTo}
      />

      <main className="v2-main">
        {state.view === 'home' && (
          <V2Work onOpenDiscipline={(id) => navigate({ view: 'discipline', id })} />
        )}

        {state.view === 'discipline' && discipline && (
          <V2Discipline discipline={discipline} onHome={goHome} onOpenImage={openImage} />
        )}
      </main>

      {lightbox && (
        <V2Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(index) => setLightbox(lb => (lb ? { ...lb, index } : lb))}
        />
      )}

      {references && <V2References onClose={() => setReferences(false)} />}
      {lab && <V2Lab onClose={closeLab} onSpawn={(toy) => { setLabToy(toy); closeLab() }} />}
      {labToy === 'ipod' && <V2LabIpod onClose={() => setLabToy(null)} />}
      {labToy === 'glass' && <V2LabGlass onClose={() => setLabToy(null)} />}
      {labToy === 'pet' && <V2LabPet onClose={() => setLabToy(null)} />}
    </div>
  )
}
