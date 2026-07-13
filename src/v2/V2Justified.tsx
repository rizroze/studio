import { useRef, useState, useLayoutEffect, useMemo } from 'react'
import { IMAGE_DIMS } from './imageDims'
import { med } from './disciplines'
import { fadeClass } from './V2Bento'

interface V2JustifiedProps {
  gallery: string[]
  onOpenImage: (images: string[], index: number) => void
}

const GAP = 8

const markIn = (e: React.SyntheticEvent<HTMLImageElement>) => e.currentTarget.classList.add('in')
const refIn = (img: HTMLImageElement | null) => {
  if (img?.complete) requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('in')))
}

type Tile = { src: string; i: number; w: number; h: number }

// Justified-rows bento: every image keeps its native aspect ratio, each row is
// scaled to a shared height so it fills the container edge-to-edge, and nothing
// is cropped or left out. Widths come from precomputed dims — no reflow.
function layout(gallery: string[], width: number): Tile[][] {
  if (!width) return []
  const target = width < 560 ? 190 : width < 960 ? 250 : 300
  const ratios = gallery.map((src) => {
    const d = IMAGE_DIMS[src]
    return d ? d[0] / d[1] : 1
  })

  const rows: Tile[][] = []
  let row: { src: string; i: number; r: number }[] = []
  let rowRatio = 0

  const flush = (justify: boolean) => {
    if (!row.length) return
    const gaps = GAP * (row.length - 1)
    // justified rows scale to fill the width; the last row keeps target height
    const h = justify ? (width - gaps) / rowRatio : target
    rows.push(row.map(({ src, i, r }) => ({ src, i, w: r * h, h })))
    row = []
    rowRatio = 0
  }

  gallery.forEach((src, i) => {
    row.push({ src, i, r: ratios[i] })
    rowRatio += ratios[i]
    const gaps = GAP * (row.length - 1)
    if (rowRatio * target + gaps >= width) flush(true)
  })
  flush(false)
  return rows
}

export function V2Justified({ gallery, onOpenImage }: V2JustifiedProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const rows = useMemo(() => layout(gallery, width), [gallery, width])

  return (
    <div className="v2-justified" ref={ref} style={{ gap: GAP }}>
      {rows.map((r, ri) => (
        <div className="v2-just-row" key={ri} style={{ gap: GAP }}>
          {r.map(({ src, i, w, h }) => (
            <button
              key={src}
              className="v2-just-item"
              style={{ width: w, height: h }}
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
      ))}
    </div>
  )
}
