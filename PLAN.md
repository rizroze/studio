# rizzy.today → Web3 Design Studio

## The Pivot

Evolve rizzy.today from personal portfolio to a one-man web3 design studio. Same domain, same design system, same personality – but now it sells.

**Positioning:** "Designer who codes" for web3. Clients get a complete brand and a live product from one person. No handoffs, no hiring a separate dev, no lost-in-translation.

**Why this works:**
- Web2 studios charge $5-14K for branding alone (no code, no motion, no web3)
- You do brand + design + code + motion + generative art, shipped and deployed
- Web3 has fewer studios, higher budgets, and most design is genuinely bad
- Your network (RadiantsDAO, Solana ecosystem) is already warm
- rizzy.today already has traffic, recognition, and the liquid glass signature

---

## Current Site → Studio Site

### What rizzy.today has now

Single-page app, no routing. Everything is panels over a hero.

```
Current:
├── Hero (ASCII rose, PFP, "worked with 20 web3 projects", client ticker)
├── MenuBar (time, notifications, calendar link)
├── Panels (toggle open/close):
│   ├── About Card (bio + emoji reactions)
│   ├── Cards Stack (4 project cards – pitchdeck, motion, solana vid, logo)
│   └── Testimonials (2 testimonials)
├── Service Pills ("Hire me" → only Pitchdecks visible)
├── Guestbook (Firebase-backed)
├── iPod Player (music)
└── Sticky Note (todo checklist)
```

### What it becomes

Multi-page studio site with proper routing. Keep the personality, add the business.

```
New:
├── / (Home)
│   ├── Hero – value prop, not just intro
│   ├── Selected Work – 3-4 project previews (not card stack)
│   ├── Services Overview – 3 tiers, brief
│   ├── Client Logos – existing ticker, expanded
│   ├── Testimonials – inline section, not hidden panel
│   └── CTA – "Let's build something" → booking
│
├── /work (Case Studies)
│   ├── Grid/list of all projects
│   ├── Click → individual case study page
│   ├── /work/radiants
│   ├── /work/wayy
│   ├── /work/generative
│   └── /work/pitchdecks
│
├── /services (Packages & Pricing)
│   ├── 3 tiers with pricing
│   ├── Add-ons section
│   ├── Process breakdown (how it works)
│   └── CTA → booking
│
├── /about (Your Story)
│   ├── Bio – expanded from current about card
│   ├── The "designer who codes" angle
│   ├── Tools & stack
│   ├── Experiments gallery (moved here – proof of creative range)
│   └── Guestbook (keep it, adds personality)
│
└── /contact (Book a Call)
    ├── Cal.com embed
    ├── Or simple intake form (project type, budget, timeline)
    └── SOL/USDC payment note
```

---

## Page-by-Page Breakdown

### / (Home)

The homepage goes from "here's my portfolio" to "here's what I can do for you."

**Hero Section**
- Keep: ASCII rose animation (signature), PFP, liquid glass aesthetic
- Change: tagline from "translating ideas into visuals" → something that sells
  - Option A: "I design & ship web3 brands"
  - Option B: "Brand. Code. Motion. Shipped."
  - Option C: "Your web3 brand, designed and deployed"
- Change: "worked with 20 web3 projects" → keep, it's social proof
- Add: Primary CTA button – "See my work" or "Book a call"

**Selected Work**
- Replace card stack with a proper work grid (2-3 featured projects)
- Each shows: thumbnail/video, project name, what was delivered
- Click → /work/[project] case study
- Show the range: brand system, product UI, generative art

**Services Overview**
- Not the full pricing page – just a teaser
- 3 columns: Core / Growth / Premium with one-liners
- "Starting at $8,000" anchoring
- CTA → /services for full breakdown

**Client Logos**
- Keep the existing ticker, add any new ones
- Stronger than testimonials for quick credibility

**Testimonials**
- Move from hidden panel to inline section on homepage
- 2-3 testimonials visible (already have DEVOUR + Jerk Terror)
- Get 1-2 more from Radiants community

**Footer CTA**
- "Ready to build?" + booking link
- Keep it simple, one action

### /work (Case Studies)

Each case study follows this structure:

**Template:**
```
[Project Name]
[One-line description]
[Role tags: Brand / UI / Code / Motion / Generative]

The Brief
  → What the client needed

The Work
  → What was built (screenshots, videos, live embeds)
  → Design decisions explained
  → Before/after if applicable

The Stack
  → Technologies used
  → Design system details

The Result
  → Impact, metrics if available
  → Client testimonial (inline)
```

**Case Study 1: Radiants – Design System & Brand**
- Full design token system (@rdna/radiants)
- Retro pixel aesthetic, DNA theme architecture
- Component library (React)
- Brand motion videos (Remotion)
- PFP background changer tool
- Generative pixel glyph language (Radish)
- Tags: Brand / Design System / Motion / Generative / Tools

**Case Study 2: WAYY – Product UI**
- Prediction market for art on Solana
- Full app design & development (Next.js)
- Solana wallet integration, transaction flows
- Dashboard, marketplace, battle system UI
- Tags: UI / Code / Web3 / Product

**Case Study 3: Generative Experiments – Creative Coding**
- 21+ standalone HTML experiments
- Flow fields, wave typography, needle fields
- Algorithmic art with seeded randomness
- This is the "wow, this person is different" case study
- Tags: Generative Art / Creative Coding / Motion

**Case Study 4: Pitch Decks**
- Hydex pitch deck (already in portfolio)
- Any others you've done
- Tags: Brand / Pitch Deck / Strategy

### /services (Packages & Pricing)

**Core Package – Brand Foundation – $8,000**
Everything a web3 project needs to look legit from day one.
- Brand Discovery & Strategy
- Logo Suite (wordmark, icon, variations)
- Color System & Typography
- Design Tokens (CSS/Tailwind-ready)
- Brand Guidelines Doc
- Social Kit (PFP templates, banner templates)

**Growth Package – Brand + Web – $15,000**
Brand foundation + a live website that ships.
- Everything in Core
- Website Design (Figma)
- Website Development (React/Next.js, deployed)
- Motion elements (loading states, transitions, micro-interactions)
- 1 month post-launch support

**Premium Package – Full Stack Brand – $25,000**
The complete identity system for serious projects.
- Everything in Growth
- Brand Motion Video (30-60s, Remotion)
- Generative Art System (on-brand algorithmic visuals)
- Mint Page / dApp UI Design & Dev
- Custom illustrations or 3D elements
- Design System Documentation (component library)
- 2 months post-launch support

**Add-Ons**
- Motion/Brand Video – $3,000-5,000
- Generative Art Collection – $5,000-8,000
- PFP Tool / Trait Builder – $4,000-6,000
- Additional Pages – $1,500-3,000/page
- Token Dashboard UI – $5,000-8,000
- Ongoing Retainer – $3,000/mo

**Process Section (How It Works)**
1. Discovery Call (free, 30 min) – understand the project
2. Proposal – scope, timeline, deliverables
3. Kickoff – 50% upfront, work begins
4. Delivery – iterative reviews, final handoff
5. Support – post-launch included in package

**Payment**
- 50% upfront, 50% on delivery
- Accepts USD, SOL, USDC

### /about

- Expanded bio from current about card
- "Designer who codes" story – how you got here
- Tools & workflow (Figma, React, GSAP, Remotion, Claude Code)
- Experiments gallery – moved from current site, shows creative range
- Guestbook – keep it, it's a personality touch
- iPod player – could keep as an easter egg

### /contact

- Cal.com embed for booking discovery calls
- Or: simple form (name, project type, budget range, timeline, description)
- "Accepts SOL/USDC" note
- Response time: "I'll get back to you within 24 hours"

---

## Technical Changes

### Routing
- Add React Router (or keep it minimal with hash routes)
- Current: single page, panel toggles
- New: proper page routes (/, /work, /work/:slug, /services, /about, /contact)

### What to keep
- Liquid glass design system (the signature)
- Single styles.css approach
- Custom stores (useSyncExternalStore)
- Firebase (guestbook, reactions)
- Vercel deploy
- GSAP for scroll animations & entrance sequences
- ASCII rose hero (iconic)
- iPod player (easter egg on /about)
- Client logo ticker

### What to add
- React Router (lightweight, client-side)
- Page transitions (GSAP)
- Case study template component
- Pricing card components
- Cal.com integration
- ScrollTrigger for section reveals
- SEO meta tags per page (react-helmet or manual)
- OG images for social sharing

### What to remove/change
- Panel toggle system → replaced by actual pages
- Card stack → replaced by proper work grid
- Service pills (only pitchdecks) → replaced by full services page
- Sticky note → remove (doesn't serve studio purpose)
- Notification dropdown → simplify or repurpose

### Preserved personality elements
- ASCII rose animation
- Guestbook
- iPod player
- Emoji reactions (move to case studies – let people react to projects)
- Glass morphism everything
- Custom cursor
- Notification bell → could show real updates (new case study, new experiment)

---

## Services & Pricing

### The Math (911 Goal = $120K/year)

| Scenario | Projects/Year | Revenue |
|----------|--------------|---------|
| 8x Core ($8K) | 8 | $64,000 |
| 8x Growth ($15K) | 8 | $120,000 |
| 5x Growth + 2x Premium | 7 | $125,000 |
| 4x Premium ($25K) | 4 | $100,000 |
| Mix + retainers | 6-8 | $120,000+ |

**Sweet spot:** 1-2 projects/month, mostly Growth tier. That's the 911.

---

## Launch Sequence

### Phase 1 – Content Prep (Week 1)
- [ ] Write case study copy for Radiants, WAYY, generative, pitchdecks
- [ ] Gather screenshots, screen recordings, GIFs of all work
- [ ] Record short Loom walkthroughs of each project
- [ ] Get 1-2 more testimonials from Radiants community
- [ ] Finalize pricing (gut check with 1-2 trusted people)
- [ ] Set up Cal.com booking page

### Phase 2 – Build (Week 1-2)
- [ ] Add React Router to rizzy.today
- [ ] Build page layout shell (nav, page transitions)
- [ ] Build /work page + case study template
- [ ] Build /services page with pricing cards
- [ ] Build /about page (migrate about card + experiments)
- [ ] Build /contact page (Cal.com embed)
- [ ] Evolve homepage hero + add sections
- [ ] Add ScrollTrigger animations
- [ ] OG images + meta tags
- [ ] Deploy

### Phase 3 – Launch (Week 2-3)
- [ ] Announce on X (@rizzytoday)
- [ ] Post case study thread for Radiants (biggest project)
- [ ] Share in RadiantsDAO community
- [ ] DM 10 web3 projects that need design help
- [ ] Update X bio to reflect studio positioning

### Phase 4 – Pipeline (Ongoing)
- [ ] Weekly: share process content, before/afters, experiments
- [ ] Referrals: ask Radiants network for intros
- [ ] Cold outreach: new Solana projects with bad design
- [ ] Free tool play: ship a small free tool for web3 projects
- [ ] Case study for each new client (compounds the portfolio)

---

## Competitive Edge

What you have that web2 studios (and most web3 "designers") don't:

1. **You ship code.** Not Figma files – live, deployed products.
2. **Web3 native.** Wallet integration, token UI, on-chain interactions.
3. **Generative art.** Algorithmic visuals, mint pages, PFP tools.
4. **Motion pipeline.** Remotion for brand videos, not outsourced.
5. **Design systems.** Token-based, component-ready, developer-friendly.
6. **Speed.** One person = no meetings, no handoffs, fast iteration.
7. **AI-augmented.** Claude Code makes you a 5-person studio.

You're not competing with Happy Pizza. You're in a different category entirely.
