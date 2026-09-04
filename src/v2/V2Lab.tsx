import { useEffect } from 'react'
import { createPortal } from 'react-dom'

type Toy = 'ipod' | 'glass' | 'pet'

interface LabItem {
  year: string
  title: string
  date: string        // DD/MM
  note?: string
  spawn?: Toy         // present = spawns an interactive toy over the page
  badge?: string      // e.g. 'New'
}

// The lab — experiments and design toys. Newest first; grouped by year.
const LAB: LabItem[] = [
  { year: '2026', title: 'Tamagotchi', date: '27/06', note: 'An octopus that lives here. Feed, play, pet', spawn: 'pet', badge: 'New' },
  { year: '2026', title: 'Liquid Glass', date: '13/04', note: 'Displacement glass. Drag it over the page', spawn: 'glass' },
  { year: '2026', title: 'iPod', date: '24/03', note: 'Grab it, fling it, press play', spawn: 'ipod' },
]

export function V2Lab({ onClose, onSpawn }: { onClose: () => void; onSpawn: (toy: Toy) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div className="v2-lab-overlay" onClick={onClose}>
      <div className="v2-lab-panel" onClick={e => e.stopPropagation()}>
        <div className="v2-lab-head">
          <span className="v2-lab-label">Lab</span>
          <button className="v2-lab-close" onClick={onClose} aria-label="Close">Close</button>
        </div>

        {/* the toys are the proof that the client work is built and not mocked,
            but only if that is said out loud — unlabelled they read as spare time */}
        <p className="v2-lab-intro">
          These are running builds, not mockups. Same hands as the client work.
        </p>

        <div className="v2-lab-list">
          {LAB.map((it, i) => {
            const showYear = i === 0 || LAB[i - 1].year !== it.year
            const inner = (
              <>
                <span className="v2-lab-year">{showYear ? it.year : ''}</span>
                <span className="v2-lab-mid">
                  <span className="v2-lab-title">{it.title}</span>
                  {it.badge && <span className="v2-lab-new">{it.badge}</span>}
                  {it.note && <span className="v2-lab-note">{it.note}</span>}
                </span>
                <span className="v2-lab-date">{it.date}</span>
              </>
            )
            if (it.spawn) {
              const toy = it.spawn
              return (
                <button key={it.title} className="v2-lab-row is-link" onClick={() => onSpawn(toy)}>
                  {inner}
                </button>
              )
            }
            return <div key={it.title} className="v2-lab-row">{inner}</div>
          })}
        </div>
      </div>
    </div>,
    document.body,
  )
}
