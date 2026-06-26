import { V2Loader } from './V2Loader'
import { V2Music } from './V2Music'

interface V2NavItem {
  label: string
  project: string
}

interface V2IdentityProps {
  onHome: () => void
  onOpenReferences: () => void
  onOpenLab: () => void
  nav?: V2NavItem[]
  navTitle?: string
  activeNav?: number
  onJump?: (index: number) => void
}

export function V2Identity({ onHome, onOpenReferences, onOpenLab, nav, navTitle, activeNav = 0, onJump }: V2IdentityProps) {
  return (
    <aside className="v2-rail">
      <div className="v2-rail-top">
        <button className="v2-rail-id" onClick={onHome}>
          <img className="v2-avatar" src="/v2-avatar.jpg" alt="Riz" />
          <span>
            <span className="v2-rail-name">
              Riz
              <svg className="v2-verified" viewBox="0 0 22 22" width="18" height="18" aria-label="Verified">
                <path fill="#1d9bf0" d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/>
              </svg>
            </span>
            <span className="v2-rail-role">Creative Direction</span>
          </span>
        </button>

        {nav && nav.length > 0 ? (
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
        ) : (
          <>
            <p className="v2-rail-statement">
              Started in guerrilla marketing for underground rock bands,
              self-taught tattooing, studied engineering and film, then
              unlearned most of it. Spent ten years following the work wherever
              it went. Fashion runway shows, illustration, motion design, brand
              systems, content direction. And the last four leading creative in
              Solana.
            </p>
            <p className="v2-rail-statement">
              The work was here before any title. Not from briefs, but from
              being inside it. It's the intersection of everything I've been
              doing my whole life. I was just following my heart, and realized
              they call that “Creative Director” these days.
            </p>
            <p className="v2-rail-find">
              Find me on{' '}
              <a href="https://x.com/rizroze" target="_blank" rel="noopener noreferrer">X</a>,{' '}
              <a href="https://cal.com/rizzytoday" target="_blank" rel="noopener noreferrer">book a call</a>,
              {' '}or reach me by{' '}
              <a href="mailto:rizzy2day@gmail.com">email</a>.
            </p>
            <div className="v2-rail-status">
              <span className="v2-rail-open">Available to work.</span>
              <span className="v2-rail-updated">Updated Jun 25, 2026</span>
            </div>
          </>
        )}
      </div>

      <div className="v2-rail-bottom">
        <div className="v2-rail-aux">
          <V2Loader />
          <V2Music />
        </div>
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
      </div>
    </aside>
  )
}
