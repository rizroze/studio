import { useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'
import { ClientTicker } from '../components/ClientTicker'
import { AsciiRose } from '../components/AsciiRose'
import { CASE_STUDIES } from '../constants/projects'

const BOOK_COLORS = ['#FCE184', '#F5B731', '#34A853', '#1a1a2e']

const SPINE_LOGOS: (string | null)[] = [
  '/content/logos/rad-spine.png',
  '/content/logos/wayy-spine.webp',
  '/content/logos/hydex-spine.png',
  null, // Fullport — text label
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const shelfRef = useRef<HTMLDivElement>(null)

  // Random float tease — pauses entirely on hover, resumes 1.5s after leave
  useEffect(() => {
    const shelf = shelfRef.current
    if (!shelf) return
    const containers = shelf.querySelectorAll('.book-container')
    let last = -1
    let paused = false
    let resumeTimer: ReturnType<typeof setTimeout> | null = null

    const clearAllTease = () => {
      containers.forEach(c => c.classList.remove('book-tease'))
    }

    const tease = () => {
      if (paused) return
      let next: number
      let attempts = 0
      do {
        next = Math.floor(Math.random() * containers.length)
        attempts++
      } while (next === last && containers.length > 1 && attempts < 8)
      last = next

      clearAllTease()
      const el = containers[next] as HTMLElement
      void el.offsetWidth
      el.classList.add('book-tease')
    }

    let hoverCount = 0

    // Hover on a book: kill all tease, pause loop
    const onEnter = () => {
      hoverCount++
      paused = true
      if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null }
      clearAllTease()
    }

    // Leave a book: resume 1.5s after last book unhovered
    const onLeave = () => {
      hoverCount--
      if (hoverCount > 0) return
      if (resumeTimer) clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => {
        paused = false
        tease()
      }, 1500)
    }

    containers.forEach(c => {
      c.addEventListener('mouseenter', onEnter)
      c.addEventListener('mouseleave', onLeave)
    })

    tease()
    const id = setInterval(tease, 4000)
    return () => {
      clearInterval(id)
      if (resumeTimer) clearTimeout(resumeTimer)
      containers.forEach(c => {
        c.removeEventListener('mouseenter', onEnter)
        c.removeEventListener('mouseleave', onLeave)
      })
    }
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
            <div className="shelf-line" />
            <span className="shelf-label">MY_LIBRARY</span>
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
