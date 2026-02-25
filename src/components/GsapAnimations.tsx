import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * GSAP-only animations — things CSS IntersectionObserver can't do:
 * 1. Hero entrance timeline (sequenced choreography)
 * 2. Bookshelf ambient float (infinite yoyo, pause on hover)
 *
 * Everything else uses data-reveal / data-reveal-stagger via CSS.
 * No MutationObserver, no ScrollTrigger — keep it simple.
 */
export function GsapAnimations() {
  useGSAP(() => {
    // Hide book containers with autoAlpha (visibility:hidden + opacity:0)
    // Each will be revealed individually with a quick fade
    gsap.set('.book-container', { autoAlpha: 0 })
    gsap.set('.shelf-label', { opacity: 0 })

    // --- Hero entrance: sequenced timeline ---
    const tl = gsap.timeline({ delay: 0.15 })

    tl.fromTo('.hero-headline',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    )
    .fromTo('.hero-subline',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.35'
    )
    // CTA row + shelf line + hero-right all start together
    .addLabel('reveal', '-=0.25')
    .fromTo('.hero-cta-row',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      'reveal'
    )
    .fromTo('.hero-right',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' },
      'reveal'
    )
    // Shelf line draws right to left — same moment
    .fromTo('.shelf-line',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: 'power2.out' },
      'reveal'
    )
    // MY_LIBRARY label fades in after line
    .fromTo('.shelf-label',
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      'reveal+=0.4'
    )

    // Books land one by one with fade + drop
    // Container gets a quick autoAlpha reveal (0.15s) — brief enough that
    // preserve-3d flattening isn't noticeable. Inner .book gets the y-drop
    // motion so we don't conflict with container's CSS translateZ.
    const books = gsap.utils.toArray<HTMLElement>('.book-container .book')
    books.forEach((book, i) => {
      const container = book.parentElement!
      const bookTime = `reveal+=${0.2 + i * 0.1}`

      tl.to(container, { autoAlpha: 1, duration: 0.15 }, bookTime)
      tl.fromTo(book,
        { y: -25 },
        { y: 0, duration: 0.45, ease: 'back.out(1.6)' },
        bookTime
      )
    })

    // Clean up inline styles after all books have landed
    const cleanupTime = `reveal+=${0.2 + books.length * 0.1 + 0.45}`
    tl.call(() => {
      gsap.set('.book-container', { clearProps: 'opacity,visibility' })
      gsap.set('.book-container .book', { clearProps: 'transform' })
    }, [], cleanupTime)

    tl.fromTo('.hero-ticker',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      `reveal+=${0.2 + books.length * 0.1 + 0.2}`
    )

    // Bookshelf ambient float handled by CSS (book-tease class in Hero.tsx)
  }, [])

  return null
}
