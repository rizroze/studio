import { useState, useEffect } from 'react'
import { DISCIPLINES, findDiscipline } from './disciplines'
import type { Discipline } from './disciplines'
import { V2Discipline } from './V2Discipline'

const ROTATE_MS = 7000

const pieceCount = (d: Discipline) =>
  d.collections.reduce((n, c) => n + c.section.gallery.length, 0) + d.videos.length

// Session-scoped, not component state: once someone has taken over, leaving for
// the homepage and coming back shouldn't start the carousel up again in their
// face. Resets on reload, which is the right granularity — a new visit is a new
// chance to show that the tabs move.
let userTookOver = false

interface V2WorksProps {
  activeId: string
  onSelect: (id: string, replace?: boolean) => void
  onHome: () => void
  onOpenImage: (images: string[], index: number) => void
  /** false when the visitor named a discipline in the URL — see V2Root */
  canRotate?: boolean
  /** a piece to land on, set when the visitor clicked it on the homepage */
  focusSrc?: string | null
  onFocused?: () => void
}

// Every discipline on one page, switched by the tab row rather than by leaving
// for a separate URL each time. Each tab is still a real route (/works/<id>) so
// a single discipline stays linkable and shows up in analytics — the tabs
// changed the navigation, not the addressing.
export function V2Works({ activeId, onSelect, onHome, onOpenImage, canRotate = true, focusSrc, onFocused }: V2WorksProps) {
  const discipline = findDiscipline(activeId) ?? DISCIPLINES[0]

  // The tab row cycles on its own so an arriving visitor sees that there are
  // four walls here, not one. It is an attract loop, not a carousel: the first
  // real input ends it for good, because nothing is worse than being yanked to
  // another discipline mid-scroll.
  const [rotating, setRotating] = useState(
    // arriving on a named discipline or a specific piece is the strongest
    // signal there is that this visitor came for something — rotating away
    // from it would be a bug, not a flourish
    () => canRotate && !focusSrc && !userTookOver
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const takeOver = () => {
    userTookOver = true
    setRotating(false)
  }

  useEffect(() => {
    if (!rotating) return
    const t = window.setTimeout(() => {
      const i = DISCIPLINES.findIndex((d) => d.id === discipline.id)
      // replace, not push: seven seconds of idling would otherwise bury the
      // page someone actually arrived from under a pile of back-button steps
      onSelect(DISCIPLINES[(i + 1) % DISCIPLINES.length].id, true)
    }, ROTATE_MS)
    return () => window.clearTimeout(t)
  }, [rotating, discipline.id, onSelect])

  useEffect(() => {
    if (!rotating) return
    const stop = () => takeOver()
    // deliberately not 'scroll': switching tabs scrolls the pane back to the
    // top itself, so the rotation would cancel itself on its own first tick.
    // These four are all things only a person does.
    const opts = { passive: true, once: true } as const
    window.addEventListener('wheel', stop, opts)
    window.addEventListener('touchmove', stop, opts)
    window.addEventListener('pointerdown', stop, opts)
    window.addEventListener('keydown', stop, opts)
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('pointerdown', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [rotating])

  // land on the piece that was clicked. Two frames of grace: the discipline
  // remounts on every tab change, and the tile has to exist and have its
  // aspect-ratio box before scrollIntoView can find the right offset.
  useEffect(() => {
    if (!focusSrc) return
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = document.querySelector(`[data-lbsrc="${CSS.escape(focusSrc)}"]`)
        if (el) {
          el.scrollIntoView({ block: 'center' })
          // a beat of emphasis, or arriving mid-wall looks like a mis-scroll
          el.classList.add('landed')
          window.setTimeout(() => el.classList.remove('landed'), 1400)
        }
        onFocused?.()
      })
    })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [focusSrc, discipline.id, onFocused])

  return (
    <div className="v2-works">
      {/* sticky: a discipline is a long scroll, and tabs you have to scroll back
          up to reach are just links with extra steps */}
      <div className={`v2-tabbar${rotating ? ' rotating' : ''}`}>
        <button className="v2-tabs-home" onClick={onHome}>← Home</button>
        <div className="v2-tabs" role="tablist" aria-label="Disciplines">
          {DISCIPLINES.map((d) => {
            const active = d.id === discipline.id
            return (
              <button
                key={d.id}
                role="tab"
                aria-selected={active}
                className={`v2-tab${active ? ' active' : ''}`}
                onClick={() => { takeOver(); onSelect(d.id) }}
              >
                <span className="v2-tab-label">{d.label}</span>
                <span className="v2-tab-count">{pieceCount(d)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* keyed on the discipline so switching tabs remounts: the entrance fade
          replays, and per-collection state (index-view scroll spy, video tiles)
          starts clean instead of carrying over from the previous discipline */}
      <V2Discipline key={discipline.id} discipline={discipline} onOpenImage={onOpenImage} />
    </div>
  )
}
