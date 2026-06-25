import { useRef, useState, useLayoutEffect } from 'react'

interface V2BentoProps {
  gallery: string[]
  cols?: number
  onOpenImage: (images: string[], index: number) => void
}

const GAP = 6

// Bento grid: square base cells, but wide images span 2 cols and tall images
// span 2 rows so content keeps its native shape instead of being cropped square.
export function V2Bento({ gallery, cols = 4, onOpenImage }: V2BentoProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [spans, setSpans] = useState<Record<number, 'wide' | 'tall'>>({})

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

  const onLoad = (i: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const r = img.naturalWidth / img.naturalHeight
    const s: 'wide' | 'tall' | undefined = r > 1.4 ? 'wide' : r < 0.72 ? 'tall' : undefined
    setSpans(prev => {
      if (prev[i] === s) return prev
      const next = { ...prev }
      if (s) next[i] = s
      else delete next[i]
      return next
    })
  }

  return (
    <div className="v2-bento" ref={ref}>
      {gallery.map((src, i) => (
        <button
          key={src}
          className={`v2-bento-item ${spans[i] ?? ''}`}
          style={{ '--i': i } as React.CSSProperties}
          onClick={() => onOpenImage(gallery, i)}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            onLoad={(e) => onLoad(i, e)}
          />
        </button>
      ))}
    </div>
  )
}
