const LOGOS = [
  { src: '/content/logos/radiants-pixel.svg', alt: 'Radiants', className: 'logo-radiants' },
  { src: '/content/logos/hydex logo.png', alt: 'Hydex', className: 'logo-hydex' },
  { src: '/content/logos/Solana Logomark - Color.svg', alt: 'Solana', className: 'logo-solana' },
  { src: '/content/logos/soladex.svg', alt: 'Soladex', className: 'logo-soladex' },
  { src: '/content/logos/skr-seeker.png', alt: 'Seeker', className: 'logo-skr' },
  { src: '/content/logos/solana-mobile.svg', alt: 'Solana Mobile', className: 'logo-solana-mobile' },
]

export function ClientTicker() {
  // 4 copies so the track is always wider than the viewport — scroll -25% for seamless loop
  const repeated = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS]
  return (
    <div className="client-ticker">
      <div className="client-ticker-track">
        {repeated.map((logo, i) => (
          <span key={`${logo.alt}-${i}`} className="ticker-logo-zone">
            <img
              src={logo.src}
              alt={logo.alt}
              className={`ticker-logo ${logo.className}`}
            />
          </span>
        ))}
      </div>
    </div>
  )
}
