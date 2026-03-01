import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * GSAP hero entrance timeline — smooth choreography on first load.
 * No blur filters (GPU-heavy), no bounce overshoot. Just clean fades + slides.
 * Waits for the loader to clear before starting so the full animation is visible.
 */
export function GsapAnimations() {
  useGSAP(() => {
    gsap.set('.shelf-label', { opacity: 0 })

    const zones = gsap.utils.toArray<HTMLElement>('.book-zone')
    gsap.set(zones, { y: -60 })

    // Wait for loader to finish fading before starting the entrance
    const loader = document.getElementById('loader')
    const startDelay = loader ? 0.5 : 0.15

    const tl = gsap.timeline({ delay: startDelay })

    // Left side — text rises in sequence
    tl.fromTo('.hero-headline',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
    )
    .fromTo('.hero-subline',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.45'
    )
    .fromTo('.hero-cta-row',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.35'
    )

    // Right side — bookshelf appears
    .fromTo('.hero-right',
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo('.shelf-line',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )

    // Books slide down into place — smooth, no overshoot
    .to(zones, {
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.07,
    }, '-=0.25')

    .fromTo('.shelf-label',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' },
      '-=0.15'
    )

    .fromTo('.hero-ticker',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.1'
    )

    // Clean up after everything lands
    .call(() => {
      gsap.set(zones, { clearProps: 'transform' })
      window.dispatchEvent(new Event('books-landed'))
    })
  }, [])

  return null
}
