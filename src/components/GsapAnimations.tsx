import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

// Preload bookshelf images so they're cached before the entrance animation
function preloadBookImages(): Promise<void> {
  const imgs = document.querySelectorAll<HTMLImageElement>('.bookshelf img')
  if (!imgs.length) return Promise.resolve()
  const promises = Array.from(imgs).map(img => {
    if (img.complete) return Promise.resolve()
    return new Promise<void>(resolve => {
      img.onload = () => resolve()
      img.onerror = () => resolve()
    })
  })
  return Promise.race([
    Promise.all(promises).then(() => {}),
    new Promise<void>(resolve => setTimeout(resolve, 400)),
  ])
}

/**
 * GSAP hero entrance timeline — smooth choreography on first load.
 * Books use opacity only (no transform) to avoid fighting 3D CSS transforms.
 */
export function GsapAnimations() {
  useGSAP(() => {
    gsap.set('.shelf-label', { opacity: 0 })

    const zones = gsap.utils.toArray<HTMLElement>('.book-zone')
    gsap.set(zones, { opacity: 0 })

    const loader = document.getElementById('loader')

    const runTimeline = () => {
      const startDelay = loader ? 0.2 : 0.1

      const tl = gsap.timeline({ delay: startDelay })

      // Left side — headline words rise in fast
      const words = gsap.utils.toArray<HTMLElement>('.hero-word')
      gsap.set(words, { opacity: 0, y: 16 })
      gsap.set('.hero-headline', { opacity: 1 })

      tl.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
        stagger: 0.04,
      })
      .fromTo('.hero-subline',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
        '-=0.25'
      )
      .fromTo('.hero-cta-row',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' },
        '-=0.3'
      )

      // Right side — bookshelf appears with left side
      .fromTo('.hero-right',
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo('.shelf-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, ease: 'power3.out' },
        '-=0.3'
      )

      // Books fade in tight
      .to(zones, {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        stagger: 0.05,
      }, '-=0.3')

      // Shelf label + ticker arrive together
      .fromTo('.shelf-label',
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' },
        '-=0.2'
      )

      .fromTo('.hero-ticker',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' },
        '-=0.25'
      )

      .call(() => {
        gsap.set(zones, { clearProps: 'opacity' })
        window.dispatchEvent(new Event('books-landed'))
      })
    }

    preloadBookImages().then(runTimeline)
  }, [])

  return null
}
