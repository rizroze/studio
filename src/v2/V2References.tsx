import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { TESTIMONIALS } from '../constants/testimonials'

interface V2ReferencesProps {
  onClose: () => void
}

// Quiet, text-only testimonials — tucked behind a "References" link in the rail.
// For the curious founder doing diligence, not flexed in the middle of the page.
export function V2References({ onClose }: V2ReferencesProps) {
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
    <div className="v2-ref-overlay" onClick={onClose}>
      <div className="v2-ref-panel" onClick={e => e.stopPropagation()}>
        <div className="v2-ref-head">
          <span className="v2-ref-label">References</span>
          <button className="v2-ref-close" onClick={onClose} aria-label="Close">Close</button>
        </div>

        <div className="v2-ref-list">
          {TESTIMONIALS.map(t => (
            <figure key={t.id} className="v2-ref-item">
              <blockquote className="v2-ref-quote">{t.quote.replace(/^"|"$/g, '')}</blockquote>
              <figcaption className="v2-ref-by">
                <a href={t.link} target="_blank" rel="noopener noreferrer" className="v2-ref-name">{t.name}</a>
                <span className="v2-ref-role">{t.title}</span>
                <span className="v2-ref-work">{t.job.text}{t.job.duration ? ` · ${t.job.duration}` : ''}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
