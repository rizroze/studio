import { useEffect, useRef } from 'react'

type LogoItem = { src: string; alt: string; className: string }

const LOGOS: LogoItem[] = [
  { src: '/content/logos/radiants-pixel.svg', alt: 'Radiants', className: 'logo-radiants' },
  { src: '/content/logos/hydex logo.png', alt: 'Hydex', className: 'logo-hydex' },
  { src: '/content/logos/Solana Logomark - Color.svg', alt: 'Solana', className: 'logo-solana' },
  { src: '/content/logos/soladex.svg', alt: 'Soladex', className: 'logo-soladex' },
  { src: '/content/logos/skr-seeker.png', alt: 'Seeker', className: 'logo-skr' },
  { src: '/content/logos/solana-mobile.svg', alt: 'Solana Mobile', className: 'logo-solana-mobile' },
  { src: '/content/logos/fullport-ticker.svg', alt: 'Fullport', className: 'logo-fullport' },
  { src: '/content/logos/wayy-logomark.webp', alt: 'WAYY', className: 'logo-wayy' },
  { src: '/content/logos/wfd-icon.svg', alt: "What's for Dinner", className: 'logo-wfd' },
  { src: '/content/logos/corner-c.webp', alt: 'The Corner', className: 'logo-corner' },
]

function LogoSet({ setRef }: { setRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={setRef} className="ticker-set" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      {LOGOS.map((logo) => (
        <span key={logo.alt} className="ticker-logo-zone">
          <img
            src={logo.src}
            alt={logo.alt}
            className={`ticker-logo ${logo.className}`}
          />
        </span>
      ))}
    </div>
  )
}

export function ClientTicker() {
  const trackRef = useRef<HTMLDivElement>(null)
  const firstSetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const firstSet = firstSetRef.current
    if (!track || !firstSet) return

    let animId: number
    let pos = 0
    const speed = 0.5 // px per frame

    const animate = () => {
      const setWidth = firstSet.offsetWidth
      if (setWidth === 0) { animId = requestAnimationFrame(animate); return }

      pos -= speed
      if (pos <= -setWidth) {
        pos += setWidth
      }
      track.style.transform = `translate3d(${pos}px, 0, 0)`
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="client-ticker">
      <div className="client-ticker-track" ref={trackRef} style={{ animation: 'none' }}>
        <LogoSet setRef={firstSetRef} />
        <LogoSet />
      </div>
    </div>
  )
}
