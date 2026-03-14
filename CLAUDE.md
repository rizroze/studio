# Studio (rizzy.studio)

Professional portfolio + booking site. Conversion-focused: visitors should book a Cal.com call.

## Stack
- React 18 + Vite (no SSR, no routing library)
- Single `styles.css` (~2900 lines) — CSS modules were tried and reverted, don't re-introduce
- State: `useSyncExternalStore` custom store in `stores/navStore.ts` — no Zustand
- GSAP: hero entrance timeline ONLY (`GsapAnimations.tsx`). Everything else is CSS transitions.
- Deploy: Vercel (push to `main` auto-deploys)
- Analytics: Vercel Analytics + Speed Insights

## Design System: Liquid Glass Dark + Skeuomorphism
- Dark theme, pure black bg, white text
- Frosted glass: `rgba(255,255,255,0.08)` + `backdrop-filter: blur(40px) saturate(120%)`
- 3D depth: perspective cards, preserve-3d books, translateZ layers
- Film grain: SVG feTurbulence overlay at 3%
- Fonts: Urbanist (headings), Inter Tight (body), Fragment Mono (code/counters)
- Easing: `cubic-bezier(0.4,0,0.2,1)` smooth, `cubic-bezier(0.34,1.56,0.64,1)` bounce

## Architecture
- Views: `useState<View>` discriminated union (`home | project | all-projects`) — no React Router
- Sections: `src/sections/` (Hero, Work, Testimonials, Services, About, FAQ, ProjectPage, AllProjects)
- Components: `src/components/` (Nav, Footer, GlassFilter, GsapAnimations, ProjectCard, PricingCard, IpodPlayer, AsciiRose, CursorGlitch, ScrollReveal, ClientTicker, VerifiedBadge)
- Data: `src/constants/` (projects.ts, testimonials.ts, services.ts, faq.ts, music.ts)
- Store: `src/stores/navStore.ts` — the ONLY store

## Crown Jewel: SVG Displacement Glass Filter
- `GlassFilter.tsx` — Canvas-generated displacement maps with chromatic aberration
- Chromium-only (Safari/Firefox get clean glass fallback)
- Nav collapses from full bar to 240px pill on scroll, expands on dot-menu click
- Reference params: scale:-180, border:0.07, blur:11, alpha:0.93
- See FORZEN.md "The Liquid Glass Displacement Filter: A War Story" for deep-dive

## Critical Rules
- **GSAP is hero-only** — don't add GSAP to other sections, CSS handles it
- **Single styles.css** — no CSS modules, no CSS-in-JS, no Tailwind
- **Pill navbar clears GSAP transforms after landing** so CSS hover states work — don't fight this
- **Glass displacement is Chromium-only** — don't try to polyfill for Safari/Firefox
- **No Framer Motion** — ever. GSAP is the only animation lib exception
- **Images: use WebP** — avatar/favicon already converted (95KB PNG -> 24KB WebP)
- **Commit style**: Action-first (`Fix`, `Add`, `Update`, `Mobile:`) — not conventional commits

## Key Patterns
- **Radio-input state machine**: Books use `<input type="radio">` for open/close state (pure CSS, no JS)
- **Stable wrapper pattern**: `.book-zone` (hover target, doesn't move) wraps `.book-container` (receives transform) to prevent hover flicker
- **ScrollReveal**: IntersectionObserver + MutationObserver combo — `data-reveal` and `data-reveal-stagger` attributes
- **Page transitions**: 250ms CSS opacity+blur, class toggle, no library
- **Async fonts**: `media="print" onload="this.media='all'"` trick

## File Quick Reference
- Entry: `index.html` (meta, JSON-LD, loader, font loading)
- Styles: `src/styles.css`
- Glass filter: `src/components/GlassFilter.tsx`
- GSAP animations: `src/components/GsapAnimations.tsx`
- Project data: `src/constants/projects.ts` (CaseStudyData interface)
- Nav store: `src/stores/navStore.ts`
- Deep-dive docs: `FORZEN.md`, `GSAP_CHEATSHEET.md`

## Known Gotchas
- Port 3000 always in use — dev server auto-selects next available
- `opacity < 1` flattens `preserve-3d` — animate opacity on parent, transform on children
- SVG data URIs ignore `mix-blend-mode` and `filter:blur()` — use Canvas 2D instead
- Default SVG filter region (120%) too small for large displacement — extend it
- Canvas displacement map must match FULL filter region size, padded with neutral gray (128,128,128)
- Touch + click double-fire on mobile — use `touchHandledRef` pattern
- `filter: blur(0)` on `.page-enter` creates a containing block — `position: fixed` children won't be viewport-relative. Use `createPortal(el, document.body)` for overlays/lightboxes
