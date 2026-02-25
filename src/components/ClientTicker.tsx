const LOGOS = [
  { src: '/content/logos/radiants-pixel.svg', alt: 'Radiants', className: 'logo-radiants' },
  { src: '/content/logos/hydex logo.png', alt: 'Hydex', className: 'logo-hydex' },
  { src: '/content/logos/Solana Logomark - Color.svg', alt: 'Solana', className: 'logo-solana' },
  { src: '/content/logos/soladex.svg', alt: 'Soladex', className: 'logo-soladex' },
  { src: '/content/logos/skr-seeker.png', alt: 'Seeker', className: 'logo-skr' },
  { src: '/content/logos/solana-mobile.svg', alt: 'Solana Mobile', className: 'logo-solana-mobile' },
]

export function ClientTicker() {
  // 2 identical copies — scroll by exactly -50% for seamless loop
  const doubled = [...LOGOS, ...LOGOS]
  return (
    <div className="client-ticker">
      <div className="client-ticker-track">
        {doubled.map((logo, i) => (
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
