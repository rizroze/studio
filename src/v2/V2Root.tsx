import { useState, useEffect, useCallback } from 'react'
import { track } from '@vercel/analytics'
import { DISCIPLINES, findDiscipline, findPieceDiscipline } from './disciplines'
import { V2Identity } from './V2Identity'
import { V2RailFoot, RailQuote } from './V2RailFoot'
import { V2RailNav } from './V2RailNav'
import { useIsMobile } from './useMobile'
import { V2Home } from './V2Home'
import { V2Works } from './V2Works'
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
  | { view: 'works'; id: string }

type Lightbox = { images: string[]; index: number } | null

// / → home, /works/<disciplineId> → the works page with that tab open.
// /works alone opens the first discipline; the bare /<disciplineId> form is the
// old scheme and still resolves, then gets rewritten to the canonical path.
function parsePath(): V2View {
  const parts = window.location.pathname.split('/').filter(Boolean) // ['works', id?] | [id?]
  if (parts[0] === 'works') {
    const id = parts[1]
    return { view: 'works', id: id && findDiscipline(id) ? id : DISCIPLINES[0].id }
  }
  if (parts[0] && findDiscipline(parts[0])) return { view: 'works', id: parts[0] }
  return { view: 'home' }
}

function buildPath(v: V2View): string {
  return v.view === 'works' ? `/works/${v.id}` : '/'
}

// A legacy /<disciplineId> link (shared before the tabs existed, or followed
// out of a search index) renders the right thing but under the wrong URL.
// Rewrite it in place — replaceState, not pushState, so Back still leaves the
// site instead of bouncing between the two spellings of the same page.
function isLegacyDisciplinePath(): boolean {
  const parts = window.location.pathname.split('/').filter(Boolean)
  return parts.length === 1 && !!findDiscipline(parts[0])
}

// Did the visitor name a discipline, rather than landing on the works page in
// general? A URL with a discipline in it — shared, bookmarked, or clicked
// through from a piece — is intent, and the tab rotation must not move away
// from it. Only a bare /works or the homepage's WORKS link gets the attract
// loop.
function pathNamesDiscipline(): boolean {
  const parts = window.location.pathname.split('/').filter(Boolean)
  if (parts[0] === 'works') return !!(parts[1] && findDiscipline(parts[1]))
  return !!(parts[0] && findDiscipline(parts[0]))
}

// the Lab is its own URL: /lab (and legacy /?lab from older links)
function isLabPath(): boolean {
  return window.location.pathname === '/lab' || new URLSearchParams(window.location.search).has('lab')
}

// References gets its own URL too, so opening it registers as a pageview in
// analytics — as a pure state toggle it was invisible, and it's the one click
// that signals a visitor is actually doing diligence. Also makes it linkable.
function isRefsPath(): boolean {
  return window.location.pathname === '/references'
}

export function V2Root() {
  const [state, setState] = useState<V2View>(() => parsePath())
  const [lightbox, setLightbox] = useState<Lightbox>(null)
  const [references, setReferences] = useState(() => isRefsPath())
  const [lab, setLab] = useState(() => isLabPath())
  const [labToy, setLabToy] = useState<Toy | null>(null)
  const [activeBlock, setActiveBlock] = useState(0)
  // a specific piece the works page should scroll to on arrival — set when a
  // homepage tile is clicked, cleared once V2Works has landed on it
  const [focusSrc, setFocusSrc] = useState<string | null>(null)
  const [pinned, setPinned] = useState(() => pathNamesDiscipline())

  // canonicalize the legacy URLs: /?lab → /lab, /<disciplineId> → /works/<id>
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('lab')) {
      window.history.replaceState(null, '', '/lab')
    } else if (isLegacyDisciplinePath()) {
      window.history.replaceState(null, '', buildPath(parsePath()))
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
    const onPop = () => { setState(parsePath()); setPinned(pathNamesDiscipline()); setLab(isLabPath()); setReferences(isRefsPath()); setActiveBlock(0); scrollTop() }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [scrollTop])

  // `replace` is for navigation the visitor didn't ask for — the works tab
  // rotation. Pushing those would bury the page they arrived from.
  const navigate = useCallback((next: V2View, replace = false) => {
    window.history[replace ? 'replaceState' : 'pushState'](null, '', buildPath(next))
    setState(next)
    setLab(false)
    setReferences(false)
    setActiveBlock(0)
    scrollTop()
  }, [scrollTop])

  const openLab = useCallback(() => { window.history.pushState(null, '', '/lab'); setLab(true) }, [])
  const closeLab = useCallback(() => {
    window.history.pushState(null, '', buildPath(state))
    setLab(false)
  }, [state])

  const openReferences = useCallback(() => {
    window.history.pushState(null, '', '/references')
    setReferences(true)
    // custom event — a hard count of diligence clicks, independent of whether
    // the /references pageview survives ad blockers or shows up in Pages
    track('References Opened')
  }, [])
  const closeReferences = useCallback(() => {
    window.history.pushState(null, '', buildPath(state))
    setReferences(false)
  }, [state])

  // scroll-spy: highlight the block currently under the top of the content pane
  useEffect(() => {
    if (state.view !== 'works') return
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

  // A homepage tile opens the wall its piece lives on, at that piece — landing
  // at the top of a 110-image grid would make the click feel like it missed.
  const openPiece = useCallback((src: string) => {
    const d = findPieceDiscipline(src)
    if (!d) return
    setFocusSrc(src)
    setPinned(true)
    navigate({ view: 'works', id: d.id })
  }, [navigate])

  const discipline = state.view === 'works' ? findDiscipline(state.id) : undefined
  const isMobile = useIsMobile()

  const openImage = useCallback((images: string[], index: number) => {
    setLightbox({ images, index })
  }, [])

  const jumpTo = useCallback((i: number) => {
    const id = discipline && i >= discipline.collections.length ? 'block-motion' : `block-${i}`
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [discipline])

  // the rail minimap and the homepage's click-through both land on a piece the
  // same way: find its tile by the handle every tile carries
  const jumpToPiece = useCallback((src: string) => {
    document
      .querySelector(`[data-lbsrc="${CSS.escape(src)}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const nav = discipline
    ? [
        ...discipline.collections.map(c => ({ label: c.label ?? c.section.title, project: c.project })),
        ...(discipline.videos.length ? [{ label: discipline.videosLabel ?? 'Motion', project: 'Video' }] : []),
      ]
    : undefined

  return (
    <div id="v2-root">
      <V2Identity
        onHome={goHome}
        onOpenReferences={openReferences}
        onOpenLab={openLab}
        nav={nav}
        navTitle={discipline?.label}
        activeNav={activeBlock}
        onJump={jumpTo}
        discipline={discipline}
        onJumpPiece={jumpToPiece}
        isMobile={isMobile}
      />

      <main className="v2-main">
        {state.view === 'home' && (
          <V2Home
            onOpenWorks={() => { setPinned(false); navigate({ view: 'works', id: DISCIPLINES[0].id }) }}
            onOpenPiece={openPiece}
          />
        )}

        {state.view === 'works' && discipline && (
          <V2Works
            activeId={discipline.id}
            onSelect={(id, replace) => navigate({ view: 'works', id }, replace)}
            onHome={goHome}
            canRotate={!pinned}
            focusSrc={focusSrc}
            onFocused={() => setFocusSrc(null)}
            onOpenImage={openImage}
          />
        )}
      </main>

      {/* mobile: the in-page jump list (discipline) and the rail foot both live
          at the bottom of the page — nav first, then Sound (+ the pull-quote on
          home; References/Lab live up in the rail on home only) */}
      {isMobile && (
        <>
          {state.view === 'works' && nav && (
            <V2RailNav nav={nav} navTitle={discipline?.label} activeNav={activeBlock} onJump={jumpTo} />
          )}
          <V2RailFoot>
            {/* same as desktop: the pull-quote anchors the very bottom */}
            {state.view === 'home' ? <RailQuote /> : null}
          </V2RailFoot>
        </>
      )}

      {lightbox && (
        <V2Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(index) => setLightbox(lb => (lb ? { ...lb, index } : lb))}
        />
      )}

      {references && <V2References onClose={closeReferences} />}
      {lab && <V2Lab onClose={closeLab} onSpawn={(toy) => { setLabToy(toy); closeLab() }} />}
      {labToy === 'ipod' && <V2LabIpod onClose={() => setLabToy(null)} />}
      {labToy === 'glass' && <V2LabGlass onClose={() => setLabToy(null)} />}
      {labToy === 'pet' && <V2LabPet onClose={() => setLabToy(null)} />}
    </div>
  )
}
