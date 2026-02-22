import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
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

  // Ambient float animation
  useGSAP(() => {
    const shelf = shelfRef.current
    if (!shelf) return
    const books = shelf.querySelectorAll('.book')
    books.forEach((el, i) => {
      const container = el.closest('.book-container')!
      const tween = gsap.to(el, {
        top: -3,
        duration: 4 + i * 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.4,
      })
      container.addEventListener('mouseenter', () => tween.pause())
      container.addEventListener('mouseleave', () => tween.resume())
    })
  }, { scope: shelfRef })

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
