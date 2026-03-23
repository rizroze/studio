import { useEffect, useRef } from 'react'
import { track } from '@vercel/analytics'
import { ClientTicker } from '../components/ClientTicker'
import { AsciiRose, HeroCursorField } from '../components/AsciiRose'
import { CASE_STUDIES, BOOKSHELF_SLUGS } from '../constants/projects'

const BOOK_COLORS = ['#FCE184', '#F5B731', '#34A853', '#1a1a2e', '#F97316']

const SPINE_LOGOS: (string | null)[] = [
  '/content/logos/rad-spine.webp',
  '/content/logos/wayy-spine.webp',
  '/content/logos/hydex-spine.webp',
  null, // Fullport — text label
  null, // whatsfordinner — text label
]

const SPINE_TEXTS: (string | null)[] = [
  null, null, null, null,
  'whatsfordinner',
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
    // Skip parallax on mobile — causes scroll jank
    if (window.innerWidth < 769) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) { ticking = false; return }
        const y = window.scrollY
        const books = el.querySelector('.hero-right') as HTMLElement | null
        if (books) books.style.transform = `translateY(${y * 0.15}px)`
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="hero" className="hero-studio" ref={sectionRef}>
      <HeroCursorField />
      <AsciiRose />
      <div className="hero-split">
        <div className="hero-left">
          <h1 className="hero-headline">
            <span className="hero-word">You</span>{' '}
            <span className="hero-word">don't</span>{' '}
            <span className="hero-word">need</span>{' '}
            <span className="hero-word">more</span>{' '}
            <span className="hero-word">features.</span>{' '}
            <span className="hero-word">You</span>{' '}
            <span className="hero-word">need</span>
            <span className="hero-accent-line">
              <span className="hero-word">more</span>{' '}
              <span className="hero-word hero-accent">conviction</span>{' '}
              <span className="hero-word hero-accent">in</span>{' '}
              <span className="hero-word hero-accent">how</span>{' '}
              <span className="hero-word hero-accent">you</span>{' '}
              <span className="hero-word hero-accent">present</span>{' '}
              <span className="hero-word hero-accent">them.</span>
            </span>
          </h1>
          <p className="hero-subline">
            I turn what you're building into a <strong>brand people remember</strong>. Today.
          </p>
          <div className="hero-cta-row">
            <a href="https://cal.com/rizzytoday" target="_blank" rel="noopener noreferrer" className="hero-cta" onClick={() => track('cta_click', { location: 'hero' })}>
              <img src="/Rizzytoday Profile Picture.webp" alt="" className="hero-cta-avatar" />
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
                        <span className="spine-text">{SPINE_TEXTS[i] ?? p.title}</span>
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
            {/* Corner — standalone book, not a case study */}
            <div className="book-zone">
              <label
                className="book-container"
                style={{ '--bk-color': '#EDE4D0' } as React.CSSProperties}
              >
                <div className="book">
                  <div className="book-spine">
                    <span className="spine-text">The Corner</span>
                  </div>
                  <div className="book-back"></div>
                  <div className="book-cover">
                    <img src="/content/logos/corner-c.webp" alt="The Corner" loading="eager" />
                  </div>
                  <div className="book-side"></div>
                  <input type="radio" name="hero-book" />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-ticker">
        <div className="hero-ticker-proof">
          <span className="ticker-stars">★★★★★</span>
          <span className="ticker-label">Clients</span>
        </div>
        <ClientTicker />
      </div>
    </section>
  )
}
