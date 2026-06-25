import { useState, useEffect, useCallback } from 'react'
import { findDiscipline } from './disciplines'
import { V2Identity } from './V2Identity'
import { V2Work } from './V2Work'
import { V2Discipline } from './V2Discipline'
import { V2Lightbox } from './V2Lightbox'
import '../styles-v2.css'

type V2View =
  | { view: 'home' }
  | { view: 'discipline'; id: string }

type Lightbox = { images: string[]; index: number } | null

// /v2 → home, /v2/<branchId> → discipline
function parsePath(): V2View {
  const parts = window.location.pathname.split('/').filter(Boolean) // ['v2', id?]
  const id = parts[1]
  if (id && findDiscipline(id)) return { view: 'discipline', id }
  return { view: 'home' }
}

function buildPath(v: V2View): string {
  return v.view === 'discipline' ? `/v2/${v.id}` : '/v2'
}

export function V2Root() {
  const [state, setState] = useState<V2View>(() => parsePath())
  const [lightbox, setLightbox] = useState<Lightbox>(null)
  const [activeBlock, setActiveBlock] = useState(0)

  useEffect(() => {
    const onPop = () => setState(parsePath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((next: V2View) => {
    window.history.pushState(null, '', buildPath(next))
    setState(next)
    setActiveBlock(0)
    document.querySelector('.v2-main')?.scrollTo({ top: 0 })
  }, [])

  // scroll-spy: highlight the block currently under the top of the content pane
  useEffect(() => {
    if (state.view !== 'discipline') return
    const main = document.querySelector('.v2-main') as HTMLElement | null
    if (!main) return
    let ticking = false
    const update = () => {
      ticking = false
      const blocks = Array.from(main.querySelectorAll('[id^="block-"]')) as HTMLElement[]
      const line = main.getBoundingClientRect().top + 140
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
    main.addEventListener('scroll', onScroll, { passive: true })
    return () => main.removeEventListener('scroll', onScroll)
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
    </div>
  )
}
