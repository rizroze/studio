import { useRef, useLayoutEffect } from 'react'

interface V2MosaicProps {
  images: string[]
  runKey: string   // discipline id — replay when it changes
  cols?: number    // dense column count (big layout = one column fewer)
  onOpen: () => void
}

// DESIGN-RULES "Smooth ease": the curve for something moving between two
// positions. Gentle in, gentle out, and — unlike the overshoot this used to
// run — it never passes its mark and creeps back, which reads as a snap.
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

// Goal: see the BIG grid, then it gets smaller and every tile repositions into
// the dense grid because the column system changed — a real layout FLIP, held
// briefly, then a staggered reflow.
export function V2Mosaic({ images, runKey, cols = 3, onOpen }: V2MosaicProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const items = Array.from(grid.children) as HTMLElement[]
    if (!items.length) return

    const timers: number[] = []

    // measure dense (final 6-col), then big (3-col)
    const dense = items.map(el => el.getBoundingClientRect())
    grid.classList.add('mosaic-big')
    const big = items.map(el => el.getBoundingClientRect())
    grid.classList.remove('mosaic-big')

    // park each tile at its BIG position/size — visible (no fade), so you see it
    items.forEach((el, i) => {
      const d = dense[i]
      const b = big[i]
      el.style.transformOrigin = 'top left'
      el.style.transition = 'none'
      el.style.transform =
        `translate(${b.left - d.left}px, ${b.top - d.top}px) scale(${b.width / d.width})`
    })
    void grid.offsetWidth

    // hold the big view briefly, then reflow every tile to its dense slot
    const hold = window.setTimeout(() => {
      items.forEach((el, i) => {
        el.style.transition = `transform 0.6s ${EASE} ${i * 0.012}s`
        el.style.transform = ''
      })
      const cleanup = window.setTimeout(() => {
        items.forEach(el => {
          el.style.transition = ''
          el.style.transform = ''
          el.style.transformOrigin = ''
        })
      }, 700 + items.length * 12)
      timers.push(cleanup)
    }, 420)
    timers.push(hold)

    return () => timers.forEach(clearTimeout)
  }, [runKey])

  return (
    <div className="v2-home-mosaic-clip">
      <div
        className="v2-home-mosaic"
        ref={gridRef}
        // big = one column fewer, so the jump stays gentle whatever the dense
        // count is. Halving it made mobile (4 cols) leap 2.06x against
        // desktop's 1.52x, which threw all but 4 tiles outside the clip box —
        // you saw them pop in rather than rearrange.
        style={{ '--mcols': cols, '--mcols-big': Math.max(1, cols - 1) } as React.CSSProperties}
      >
        {images.map((src, i) => (
          // key per discipline+slot: hovering a new branch remounts fresh tiles
          // instead of swapping src on a reused <img> (which flashed the stale image)
          <button key={`${runKey}-${i}`} className="v2-mosaic-item" onClick={onOpen}>
            <img src={src} alt="" decoding="async" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  )
}
