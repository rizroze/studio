import { useEffect, useState, useRef } from 'react'

const SECTIONS = [
  { id: 'hero', label: 'Top' },
  { id: 'work', label: 'Work' },
  { id: 'testimonials', label: 'Proof' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

const TICKS_BETWEEN = 2
const STEP = TICKS_BETWEEN + 1 // positions between section dots

// Dock magnification curve
function dockScale(dist: number): number {
  const radius = 4 // how many positions the magnification reaches
  if (dist >= radius) return 0
  // cosine falloff — smooth bell curve like macOS Dock
  return (1 + Math.cos(Math.PI * dist / radius)) / 2
}

export function ScrollNav() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const rafRef = useRef(0)
  const offsetsRef = useRef<number[]>([])

  // Cache section offsets on mount + resize
  useEffect(() => {
    const cacheOffsets = () => {
      offsetsRef.current = SECTIONS.map(s => {
        const el = document.getElementById(s.id)
        return el ? el.offsetTop : 0
      })
    }
    cacheOffsets()
    window.addEventListener('resize', cacheOffsets, { passive: true })
    return () => window.removeEventListener('resize', cacheOffsets)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY
        const vh = window.innerHeight
        const offsets = offsetsRef.current

        setVisible(y > vh * 0.4)

        let currentIdx = 0
        let sectionProgress = 0

        for (let i = 0; i < offsets.length; i++) {
          const top = offsets[i] - vh * 0.4
          if (y >= top) {
            currentIdx = i
            if (i < offsets.length - 1) {
              const sectionHeight = offsets[i + 1] - offsets[i]
              sectionProgress = Math.min(1, Math.max(0, (y - top) / sectionHeight))
            } else {
              const remaining = document.body.scrollHeight - offsets[i] - vh
              sectionProgress = remaining > 0 ? Math.min(1, (y - top) / remaining) : 1
            }
          }
        }

        setActiveIdx(currentIdx)
        setProgress(sectionProgress)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth' })
  }

  // Build flat list with sequential positions
  const items: { type: 'section' | 'tick'; sectionIdx: number; tickIdx?: number; pos: number }[] = []
  let pos = 0
  SECTIONS.forEach((_, i) => {
    items.push({ type: 'section', sectionIdx: i, pos })
    pos++
    if (i < SECTIONS.length - 1) {
      for (let t = 0; t < TICKS_BETWEEN; t++) {
        items.push({ type: 'tick', sectionIdx: i, tickIdx: t, pos })
        pos++
      }
    }
  })

  // Interpolated active position for smooth magnification
  const activeSectionPos = activeIdx * STEP
  const nextSectionPos = (activeIdx + 1) * STEP
  const activePos = activeSectionPos + (activeIdx < SECTIONS.length - 1 ? progress * (nextSectionPos - activeSectionPos) : 0)

  return (
    <nav
      className={`scroll-nav ${visible ? 'scroll-nav-visible' : ''} ${hovered ? 'scroll-nav-expanded' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="scroll-nav-track">
        {items.map((item, i) => {
          const dist = Math.abs(item.pos - activePos)
          const mag = dockScale(dist) // 0 to 1

          if (item.type === 'section') {
            const isActive = item.sectionIdx === activeIdx
            // Section dots: 4px base → 8px at full magnification
            const dotSize = 4 + mag * 4
            const dotOpacity = 0.3 + mag * 0.7

            return (
              <button
                key={`s-${item.sectionIdx}`}
                className="scroll-nav-dot"
                onClick={() => scrollTo(SECTIONS[item.sectionIdx].id)}
                aria-label={SECTIONS[item.sectionIdx].label}
              >
                <span
                  className="scroll-nav-pip"
                  style={{
                    width: dotSize,
                    height: dotSize,
                    background: isActive
                      ? '#fff'
                      : `rgba(255,255,255,${dotOpacity * 0.6})`,
                    boxShadow: isActive
                      ? `0 0 ${4 + mag * 4}px rgba(255,255,255,${0.3 + mag * 0.3})`
                      : 'none',
                  }}
                />
                <span className={`scroll-nav-label ${isActive ? 'scroll-nav-label-active' : ''}`}>
                  {SECTIONS[item.sectionIdx].label}
                </span>
              </button>
            )
          }

          // Tick dots: 2px base → 4px at full magnification
          const tickSize = 2 + mag * 2
          const tickThreshold = (item.tickIdx! + 1) / (TICKS_BETWEEN + 1)
          const isLit = item.sectionIdx < activeIdx ||
            (item.sectionIdx === activeIdx && progress >= tickThreshold)
          const tickOpacity = isLit ? 0.25 + mag * 0.35 : 0.1 + mag * 0.1

          return (
            <div key={`t-${i}`} className="scroll-nav-tick">
              <span
                className="scroll-nav-tick-dot"
                style={{
                  width: tickSize,
                  height: tickSize,
                  background: `rgba(255,255,255,${tickOpacity})`,
                  display: 'block',
                }}
              />
            </div>
          )
        })}
      </div>
    </nav>
  )
}
