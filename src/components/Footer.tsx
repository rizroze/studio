import { useState } from 'react'
import { IpodPlayer } from './IpodPlayer'

const INITIAL_EMOJIS = [
  { key: 'salute', emoji: '🫡', count: 42 },
  { key: 'sword', emoji: '🗡️', count: 18 },
  { key: 'basketball', emoji: '🏀', count: 27 },
  { key: 'heart', emoji: '❤️', count: 63 },
]

export function Footer() {
  const [emojis, setEmojis] = useState(INITIAL_EMOJIS)
  const [bumped, setBumped] = useState<string | null>(null)

  const handleEmojiClick = (key: string) => {
    setEmojis(prev => prev.map(e =>
      e.key === key ? { ...e, count: e.count + 1 } : e
    ))
    setBumped(key)
    setTimeout(() => setBumped(null), 300)
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
                className={`footer-emoji-pill ${bumped === e.key ? 'bumped' : ''}`}
                onClick={() => handleEmojiClick(e.key)}
              >
                <span className="footer-emoji">{e.emoji}</span>
                <span className="footer-emoji-count">{e.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-ipod-wrap">
            <IpodPlayer />
          </div>
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
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Rizzy Studio. All rights reserved.</span>
      </div>
    </footer>
  )
}
