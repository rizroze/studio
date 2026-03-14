import { useState, useRef, useEffect } from 'react'
import { IpodPlayer } from './IpodPlayer'
import { useFirebase } from '../services/firebase'

const EMOJI_KEYS = [
  { key: 'salute', emoji: '🫡' },
  { key: 'sword', emoji: '🗡️' },
  { key: 'basketball', emoji: '🏀' },
  { key: 'heart', emoji: '❤️' },
]

const COUNTS_CACHE = 'studio-emoji-counts'
const PRESSED_KEY = 'studio-emoji-pressed'

function getCachedCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(COUNTS_CACHE)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function loadPressed(): Set<string> {
  try {
    const raw = localStorage.getItem(PRESSED_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

export function Footer() {
  const { db, isReady } = useFirebase()
  const [counts, setCounts] = useState<Record<string, number>>(getCachedCounts)
  const [clicked, setClicked] = useState<string | null>(null)
  const [pressed, setPressed] = useState<Set<string>>(loadPressed)
  const [spinning, setSpinning] = useState<Record<string, { prev: number; next: number; direction: 'up' | 'down' }>>({})
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t))
      timeoutsRef.current.clear()
    }
  }, [])

  // Load counts from Firestore when ready
  useEffect(() => {
    if (!db || !isReady) return
    let cancelled = false
    ;(async () => {
      const { doc, getDoc } = await import('firebase/firestore')
      try {
        const snap = await getDoc(doc(db, 'reactions', 'counts'))
        if (snap.exists() && !cancelled) {
          const data = snap.data() as Record<string, number>
          setCounts(data)
          localStorage.setItem(COUNTS_CACHE, JSON.stringify(data))
        }
      } catch (e) {
        console.error('Error loading emoji counts:', e)
      }
    })()
    return () => { cancelled = true }
  }, [db, isReady])

  const handleEmojiClick = async (key: string) => {
    const currentCount = counts[key] || 0
    const wasPressed = pressed.has(key)
    const nextCount = wasPressed ? Math.max(0, currentCount - 1) : currentCount + 1

    // Optimistic UI — animate immediately
    setSpinning(prev => ({
      ...prev,
      [key]: { prev: currentCount, next: nextCount, direction: wasPressed ? 'down' : 'up' }
    }))

    setCounts(prev => {
      const updated = { ...prev, [key]: nextCount }
      localStorage.setItem(COUNTS_CACHE, JSON.stringify(updated))
      return updated
    })

    setPressed(prev => {
      const next = new Set(prev)
      wasPressed ? next.delete(key) : next.add(key)
      localStorage.setItem(PRESSED_KEY, JSON.stringify([...next]))
      return next
    })

    setClicked(key)
    const clickTimeout = setTimeout(() => setClicked(null), 500)
    timeoutsRef.current.add(clickTimeout)

    const spinTimeout = setTimeout(() => {
      setSpinning(prev => {
        const { [key]: _, ...rest } = prev
        return rest
      })
    }, 350)
    timeoutsRef.current.add(spinTimeout)

    // Atomic Firestore increment
    if (db) {
      try {
        const { doc, setDoc, increment } = await import('firebase/firestore')
        await setDoc(doc(db, 'reactions', 'counts'), {
          [key]: increment(wasPressed ? -1 : 1)
        }, { merge: true })
      } catch (e) {
        console.error('Error updating emoji count:', e)
      }
    }
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-main">
          <a href="#" className="footer-brand-big" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            <img src="/rizzy-avatar.webp" alt="Rizzy Studio" className="footer-pfp-big" />
            <span>Rizzy Studio</span>
          </a>
          <p className="footer-tagline-big">The rizz your brand's been missing.</p>

          <div className="footer-emoji-row">
            {EMOJI_KEYS.map(e => (
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
                    <span className="footer-slot-static">{counts[e.key] || 0}</span>
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="footer-connect">
            <h4 className="footer-heading">Connect</h4>
            <div className="footer-connect-links">
              <a href="https://x.com/rizzytoday" target="_blank" rel="noopener noreferrer" className="footer-link">X / Twitter</a>
              <a href="https://discord.com/users/rizzytoday" target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a>
              <a href="https://github.com/rizzytoday" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
              <a href="https://rizztoday.vercel.app" target="_blank" rel="noopener noreferrer" className="footer-link">Personal website</a>
            </div>
          </div>
        </div>

        <div className="footer-right">
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
        <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="footer-link footer-privacy-link">Privacy</a>
      </div>
    </footer>
  )
}
