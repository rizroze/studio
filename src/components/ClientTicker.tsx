import { useEffect, useRef } from 'react'

const LOGOS = [
  { src: '/content/logos/radiants-pixel.svg', alt: 'Radiants', cls: 'logo-radiants' },
  { src: '/content/logos/wayy-logomark.webp', alt: 'WAYY', cls: 'logo-wayy' },
  { src: '/content/logos/hydex logo.png', alt: 'Hydex', cls: 'logo-hydex' },
  { src: '/content/logos/fullport-ticker.svg', alt: 'Fullport', cls: 'logo-fullport' },
  { src: '/content/logos/wfd-icon.svg', alt: "What's for Dinner", cls: 'logo-wfd' },
  { src: '/content/logos/corner-c.webp', alt: 'The Corner', cls: 'logo-corner' },
  { src: '/content/logos/Solana Logomark - Color.svg', alt: 'Solana', cls: 'logo-solana' },
  { src: '/content/logos/solana-mobile.svg', alt: 'Solana Mobile', cls: 'logo-solana-mobile' },
  { src: '/content/logos/soladex.svg', alt: 'Soladex', cls: 'logo-soladex' },
  { src: '/content/logos/skr-seeker.png', alt: 'Seeker', cls: 'logo-skr' },
]

// Render logos 4 times so there's always enough to fill any screen
const ALL = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS]

export function ClientTicker() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let pos = 0
    let raf: number
    const speed = 0.6

    const tick = () => {
      pos -= speed
      // Reset when first set scrolls out (10 logos × ~80px avg = ~800px)
      // Measure actual first-set width for accuracy
      const firstSet = el.children.length / 4
      let w = 0
      for (let i = 0; i < firstSet; i++) {
        const child = el.children[i] as HTMLElement
        w += child.offsetWidth + 48 // 48 = gap
      }
      if (w > 0 && Math.abs(pos) >= w) pos += w
      el.style.transform = `translate3d(${pos}px,0,0)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="ticker-wrap">
      <div className="ticker-move" ref={ref}>
        {ALL.map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className={`ticker-img ${logo.cls}`}
            loading="eager"
          />
        ))}
      </div>
    </div>
  )
}
