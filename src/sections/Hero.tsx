import { useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'
import { ClientTicker } from '../components/ClientTicker'
import { AsciiRose } from '../components/AsciiRose'
import { CASE_STUDIES, BOOKSHELF_SLUGS } from '../constants/projects'

const BOOK_COLORS = ['#FCE184', '#F5B731', '#34A853', '#1a1a2e']

const SPINE_LOGOS: (string | null)[] = [
  '/content/logos/rad-spine.png',
  '/content/logos/wayy-spine.webp',
  '/content/logos/hydex-spine.png',
  null, // Fullport — text label
]

// Bookshelf shows only 4 curated projects, not the full CASE_STUDIES list
const BOOKSHELF_PROJECTS = BOOKSHELF_SLUGS.map(
  slug => CASE_STUDIES.find(p => p.slug === slug)!
)

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const shelfRef = useRef<HTMLDivElement>(null)

  // Random float tease — waits for GSAP entrance to finish, then starts
  useEffect(() => {
    const shelf = shelfRef.current
    if (!shelf) return
    const zones = shelf.querySelectorAll('.book-zone')
    const containers = shelf.querySelectorAll('.book-container')
    let last = -1
    let paused = false
    let ready = false
    let intervalId: ReturnType<typeof setInterval> | null = null
    let resumeTimer: ReturnType<typeof setTimeout> | null = null

    const clearAllTease = () => {
      containers.forEach(c => c.classList.remove('book-tease'))
    }

    const tease = () => {
      if (paused || !ready) return
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

    const onEnter = () => {
      hoverCount++
      paused = true
      if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null }
      clearAllTease()
    }

    const onLeave = () => {
      hoverCount--
      if (hoverCount > 0) return
      if (resumeTimer) clearTimeout(resumeTimer)
      resumeTimer = setTimeout(() => {
        paused = false
        tease()
      }, 1500)
    }

    // Only start teasing after GSAP entrance clears transforms
    const onBooksLanded = () => {
      ready = true
      tease()
      intervalId = setInterval(tease, 4000)
    }

    zones.forEach(z => {
      z.addEventListener('mouseenter', onEnter)
      z.addEventListener('mouseleave', onLeave)
    })

    window.addEventListener('books-landed', onBooksLanded)

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (resumeTimer) clearTimeout(resumeTimer)
      window.removeEventListener('books-landed', onBooksLanded)
      zones.forEach(z => {
        z.removeEventListener('mouseenter', onEnter)
        z.removeEventListener('mouseleave', onLeave)
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
            {BOOKSHELF_PROJECTS.map((p, i) => (
              <div key={p.slug} className="book-zone">
                <label
                  className="book-container"
                  style={{ '--bk-color': BOOK_COLORS[i] } as React.CSSProperties}
                >
                  <div className="book">
                    <div className="book-spine">
                      {SPINE_LOGOS[i] ? (
                        <img src={SPINE_LOGOS[i]!} alt={p.title} className="spine-logo" loading="eager" />
                      ) : (
                        <span className="spine-text">{p.title}</span>
                      )}
                    </div>
                    <div className="book-back"></div>
                    <div className="book-cover">
                      <img src={p.thumbnail} alt={p.title} loading="eager" />
                    </div>
                    <div className="book-side"></div>
                    <input type="radio" name="hero-book" />
                  </div>
                </label>
              </div>
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
