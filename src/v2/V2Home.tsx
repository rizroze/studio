import { useRef, useEffect } from 'react'
import { FEATURED_WORKS } from './featured'
import type { FeaturedWork } from './featured'
import { findPieceDiscipline, med, videoPoster } from './disciplines'
import { IMAGE_DIMS } from './imageDims'
import { projectLogo } from './clientLogos'
import { HOMEPAGE_CLIENTS } from './clientLogos'

// An autoplaying still — same contract as V2VideoTile (muted, IntersectionObserver,
// pauses off screen) but with no click of its own: the whole tile is a button
// that opens the discipline, so the video must not steal the press for a
// fullscreen overlay.
function FeatureVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.play().catch(() => {}); else el.pause() },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <video ref={ref} src={src} poster={videoPoster(src)} muted loop playsInline preload="metadata" />
}

function FeatureTile({ work, n, onOpen }: { work: FeaturedWork; n: number; onOpen: () => void }) {
  const isVideo = /\.mp4$/i.test(work.src)
  // the piece's own shape by default — a screen looks like a screen and a
  // social cut looks like a social cut. 4:3 only when dims are unknown.
  const dims = IMAGE_DIMS[work.src]
  const ratio = work.ratio ?? (dims ? dims[0] / dims[1] : 4 / 3)
  const label = findPieceDiscipline(work.src)?.label ?? ''
  const logo = work.client ? projectLogo(work.client) : undefined
  return (
    <button className={`v2-feature${work.wide ? ' wide' : ''}`} onClick={onOpen}>
      {/* fixed before the media loads so the grid never reflows mid-decode */}
      <div
        className="v2-feature-frame"
        style={{ aspectRatio: ratio, ['--zoom' as string]: work.zoom ?? 1 }}
      >
        {isVideo
          ? <FeatureVideo src={work.src} />
          : (
            <img
              src={med(work.src)}
              // the 640px medium is fine for a grid thumbnail and far too soft
              // for the homepage's biggest images on a 2x screen — offer both
              // and let the browser pick against the real rendered width
              srcSet={dims ? `${med(work.src)} 640w, ${work.src} ${dims[0]}w` : undefined}
              sizes="(max-width: 820px) 100vw, 46vw"
              alt=""
              loading={n <= 2 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
          )}
      </div>
      {/* same quiet mono caption as a discipline block header — logo, client,
          title. The display face is for the work itself, not for labelling it */}
      <div className="v2-feature-meta">
        {logo && (
          <img
            className={`v2-disc-logo${logo.invert ? ' invert' : ''}`}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
          />
        )}
        {work.client && (
          <>
            <span className="v2-feature-client">{work.client}</span>
            {work.title && <span className="v2-feature-sep">·</span>}
          </>
        )}
        {work.title && <span className="v2-feature-name">{work.title}</span>}
        <span className="v2-feature-disc">{label}</span>
        <span className="v2-arrow">→</span>
      </div>
      <p className="v2-feature-note">{work.note}</p>
    </button>
  )
}

interface V2HomeProps {
  onOpenWorks: () => void
  onOpenPiece: (src: string) => void
}

export function V2Home({ onOpenWorks, onOpenPiece }: V2HomeProps) {
  return (
    <div className="v2-home v2-fade">
      <div className="v2-home-top">
        <span className="v2-crumb">
          <span>Selected Work</span>
          <span className="v2-crumb-sep">·</span>
          <span>{FEATURED_WORKS.length} pieces</span>
        </span>
        {/* the homepage's only exit, so it reads as a destination rather than a
            link — everything else lives one click deep, on /works */}
        <button className="v2-works-link" onClick={onOpenWorks}>
          Works <span className="v2-arrow">→</span>
        </button>
      </div>

      <div className="v2-featured">
        {FEATURED_WORKS.map((w, i) => (
          <FeatureTile key={w.src} work={w} n={i + 1} onOpen={() => onOpenPiece(w.src)} />
        ))}
      </div>

      <div className="v2-clients">
        <span className="v2-clients-head">Worked with</span>
        <div className="v2-clients-row">
          {HOMEPAGE_CLIENTS.map((c) => (
            <img
              key={c.alt}
              className={`v2-client-logo${c.invert ? ' invert' : ''}${c.wordmark ? ' wordmark' : ''}${c.smaller ? ' smaller' : ''}`}
              src={c.src}
              alt={c.alt}
              title={c.alt}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
