import { useState, useRef } from 'react'
import { IpodPlayer } from './IpodPlayer'

const INITIAL_EMOJIS = [
  { key: 'salute', emoji: '🫡', count: 42 },
  { key: 'sword', emoji: '🗡️', count: 18 },
  { key: 'basketball', emoji: '🏀', count: 27 },
  { key: 'heart', emoji: '❤️', count: 63 },
]

export function Footer() {
  const [emojis, setEmojis] = useState(INITIAL_EMOJIS)
  const [clicked, setClicked] = useState<string | null>(null)
  const [pressed, setPressed] = useState<Set<string>>(new Set())
  const [spinning, setSpinning] = useState<Record<string, { prev: number; next: number; direction: 'up' | 'down' }>>({})
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  const handleEmojiClick = (key: string) => {
    const current = emojis.find(e => e.key === key)
    if (!current) return

    const wasPressed = pressed.has(key)
    const nextCount = wasPressed ? current.count - 1 : current.count + 1

    // Trigger slot animation
    setSpinning(prev => ({
      ...prev,
      [key]: { prev: current.count, next: nextCount, direction: wasPressed ? 'down' : 'up' }
    }))

    // Update count
    setEmojis(prev => prev.map(e =>
      e.key === key ? { ...e, count: nextCount } : e
    ))

    // Toggle pressed
    setPressed(prev => {
      const next = new Set(prev)
      wasPressed ? next.delete(key) : next.add(key)
      return next
    })

    // Trigger clicked animation
    setClicked(key)
    const clickTimeout = setTimeout(() => setClicked(null), 500)
    timeoutsRef.current.add(clickTimeout)

    // Clear spinner after animation
    const spinTimeout = setTimeout(() => {
      setSpinning(prev => {
        const { [key]: _, ...rest } = prev
        return rest
      })
    }, 350)
    timeoutsRef.current.add(spinTimeout)
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-main">
          <a href="#" className="footer-brand-big" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            <img src="/rizzy-avatar.png" alt="Rizzy Studio" className="footer-pfp-big" />
            <span>Rizzy Studio</span>
          </a>
          <p className="footer-tagline-big">The creative director your web3 project is missing.</p>

          <div className="footer-emoji-row">
            {emojis.map(e => (
              <button
                key={e.key}
                className={`footer-emoji-pill ${pressed.has(e.key) ? 'pressed' : ''} ${clicked === e.key ? 'clicked' : ''}`}
                onClick={() => handleEmojiClick(e.key)}
              >
                <span className="footer-emoji">{e.emoji}</span>
                <span className="footer-emoji-count-wrapper">
                  {spinning[e.key] ? (
                    <>
                      <span className={`footer-slot slot-exit-${spinning[e.key].direction}`}>{spinning[e.key].prev}</span>
                      <span className={`footer-slot slot-enter-${spinning[e.key].direction}`}>{spinning[e.key].next}</span>
                    </>
                  ) : (
                    <span className="footer-slot-static">{e.count}</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-links-grid">
            <div className="footer-col">
              <h4 className="footer-heading">Sections</h4>
              <a href="#work" className="footer-link">Work</a>
              <a href="#services" className="footer-link">Services</a>
              <a href="#about" className="footer-link">About</a>
              <a href="#contact" className="footer-link">Contact</a>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Connect</h4>
              <a href="https://x.com/rizzytoday" target="_blank" rel="noopener noreferrer" className="footer-link">X / Twitter</a>
              <a href="https://discord.gg/radiants" target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>
              <a href="https://github.com/rizzytoday" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
              <a href="https://rizzy.today" target="_blank" rel="noopener noreferrer" className="footer-link">rizzy.today ↗</a>
            </div>
          </div>
          <div className="footer-ipod-wrap">
            <IpodPlayer />
            <svg className="ipod-cable" viewBox="0 0 800 400">
              <path d="M60 0 C60 30, 60 60, 80 90 C110 140, 180 160, 260 170 C380 185, 500 165, 580 185 C640 200, 660 240, 640 280 C620 320, 570 340, 580 380 C590 410, 630 420, 680 400 C730 380, 780 400, 820 420" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Rizzy Studio. All rights reserved.</span>
      </div>
    </footer>
  )
}
