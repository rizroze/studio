import { useEffect, useRef, useState } from 'react'
import { V2RailFoot, RailLinks, RailQuote } from './V2RailFoot'
import { V2RailNav, type V2NavItem } from './V2RailNav'
import { V2RailMap } from './V2RailMap'
import type { Discipline } from './disciplines'

const EMAIL = 'rizzy2day@gmail.com'

// The clipboard API needs a secure context and can still be refused by
// permissions, so fall back to the old textarea + execCommand trick. Returns
// false only if both paths fail, which is the caller's cue to hand off to the
// mail client the way the plain mailto link used to.
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    /* blocked or unavailable — try the legacy path below */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

interface V2IdentityProps {
  onHome: () => void
  onOpenReferences: () => void
  onOpenLab: () => void
  nav?: V2NavItem[]
  navTitle?: string
  activeNav?: number
  onJump?: (index: number) => void
  // desktop shows the minimap instead of the section list; mobile keeps the
  // list (rendered at the page bottom by V2Root), because a hundred-odd
  // thumbnails parked below the fold is weight nobody scrolls to
  discipline?: Discipline
  onJumpPiece?: (src: string) => void
  isMobile?: boolean   // on mobile the rail foot moves to the page bottom (V2Root)
}

export function V2Identity({ onHome, onOpenReferences, onOpenLab, nav, navTitle, activeNav = 0, onJump, discipline, onJumpPiece, isMobile = false }: V2IdentityProps) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | undefined>(undefined)

  // a click landing right before unmount would otherwise set state on a gone node
  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  const onCopyEmail = async () => {
    if (!(await copyToClipboard(EMAIL))) {
      window.location.href = `mailto:${EMAIL}`
      return
    }
    setCopied(true)
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <aside className="v2-rail">
      <div className="v2-rail-top">
        <button className="v2-rail-id" onClick={onHome}>
          <img className="v2-avatar" src="/riz-mark.webp" alt="Riz" />
          <span>
            <span className="v2-rail-name">
              Riz
              <svg className="v2-verified" viewBox="0 0 22 22" width="18" height="18" aria-label="Verified">
                <path fill="#1d9bf0" d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/>
              </svg>
            </span>
            <span className="v2-rail-role">End-to-End Creative Partner</span>
          </span>
        </button>

        {nav && nav.length > 0 ? (
          // mobile moves this jump list to the page bottom (rendered in V2Root)
          isMobile ? null : discipline && onJumpPiece ? (
            <V2RailMap discipline={discipline} onJump={onJumpPiece} />
          ) : (
            <V2RailNav nav={nav} navTitle={navTitle} activeNav={activeNav} onJump={onJump} />
          )
        ) : (
          <>
            {/* Four beats, and they only work in this order: what the job has
                always been, the receipts, what I do now, and who is accountable
                for it. Grouped in their own box because the rail's 28px rhythm
                separates parts of the page, not paragraphs of one thought. */}
            <div className="v2-rail-bio">
              <p className="v2-rail-statement">
                Started in guerrilla marketing for rock bands. The job was
                making people look. It still is.
              </p>
              <p className="v2-rail-statement">
                Studied engineering and film, tattooed, made clothes and walked
                runways. Ten years following the work wherever it went.
                Four of those in crypto, two as creative lead, including the
                campaigns for two hackathons run by{' '}
                <a href="https://solanamobile.com/" target="_blank" rel="noopener noreferrer">Solana Mobile</a>,
                {' '}the team building Solana's phone:{' '}
                <a href="https://x.com/RadiantsDAO/status/1967983306047393960" target="_blank" rel="noopener noreferrer">Seeker</a>{' '}
                and the $125K+{' '}
                <a href="https://solanamobile.radiant.nexus/" target="_blank" rel="noopener noreferrer">Monolith</a>.
              </p>
              <p className="v2-rail-statement">
                Now I take a brand from the first mark to launch day. The
                identity, the film that introduces it, and the site or app it
                lives in. Usually solo, usually fast.
              </p>
              <p className="v2-rail-statement">
                Everything here was designed, animated and built by me. One
                person to ask, one hand on all of it.
              </p>
            </div>
            <p className="v2-rail-find">
              Find me on{' '}
              <a href="https://x.com/rizzytoday" target="_blank" rel="noopener noreferrer">X</a>,{' '}
              <a href="https://cal.com/riztoday/15min" target="_blank" rel="noopener noreferrer">book a call</a>,
              {' '}or reach me by{' '}
              <button type="button" className="v2-copy" onClick={onCopyEmail} title={`Copy ${EMAIL}`}>
                <span className={`v2-copy-slot${copied ? ' is-copied' : ''}`} aria-live="polite">
                  <span className="v2-copy-reel">
                    <span className="v2-copy-word" aria-hidden={copied}><span className="v2-copy-u">email</span>.</span>
                    <span className="v2-copy-word" aria-hidden={!copied}><span className="v2-copy-u">copied</span>.</span>
                  </span>
                </span>
              </button>
            </p>
            {/* mobile pulls the links up here; desktop keeps them in the foot */}
            {isMobile && <RailLinks onOpenReferences={onOpenReferences} onOpenLab={onOpenLab} />}
          </>
        )}
      </div>

      {!isMobile && (
        <V2RailFoot>
          <RailLinks onOpenReferences={onOpenReferences} onOpenLab={onOpenLab} />
          {/* the pull-quote rides with the bio, so it's home-only — a
              discipline view shows the jump nav and doesn't need the pitch */}
          {!(nav && nav.length > 0) && <RailQuote />}
        </V2RailFoot>
      )}
    </aside>
  )
}
