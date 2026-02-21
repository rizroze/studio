import { useEffect, useRef } from 'react'
import { ClientTicker } from '../components/ClientTicker'
import { AsciiRose } from '../components/AsciiRose'
import { CASE_STUDIES } from '../constants/projects'

const BOOK_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853']

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

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
            Your product is great.<br />
            Your brand should be <span className="hero-accent">too.</span>
          </h1>
          <p className="hero-subline">
            Helping web3 teams turn shipped code into brands that win <strong>attention</strong>, <strong>trust</strong>, and <strong>traction</strong>.
          </p>
          <a href="https://cal.com/rizzytoday" target="_blank" rel="noopener noreferrer" className="hero-cta">
            <img src="/rizzy-avatar.png" alt="" className="hero-cta-avatar" />
            Book an intro
          </a>
        </div>

        <div className="hero-right">
          <div className="bookshelf">
            {CASE_STUDIES.map((p, i) => (
              <label key={p.slug} className="book-container">
                <div
                  className="book"
                  style={{ '--book-color': BOOK_COLORS[i] } as React.CSSProperties}
                >
                  <div className="book-spine"></div>
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
