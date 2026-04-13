// core/liquid-glass.ts
function resolveConfig(el, opts) {
  const rect = el.getBoundingClientRect();
  const ab = opts.aberration ?? [0, 10, 20];
  return {
    width: opts.width ?? Math.round(rect.width),
    height: opts.height ?? Math.round(rect.height),
    radius: opts.borderRadius ?? 50,
    scale: opts.scale ?? -180,
    border: opts.border ?? 0.07,
    lightness: opts.lightness ?? 50,
    alpha: opts.alpha ?? 0.93,
    blur: opts.blur ?? 11,
    r: ab[0],
    g: ab[1],
    b: ab[2],
    frost: opts.frost ?? 0,
    saturation: opts.saturation ?? 1,
    displace: opts.displaceBlur ?? 0
  };
}
var isChromium = typeof navigator !== "undefined" && /Chrome\//.test(navigator.userAgent);
var _mapCache = /* @__PURE__ */ new Map();
function buildDisplacementMap(c) {
  const key = `${c.width}:${c.height}:${c.radius}:${c.scale}:${c.border}:${c.blur}:${c.lightness}:${c.alpha}`;
  const cached = _mapCache.get(key);
  if (cached) return cached;
  const maxDisplace = Math.max(Math.abs(c.scale) * 0.5, 20);
  const padX = Math.ceil(maxDisplace);
  const padY = Math.ceil(maxDisplace);
  const totalW = c.width + padX * 2;
  const totalH = c.height + padY * 2;
  const canvas = document.createElement("canvas");
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(128, 128, 128)";
  ctx.fillRect(0, 0, totalW, totalH);
  const ox = padX;
  const oy = padY;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(ox, oy, c.width, c.height, c.radius);
  ctx.clip();
  ctx.fillStyle = "#000000";
  ctx.fillRect(ox, oy, c.width, c.height);
  const redGrad = ctx.createLinearGradient(ox + c.width, oy, ox, oy);
  redGrad.addColorStop(0, "#000000");
  redGrad.addColorStop(1, "#ff0000");
  ctx.fillStyle = redGrad;
  ctx.fillRect(ox, oy, c.width, c.height);
  ctx.globalCompositeOperation = "difference";
  const blueGrad = ctx.createLinearGradient(ox, oy, ox, oy + c.height);
  blueGrad.addColorStop(0, "#000000");
  blueGrad.addColorStop(1, "#0000ff");
  ctx.fillStyle = blueGrad;
  ctx.fillRect(ox, oy, c.width, c.height);
  ctx.globalCompositeOperation = "source-over";
  const borderPx = Math.min(c.width, c.height) * (c.border * 0.5);
  ctx.filter = `blur(${c.blur}px)`;
  ctx.fillStyle = `hsla(0, 0%, ${c.lightness}%, ${c.alpha})`;
  ctx.beginPath();
  ctx.roundRect(
    ox + borderPx,
    oy + borderPx,
    c.width - borderPx * 2,
    c.height - borderPx * 2,
    c.radius
  );
  ctx.fill();
  ctx.restore();
  const uri = canvas.toDataURL();
  _mapCache.set(key, uri);
  return uri;
}
var _instanceCount = 0;
function createFilterSVG(id) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.style.cssText = "position:absolute;width:0;height:0;pointer-events:none;";
  svg.innerHTML = `
    <defs>
      <filter id="${id}" color-interpolation-filters="sRGB" x="-38%" y="-188%" width="176%" height="476%">
        <feImage result="map" preserveAspectRatio="none" />
        <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" result="dispRed" data-channel="red" />
        <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" result="dispGreen" data-channel="green" />
        <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
        <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" result="dispBlue" data-channel="blue" />
        <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
        <feBlend in="red" in2="green" mode="screen" result="rg" />
        <feBlend in="rg" in2="blue" mode="screen" result="output" />
        <feGaussianBlur in="output" stdDeviation="0" />
      </filter>
    </defs>
  `;
  const filter = svg.querySelector("filter");
  const feImage = svg.querySelector("feImage");
  const red = svg.querySelector('[data-channel="red"]');
  const green = svg.querySelector('[data-channel="green"]');
  const blue = svg.querySelector('[data-channel="blue"]');
  const blurEl = svg.querySelector("feGaussianBlur");
  return { svg, feImage, red, green, blue, blur: blurEl, filter };
}
function applyConfig(c, refs) {
  const uri = buildDisplacementMap(c);
  const maxD = Math.max(Math.abs(c.scale) * 0.5, 20);
  const pctX = Math.ceil(maxD / c.width * 100);
  const pctY = Math.ceil(maxD / c.height * 100);
  refs.filter.setAttribute("x", `-${pctX}%`);
  refs.filter.setAttribute("y", `-${pctY}%`);
  refs.filter.setAttribute("width", `${100 + pctX * 2}%`);
  refs.filter.setAttribute("height", `${100 + pctY * 2}%`);
  refs.feImage.setAttributeNS("http://www.w3.org/1999/xlink", "href", uri);
  refs.feImage.setAttribute("href", uri);
  refs.red.setAttribute("scale", String(c.scale + c.r));
  refs.green.setAttribute("scale", String(c.scale + c.g));
  refs.blue.setAttribute("scale", String(c.scale + c.b));
  refs.blur.setAttribute("stdDeviation", String(c.displace));
}
function createLiquidGlass(element, options = {}) {
  const fallback = options.fallbackFilter ?? "blur(12px)";
  if (!isChromium) {
    const prev = element.style.backdropFilter;
    const prevWebkit = element.style.getPropertyValue("-webkit-backdrop-filter");
    element.style.backdropFilter = fallback;
    element.style.setProperty("-webkit-backdrop-filter", fallback);
    const dummySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    return {
      isActive: false,
      filterElement: dummySvg,
      update() {
      },
      destroy() {
        element.style.backdropFilter = prev;
        element.style.setProperty("-webkit-backdrop-filter", prevWebkit);
      }
    };
  }
  const id = options.filterId ?? `liquid-glass-${++_instanceCount}`;
  const refs = createFilterSVG(id);
  document.body.appendChild(refs.svg);
  let currentOpts = { ...options };
  let config = resolveConfig(element, currentOpts);
  applyConfig(config, refs);
  const applyStyles = (c) => {
    element.style.backdropFilter = `url(#${id}) saturate(${c.saturation})`;
    element.style.setProperty(
      "-webkit-backdrop-filter",
      `url(#${id}) saturate(${c.saturation})`
    );
    if (c.frost > 0) {
      element.style.background = `hsl(0 0% 0% / ${c.frost})`;
    }
  };
  applyStyles(config);
  let resizeRaf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      if (currentOpts.width == null || currentOpts.height == null) {
        config = resolveConfig(element, currentOpts);
        applyConfig(config, refs);
        applyStyles(config);
      }
    });
  });
  ro.observe(element);
  return {
    isActive: true,
    filterElement: refs.svg,
    update(newOpts) {
      currentOpts = { ...currentOpts, ...newOpts };
      config = resolveConfig(element, currentOpts);
      applyConfig(config, refs);
      applyStyles(config);
    },
    destroy() {
      ro.disconnect();
      cancelAnimationFrame(resizeRaf);
      refs.svg.remove();
      element.style.backdropFilter = "";
      element.style.setProperty("-webkit-backdrop-filter", "");
      element.style.background = "";
    }
  };
}

// demo/main.ts
var DEFAULTS = {
  scale: -180,
  borderRadius: 50,
  blur: 11,
  border: 0.07,
  lightness: 50,
  alpha: 0.93,
  frost: 0,
  saturation: 1,
  width: 400,
  height: 80,
  aberR: 0,
  aberG: 10,
  aberB: 20
};
var glassEl = document.getElementById("glass");
var configBody = document.getElementById("config-body");
var configPanel = document.getElementById("config");
var toggleBtn = document.getElementById("toggle-panel");
var resetBtn = document.getElementById("reset");
var browserNotice = document.getElementById("browser-notice");
if (!isChromium) {
  browserNotice.style.display = "block";
}
var glass = createLiquidGlass(glassEl, {
  width: DEFAULTS.width,
  height: DEFAULTS.height,
  borderRadius: DEFAULTS.borderRadius,
  scale: DEFAULTS.scale,
  aberration: [DEFAULTS.aberR, DEFAULTS.aberG, DEFAULTS.aberB],
  blur: DEFAULTS.blur,
  border: DEFAULTS.border,
  lightness: DEFAULTS.lightness,
  alpha: DEFAULTS.alpha,
  frost: DEFAULTS.frost,
  saturation: DEFAULTS.saturation
});
function togglePanel() {
  configPanel.classList.toggle("collapsed");
}
toggleBtn.addEventListener("click", togglePanel);
document.querySelector(".config-header").addEventListener("click", (e) => {
  if (e.target.closest(".config-toggle")) return;
  togglePanel();
});
var advancedToggle = document.getElementById("toggle-advanced");
var advancedBody = document.getElementById("advanced-body");
advancedToggle.addEventListener("click", () => {
  const isOpen = advancedBody.classList.toggle("open");
  advancedToggle.classList.toggle("open", isOpen);
  advancedToggle.textContent = isOpen ? "Advanced \u2212" : "Advanced";
});
var sliders = [];
for (const key of Object.keys(DEFAULTS)) {
  const input = document.getElementById(`opt-${key}`);
  const display = document.getElementById(`val-${key}`);
  if (input && display) {
    sliders.push({ key, input, display });
  }
}
function readSliders() {
  const vals = {};
  for (const s of sliders) {
    vals[s.key] = parseFloat(s.input.value);
  }
  return {
    scale: vals.scale,
    borderRadius: vals.borderRadius,
    blur: vals.blur,
    border: vals.border,
    lightness: vals.lightness,
    alpha: vals.alpha,
    frost: vals.frost,
    saturation: vals.saturation,
    width: vals.width,
    height: vals.height,
    aberration: [vals.aberR ?? 0, vals.aberG ?? 10, vals.aberB ?? 20]
  };
}
function syncDisplays() {
  for (const s of sliders) {
    s.display.textContent = s.input.value;
  }
}
function applySliders() {
  syncDisplays();
  const opts = readSliders();
  glassEl.style.width = `${opts.width}px`;
  glassEl.style.height = `${opts.height}px`;
  glassEl.style.borderRadius = `${opts.borderRadius}px`;
  glass.update(opts);
}
for (const s of sliders) {
  s.input.addEventListener("input", applySliders);
}
resetBtn.addEventListener("click", () => {
  for (const s of sliders) {
    s.input.value = String(DEFAULTS[s.key]);
  }
  applySliders();
});
var isDragging = false;
var dragOffsetX = 0;
var dragOffsetY = 0;
glassEl.addEventListener("pointerdown", (e) => {
  isDragging = true;
  const rect = glassEl.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left - rect.width / 2;
  dragOffsetY = e.clientY - rect.top - rect.height / 2;
  glassEl.setPointerCapture(e.pointerId);
  glassEl.style.cursor = "grabbing";
});
window.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  const x = e.clientX - dragOffsetX;
  const y = e.clientY - dragOffsetY;
  glassEl.style.left = `${x}px`;
  glassEl.style.top = `${y}px`;
  glassEl.style.transform = "translate(-50%, -50%)";
});
window.addEventListener("pointerup", () => {
  if (!isDragging) return;
  isDragging = false;
  glassEl.style.cursor = "grab";
});
var copyBtn = document.getElementById("copy-btn");
var codeText = document.querySelector(".code-snippet code").textContent ?? "";
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(codeText).then(() => {
    copyBtn.textContent = "Copied";
    copyBtn.classList.add("copied");
    setTimeout(() => {
      copyBtn.textContent = "Copy";
      copyBtn.classList.remove("copied");
    }, 2e3);
  });
});
syncDisplays();
/**
 * Liquid Glass — Real optical refraction for the web.
 *
 * Uses Canvas 2D to generate displacement maps fed into SVG feDisplacementMap
 * filters. Three separate passes (one per RGB channel) with slightly different
 * scale values create chromatic aberration at the edges.
 *
 * Chromium only. Safari/Firefox fall back to regular backdrop-filter: blur().
 *
 * @see https://github.com/rizzytoday/liquid-glass
 * @license MIT
 */
