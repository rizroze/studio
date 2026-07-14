export interface V2NavItem {
  label: string
  project: string
}

interface V2RailNavProps {
  nav: V2NavItem[]
  navTitle?: string
  activeNav?: number
  onJump?: (index: number) => void
}

// In-page jump list ("On <X> Page"). Desktop: in the rail. Mobile: at the
// bottom of the page, just above the Sound foot.
export function V2RailNav({ nav, navTitle, activeNav = 0, onJump }: V2RailNavProps) {
  return (
    <nav className="v2-rail-nav">
      <span className="v2-rail-nav-head">On {navTitle ?? 'this'} Page</span>
      {nav.map((n, i) => (
        <button
          key={`${n.project}-${n.label}`}
          className={`v2-rail-nav-item ${activeNav === i ? 'active' : ''}`}
          onClick={() => onJump?.(i)}
        >
          <span className="v2-rail-nav-title">{n.label}</span>
          <span className="v2-rail-nav-proj">{n.project}</span>
        </button>
      ))}
    </nav>
  )
}
