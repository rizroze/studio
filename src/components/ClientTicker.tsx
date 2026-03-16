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

function LogoSet() {
  return (
    <div className="ticker-set">
      {LOGOS.map((logo) => (
        <img
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          className={`ticker-img ${logo.cls}`}
          loading="eager"
        />
      ))}
    </div>
  )
}

export function ClientTicker() {
  return (
    <div className="ticker-wrap">
      <div className="ticker-move">
        <LogoSet />
        <LogoSet />
      </div>
    </div>
  )
}
