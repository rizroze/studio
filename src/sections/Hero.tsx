import { useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'
import { ClientTicker } from '../components/ClientTicker'
import { AsciiRose } from '../components/AsciiRose'
import { CASE_STUDIES } from '../constants/projects'

const BOOK_COLORS = ['#FCE184', '#F5B731', '#34A853', '#1a1a2e']

const SPINE_LOGOS: (string | null)[] = [
  '/content/logos/rad-spine.png',
  '/content/logos/wayy-spine.png',
  '/content/logos/hydex-spine.png',
  null, // Fullport — text label
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const shelfRef = useRef<HTMLDivElement>(null)

  // Random float tease — one book at a time
  useEffect(() => {
    const shelf = shelfRef.current
    if (!shelf) return
    const containers = shelf.querySelectorAll('.book-container')
    let last = -1

    const tease = () => {
      // Pick a random book, different from last
      let next: number
      do { next = Math.floor(Math.random() * containers.length) } while (next === last && containers.length > 1)
      last = next

      // Remove from all, add to chosen
      containers.forEach(c => c.classList.remove('book-tease'))
      const el = containers[next]
      // Force reflow so animation restarts
      void (el as HTMLElement).offsetWidth
      el.classList.add('book-tease')
    }

    tease()
    const id = setInterval(tease, 4000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) { ticking = false; return }
        const y = window.scrollY
        const rose = el.querySelector('.ascii-rose') as HTMLElement | null
        const books = el.querySelector('.hero-right') as HTMLElement | null
        if (rose) rose.style.transform = `translate(-50%, -50%) translateY(${y * 0.3}px)`
        if (books) books.style.transform = `translateY(${y * 0.15}px)`
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="hero" className="hero-studio" ref={sectionRef}>
      <AsciiRose />
      <div className="hero-split">
        <div className="hero-left">
          <h1 className="hero-headline">
            I design it, code it,<br />
            and ship <span className="hero-accent">the whole thing.</span>
          </h1>
          <p className="hero-subline">
            Brand, website, motion — designed and built together, from <strong>concept</strong> to <strong>production</strong>.
          </p>
          <div className="hero-cta-row">
            <a href="https://cal.com/rizzytoday" target="_blank" rel="noopener noreferrer" className="hero-cta" onClick={() => track('cta_click', { location: 'hero' })}>
              <img src="/rizzy-avatar.png" alt="" className="hero-cta-avatar" />
              Book an intro
            </a>
            <span className="available-badge"><span className="available-dot" />Available now</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="bookshelf" ref={shelfRef}>
            {CASE_STUDIES.map((p, i) => (
              <label
                key={p.slug}
                className="book-container"
                style={{ '--bk-color': BOOK_COLORS[i] } as React.CSSProperties}
              >
                <div className="book">
                  <div className="book-spine">
                    {SPINE_LOGOS[i] ? (
                      <img src={SPINE_LOGOS[i]!} alt={p.title} className="spine-logo" />
                    ) : (
                      <span className="spine-text">{p.title}</span>
                    )}
                  </div>
                  <div className="book-back"></div>
                  <div className="book-cover">
                    <img src={p.thumbnail} alt={p.title} />
                  </div>
                  <div className="book-side"></div>
                  <input type="radio" name="hero-book" />
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-ticker">
        <div className="hero-ticker-proof">
          <span className="ticker-stars">★★★★★</span>
          <span className="ticker-label">Happy Clients</span>
        </div>
        <ClientTicker />
      </div>
    </section>
  )
}
