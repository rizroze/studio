import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
  const { scrolledPastHero, pillExpanded, activeSection, atFooter } = useNavScroll()
  const navRef = useRef<HTMLElement>(null)

  // Single throttled scroll handler for hero threshold + active section
  // Uses cached offsetTop values to avoid forced layout recalc on every frame
  useEffect(() => {
    const sectionIds = ['work', 'services', 'about', 'contact']
    let ticking = false
    let cachedOffsets: { id: string; top: number }[] = []

    const cacheOffsets = () => {
      cachedOffsets = sectionIds.map(id => {
        const el = document.getElementById(id)
        return { id, top: el ? el.offsetTop : Infinity }
      })
    }

    // Cache on load and resize (layout changes)
    cacheOffsets()
    window.addEventListener('resize', cacheOffsets)

    const update = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight * 0.7
      navStore.setScrolledPastHero(scrollY > heroHeight)

      const midpoint = scrollY + window.innerHeight * 0.4
      if (scrollY < window.innerHeight * 0.5) {
        navStore.setActiveSection('')
      } else {
        let active = ''
        for (const s of cachedOffsets) {
          if (s.top <= midpoint) active = s.id
        }
        navStore.setActiveSection(active)
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', cacheOffsets)
    }
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

  // Close mobile menu on scroll (dropdown doesn't block page)
  useEffect(() => {
    if (!mobileOpen) return
    const onScroll = () => navStore.close()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileOpen])

  const handleLinkClick = (href: string) => {
    navStore.close()
    navStore.closePill()
    navStore.lockActiveSection(href.slice(1))
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
    pillExpanded ? 'expanded' : '',
    atFooter ? 'at-footer' : ''
  ].filter(Boolean).join(' ')

  return (
    <>
      <nav className={navClass} ref={navRef}>
        <div className="nav-inner">
          <a href="#" className="nav-brand" onClick={scrollToTop}>
            <img src="/rizzy-avatar.webp" alt="Rizzy Studio" className="nav-pfp" />
            <span className={`nav-brand-text ${atFooter ? 'hide' : ''}`}>Rizzy Studio</span>
          </a>

          <div className="nav-links desktop-only">
            {NAV_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link ${activeSection === item.href.slice(1) ? 'active' : ''}`}
                onClick={() => handleLinkClick(item.href)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <a href="#contact" className="nav-cta desktop-only" onClick={() => handleLinkClick('#contact')}>
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
      </nav>

      {mobileOpen && createPortal(
        <div className="nav-mobile-menu">
          <div className="nav-mobile-header">
            <a href="#" className="nav-brand" onClick={(e) => { scrollToTop(e); navStore.close() }}>
              <img src="/rizzy-avatar.webp" alt="Rizzy Studio" className="nav-pfp" />
              <span className="nav-brand-text">Rizzy Studio</span>
            </a>
            <button className="nav-mobile-toggle open" onClick={() => navStore.close()} aria-label="Close menu">
              <span /><span /><span />
            </button>
          </div>
          <div className="nav-mobile-menu-inner">
            {NAV_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-mobile-link ${activeSection === item.href.slice(1) ? 'active' : ''}`}
                onClick={() => handleLinkClick(item.href)}
              >
                {item.label}
              </a>
            ))}
            <a href="https://cal.com/rizzytoday" target="_blank" rel="noopener noreferrer" className="nav-mobile-cta" onClick={() => navStore.close()}>
              Book a call
            </a>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
