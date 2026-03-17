import { useEffect, useRef, useState } from 'react'
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
  scrollBarRef?: React.RefObject<HTMLDivElement | null>
}

export function Nav({ onLogoClick, scrollBarRef }: NavProps) {
  const mobileOpen = useMobileNav()
  const { scrolledPastHero, pillExpanded, activeSection, atFooter } = useNavScroll()
  const navRef = useRef<HTMLElement>(null)
  const dotRef = useRef<HTMLButtonElement>(null)
  const angleRef = useRef(0)
  const orbitingRef = useRef(true)
  const targetAngleRef = useRef<number | null>(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuClosing, setMenuClosing] = useState(false)

  // JS-driven orbit for the 2-dot toggle
  useEffect(() => {
    const el = dotRef.current
    if (!el) return
    let animId: number
    const speed = 360 / 3000 // 360deg per 3s (in deg/ms)
    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = now - lastTime
      lastTime = now

      if (targetAngleRef.current !== null) {
        // Smoothly rotate forward toward target
        const target = targetAngleRef.current
        const remaining = target - angleRef.current
        if (remaining <= 0.5) {
          angleRef.current = target
          targetAngleRef.current = null
          orbitingRef.current = false
        } else {
          // Ease out as we approach target, but never slower than orbit speed
          const easeSpeed = Math.max(speed * dt, remaining * 0.08)
          angleRef.current += easeSpeed
        }
      } else if (orbitingRef.current) {
        angleRef.current += speed * dt
      }

      el.style.transform = `rotate(${angleRef.current % 360}deg)`
      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [])

  // When menu opens/closes, set orbit target
  useEffect(() => {
    if (mobileOpen) {
      // Find next 90deg forward from current angle
      const current = angleRef.current % 360
      const next90 = Math.ceil(current / 90) * 90
      // If we're already very close to 90, go to the next one
      targetAngleRef.current = angleRef.current + (next90 - current < 5 ? 90 + (next90 - current) : (next90 - current))
    } else {
      // Resume orbiting from current position
      orbitingRef.current = true
    }
  }, [mobileOpen])

  // Sync menu visibility with open state, adding close animation delay
  useEffect(() => {
    if (mobileOpen) {
      setMenuClosing(false)
      setMenuVisible(true)
    } else if (menuVisible) {
      setMenuClosing(true)
      const timer = setTimeout(() => {
        setMenuVisible(false)
        setMenuClosing(false)
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [mobileOpen])

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

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    navStore.close()
    navStore.closePill()
    navStore.lockActiveSection(href.slice(1))
    const el = document.getElementById(href.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth' })
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
      <nav className={navClass} ref={navRef} onClick={(e) => {
        // On mobile, clicking anywhere on the pill toggles menu
        if (window.innerWidth <= 768) {
          // Don't toggle if clicking a link or the brand
          const target = e.target as HTMLElement
          if (target.closest('a') || target.closest('.nav-cta')) return
          navStore.toggle()
        }
      }}>
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
                onClick={(e) => handleLinkClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <a href="#contact" className="nav-cta desktop-only" onClick={(e) => handleLinkClick(e, '#contact')}>
            Book a call
          </a>

          <button
            className="nav-dot-toggle desktop-only"
            onClick={navStore.togglePill}
            aria-label="Toggle navigation"
          >
            <span /><span />
          </button>

          <button
            ref={dotRef}
            className={`nav-mobile-toggle mobile-only ${mobileOpen ? 'open' : ''}`}
            onClick={(e) => { e.stopPropagation(); navStore.toggle() }}
            aria-label="Toggle menu"
          >
            <span /><span />
          </button>
        </div>
        {scrollBarRef && <div className="scroll-progress" ref={scrollBarRef as React.RefObject<HTMLDivElement>} />}
      </nav>

      {menuVisible && createPortal(
        <div className="nav-mobile-backdrop" onClick={() => navStore.close()} />,
        document.body
      )}
      {menuVisible && createPortal(
        <div className={`nav-mobile-menu ${menuClosing ? 'closing' : ''}`}>
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
                onClick={(e) => handleLinkClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
