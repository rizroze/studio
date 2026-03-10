type LogoItem = { src: string; alt: string; className: string } | { emoji: string; alt: string; className: string }

const LOGOS: LogoItem[] = [
  { src: '/content/logos/radiants-pixel.svg', alt: 'Radiants', className: 'logo-radiants' },
  { src: '/content/logos/hydex logo.png', alt: 'Hydex', className: 'logo-hydex' },
  { src: '/content/logos/Solana Logomark - Color.svg', alt: 'Solana', className: 'logo-solana' },
  { src: '/content/logos/soladex.svg', alt: 'Soladex', className: 'logo-soladex' },
  { src: '/content/logos/skr-seeker.png', alt: 'Seeker', className: 'logo-skr' },
  { src: '/content/logos/solana-mobile.svg', alt: 'Solana Mobile', className: 'logo-solana-mobile' },
  { src: '/content/logos/fullport-ticker.svg', alt: 'Fullport', className: 'logo-fullport' },
  { emoji: '🍴', alt: "What's for Dinner", className: 'logo-wfd' },
  { src: '/content/logos/corner-c.webp', alt: 'The Corner', className: 'logo-corner' },
]

export function ClientTicker() {
  // 2 identical halves — animate -50% so it loops seamlessly
  const repeated = [...LOGOS, ...LOGOS]
  return (
    <div className="client-ticker">
      <div className="client-ticker-track">
        {repeated.map((logo, i) => (
          <span key={`${logo.alt}-${i}`} className="ticker-logo-zone">
            {'emoji' in logo ? (
              <span className={`ticker-emoji ${logo.className}`}>{logo.emoji}</span>
            ) : (
              <img
                src={logo.src}
                alt={logo.alt}
                className={`ticker-logo ${logo.className}`}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
