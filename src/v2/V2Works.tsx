import { DISCIPLINES, findDiscipline } from './disciplines'
import type { Discipline } from './disciplines'
import { V2Discipline } from './V2Discipline'

const pieceCount = (d: Discipline) =>
  d.collections.reduce((n, c) => n + c.section.gallery.length, 0) + d.videos.length

interface V2WorksProps {
  activeId: string
  onSelect: (id: string) => void
  onHome: () => void
  onOpenImage: (images: string[], index: number) => void
}

// Every discipline on one page, switched by the tab row rather than by leaving
// for a separate URL each time. Each tab is still a real route (/works/<id>) so
// a single discipline stays linkable and shows up in analytics — the tabs
// changed the navigation, not the addressing.
export function V2Works({ activeId, onSelect, onHome, onOpenImage }: V2WorksProps) {
  const discipline = findDiscipline(activeId) ?? DISCIPLINES[0]

  return (
    <div className="v2-works">
      {/* sticky: a discipline is a long scroll, and tabs you have to scroll back
          up to reach are just links with extra steps */}
      <div className="v2-tabbar">
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
                onClick={() => onSelect(d.id)}
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
