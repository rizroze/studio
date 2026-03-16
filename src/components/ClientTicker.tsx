import { useEffect, useRef } from 'react'

const LOGOS = [
  { src: '/content/logos/radiants-pixel.svg', alt: 'Radiants', cls: 'logo-radiants' },
  { src: '/content/logos/wayy-logomark.webp', alt: 'WAYY', cls: 'logo-wayy' },
  { src: '/content/logos/hydex logo.webp', alt: 'Hydex', cls: 'logo-hydex' },
  { src: '/content/logos/fullport-ticker.svg', alt: 'Fullport', cls: 'logo-fullport' },
  { src: '/content/logos/wfd-icon.svg', alt: "What's for Dinner", cls: 'logo-wfd' },
  { src: '/content/logos/corner-c.webp', alt: 'The Corner', cls: 'logo-corner' },
  { src: '/content/logos/Solana Logomark - Color.svg', alt: 'Solana', cls: 'logo-solana' },
  { src: '/content/logos/solana-mobile.svg', alt: 'Solana Mobile', cls: 'logo-solana-mobile' },
  { src: '/content/logos/soladex.svg', alt: 'Soladex', cls: 'logo-soladex' },
  { src: '/content/logos/skr-seeker.webp', alt: 'Seeker', cls: 'logo-skr' },
]

function LogoRow() {
  return (
    <>
      {LOGOS.map((logo, i) => (
        <img key={i} src={logo.src} alt={logo.alt} className={`ticker-img ${logo.cls}`} loading="eager" />
      ))}
    </>
  )
}

export function ClientTicker() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const moveRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = moveRef.current
    const set = setRef.current
    if (!move || !set) return

    let pos = 0
    let setWidth = 0
    let raf: number

    const measure = () => {
      setWidth = set.offsetWidth
    }

    // Wait for all images to load then measure
    const imgs = set.querySelectorAll('img')
    let loaded = 0
    const total = imgs.length
    const onLoad = () => {
      loaded++
      if (loaded >= total) measure()
    }
    imgs.forEach(img => {
      if (img.complete) loaded++
      else {
        img.addEventListener('load', onLoad, { once: true })
        img.addEventListener('error', onLoad, { once: true })
      }
    })
    if (loaded >= total) measure()

    // Also measure on resize
    window.addEventListener('resize', measure)

    const tick = () => {
      if (setWidth > 0) {
        pos -= 0.6
        if (Math.abs(pos) >= setWidth) pos += setWidth
        move.style.transform = `translate3d(${pos}px,0,0)`
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div className="ticker-wrap" ref={wrapRef}>
      <div className="ticker-move" ref={moveRef}>
        <div className="ticker-set" ref={setRef}><LogoRow /></div>
        <div className="ticker-set"><LogoRow /></div>
        <div className="ticker-set"><LogoRow /></div>
      </div>
    </div>
  )
}
