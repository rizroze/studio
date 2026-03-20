# rizzy.today — Studio Site

## What Was Built

### Architecture
Single-page app with a view state machine — no React Router. Three views:
- `home` — scrollable portfolio with all sections
- `project` — individual case study page (`/work/:slug`)
- `all-projects` — grid of all work (`/work`)

Page transitions use 250ms CSS opacity+blur with class toggling. URL updates via `history.pushState` for shareable links.

### Site Structure

```
/ (Home)
├── Hero – Interactive bookshelf with 3D rotating book covers (GSAP entrance)
├── Work – Featured project cards with 3D tilt on hover
├── Testimonials – Inline banner + detailed section
├── Services – 3 pricing tiers (Start / Build / Studio)
├── About – Bio, skills, background
├── Discovery – Process breakdown (how it works)
├── FAQ – Expandable accordion
└── Footer – CTA + links

/work (All Projects)
├── Filterable grid of all case studies
└── Click → individual project page

/work/:slug (Case Study)
├── Cover image/video
├── Brief, Challenge, Solution
├── Gallery sections with multiple layouts
├── Stack tags
└── Result metrics
```

### Key Components
- **Nav** — SVG displacement glass pill navbar (Chromium-only, clean fallback)
- **ScrollNav** — Dot navigation for section jumping
- **ProjectCard** — 3D perspective tilt cards with mouse tracking
- **PricingCard** — Flip animation pricing cards
- **GlassFilter** — Canvas-generated displacement maps with chromatic aberration
- **GsapAnimations** — Hero entrance timeline only
- **ScrollReveal** — IntersectionObserver + MutationObserver combo
- **WordReveal** — Character-by-character text animation
- **IpodPlayer** — Music player easter egg
- **AsciiRose** — Signature ASCII art with wave distortion
- **CursorGlitch** — Custom cursor effect
- **ClientTicker** — Logo marquee for social proof

### Services & Pricing

Three tiers, no specific dollar amounts on the site:

**Start** — Brand identity for teams launching something new
- Logo, colors, typography, brand guidelines, content direction
- Timeline: 1–2 weeks

**Build** (featured) — Brand + custom coded website
- Everything in Start + React website, responsive, animations, CMS
- Timeline: 2–4 weeks

**Studio** — Full creative direction
- Everything in Build + design system, motion graphics, presentations, ongoing support
- Timeline: 6–8 weeks

Payment: 50% upfront, 50% on delivery. Accepts SOL, USDC, and traditional payments.

### Case Studies
Each case study follows a structured template:
- Brief → Challenge → Solution → Gallery → Stack → Result

Categories: brand, web, motion, mobile

Gallery layouts: grid, squares, squares-small, landscape, deck (with wide-spanning items)

---

## Technical Decisions

### What was kept from the original site
- Liquid glass design system (the signature)
- Single `styles.css` approach (~2900 lines)
- Custom stores (`useSyncExternalStore`) — no Zustand
- Vercel deploy
- GSAP for hero entrance only
- ASCII rose hero
- iPod player

### What was added
- View state machine with URL routing (pushState, no React Router)
- Page transitions (CSS opacity+blur)
- Case study template with structured data
- Pricing cards with flip animation
- Cal.com booking integration
- ScrollReveal with stagger support
- WordReveal text animations
- ScrollNav dot navigation
- 3D project card tilt
- Interactive bookshelf hero with 3D book covers
- Client logo ticker
- Scroll progress bar
- Film grain overlay (SVG feTurbulence)

### What was removed/changed
- Panel toggle system → replaced by scrollable sections
- Card stack → replaced by proper work grid with 3D tilt
- Service pills (only pitchdecks) → replaced by full pricing section
- Sticky note → removed
- Notification dropdown → removed

