# GSAP Cheatsheet — Every motion.dev Pattern, Translated

> Your design rules: CSS for simple states (hover, active, focus), GSAP for choreography.
> This cheatsheet covers every animation concept from motion.dev and how to do it with GSAP + CSS.

---

## Setup

```tsx
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { CustomEase } from "gsap/CustomEase"
import { Flip } from "gsap/Flip"
import { Draggable } from "gsap/Draggable"
import { Observer } from "gsap/Observer"

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip, Draggable, Observer)
```

---

## 1. Basic Animation

### Animate to target

```tsx
// motion.dev
<motion.div animate={{ x: 100, opacity: 1 }} />

// GSAP
gsap.to(el, { x: 100, opacity: 1 })
```

### Animate from → to

```tsx
// motion.dev
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} />

// GSAP
gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })

// Or just "from" (animates FROM these values to current CSS state)
gsap.from(el, { opacity: 0, y: 20 })
```

### Set instantly (no animation)

```tsx
// motion.dev
<motion.div initial={false} style={{ x: 100 }} />

// GSAP
gsap.set(el, { x: 100 })
```

---

## 2. Transitions & Easing

### Duration + easing

```tsx
// motion.dev
transition={{ duration: 0.5, ease: "easeInOut" }}

// GSAP
gsap.to(el, { x: 100, duration: 0.5, ease: "power2.inOut" })
```

### Easing translation table

| motion.dev | GSAP | Feel |
|---|---|---|
| `"linear"` | `"none"` | Constant speed |
| `"easeIn"` | `"power2.in"` | Slow start |
| `"easeOut"` | `"power2.out"` | Slow end |
| `"easeInOut"` | `"power2.inOut"` | Slow both ends |
| `"backIn"` | `"back.in(1.7)"` | Overshoot start |
| `"backOut"` | `"back.out(1.7)"` | Overshoot end |
| `"backInOut"` | `"back.inOut(1.7)"` | Overshoot both |
| `"circIn"` | `"circ.in"` | Circular ease |
| `"circOut"` | `"circ.out"` | Circular ease |
| `"anticipate"` | `"back.inOut(2)"` | Pull back then shoot |
| `cubicBezier(a,b,c,d)` | `CustomEase.create("name", "M0,0 C...")` | Custom curve |
| `[0.4, 0, 0.2, 1]` | `"power2.out"` (closest) | Material ease |
| `steps(n)` | `"steps(n)"` | Stepped |

### GSAP-exclusive easings (no motion.dev equivalent)

| Ease | Feel |
|---|---|
| `"power3.out"` | Aggressive deceleration |
| `"power4.out"` | Very snappy |
| `"elastic.out(1, 0.3)"` | Spring overshoot with oscillation |
| `"bounce.out"` | Ball-drop bounce |
| `"expo.out"` | Extreme deceleration |
| `"slow(0.7, 0.7, false)"` | Slow middle section |

### Spring physics

```tsx
// motion.dev — physics spring
transition={{ type: "spring", stiffness: 300, damping: 20, mass: 1 }}

// GSAP — elastic ease (similar vibe, not true physics)
gsap.to(el, { x: 100, ease: "elastic.out(1, 0.3)", duration: 1 })

// GSAP — for true spring feel, use CustomEase or CustomWiggle
// Or simulate with gsap.quickTo() for interactive spring-following
const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" })
window.addEventListener("mousemove", e => xTo(e.clientX))
```

### Per-property transitions

```tsx
// motion.dev
transition={{ x: { type: "spring", stiffness: 300 }, opacity: { duration: 0.2 } }}

// GSAP — use timeline
const tl = gsap.timeline()
tl.to(el, { opacity: 1, duration: 0.2 })
  .to(el, { x: 100, ease: "elastic.out(1, 0.3)", duration: 0.8 }, 0) // "0" = start at same time
```

---

## 3. Keyframes

```tsx
// motion.dev
animate={{ x: [0, 100, 50] }}
transition={{ duration: 2, times: [0, 0.8, 1] }}

// GSAP — keyframes property
gsap.to(el, {
  keyframes: [
    { x: 0, duration: 0 },
    { x: 100, duration: 1.6 },   // 80% of 2s
    { x: 50, duration: 0.4 },    // remaining 20%
  ]
})

// Or simpler with keyframes shorthand
gsap.to(el, {
  keyframes: { x: [0, 100, 50] },
  duration: 2,
  ease: "power2.inOut"
})
```

---

## 4. Repeat & Loop

```tsx
// motion.dev
transition={{ repeat: Infinity, repeatType: "reverse", repeatDelay: 0.5 }}

// GSAP
gsap.to(el, { x: 100, repeat: -1, yoyo: true, repeatDelay: 0.5 })
//                      ^^^ -1 = infinite
//                               ^^^ yoyo = "reverse" in motion.dev
```

| motion.dev `repeatType` | GSAP equivalent |
|---|---|
| `"loop"` | `repeat: -1` (default, restarts from beginning) |
| `"reverse"` | `repeat: -1, yoyo: true` |
| `"mirror"` | `repeat: -1, yoyo: true` (same as reverse in GSAP) |

---

## 5. Gestures

### Hover, Tap, Focus → CSS only (your design rules)

```css
/* whileHover */
.btn {
  transition: transform 0.3s var(--bounce-ease), box-shadow 0.3s var(--smooth-ease);
}
.btn:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

/* whileTap */
.btn:active {
  transform: scale(0.98);
  transition: all 0.15s var(--smooth-ease);
}

/* whileFocus */
.btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4);
}
```

### Complex hover (multi-step, staggered children) → GSAP

```tsx
const ref = useRef<HTMLDivElement>(null)

useGSAP(() => {
  const el = ref.current!
  const children = el.querySelectorAll(".child")

  el.addEventListener("mouseenter", () => {
    gsap.to(el, { scale: 1.05, y: -2, duration: 0.3, ease: "back.out(1.7)" })
    gsap.to(children, { opacity: 1, y: 0, stagger: 0.03, duration: 0.25 })
  })

  el.addEventListener("mouseleave", () => {
    gsap.to(el, { scale: 1, y: 0, duration: 0.25, ease: "power2.out" })
    gsap.to(children, { opacity: 0, y: 8, stagger: 0.02, duration: 0.2 })
  })
}, { scope: ref })
```

---

## 6. Stagger

```tsx
// motion.dev — variants
staggerChildren: 0.1, staggerDirection: 1

// motion.dev — imperative
animate("li", { opacity: 1 }, { delay: stagger(0.1, { from: "center" }) })

// GSAP — simple
gsap.from(".item", { opacity: 0, y: 20, stagger: 0.1 })

// GSAP — from center
gsap.from(".item", { opacity: 0, y: 20, stagger: { each: 0.1, from: "center" } })

// GSAP — from end
gsap.from(".item", { opacity: 0, y: 20, stagger: { each: 0.1, from: "end" } })

// GSAP — with easing on the stagger itself
gsap.from(".item", { opacity: 0, y: 20, stagger: { each: 0.1, ease: "power2.in" } })

// GSAP — grid stagger (2D)
gsap.from(".grid-item", {
  opacity: 0,
  scale: 0.8,
  stagger: { each: 0.05, from: "center", grid: [4, 6], axis: "y" }
})
```

---

## 7. Timelines (Sequencing)

```tsx
// motion.dev — useAnimate sequence
await animate([
  [el, { x: 100 }],
  ["li", { opacity: 1 }, { at: "-0.2" }],   // overlap
  [el, { rotate: 45 }, { at: 0.5 }],         // absolute time
])

// GSAP — timeline
const tl = gsap.timeline()

tl.to(el, { x: 100, duration: 0.5 })
  .to("li", { opacity: 1, duration: 0.3 }, "-=0.2")    // overlap 0.2s
  .to(el, { rotation: 45, duration: 0.4 }, 0.5)         // absolute time 0.5s

// Labels for named positions
tl.addLabel("reveal", "-=0.25")
  .to(".card", { y: 0, stagger: 0.1 }, "reveal")
  .to(".badge", { scale: 1 }, "reveal+=0.3")
```

### Timeline control

```tsx
const tl = gsap.timeline({ paused: true })

tl.play()           // Play from current position
tl.pause()          // Pause
tl.reverse()        // Play backwards
tl.restart()        // Start over
tl.progress(0.5)    // Jump to 50%
tl.timeScale(2)     // 2x speed
tl.seek("reveal")   // Jump to label
tl.kill()           // Destroy
```

---

## 8. Scroll Animations

### Scroll-triggered (enter viewport) → CSS + IntersectionObserver

You already have `ScrollReveal.tsx` using `data-reveal`. For most cases, stick with this.

### Scroll-triggered → GSAP ScrollTrigger

```tsx
// motion.dev
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.5 }}
/>

// GSAP ScrollTrigger — toggle class (lightweight)
ScrollTrigger.create({
  trigger: el,
  start: "top 80%",
  onEnter: () => el.classList.add("revealed"),
  once: true,
})

// GSAP ScrollTrigger — direct animation
gsap.from(el, {
  opacity: 0, y: 50,
  scrollTrigger: {
    trigger: el,
    start: "top 80%",     // element top hits 80% down viewport
    end: "top 20%",
    toggleActions: "play none none none",  // onEnter, onLeave, onEnterBack, onLeaveBack
  }
})
```

### Scroll-linked (parallax, progress bars)

```tsx
// motion.dev
const { scrollYProgress } = useScroll({ target: ref })
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

// GSAP ScrollTrigger — scrub
gsap.to(el, {
  opacity: 1,
  y: 0,
  scrollTrigger: {
    trigger: el,
    start: "top bottom",
    end: "top center",
    scrub: true,          // Animation progress = scroll progress
  }
})

// Parallax
gsap.to(".bg-image", {
  y: -200,
  scrollTrigger: {
    trigger: ".section",
    start: "top bottom",
    end: "bottom top",
    scrub: 0.5,           // 0.5s smoothing on scroll
  }
})

// Progress bar
gsap.to(".progress-bar", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  }
})
```

### Pin (stick element while scrolling)

```tsx
// No motion.dev equivalent — GSAP exclusive
ScrollTrigger.create({
  trigger: ".panel",
  start: "top top",
  end: "+=500",        // Pin for 500px of scroll
  pin: true,
  pinSpacing: true,
})
```

---

## 9. Layout Animations (FLIP)

```tsx
// motion.dev
<motion.div layout layoutId="shared-card" />

// GSAP Flip plugin
const state = Flip.getState(".cards")   // Snapshot current positions

// ... change DOM (reorder, resize, reparent) ...

Flip.from(state, {
  duration: 0.5,
  ease: "power2.inOut",
  stagger: 0.05,
  absolute: true,        // Use position:absolute during animation
  onComplete: cleanup,
})
```

### Shared element transition

```tsx
// motion.dev
<motion.div layoutId="hero-image" />  // on page A and page B

// GSAP Flip — manually
const state = Flip.getState("#hero-image")

// Move element to new container
newContainer.appendChild(heroImage)

Flip.from(state, {
  duration: 0.6,
  ease: "power3.inOut",
  scale: true,           // Animate scale changes
})
```

### Filter/sort animation

```tsx
// Capture state before change
const state = Flip.getState(".grid-item", { props: "opacity" })

// Change the DOM (filter, sort, etc.)
items.forEach(item => {
  item.style.display = shouldShow(item) ? "block" : "none"
})

// Animate from old state to new state
Flip.from(state, {
  duration: 0.5,
  ease: "power2.out",
  stagger: 0.03,
  onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 }),
  onLeave: els => gsap.to(els, { opacity: 0, scale: 0.8 }),
})
```

---

## 10. Exit Animations

```tsx
// motion.dev
<AnimatePresence>
  {show && <motion.div exit={{ opacity: 0, y: -20 }} />}
</AnimatePresence>

// GSAP — animate out, then remove
function exitElement(el: HTMLElement) {
  gsap.to(el, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => el.remove()
  })
}

// React pattern — state-driven
function AnimatedItem({ show, children }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(show)

  useEffect(() => {
    if (show) {
      setMounted(true)
    } else if (ref.current) {
      gsap.to(ref.current, {
        opacity: 0, y: -20, duration: 0.3,
        onComplete: () => setMounted(false)
      })
    }
  }, [show])

  useEffect(() => {
    if (show && ref.current) {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      )
    }
  }, [mounted])

  if (!mounted) return null
  return <div ref={ref}>{children}</div>
}
```

---

## 11. Drag

```tsx
// motion.dev
<motion.div drag="x" dragConstraints={{ left: -100, right: 100 }} dragElastic={0.2} />

// GSAP Draggable
import { Draggable } from "gsap/Draggable"

Draggable.create(el, {
  type: "x",                          // "x", "y", "x,y", "rotation"
  bounds: { minX: -100, maxX: 100 },  // Or a container element
  edgeResistance: 0.8,                // Like dragElastic (0 = none, 1 = max)
  inertia: true,                      // Momentum on release (needs InertiaPlugin)
  snap: { x: v => Math.round(v / 50) * 50 },  // Snap to grid
  onDrag() { console.log(this.x) },
  onDragEnd() { console.log("released at", this.x) },
})

// Snap to origin on release
Draggable.create(el, {
  type: "x,y",
  onDragEnd() {
    gsap.to(this.target, { x: 0, y: 0, ease: "elastic.out(1, 0.3)" })
  }
})
```

---

## 12. Text Animations (GSAP exclusive — no motion.dev equivalent)

```tsx
// Split text into characters/words/lines
useGSAP(() => {
  const split = new SplitText(".headline", { type: "chars, words" })

  // Staggered character reveal
  gsap.from(split.chars, {
    opacity: 0,
    y: 20,
    rotateX: -90,
    stagger: 0.03,
    duration: 0.5,
    ease: "back.out(1.7)",
  })

  // Typewriter effect
  gsap.from(split.chars, {
    opacity: 0,
    stagger: 0.04,
    duration: 0.01,       // Near-instant per character
    ease: "none",
  })

  // Word-by-word with scroll
  gsap.from(split.words, {
    opacity: 0.2,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".headline",
      start: "top 80%",
      end: "top 30%",
      scrub: true,
    }
  })
})
```

---

## 13. Reactive Values (quickTo / quickSetter)

```tsx
// motion.dev
const x = useMotionValue(0)
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])

// GSAP quickTo — spring-like following
const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" })
const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" })

window.addEventListener("mousemove", e => {
  xTo(e.clientX - window.innerWidth / 2)
  yTo(e.clientY - window.innerHeight / 2)
})

// GSAP quickSetter — instant (no animation, max perf)
const setX = gsap.quickSetter(el, "x", "px")
const setOpacity = gsap.quickSetter(el, "opacity")

window.addEventListener("mousemove", e => {
  setX(e.clientX)
  // Map range: input [-200, 200] → output [0, 1, 0]
  const mapped = gsap.utils.mapRange(-200, 200, 0, 1, e.clientX - window.innerWidth / 2)
  setOpacity(mapped)
})

// gsap.utils for value mapping (like useTransform)
gsap.utils.mapRange(0, 100, 0, 1, 50)           // → 0.5
gsap.utils.clamp(0, 1, 1.5)                      // → 1
gsap.utils.interpolate(0, 100, 0.5)              // → 50
gsap.utils.interpolate(["red", "blue"], 0.5)     // → color midpoint
gsap.utils.pipe(clampFn, mapFn, snapFn)          // Chain transforms
gsap.utils.wrap(0, 360, 400)                     // → 40 (wraps around)
gsap.utils.snap(50, 123)                         // → 150 (snap to nearest 50)
```

---

## 14. Custom Easing

```tsx
// motion.dev — cubicBezier or JS function
transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
transition={{ ease: t => t * t }}

// GSAP CustomEase — from cubic bezier
CustomEase.create("myEase", "M0,0 C0.17,0.67 0.83,0.67 1,1")

// GSAP CustomEase — from SVG path (full control)
CustomEase.create("hop", "M0,0 C0,0 0.1,1.2 0.5,1.2 0.9,1.2 1,0 1,0")

gsap.to(el, { y: -100, ease: "myEase" })
gsap.to(el, { y: -100, ease: "hop" })
```

---

## 15. Observer (Gesture Detection — GSAP exclusive)

```tsx
// Detect scroll, touch, pointer events without scroll actually happening
// Great for fullscreen section transitions
Observer.create({
  type: "wheel, touch, pointer",
  onUp: () => goToNextSection(),
  onDown: () => goToPrevSection(),
  tolerance: 10,
  preventDefault: true,
})
```

---

## 16. Reduced Motion (Accessibility)

```tsx
// motion.dev
const prefersReduced = useReducedMotion()

// GSAP — built in
gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
  // Swap animations for opacity-only or disable them
  gsap.set(".animated", { clearProps: "all" })
})

// Or check manually
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
```

---

## 17. Responsive Animations

```tsx
// GSAP matchMedia — breakpoint-specific animations
gsap.matchMedia().add({
  "(min-width: 901px)": () => {
    // Desktop animations
    gsap.from(".hero", { x: -100, duration: 1 })
  },
  "(max-width: 900px)": () => {
    // Mobile animations (simpler, shorter)
    gsap.from(".hero", { opacity: 0, duration: 0.5 })
  },
})
```

---

## 18. Animation Frame Loop

```tsx
// motion.dev
useAnimationFrame((time, delta) => { /* per frame */ })

// GSAP ticker
gsap.ticker.add((time, deltaTime, frame) => {
  // Runs every frame
  el.style.transform = `rotate(${time * 50}deg)`
})

// Remove when done
gsap.ticker.remove(myCallback)

// Set FPS
gsap.ticker.fps(30)  // Cap at 30fps
```

---

## 19. Callbacks

```tsx
// motion.dev
onAnimationStart={() => {}}
onAnimationComplete={() => {}}

// GSAP
gsap.to(el, {
  x: 100,
  onStart: () => console.log("started"),
  onUpdate: () => console.log("each frame"),
  onComplete: () => console.log("done"),
  onReverseComplete: () => console.log("reversed to start"),
})

// Timeline callbacks at specific points
tl.call(() => doSomething(), [], "reveal")        // At label
tl.call(() => doSomething(), [], "+=0.5")          // 0.5s from now
tl.eventCallback("onComplete", () => allDone())    // When whole timeline ends
```

---

## 20. useGSAP Hook (React Integration)

```tsx
import { useGSAP } from "@gsap/react"

function Component() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // All GSAP code here — auto-cleaned up on unmount
    gsap.from(".item", { opacity: 0, y: 20, stagger: 0.1 })

    // ScrollTriggers auto-killed
    ScrollTrigger.create({ trigger: ".section", ... })

    // Timelines auto-killed
    gsap.timeline().to(".box", { x: 100 })

  }, { scope: container })  // Scope selectors to container's children

  // With dependencies (re-run when deps change)
  useGSAP(() => {
    gsap.to(".box", { x: isOpen ? 200 : 0 })
  }, { scope: container, dependencies: [isOpen] })

  return <div ref={container}>...</div>
}
```

---

## Quick Reference: What to Use When

| Animation Need | Use |
|---|---|
| Hover/active/focus states | **CSS** transitions |
| Simple entrance fade/slide | **CSS** `@keyframes` + `data-reveal` |
| Infinite loops (pulse, spin, float) | **CSS** `@keyframes` |
| Multi-step entrance choreography | **GSAP** `timeline()` |
| Staggered reveals (lists, grids) | **GSAP** `stagger` or **CSS** `nth-child` delays |
| Scroll-triggered class toggle | **IntersectionObserver** (you have `ScrollReveal.tsx`) |
| Scroll-linked parallax/progress | **GSAP** `ScrollTrigger` with `scrub` |
| Pinned scroll sections | **GSAP** `ScrollTrigger` with `pin` |
| Text splitting (char/word reveals) | **GSAP** `SplitText` |
| Layout transitions (reorder, resize) | **GSAP** `Flip` |
| Drag & drop | **GSAP** `Draggable` |
| Cursor-following elements | **GSAP** `quickTo()` |
| Value mapping & interpolation | **GSAP** `gsap.utils` |
| Complex exit animations | **GSAP** `gsap.to()` + `onComplete` |
| Responsive animation variants | **GSAP** `matchMedia()` |
| Per-frame animation loop | **GSAP** `ticker` |

---

## Your Existing Easing Tokens

Keep using these in CSS — they complement GSAP:

```css
--smooth-ease: cubic-bezier(0.4, 0, 0.2, 1);     /* General transitions */
--bounce-ease: cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot for transforms */
--pill-ease: cubic-bezier(0.22, 1, 0.36, 1);      /* Spring-like entrance */
```

GSAP closest equivalents:
- `--smooth-ease` → `"power2.out"`
- `--bounce-ease` → `"back.out(1.4)"`
- `--pill-ease` → `"power3.out"`
