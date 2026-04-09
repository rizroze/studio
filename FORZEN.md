# FORZEN: Rizzy Studio

> A solo creative studio site that sells design, code, and motion work — all from one person. Built with React 18, Vite, a single monolithic CSS file, and zero animation libraries beyond GSAP (which is installed but barely used). This is a portfolio that doubles as a sales machine.

---

## What This Project Actually Is

Rizzy Studio is a client-facing portfolio site for Riz Roze — a full-stack creative working in the Solana ecosystem. The site's job is simple: make someone think "I want this person to build my thing" within 10 seconds of landing. Every design decision, every animation, every section exists to convert a visitor into a booked call on Cal.com.

It's not a blog. It's not a playground. It's a business tool dressed in liquid glass.

---

## The Stack (And Why It's This Simple)

| Layer | Tool | Why |
|-------|------|-----|
| Framework | React 18 + Vite | Fast dev, fast builds, no SSR needed for a portfolio |
| Styling | Single `styles.css` (~2900 lines) | CSS modules were tried and reverted — one file is simpler to reason about |
| State | `useSyncExternalStore` | No Zustand, no Redux. A hand-rolled store for nav state. That's it. |
| Animations | CSS transitions + GSAP | CSS handles hovers/reveals, GSAP handles hero entrance choreography |
| Analytics | Vercel Analytics + Speed Insights | Free tier, zero config, tracks CTA conversions |
| Deploy | Vercel (GitHub integration) | Push to `main`, it deploys. That's the whole pipeline. |
| Fonts | Google Fonts (Urbanist, Inter Tight, Fragment Mono) | Loaded async with `media="print"` trick for non-blocking |

The deliberate absence of complexity is the architectural decision. No routing library — views are swapped with a `useState`. No CSS-in-JS — one file, one source of truth. No animation library for hovers — CSS handles it. The rule is: if CSS can do it, CSS does it.

---

## Project Structure

```
studio/
├── index.html              # Entry point, meta tags, JSON-LD, font loading
├── public/
│   ├── rizzy-avatar.png    # Brand avatar (used everywhere)
│   ├── newpfp.png          # Favicon (smiley face)
│   ├── rizzyrose.png       # Source image for ASCII art
│   ├── riz-sharecard.jpg   # OG share image (1200x630, ~48KB)
│   ├── content/            # Project thumbnails, logos, gallery images
│   ├── testimonial/        # Client headshots
│   ├── music/              # iPod player tracks
│   ├── robots.txt          # SEO crawling rules
│   ├── sitemap.xml         # Single-page sitemap
│   ├── privacy.html        # Minimal privacy policy
│   └── 404.html            # Branded 404 page
├── src/
│   ├── main.tsx            # ReactDOM.createRoot, that's it
│   ├── App.tsx             # View router, page transitions, scroll progress
│   ├── styles.css          # THE stylesheet (~2900 lines)
│   ├── sections/           # Page-level components
│   │   ├── Hero.tsx        # Bookshelf, headline, CTA
│   │   ├── Work.tsx        # Project card grid
│   │   ├── Testimonials.tsx # Client quotes with verified badges
│   │   ├── Services.tsx    # Pricing tiers
│   │   ├── About.tsx       # Bio + tool stack icons
│   │   ├── FAQ.tsx         # Accordion FAQ
│   │   ├── ProjectPage.tsx # Individual project deep-dive
│   │   └── AllProjects.tsx # Grid of all work
│   ├── components/         # Reusable UI pieces
│   │   ├── Nav.tsx         # Floating pill nav (morphs → Dynamic Island style)
│   │   ├── Footer.tsx      # Emoji reactions, iPod, links
│   │   ├── GlassFilter.tsx # SVG displacement filter (liquid glass refraction)
│   │   ├── GsapAnimations.tsx # Hero entrance timeline + book choreography
│   │   ├── ProjectCard.tsx # Tilt-on-hover project cards
│   │   ├── PricingCard.tsx # Glass pricing cards
│   │   ├── IpodPlayer.tsx  # Working iPod Nano music player
│   │   ├── AsciiRose.tsx   # Interactive ASCII art from image
│   │   ├── CursorGlitch.tsx # Click ripple waves
│   │   ├── ScrollReveal.tsx # IntersectionObserver reveal system
│   │   ├── ClientTicker.tsx # Auto-scrolling client logos
│   │   └── VerifiedBadge.tsx # SVG verified checkmark
│   ├── constants/          # All data lives here, not in components
│   │   ├── projects.ts     # Case studies (4 projects)
│   │   ├── testimonials.ts # Client quotes + metadata
│   │   ├── services.ts     # Pricing tier definitions
│   │   ├── music.ts        # iPod playlist tracks
│   │   └── faq.ts          # FAQ question/answer pairs
│   └── stores/
│       └── navStore.ts     # The only store in the entire app
```

---

## How The "Router" Works

There's no React Router. The entire app uses a discriminated union type for views:

```tsx
type View = { type: 'home' } | { type: 'project'; slug: string } | { type: 'all-projects' }
```

`App.tsx` holds this state and passes callbacks down. When you click a project card, it calls `openProject(slug)`. When you click "Back," it calls `goHome()`. Every view change goes through `transitionTo()`:

```tsx
const transitionTo = useCallback((next: View) => {
  setTransitioning(true)           // Triggers CSS fade-out + blur
  setTimeout(() => {
    setView(next)                   // Swap the view
    window.scrollTo({ top: 0 })     // Reset scroll
    requestAnimationFrame(() => setTransitioning(false))  // Fade in
  }, 250)
}, [])
```

The 250ms delay lets the CSS transition (opacity 0 + blur 4px) play out before the DOM swaps. It feels like a page transition but it's just a timeout and a class toggle. Simple, effective, no library needed.

**Why no React Router?** This is a single-page portfolio with three possible "views." Adding a router would mean URL management, history handling, route definitions — all overhead for something that's solved by one `useState` and three conditionals.

---

## The Nav: A Lesson in Lightweight State

The nav has three states: mobile menu open/closed, scrolled-past-hero, and pill-expanded. All managed by `navStore.ts` — a hand-rolled store using `useSyncExternalStore`:

```tsx
let state: NavState = { mobileOpen: false, scrolledPastHero: false, pillExpanded: false }
const listeners = new Set<() => void>()

function emit() { listeners.forEach(fn => fn()) }

export const navStore = {
  getSnapshot: () => state,
  subscribe: (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn) },
  toggle: () => { state = { ...state, mobileOpen: !state.mobileOpen }; emit() },
  // ... etc
}
```

This is the exact same pattern behind Zustand — a mutable state object, a set of listeners, and React's `useSyncExternalStore` to trigger re-renders. But without the 12KB dependency. The nav is the *only thing* in the app that needs shared state, so a full state management library would be absurd.

The nav morphs based on scroll position: starts transparent, then compresses into a frosted glass pill after you scroll past the hero. On desktop, there's also a dot-toggle that expands the pill to reveal links — like iOS's Dynamic Island.

---

## The Bookshelf: 3D CSS Books

The hero's most distinctive element is a row of 3D books built entirely in CSS. No Three.js, no WebGL. Each book is a `<label>` wrapping a hidden `<input type="radio">`:

```tsx
<label className="book-container">
  <div className="book">
    <div className="book-spine">...</div>
    <div className="book-back"></div>
    <div className="book-cover"><img src={...} /></div>
    <div className="book-side"></div>
    <input type="radio" name="hero-book" />
  </div>
</label>
```

When you click a book (checking the radio), CSS `:checked` selectors rotate the book open to reveal the cover. No JavaScript needed for the open/close animation — the radio input pattern handles state, and CSS transforms handle the 3D rotation.

A `useEffect` randomly adds a `book-tease` class to one book every 4 seconds, making it bob slightly to catch attention. The parallax effect on scroll is pure vanilla JS — `translateY(scrollY * 0.15)`.

---

## Interactive ASCII Art

`AsciiRose.tsx` converts a PNG image into a live ASCII art display. Here's the clever part:

1. Load `/rizzyrose.png` into a hidden `<canvas>`
2. Read every pixel's brightness via `getImageData()`
3. Map brightness to ASCII characters: `' .:-=+*#%@'`
4. Render the result as text in a `<pre>` tag

On mouse hover, it starts a `requestAnimationFrame` loop that adds a ripple wave effect — the mouse position creates a radial sine wave that modulates character brightness around the cursor. Move your mouse away, it snaps back to the static version. No canvas rendering on screen — it's all `textContent` updates on a `<pre>` element.

This is a great example of the project's philosophy: use the simplest possible technology for a premium-feeling effect. No WebGL, no shader, no library. Just pixel math and monospace text.

---

## The iPod Player: A Working Music Player in 100 Lines

The footer has a fully functional iPod Nano that plays actual music tracks. It's a real `<audio>` element controlled by CSS-styled buttons arranged in a click wheel layout. Previous, next, play/pause — all working. An equalizer bar animation plays when audio is active. The cable below it is a pure SVG `<path>`.

The playlist is defined in `constants/music.ts` and the player auto-advances tracks when one ends. Volume is set to 25% by default (a nice touch — nobody wants to get blasted by a portfolio site).

---

## Scroll Reveal System

`ScrollReveal.tsx` is a zero-dependency, framework-level animation system. It sets up one `IntersectionObserver` and watches for two data attributes:

- `data-reveal` — fade-in when visible
- `data-reveal-stagger` — fade-in with staggered children

When an element enters the viewport (5% threshold, -40px root margin), it gets a `revealed` class and is unobserved. CSS handles the actual animation:

```css
[data-reveal] { opacity: 0; transform: translateY(20px); transition: ... }
[data-reveal].revealed { opacity: 1; transform: translateY(0); }
```

A `MutationObserver` re-scans for new elements whenever the DOM changes — this is critical because view transitions add/remove entire sections. Without it, elements added after the initial page load would never animate.

---

## The Single CSS File

At ~2900 lines, `styles.css` is the biggest file in the project. It covers everything:

- Global resets and typography
- Navigation states (transparent, scrolled, pill-expanded, mobile)
- Hero section with bookshelf 3D transforms
- Project cards with tilt-on-hover
- Pricing cards with glass morphism
- Testimonial cards with job tags
- Footer with emoji reactions and iPod styling
- Scroll progress bar, back-to-top button
- Page transitions (fade + blur)
- Responsive breakpoints (900px, 768px, 480px)
- ASCII art container sizing
- Click wave ripple animation
- And more...

**Why one file?** CSS modules were tried in an earlier session and reverted. The problem: when everything is scoped, you lose the ability to reason about cascade and specificity across components. For a site this size (not a web app with 200 components), one well-organized file is faster to write, debug, and maintain. You can search for `.book-` and see every book-related style in context.

The glass morphism pattern appears dozens of times:
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(40px) saturate(120%);
border: 1px solid rgba(255, 255, 255, 0.12);
border-radius: 20px;
```

---

## Data Architecture

All content lives in `src/constants/`. Components never hardcode text, images, or config:

**`projects.ts`** — The `CaseStudyData` interface is the most important type. It defines everything about a project: slug, title, client, tags, thumbnail, color, gallery images, category, description, brief, challenge, solution, stack, result, and result metric. Currently 4 projects: Radiants, WAYY, Hydex, Fullport.

**`testimonials.ts`** — Each testimonial has a name, title, profile pic, optional X/Twitter link, the quote, and a `job` object that describes what work was done (with a brand logo, text, duration, and ongoing flag).

**`services.ts`** — Three pricing tiers (Sprint, Build, Studio) with features, timeline, and CTA links. No prices shown — just "Book a call."

**`faq.ts`** — Question/answer pairs for the accordion.

**`music.ts`** — iPod playlist with track titles and file paths.

This separation means you can add a new project by editing one file, and it automatically shows up in the hero bookshelf, work grid, all-projects page, and project pages.

---

## SEO & Analytics

The site ships with:

- **Vercel Analytics** — Tracks page views and custom events (`track('cta_click', { location: 'hero' })`)
- **Vercel Speed Insights** — Core Web Vitals monitoring
- **JSON-LD** — `ProfessionalService` schema for Google rich results
- **Open Graph + Twitter Cards** — Custom share image (1200x630 JPEG)
- **Meta description** — Optimized for search: "Design, code, and motion — one person, concept to production."
- **robots.txt + sitemap.xml** — Standard crawl directives
- **Privacy policy** — Minimal, honest, covers Vercel Analytics and Cal.com

CTA tracking is wired to three locations: hero "Book an intro," pricing tier "Book a call," and FAQ "Schedule a call." Each reports its location so you can see which section converts best.

---

## Responsive Design

Three breakpoints, mobile-down:

| Breakpoint | What changes |
|------------|-------------|
| 900px | Nav switches from pill + dot-toggle to hamburger. Two-column layouts stack. |
| 768px | Bookshelf scales to 65%. Pricing cards stack vertically. Font sizes reduce. |
| 480px | Hero headline shrinks. Padding tightens. Touch targets enforced at 44px. |

The bookshelf is the trickiest responsive element — it uses `transform: scale(0.65)` on mobile rather than reflowing the 3D layout. This preserves the CSS 3D transforms without needing different perspective values per breakpoint.

---

## Patterns Worth Stealing

### 1. The Radio-Input State Machine
Using `<input type="radio">` for mutually exclusive UI states (like "which book is open") is an ancient CSS trick that still works beautifully. Zero JS, accessible, works without React hydration.

### 2. The `useSyncExternalStore` Mini-Store
If you need shared state between 2-3 components, you don't need Zustand. The pattern is ~20 lines: a plain object, a Set of listeners, and an emit function. React's `useSyncExternalStore` handles the subscription lifecycle.

### 3. Async Font Loading
```html
<link href="..." rel="stylesheet" media="print" onload="this.media='all'">
```
Fonts load in the background. The page renders immediately with system fonts, then swaps when ready. No FOIT (Flash of Invisible Text).

### 4. CSS-Only Page Transitions
A `transitioning` state adds `.page-exit` (opacity 0, blur 4px), a 250ms timeout swaps the view, then `.page-enter` fades in. No Framer Motion, no React Transition Group. Just a class toggle and a timeout.

### 5. MutationObserver + IntersectionObserver Combo
ScrollReveal uses `MutationObserver` to detect when new elements are added to the DOM, then registers them with `IntersectionObserver`. This makes the reveal system work across view transitions without any explicit "re-initialize" calls.

---

## The Liquid Glass Displacement Filter: A War Story

This is the crown jewel of the site — and the hardest thing we built. The nav pill doesn't just have `backdrop-filter: blur()` like every other glassmorphism site. It has **real optical refraction**. Background content warps outward through the edges of the pill like you're looking through actual glass. There's subtle chromatic aberration (RGB color splitting) at the boundaries. The center is crystal clear. It looks like Apple's iOS 18 liquid glass, but on the web.

It's implemented in `src/components/GlassFilter.tsx` and it took multiple sessions of debugging to get right. Here's everything we learned.

### How SVG Displacement Filters Work

The effect uses `backdrop-filter: url(#svg-filter)` — a Chromium-only feature that applies an SVG filter to the content behind an element. The core primitive is `feDisplacementMap`: it takes a "displacement map" (a colored image) and shifts every pixel of the backdrop based on the map's color values at that position.

The formula: `P'(x,y) = P(x + scale × (C/255 - 0.5), y + scale × (C/255 - 0.5))`

When a pixel in the map is exactly `rgb(128, 128, 128)` (neutral gray), the formula gives zero displacement — that pixel stays put. When the map has a gradient from black to red, pixels get shifted along the X-axis. Blue gradients shift along Y. The `scale` parameter controls how far pixels can move (ours is -180, meaning up to 90px of displacement).

To get **chromatic aberration** (rainbow edge fringing), we run three separate `feDisplacementMap` passes — one for red, one for green, one for blue — each with a slightly different `scale` value (-180, -170, -160). Then we blend the channels back together with `feBlend mode="screen"`. The result: each color channel is displaced by a slightly different amount, creating that prismatic glass-edge look.

### The Displacement Map: Why Canvas, Not SVG

The displacement map itself is a small image with this structure:
- **Neutral gray background** (128,128,128) — no displacement outside the pill
- **Red gradient left→right** within the pill shape — drives X-axis warp
- **Blue gradient top→bottom**, blended with `globalCompositeOperation: 'difference'` — drives Y-axis warp
- **Blurred gray center rect** — neutralizes the center so only edges displace

The reference technique (Jhey Tompkins' CodePen) generates this map as an SVG, serializes it with `XMLSerializer`, and loads it as a data URI via `feImage`. This works because the SVG contains CSS like `mix-blend-mode: difference` and `filter: blur(11px)` that Chromium processes during rasterization.

**Except it doesn't.** Not reliably.

When `feImage` loads an SVG data URI, it renders it as an image — and SVG-as-image restricts CSS property evaluation. `mix-blend-mode: difference` gets ignored. `filter: blur()` gets ignored. The center neutralization rect doesn't work, and the entire pill becomes a fully-displaced mess.

We confirmed this by extracting the displacement map pixels in the browser:
- SVG approach: center pixels showed raw gradient values (no neutralization)
- Canvas approach: center pixels showed rgb(128, 116, 129) (properly neutralized)

**The fix:** Generate the displacement map using Canvas 2D. Canvas natively supports `globalCompositeOperation = 'difference'` and `ctx.filter = 'blur(11px)'` — these are real API calls, not CSS properties that might be ignored. The Canvas output is a correct raster bitmap every time.

```ts
// The key operations that SVG-as-image can't do but Canvas can:
ctx.globalCompositeOperation = 'difference'  // ← native blend mode
ctx.filter = `blur(${c.blur}px)`            // ← native CSS filter
```

### The Filter Region Problem: Why the Warp Was Invisible

Even with a correct displacement map, the effect was invisible. Why?

SVG filters have a **filter region** — the area they process. By default, it's `x="-10%" y="-10%" width="120%" height="120%"`, meaning only 10% beyond the element's bounds is captured. For our 48px tall pill, that's **4.8px** of extra backdrop on top and bottom.

But with `scale: -180`, edge pixels can displace up to **90px** away. When `feDisplacementMap` tries to sample the backdrop 90px from the edge, that position is way outside the captured region. It gets transparent. The warp effect dies.

**The fix:** Extend the filter region massively:
```xml
<filter x="-100%" y="-200%" width="300%" height="500%">
```

This captures 1× the element width on each side and 2× the element height on top/bottom — plenty of backdrop for the displacement to sample from.

### The Alignment Trap: Why Extending the Region Broke Everything First

Here's the trap that cost us a full day: when you extend the filter region, `feImage` at `width="100%" height="100%"` fills the **entire filter region**, not just the element. Our 240×48 displacement map got stretched to 720×240, completely misaligning the pill shape in the map with the actual element on screen.

**The fix:** Pre-size the Canvas displacement map to match the **entire filter region**, not just the element. The pill shape is drawn centered in a larger canvas padded with neutral gray:

```ts
// Filter region: x=-100% y=-200% width=300% height=500%
const padX = c.width          // 240px padding left and right
const padY = c.height * 2     // 96px padding top and bottom
const totalW = c.width + padX * 2   // 720px total (3× element)
const totalH = c.height + padY * 2  // 240px total (5× element)

canvas.width = totalW
canvas.height = totalH

// Fill everything neutral gray first
ctx.fillStyle = 'rgb(128, 128, 128)'
ctx.fillRect(0, 0, totalW, totalH)

// Then draw the pill gradients centered at (padX, padY)
```

Now `feImage` fills the filter region naturally, the displacement map is the right size, the pill aligns with the element, and the gray padding ensures zero displacement outside the pill. Everything clicks.

### The Three Bugs, Summarized

| Bug | Symptom | Root Cause | Fix |
|-----|---------|------------|-----|
| SVG data URI CSS restriction | Full-surface chromatic chaos, no clean center | `mix-blend-mode` and `filter:blur()` ignored in SVG-as-image | Canvas 2D with native `globalCompositeOperation` and `ctx.filter` |
| Filter region too small | Warp effect invisible | Default 10% extension = 4.8px, but displacement reaches 90px | Extended to x=-100% y=-200% width=300% height=500% |
| Map/region misalignment | Pill shape displaced from actual element | feImage stretches small map to fill large filter region | Pre-size Canvas to full filter region, pill centered with gray padding |

### Config Params

All three nav states (full bar, collapsed pill, expanded pill) share the same base params — only `width`, `height`, and `radius` change:

```ts
const BASE = {
  scale: -180,      // Displacement magnitude (pixels)
  border: 0.07,     // Neutralization inset (fraction of min dimension)
  lightness: 50,    // Center rect gray value
  alpha: 0.93,      // Center rect opacity (< 1 lets edges bleed slightly)
  blur: 11,         // Center rect blur radius
  r: 0, g: 10, b: 20,  // Per-channel scale offsets (chromatic aberration)
  frost: 0,         // Background tint opacity
  saturation: 1,    // Backdrop saturation multiplier
}
```

The per-channel offsets (`r: 0, g: 10, b: 20`) mean red displaces at -180, green at -170, blue at -160 — creating the subtle rainbow fringing at edges.

### Chromium Only

This technique only works in Chromium. Safari and Firefox don't support `backdrop-filter: url(#svg-filter)`. On those browsers, the component returns `null` and the nav falls back to regular `backdrop-filter: blur(50px) saturate(120%)` — still looks good, just not *as* good.

Detection is simple: `navigator.userAgent` check for "Chrome/". When Chromium is detected, `document.documentElement.dataset.glass = 'true'` activates the CSS rule that swaps to the SVG displacement filter.

### Why This Matters

Every glassmorphism site uses the same `backdrop-filter: blur()`. This one bends light. The displacement map creates actual optical refraction — content doesn't just blur behind the glass, it *warps* toward the edges like real curved glass would. It's the difference between frosted glass and a lens.

And it's 225 lines of code. No WebGL. No shaders. No libraries. Just Canvas 2D, SVG filters, and a stubborn refusal to give up.

---

## Bugs We Fought (And What They Taught Us)

### The Book Entrance Animation: Respecting preserve-3d

The bookshelf books are 3D CSS objects using `transform-style: preserve-3d`. This creates a constraint: you can't animate `opacity` on a preserve-3d element because `opacity < 1` flattens the 3D rendering.

The solution in `GsapAnimations.tsx`:
1. Pre-position all `.book-container` elements at `y: -120` (above their landing spot)
2. Fade in the `.hero-right` parent (opacity 0 → 1) — this reveals all books at once without individual opacity
3. Each book falls into place individually: `y: -120 → 0` with `back.out(1.4)` ease for that satisfying overshoot landing, staggered by 0.1s
4. After the last book lands: `gsap.set(containers, { clearProps: 'transform' })` removes all inline styles so CSS hover/tease effects work

The key insight: animate `opacity` on the **parent** (one transition, brief), animate `translateY` on each **child** (the visible motion). And always `clearProps` after GSAP is done — inline transforms override CSS `:hover` rules forever.

### Hover Flicker: The Stable Wrapper Pattern

Books and ticker logos had a frustrating flicker — hovering would trigger a transform (lift/float), which moved the element away from the cursor, which triggered mouseleave, which undid the transform, which moved it back under the cursor... infinite loop.

**Fix:** Separate the hover trigger from the hover effect. Each book got a `.book-zone` wrapper (stable, no transform) around the `.book-container` (receives the visual effect). Hover detection happens on the zone, transform happens on the container. The zone never moves, so the cursor stays "inside." Same pattern applied to `.ticker-logo-zone` for the client logo ticker. Simple concept, but it's the kind of thing that only reveals itself through actual user testing.

### The CSS Modules Experiment
Early in development, CSS modules were introduced for scoped styling. The result: harder to debug, lost cascade context, couldn't share styles between sections easily. Reverted back to one file. **Lesson:** CSS modules shine in large apps with many developers. For a solo project under 3000 lines, a single file with good organization wins.

### Touch + Click Double-Fire
On mobile, both `touchstart` and `click` events fire. The solution: a `touchHandledRef` pattern that sets a flag on touch and skips the subsequent click. This is relevant for the project card interactions and emoji pills.

### OG Image Woes
Multiple attempts at programmatically generating the OG share card (Playwright screenshots, PIL compositing, SVG overlays). Each approach had issues — wrong crops, double elements, cables going off-frame. **Lesson:** Sometimes the fastest path is Photoshop. The final image was hand-composited by Zen.

### Vercel Deploy Limits
Free tier allows 100 deploys/day. During a heavy build session, we hit the limit. Code was pushed to git but wouldn't deploy for hours. **Lesson:** Batch your changes instead of deploying every small fix.

---

## What's Missing / Next Steps

- **Custom domain** — OG meta tags and sitemap still point to `studio-psi-beryl-56.vercel.app`. Need to update when `rizzy.today` is pointed here.
- **More case studies** — Only 4 projects currently. The `CASE_STUDIES` array in `projects.ts` is the only thing that needs updating.
- **GSAP animations** — Hero entrance is fully choreographed. Scroll reveals are CSS-driven (no GSAP needed). Could add SplitText for section titles but honestly, the current CSS reveals work fine.
- **Form/contact section** — Currently just links to Cal.com. A contact form could capture leads who aren't ready to book.
- **Blog/writing** — Would help with SEO and establishing authority. Not critical for launch.

---

## Studio vs Rizztoday: Same DNA, Different Animal

These two sites share the same liquid glass tokens (blur, saturate, border opacity), the same fonts (Urbanist, Inter Tight, Fragment Mono), the same easing curves, and the same store pattern. But they're designed for completely different purposes and feel different when you use them.

| | rizztoday | studio |
|---|-----------|--------|
| **Purpose** | Personal playground — "come hang out" | Business storefront — "let me build for you" |
| **Hero** | Deep maroon gradient, status button with cascading actions | Split layout, 3D bookshelf with falling books |
| **Navbar** | Static glass fullbar, always visible | Dynamic glass pill with SVG displacement + chromatic aberration |
| **Interactivity** | Emoji reactions (Firebase), guestbook, sticky note, card stack | 3D card tilt, bookshelf tease, pricing flip cards |
| **GSAP** | Not used at all | Hero entrance choreography only |
| **3D** | None | Perspective cards, preserve-3d books, translateZ depth layers |
| **Film grain** | None | SVG feTurbulence overlay at 3% |
| **Scroll** | No indicator | 2px white progress bar |
| **Conversion** | No CTA (it's a portfolio) | Cal.com booking tracked with Vercel Analytics |
| **Parallax** | None | ASCII rose + bookshelf on scroll |

Rizztoday invites play. Studio commands respect. Both achieve their goal through the same underlying design language, but the personality layer is completely different. If rizztoday is a living room, studio is a showroom.

---

## The Philosophy

This site follows one rule: **the minimum complexity that achieves the desired result.**

No routing library for three views. No state library for one store. No animation library for hover effects. No CSS framework for one stylesheet. No image optimization pipeline — just compress in Python and commit the output.

Every dependency earns its place. React earns it because the component model makes the section-based architecture clean. Vite earns it because the dev experience is instant. Vercel earns it because deploy is one push. GSAP earns it because the hero entrance timeline (sequenced headlines, staggered book drops, shelf line animation) requires choreography that CSS can't express.

The result is a site that loads fast, deploys anywhere, and can be understood by reading ~26 files. That's the whole thing. No build pipeline mysteries, no config files to decode, no abstraction layers to peel back. Just components, styles, and data.

---

## Reference Files

- **GSAP Cheatsheet** — `~/studio/GSAP_CHEATSHEET.md` — Every motion.dev (Framer Motion) pattern translated to GSAP + CSS. Written as a reference for building animations without Framer Motion.
- **Styles** — `~/studio/src/styles.css` — The single source of truth (~2900 lines)
- **Glass Filter** — `~/studio/src/components/GlassFilter.tsx` — The SVG displacement crown jewel (302 lines)
