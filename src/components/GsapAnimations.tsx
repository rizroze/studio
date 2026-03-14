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
    new Promise<void>(resolve => setTimeout(resolve, 2000)),
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
      const startDelay = loader ? 0.5 : 0.15

      const tl = gsap.timeline({ delay: startDelay })

      // Left side — headline words rise in one by one
      const words = gsap.utils.toArray<HTMLElement>('.hero-word')
      gsap.set(words, { opacity: 0, y: 20 })
      gsap.set('.hero-headline', { opacity: 1 })

      tl.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.06,
      })
      .fromTo('.hero-subline',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
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

      // Books fade in with stagger — no transform to avoid 3D conflicts
      .to(zones, {
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.08,
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

      .call(() => {
        gsap.set(zones, { clearProps: 'opacity' })
        window.dispatchEvent(new Event('books-landed'))
      })
    }

    preloadBookImages().then(runTimeline)
  }, [])

  return null
}
