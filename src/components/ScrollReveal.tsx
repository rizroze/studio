import { useEffect } from 'react'

export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )

    const observe = () => {
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => observer.observe(el))
      document.querySelectorAll('[data-reveal-stagger]:not(.revealed)').forEach(el => observer.observe(el))
    }

    observe()

    // Re-observe after view changes — watch only direct children of main
    // (page content swaps), not the entire subtree which fires on every
    // class toggle, GSAP animation, and glass filter update
    const main = document.querySelector('main') || document.body
    const mo = new MutationObserver(() => {
      requestAnimationFrame(observe)
    })
    mo.observe(main, { childList: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
