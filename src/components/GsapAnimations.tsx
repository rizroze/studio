import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * GSAP hero entrance timeline — sequenced choreography that CSS can't do.
 *
 * Books fall from above one by one. We animate .book-zone (the outer wrapper)
 * instead of .book-container because .book-container has a CSS base transform
 * (translateZ) for 3D positioning. GSAP inline transforms would overwrite it,
 * breaking the 3D depth during the fall animation.
 *
 * .hero-right fades in during the fall so books become visible mid-air.
 */
export function GsapAnimations() {
  useGSAP(() => {
    gsap.set('.shelf-label', { opacity: 0 })

    // Animate .book-zone (wrapper) — leaves .book-container's CSS transform untouched
    const zones = gsap.utils.toArray<HTMLElement>('.book-zone')
    gsap.set(zones, { y: -120 })

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
    .fromTo('.shelf-line',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: 'power2.out' },
      'reveal'
    )
    .fromTo('.shelf-label',
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      'reveal+=0.4'
    )

    // Books fall into place one by one via their .book-zone wrapper
    zones.forEach((zone, i) => {
      tl.to(zone, {
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.4)',
      }, `reveal+=${0.15 + i * 0.1}`)
    })

    // Clean up GSAP inline transforms so CSS hover/tease still works
    const lastBookLands = `reveal+=${0.15 + zones.length * 0.1 + 0.5}`
    tl.call(() => {
      gsap.set(zones, { clearProps: 'transform' })
      // Signal that entrance is done — tease system can start
      window.dispatchEvent(new Event('books-landed'))
    }, [], lastBookLands)

    tl.fromTo('.hero-ticker',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      `reveal+=${0.15 + zones.length * 0.1 + 0.2}`
    )
  }, [])

  return null
}
