import { useRef, useLayoutEffect } from 'react'
import { IMAGE_DIMS } from './imageDims'
import { med } from './disciplines'

interface V2BentoProps {
  gallery: string[]
  cols?: number
  onOpenImage: (images: string[], index: number) => void
}

const GAP = 6

// span is decided up front from precomputed ratios — no reflow as images load
function spanClass(src: string): string {
  const d = IMAGE_DIMS[src]
  if (!d) return ''
  const r = d[0] / d[1]
  return r > 1.4 ? 'wide' : r < 0.72 ? 'tall' : ''
}

const markIn = (e: React.SyntheticEvent<HTMLImageElement>) => e.currentTarget.classList.add('in')
const refIn = (img: HTMLImageElement | null) => {
  // already-cached images: defer two frames so the transparent state paints and they fade too
  if (img?.complete) requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('in')))
}
// animated gifs mount already-revealed: Chromium restarts a CSS transition as
// gif frames stream in, so a class flip after paint leaves them stuck at the
// transition's start state (invisible) forever
export const fadeClass = (src: string) =>
  /\.gif$/i.test(src) ? 'v2-fadeimg in' : 'v2-fadeimg'

// Bento grid: square base cells; wide images span 2 cols, tall span 2 rows.
export function V2Bento({ gallery, cols = 4, onOpenImage }: V2BentoProps) {
  const ref = useRef<HTMLDivElement>(null)

  // keep row height == column width (square base), responsive
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const compute = () => {
      const w = el.clientWidth
      const eff = w < 560 ? Math.min(cols, 4) : cols
      const colW = (w - GAP * (eff - 1)) / eff
      el.style.setProperty('--cols', String(eff))
      el.style.setProperty('--row', `${colW}px`)
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [cols])

  return (
    <div className="v2-bento" ref={ref}>
      {gallery.map((src, i) => (
        <button
          key={src}
          className={`v2-bento-item ${spanClass(src)}`}
          data-lbsrc={src}
          onClick={() => onOpenImage(gallery, i)}
        >
          <img
            className={fadeClass(src)}
            ref={refIn}
            onLoad={markIn}
            src={med(src)}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </button>
      ))}
    </div>
  )
}
