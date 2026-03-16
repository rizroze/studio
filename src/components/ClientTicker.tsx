import { useEffect, useRef, useState } from 'react'

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
  const moveRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const move = moveRef.current
    const set = setRef.current
    if (!move || !set) return

    const apply = () => {
      const w = set.offsetWidth
      if (w <= 0) return
      // Speed: 0.6px per frame at 60fps = 36px/s
      const duration = w / 36
      move.style.setProperty('--ticker-width', `-${w}px`)
      move.style.animationDuration = `${duration}s`
      setReady(true)
    }

    // Wait for all images to load then measure
    const imgs = set.querySelectorAll('img')
    let loaded = 0
    const total = imgs.length
    const onLoad = () => { loaded++; if (loaded >= total) apply() }
    imgs.forEach(img => {
      if (img.complete) loaded++
      else {
        img.addEventListener('load', onLoad, { once: true })
        img.addEventListener('error', onLoad, { once: true })
      }
    })
    if (loaded >= total) apply()

    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

  return (
    <div className="ticker-wrap">
      <div className={`ticker-move ${ready ? 'ticker-running' : ''}`} ref={moveRef}>
        <div className="ticker-set" ref={setRef}><LogoRow /></div>
        <div className="ticker-set"><LogoRow /></div>
        <div className="ticker-set"><LogoRow /></div>
      </div>
    </div>
  )
}
