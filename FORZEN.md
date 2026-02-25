# FORZEN: Rizzy Studio

> A solo creative studio site that sells design, code, and motion work — all from one person. Built with React 18, Vite, a single monolithic CSS file, and zero animation libraries beyond GSAP (which is installed but barely used). This is a portfolio that doubles as a sales machine.

---

## What This Project Actually Is

Rizzy Studio is a client-facing portfolio site for Riz Rose — a full-stack creative working in the Solana ecosystem. The site's job is simple: make someone think "I want this person to build my thing" within 10 seconds of landing. Every design decision, every animation, every section exists to convert a visitor into a booked call on Cal.com.

It's not a blog. It's not a playground. It's a business tool dressed in liquid glass.

---

## The Stack (And Why It's This Simple)

| Layer | Tool | Why |
|-------|------|-----|
| Framework | React 18 + Vite | Fast dev, fast builds, no SSR needed for a portfolio |
| Styling | Single `styles.css` (~2900 lines) | CSS modules were tried and reverted — one file is simpler to reason about |
| State | `useSyncExternalStore` | No Zustand, no Redux. A hand-rolled store for nav state. That's it. |
| Animations | CSS transitions + keyframes | GSAP is in `package.json` but CSS does 95% of the work |
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
│   │   ├── Nav.tsx         # Floating pill nav
│   │   ├── Footer.tsx      # Emoji reactions, iPod, links
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

## Bugs We Fought (And What They Taught Us)

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
- **GSAP animations** — GSAP is installed (`package.json`) but barely used. The plan was to add scroll-triggered animations, text reveals, and ambient book floating. Most of the animation work ended up being CSS-only.
- **Form/contact section** — Currently just links to Cal.com. A contact form could capture leads who aren't ready to book.
- **Blog/writing** — Would help with SEO and establishing authority. Not critical for launch.

---

## The Philosophy

This site follows one rule: **the minimum complexity that achieves the desired result.**

No routing library for three views. No state library for one store. No animation library for hover effects. No CSS framework for one stylesheet. No image optimization pipeline — just compress in Python and commit the output.

Every dependency earns its place. React earns it because the component model makes the section-based architecture clean. Vite earns it because the dev experience is instant. Vercel earns it because deploy is one push. GSAP is installed for future scroll choreography but hasn't earned its keep yet.

The result is a site that loads fast, deploys anywhere, and can be understood by reading ~26 files. That's the whole thing. No build pipeline mysteries, no config files to decode, no abstraction layers to peel back. Just components, styles, and data.
