import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface LabItem {
  year: string
  title: string
  date: string        // DD/MM
  note?: string
  href?: string       // present = opens; absent = lives in the rail / not a page
  badge?: string      // e.g. 'New'
}

// The lab — experiments and design toys. Newest first; grouped by year.
const LAB: LabItem[] = [
  { year: '2026', title: 'Liquid Glass', date: '13/04', note: 'SVG displacement glass, no WebGL', href: '/liquid-glass/', badge: 'New' },
  { year: '2026', title: 'iPod', date: '24/03', note: 'Minimal player — lives in the rail' },
]

export function V2Lab({ onClose }: { onClose: () => void }) {
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
            return it.href ? (
              <a key={it.title} className="v2-lab-row is-link" href={it.href}>{inner}</a>
            ) : (
              <div key={it.title} className="v2-lab-row">{inner}</div>
            )
          })}
        </div>
      </div>
    </div>,
    document.body,
  )
}
