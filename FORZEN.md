# FORZEN — rizzy.today (v2: "The Index")

> The day the site stopped being a shop and started being a person.
>
> This is the teaching doc for the v2 rebuild of rizzy.today — what it is, how it's wired, why every decision was made, and the war stories behind the bugs. Read it like a letter, not a spec sheet.

---

## 0. The pivot (read this first, it's the whole point)

The old rizzy.today was a **sales machine**. Bookshelf hero, pricing tiers, an FAQ, a big "Book a call" funnel. It worked the way a freelancer's site is supposed to work: land, get impressed, convert. It was good. It was also, in Riz's own words, *acting like a car salesman.*

v2 threw all of that out. The new thesis is one line:

> **Let the work be the pitch. Quiet conviction over selling.**

Riz is job-hunting in the Solana ecosystem — he doesn't want people to be *sold*, he wants them to *want to be in a room with him*. So the site became the opposite of a funnel: full white, editorial, calm. A persistent identity rail on the left (who I am, in plain sentences), and the work itself organized **by capability, not by client** — Direction, Design, Product.

The references were deliberate: **benji.org** (a quiet personal voice on white), **It's Nice That**'s index (numbered, monospace, archival), and **yeezy.com** (stark grids, restraint). None of them are trying to sell you anything. That's the tell.

**Engineering lesson #0:** the biggest architectural decision wasn't a framework. It was deleting ~3,000 lines of working code because the *strategy* changed. Sunk cost is a feeling, not a fact. When the thesis moves, the code follows — even the good code.

---

## 1. The stack (still deliberately small)

| Layer | Tool | Why |
|---|---|---|
| Framework | React 18 + Vite | Fast, no SSR needed for a portfolio |
| Routing | **None** — manual path parsing in `V2Root.tsx` | `/`, `/direction`, `/lab` etc. handled with `pushState` + a tiny `parsePath()` |
| Styling | One `src/styles-v2.css`, scoped under `#v2-root` | No CSS modules, no Tailwind. One file, one truth. |
| State | `useState` + refs | No store library. The whole app is a handful of booleans. |
| Animation | CSS + hand-rolled `requestAnimationFrame` physics | **Zero animation libraries.** GSAP/Framer are gone. |
| Deploy | Vercel, push-to-`main` | That's the pipeline. |
| Fonts | Helvetica Neue (system) + Fragment Mono (Google, async) | Display = Helvetica Bold, metadata = mono |

The bundle tells the story: the old site shipped ~250KB+ of JS plus GSAP. v2 ships **~16KB gzip of app code** + React. Deleting the marketing site, GSAP, Firebase, and Framer dropped the CSS from 86KB → 13KB. **Less site, more presence.**

---

## 2. The shape of it

```
src/
├── App.tsx                 # just renders <V2Root/> + Vercel analytics
├── styles-v2.css           # everything, scoped under #v2-root
├── constants/
│   ├── projects.ts         # CASE_STUDIES — galleries tagged display:'index'|'dense'
│   ├── music.ts            # 9-song iPod playlist
│   └── testimonials.ts     # 2 quotes (shown only in the hidden References overlay)
└── v2/
    ├── V2Root.tsx          # routing + state machine (home | discipline, + lab/overlays)
    ├── V2Identity.tsx      # the left rail: avatar, bio, contact, scroll-spy nav
    ├── V2Work.tsx          # homepage: 3 disciplines + hover mosaic
    ├── V2Discipline.tsx    # a scrolling page of grids for one discipline
    ├── V2Collection.tsx    # renders one section as index / bento / ratio grid
    ├── V2Mosaic.tsx        # homepage FLIP grid (big → dense)
    ├── V2Lightbox.tsx      # full-res viewer (swipe on mobile, scroll-follows the grid)
    ├── V2References.tsx     # testimonials, tucked away for the curious
    ├── V2Lab.tsx           # the experiments index
    ├── V2LabIpod / Glass / Pet .tsx   # the toys
    ├── disciplines.ts      # taxonomy + thumb()/med()/videoPoster() helpers
    ├── indexLabels.ts      # raw filenames → clean human labels
    └── imageDims.ts        # precomputed image dimensions (no layout reflow)
```

**The rail is the spine.** `V2Identity` is always there on the left: avatar, the Don-Draper-ish two-paragraph bio, contact woven into a sentence ("find me on X, book a call, or email"), "Available to work." On a discipline page, the bio swaps for a scroll-spy table of contents. The content pane on the right is the only thing that changes. It's a two-pane shell, like a magazine with a fixed masthead.

---

## 3. The three big technical stories

### A. The CSS specificity trap that ate all the padding

Early on, *no padding would apply*. Set `padding: 60px`, content still hugged the edge. The culprit was the reset:

```css
#v2-root *, #v2-root *::before { padding: 0; margin: 0; }
```

That selector contains an **ID**, giving it specificity (1,0,0). Every plain class rule (`.v2-rail`, 0,1,0) lost to it. The reset was silently zeroing everything.

The fix is one of the most useful CSS tricks there is — `:where()` collapses specificity to **zero**:

```css
:where(#v2-root *), :where(#v2-root *)::before { box-sizing:border-box; margin:0; padding:0; }
```

**Lesson:** when styles "just don't apply," stop tweaking values and open DevTools' computed tab — you're almost always losing a specificity fight, not a syntax one. `:where()` is how you write resets that never bully your real rules.

### B. The yeezy mosaic — a real FLIP, not a fake one

The homepage preview had to feel like the yeezy grid: tiles appear **big** (3 per row), hold for a beat, then *resize and reposition* into a dense grid (6 per row) — like iOS icons rearranging when you change the grid. The mistake (made several times) was animating it as scatter/float/zoom. That's not what's happening. The grid **system** changes, and every tile travels to its new slot.

That's the **FLIP** technique (First, Last, Invert, Play):
1. Measure each tile's **dense** (final) position.
2. Add the "big" class, measure the **big** position.
3. Remove it, then `transform` each tile *back* to where it was big (Invert) with no transition.
4. Hold ~420ms, then release the transform with a staggered transition (Play) — they all glide to their dense slots.

**Lesson:** smooth layout animation is almost never "animate width/left." It's measure-both-states, jump to the start with a transform, then let CSS interpolate the transform. Transforms are GPU-composited and cheap; animating layout properties is slow and janky.

### C. The octopus that was never a file

The Lab has a Tamagotchi — an octopus ported from Riz's desktop pet app (`~/hatch`, a Tauri build). The recovery of that octopus is the best story in the codebase.

The wrong octopus (a pink one) got used first, because that's the only file on disk named `octopus.png`. The real one — the tan, crowned "Riz Jr." — wasn't in any sprite folder. I searched the entire machine. Empty.

The breakthrough: *"if I run the Tauri app, the octopus is right there — how is it lost?"* Exactly. It's lost as a **file** because it was never a file. `creature.html` has a `DRAW` table of **procedural canvas functions** — `DRAW_ADULT.octopus` paints the creature with `fillRect` calls every frame (crown, eyes that drift, seven tentacles waving on a `sin`). The "sprite" *is the code.* That's why the app renders it with zero image assets.

So I ported `DRAW_ADULT.octopus` **verbatim** into a `<canvas>`. Pixel-identical, because it's literally the same fill-rect calls.

**Lesson:** when an asset seems impossible to find, question the assumption that it's an asset. Generated content (procedural art, computed audio, runtime-built sprites) has no file — the file is the function. The fastest path to the "art" was reading the renderer, not hunting PNGs.

---

## 4. Performance, the boring stuff that matters

- **Three image tiers.** `.thumb.jpg` (240px) for the homepage mosaic, `.med.jpg` (640px) for grids, full-res `.webp` only in the lightbox. Grids that rendered 2688px images into 200px cells went from "Internet Explorer slow" to instant.
- **Precomputed dimensions** (`imageDims.ts`) so grids reserve correct space up front — zero reflow as images load.
- **Lazy video.** `autoPlay` was secretly downloading every mp4 on page render — ~48MB on `/product` alone. Now videos use `preload="none"` + an IntersectionObserver that plays them only when scrolled into view. Verified: 0 video bytes on load. (And the motion still shows in previews — via `ffmpeg` poster stills.)
- **Progressive previews.** The index side-preview shows the cached `med` instantly as a CSS background while the full-res `<img>` loads on top — no gray box, no lag, no soft image. Keyed per-src so it remounts instead of holding a stale frame.
- **Frame-rate-independent physics.** The iPod's drop-in used per-frame velocity, so on a 120Hz display it fell twice as fast and looked instant. The fix: integrate physics with a `dt` (delta-time) factor so the fall is ~0.6s on *any* refresh rate.

**Lesson:** "make it feel instant" is rarely one trick. It's a stack — right-sized assets, reserved space, deferred loads, a placeholder that fills the gap, and physics that don't depend on the monitor.

---

## 5. The Lab — proof you build for the love of it

`/lab` (its own URL) is the quiet rebellion against the "professional portfolio" rulebook. It's a benji-style index that **spawns interactive toys floating over the page**:

- **iPod** on a spring-physics headphone cable (drops from the top, swings, plays the playlist).
- **Liquid Glass** — the crown-jewel SVG displacement filter as a draggable slab that refracts the real page. Matched 1:1 to the `/liquid-glass/` demo (`backdrop-filter: url(#id) saturate(1)`, aberration `[0,10,20]`, scale -180 — no blur, no tint).
- **Octopus Tamagotchi** — feed/play/pet, it ages and evolves, saves to localStorage.

This is the part of the site that says *I make things because making things is the job.* For a creative-director hire, that reads louder than any case study.

---

## 6. How a good engineer showed up here

- **Delete fearlessly when the thesis changes.** 3,000 lines, gone, no ceremony.
- **Verify everything with eyes, not vibes.** Headless Chrome + the DevTools protocol screenshotted and measured every change — overflow widths, the iPod's Y over time, the glass's computed `backdrop-filter`, network requests on load. "It builds" is not "it works."
- **Read the source of truth.** The glass wasn't right until I read the *actual* `/liquid-glass/` JS. The octopus wasn't right until I read `creature.html`. Guessing is slower than reading.
- **Recover gracefully.** Lost sprites → port the renderer. Missing OG image → generate it. The constraint is rarely the wall it looks like.

---

## 7. Where it stands

Live on `main`, deploying to rizzy.today. Old `/work`, `/v2` paths redirect home. Direction holds the full Radiants campaign archive (Community 24 · Monolith 44 · Seeker 40), labeled like a gallery checklist. The share card is square on WhatsApp, wide on X. The name on the rail is just **Riz**.

It stopped being a shop. It started being him.

*— written the day it shipped.*
