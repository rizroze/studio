import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * GSAP hero entrance timeline — sequenced choreography that CSS can't do.
 *
 * Books fall from above one by one. They become visible mid-fall as the
 * parent .hero-right fades in. No opacity animation on books themselves
 * (preserve-3d on .book would flatten if any ancestor has opacity < 1).
 * We animate translateY on .book-container which does NOT have preserve-3d.
 */
export function GsapAnimations() {
  useGSAP(() => {
    gsap.set('.shelf-label', { opacity: 0 })

    // Position books above their landing spot before anything is visible
    const containers = gsap.utils.toArray<HTMLElement>('.book-container')
    gsap.set(containers, { y: -120 })

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

    // Books fall into place one by one — only translateY, no opacity
    containers.forEach((container, i) => {
      tl.to(container, {
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.4)',
      }, `reveal+=${0.15 + i * 0.1}`)
    })

    // Clean up GSAP inline transforms so CSS hover/tease still works
    const lastBookLands = `reveal+=${0.15 + containers.length * 0.1 + 0.5}`
    tl.call(() => {
      gsap.set(containers, { clearProps: 'transform' })
    }, [], lastBookLands)

    tl.fromTo('.hero-ticker',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      `reveal+=${0.15 + containers.length * 0.1 + 0.2}`
    )
  }, [])

  return null
}
