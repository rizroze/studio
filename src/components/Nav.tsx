import { useEffect, useRef } from 'react'
import { useMobileNav, useNavScroll, navStore } from '../stores/navStore'

const NAV_ITEMS = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

interface NavProps {
  onLogoClick?: () => void
}

export function Nav({ onLogoClick }: NavProps) {
  const mobileOpen = useMobileNav()
  const { scrolledPastHero, pillExpanded } = useNavScroll()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = window.innerHeight * 0.7
      navStore.setScrolledPastHero(window.scrollY > heroHeight)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!pillExpanded) return
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        navStore.closePill()
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [pillExpanded])

  const handleLinkClick = () => {
    navStore.close()
    navStore.closePill()
  }

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onLogoClick) {
      onLogoClick()
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    navStore.closePill()
  }

  const navClass = [
    'site-nav',
    scrolledPastHero ? 'scrolled' : '',
    pillExpanded ? 'expanded' : ''
  ].filter(Boolean).join(' ')

  return (
    <nav className={navClass} ref={navRef}>
      <div className="nav-inner">
        <a href="#" className="nav-brand" onClick={scrollToTop}>
          <img src="/rizzy-avatar.png" alt="Rizzy Studio" className="nav-pfp" />
          <span className="nav-brand-text">Rizzy Studio</span>
        </a>

        <div className="nav-links desktop-only">
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              onClick={handleLinkClick}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a href="#contact" className="nav-cta desktop-only" onClick={handleLinkClick}>
          Book a call
        </a>

        <button
          className="nav-dot-toggle desktop-only"
          onClick={navStore.togglePill}
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>

        <button
          className={`nav-mobile-toggle mobile-only ${mobileOpen ? 'open' : ''}`}
          onClick={navStore.toggle}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {mobileOpen && (
        <div className="nav-mobile-menu">
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="nav-mobile-link"
              onClick={handleLinkClick}
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="nav-mobile-cta" onClick={handleLinkClick}>
            Book a call
          </a>
        </div>
      )}
    </nav>
  )
}
