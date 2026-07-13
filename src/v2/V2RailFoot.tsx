import { V2Loader } from './V2Loader'
import { V2Music } from './V2Music'

interface V2RailFootProps {
  onOpenReferences: () => void
  onOpenLab: () => void
  hideLinks?: boolean   // mobile discipline view hides References/Lab
}

// The rail's bottom cluster: loader + Sound player, then the References/Lab
// links. Rendered inside the rail on desktop; on mobile it's rendered at the
// bottom of the page instead (single instance — V2Music owns audio state).
export function V2RailFoot({ onOpenReferences, onOpenLab, hideLinks = false }: V2RailFootProps) {
  return (
    <div className="v2-rail-bottom">
      <div className="v2-rail-aux">
        <V2Loader />
        <V2Music />
      </div>
      {!hideLinks && (
        <div className="v2-rail-links">
          <button className="v2-rail-link" onClick={onOpenReferences}>References</button>
          <button className="v2-rail-link" onClick={onOpenLab}>
            Lab
            <svg className="v2-lab-icon" viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6.7 2.3h2.6L9.1 5.4l3.2 6.8H3.7l3.2-6.8z" />
              <path d="M5.1 10h5.8" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
