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

function LogoSet() {
  return (
    <>
      {LOGOS.map((logo) => (
        <span key={logo.alt} className="ticker-logo-zone">
          <img
            src={logo.src}
            alt={logo.alt}
            className={`ticker-logo ${logo.className}`}
          />
        </span>
      ))}
    </>
  )
}

export function ClientTicker() {
  return (
    <div className="client-ticker">
      <div className="client-ticker-track">
        <LogoSet />
        <LogoSet />
      </div>
    </div>
  )
}
