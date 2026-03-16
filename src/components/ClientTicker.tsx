import { useEffect, useRef, useCallback } from 'react'

type LogoItem = { src: string; alt: string; className: string }

const LOGOS: LogoItem[] = [
  { src: '/content/logos/radiants-pixel.svg', alt: 'Radiants', className: 'logo-radiants' },
  { src: '/content/logos/hydex logo.png', alt: 'Hydex', className: 'logo-hydex' },
  { src: '/content/logos/Solana Logomark - Color.svg', alt: 'Solana', className: 'logo-solana' },
  { src: '/content/logos/soladex.svg', alt: 'Soladex', className: 'logo-soladex' },
  { src: '/content/logos/skr-seeker.png', alt: 'Seeker', className: 'logo-skr' },
  { src: '/content/logos/fullport-ticker.svg', alt: 'Fullport', className: 'logo-fullport' },
  { src: '/content/logos/wayy-logomark.webp', alt: 'WAYY', className: 'logo-wayy' },
  { src: '/content/logos/wfd-icon.svg', alt: "What's for Dinner", className: 'logo-wfd' },
  { src: '/content/logos/corner-c.webp', alt: 'The Corner', className: 'logo-corner' },
]

function LogoSet({ setRef }: { setRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={setRef as React.RefObject<HTMLDivElement>} className="ticker-set" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      {LOGOS.map((logo) => (
        <span key={logo.alt} className="ticker-logo-zone">
          <img
            src={logo.src}
            alt={logo.alt}
            className={`ticker-logo ${logo.className}`}
            loading="eager"
          />
        </span>
      ))}
    </div>
  )
}

export function ClientTicker() {
  const trackRef = useRef<HTMLDivElement>(null)
  const firstSetRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const widthRef = useRef(0)

  const measure = useCallback(() => {
    if (firstSetRef.current) {
      widthRef.current = firstSetRef.current.scrollWidth
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let animId: number

    // Measure after all images in the set have loaded
    const imgs = firstSetRef.current?.querySelectorAll('img') ?? []
    let loaded = 0
    const total = imgs.length

    const onImgReady = () => {
      loaded++
      if (loaded >= total) measure()
    }

    imgs.forEach(img => {
      if (img.complete) { loaded++ } else {
        img.addEventListener('load', onImgReady, { once: true })
        img.addEventListener('error', onImgReady, { once: true })
      }
    })
    if (loaded >= total) measure()

    window.addEventListener('resize', measure)

    const animate = () => {
      const w = widthRef.current
      if (w > 0) {
        posRef.current -= 0.5
        // Modulo wrap — no jump, no accumulation error
        posRef.current = ((posRef.current % w) + w) % w - w
        track.style.transform = `translate3d(${posRef.current}px, 0, 0)`
      }
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', measure)
      imgs.forEach(img => {
        img.removeEventListener('load', onImgReady)
        img.removeEventListener('error', onImgReady)
      })
    }
  }, [measure])

  return (
    <div className="client-ticker">
      <div className="client-ticker-track" ref={trackRef}>
        <LogoSet setRef={firstSetRef} />
        <LogoSet />
      </div>
    </div>
  )
}
