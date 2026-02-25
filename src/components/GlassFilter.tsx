import { useEffect, useRef, useCallback } from 'react'

/**
 * SVG displacement filter — real liquid glass refraction.
 * Based on Jhey Tompkins' technique (codepen.io/jh3y).
 *
 * The displacement map is generated via Canvas 2D because feImage loads
 * SVG data URIs as static images where CSS properties (mix-blend-mode,
 * filter:blur) are not reliably applied. Canvas performs these operations
 * natively (globalCompositeOperation, ctx.filter), producing correct bitmaps.
 *
 * The SVG filter region is extended well beyond the element so that
 * feDisplacementMap can sample backdrop content from outside the pill.
 * Without this, displaced pixels reference transparent/out-of-bounds
 * areas and the warp effect is invisible.
 *
 * Chromium only. Safari/Firefox fall back to regular backdrop-filter: blur().
 */

interface GlassConfig {
  width: number
  height: number
  radius: number
  scale: number
  border: number
  lightness: number
  alpha: number
  blur: number
  r: number
  g: number
  b: number
  x: string
  y: string
  frost: number
  saturation: number
  displace: number
}

// Exact reference values — same for all sizes
const BASE: GlassConfig = {
  width: 240,
  height: 48,
  radius: 50,
  scale: -180,
  border: 0.07,
  lightness: 50,
  alpha: 0.93,
  blur: 11,
  r: 0,
  g: 10,
  b: 20,
  x: 'R',
  y: 'B',
  frost: 0,
  saturation: 1,
  displace: 0,
}

const PILL_COLLAPSED: GlassConfig = { ...BASE }
const PILL_EXPANDED: GlassConfig = { ...BASE, width: 600 }


// Cache displacement maps by config dimensions — avoids regenerating
// the same Canvas + toDataURL() on every MutationObserver callback
const _mapCache = new Map<string, string>()

/**
 * Build displacement map via Canvas 2D.
 *
 * The canvas is sized to cover the FULL SVG filter region (3× element width,
 * 5× element height) so feImage can fill the filter region without stretching
 * or misaligning the pill shape. Areas outside the pill are neutral gray
 * (RGB 128,128,128 = zero displacement).
 */
function buildDisplacementMap(c: GlassConfig): string {
  const key = `${c.width}:${c.height}:${c.radius}:${c.border}:${c.blur}:${c.lightness}:${c.alpha}`
  const cached = _mapCache.get(key)
  if (cached) return cached
  // Filter region matches max displacement: |scale| * 0.5 = 90px
  // Pad each side by 90px, converted to fractions of element dimensions
  const maxDisplace = Math.abs(c.scale) * 0.5
  const padX = Math.ceil(maxDisplace)
  const padY = Math.ceil(maxDisplace)
  const totalW = c.width + padX * 2
  const totalH = c.height + padY * 2

  const canvas = document.createElement('canvas')
  canvas.width = totalW
  canvas.height = totalH
  const ctx = canvas.getContext('2d')!

  // Neutral gray everywhere — zero displacement outside the pill
  ctx.fillStyle = 'rgb(128, 128, 128)'
  ctx.fillRect(0, 0, totalW, totalH)

  // Offset to center the pill in the canvas
  const ox = padX
  const oy = padY

  // --- Draw displacement gradients within pill shape ---
  ctx.save()

  // Clip to pill shape (matches the element's border-radius)
  ctx.beginPath()
  ctx.roundRect(ox, oy, c.width, c.height, c.radius)
  ctx.clip()

  // Black base within pill
  ctx.fillStyle = '#000000'
  ctx.fillRect(ox, oy, c.width, c.height)

  // Red gradient: right → left (drives X-axis displacement)
  const redGrad = ctx.createLinearGradient(ox + c.width, oy, ox, oy)
  redGrad.addColorStop(0, '#000000')
  redGrad.addColorStop(1, '#ff0000')
  ctx.fillStyle = redGrad
  ctx.fillRect(ox, oy, c.width, c.height)

  // Blue gradient: top → bottom (drives Y-axis displacement)
  // Blended with 'difference' to create the correct 2-axis displacement field
  ctx.globalCompositeOperation = 'difference'
  const blueGrad = ctx.createLinearGradient(ox, oy, ox, oy + c.height)
  blueGrad.addColorStop(0, '#000000')
  blueGrad.addColorStop(1, '#0000ff')
  ctx.fillStyle = blueGrad
  ctx.fillRect(ox, oy, c.width, c.height)

  // Center neutralization: gray rect with blur creates smooth falloff
  // from neutral center (no displacement) to distorted edges
  ctx.globalCompositeOperation = 'source-over'
  const border = Math.min(c.width, c.height) * (c.border * 0.5)
  ctx.filter = `blur(${c.blur}px)`
  ctx.fillStyle = `hsla(0, 0%, ${c.lightness}%, ${c.alpha})`
  ctx.beginPath()
  ctx.roundRect(
    ox + border, oy + border,
    c.width - border * 2, c.height - border * 2,
    c.radius
  )
  ctx.fill()

  ctx.restore()

  const uri = canvas.toDataURL()
  _mapCache.set(key, uri)
  return uri
}

// Chromium-based browsers support backdrop-filter: url() — Safari/Firefox don't
const isChromium = typeof navigator !== 'undefined' &&
  /Chrome\//.test(navigator.userAgent)

export function GlassFilter() {
  const filterRef = useRef<SVGFilterElement>(null)
  const feImageRef = useRef<SVGFEImageElement>(null)
  const redRef = useRef<SVGFEDisplacementMapElement>(null)
  const greenRef = useRef<SVGFEDisplacementMapElement>(null)
  const blueRef = useRef<SVGFEDisplacementMapElement>(null)
  const blurRef = useRef<SVGFEGaussianBlurElement>(null)

  const applyConfig = useCallback((c: GlassConfig) => {
    const uri = buildDisplacementMap(c)
    // Sync the SVG filter region with the canvas padding
    if (filterRef.current) {
      const maxD = Math.abs(c.scale) * 0.5
      const pctX = Math.ceil((maxD / c.width) * 100)
      const pctY = Math.ceil((maxD / c.height) * 100)
      filterRef.current.setAttribute('x', `-${pctX}%`)
      filterRef.current.setAttribute('y', `-${pctY}%`)
      filterRef.current.setAttribute('width', `${100 + pctX * 2}%`)
      filterRef.current.setAttribute('height', `${100 + pctY * 2}%`)
    }
    if (feImageRef.current) {
      feImageRef.current.setAttributeNS('http://www.w3.org/1999/xlink', 'href', uri)
      feImageRef.current.setAttribute('href', uri)
    }
    if (redRef.current) {
      redRef.current.setAttribute('scale', String(c.scale + c.r))
      redRef.current.setAttribute('xChannelSelector', c.x)
      redRef.current.setAttribute('yChannelSelector', c.y)
    }
    if (greenRef.current) {
      greenRef.current.setAttribute('scale', String(c.scale + c.g))
      greenRef.current.setAttribute('xChannelSelector', c.x)
      greenRef.current.setAttribute('yChannelSelector', c.y)
    }
    if (blueRef.current) {
      blueRef.current.setAttribute('scale', String(c.scale + c.b))
      blueRef.current.setAttribute('xChannelSelector', c.x)
      blueRef.current.setAttribute('yChannelSelector', c.y)
    }
    if (blurRef.current) {
      blurRef.current.setAttribute('stdDeviation', String(c.displace))
    }
    document.documentElement.style.setProperty('--glass-frost', String(c.frost))
    document.documentElement.style.setProperty('--glass-saturation', String(c.saturation))
  }, [])

  useEffect(() => {
    if (isChromium) {
      document.documentElement.dataset.glass = 'true'
    }
  }, [])

  useEffect(() => {
    if (!isChromium) return

    const nav = document.querySelector('.site-nav')
    if (!nav) return

    const update = () => {
      const isScrolled = nav.classList.contains('scrolled')
      if (!isScrolled) return // fullbar doesn't use displacement (too wide, kills perf)
      const isExpanded = nav.classList.contains('expanded')
      applyConfig(isExpanded ? PILL_EXPANDED : PILL_COLLAPSED)
    }

    update()

    const observer = new MutationObserver(update)
    observer.observe(nav, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [applyConfig])

  if (!isChromium) return null

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/*
          Filter region is set dynamically in applyConfig() to match
          the displacement map's padding (based on max displacement distance).
          Tighter region = less GPU work = smoother scrolling.
        */}
        <filter
          ref={filterRef}
          id="glass-displacement"
          colorInterpolationFilters="sRGB"
          x="-38%"
          y="-188%"
          width="176%"
          height="476%"
        >
          {/*
            feImage fills the entire filter region (default 100%).
            The Canvas displacement map is pre-sized to match this region
            with the pill centered and neutral gray padding around it.
          */}
          <feImage
            ref={feImageRef}
            result="map"
            preserveAspectRatio="none"
          />
          {/* RED channel — strongest displacement */}
          <feDisplacementMap
            ref={redRef}
            in="SourceGraphic" in2="map"
            xChannelSelector="R" yChannelSelector="B"
            result="dispRed"
          />
          <feColorMatrix
            in="dispRed" type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red"
          />
          {/* GREEN channel — least displaced */}
          <feDisplacementMap
            ref={greenRef}
            in="SourceGraphic" in2="map"
            xChannelSelector="R" yChannelSelector="B"
            result="dispGreen"
          />
          <feColorMatrix
            in="dispGreen" type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="green"
          />
          {/* BLUE channel — medium displacement */}
          <feDisplacementMap
            ref={blueRef}
            in="SourceGraphic" in2="map"
            xChannelSelector="R" yChannelSelector="B"
            result="dispBlue"
          />
          <feColorMatrix
            in="dispBlue" type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blue"
          />
          {/* Blend channels back */}
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="output" />
          <feGaussianBlur ref={blurRef} in="output" stdDeviation="0" />
        </filter>
      </defs>
    </svg>
  )
}
