import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ── A web port of "hatch" — a creature that lives on the page. Octopus only.
// Game logic faithful to the desktop version (needs decay, mood, aging,
// evolution, thoughts), consolidated from its multi-window form into one
// draggable Tamagotchi widget. Persists to localStorage.

type Stage = 'baby' | 'child' | 'teen' | 'adult'
const STAGE_ORDER: Stage[] = ['baby', 'child', 'teen', 'adult']
const STAGE_MS: Record<Stage, number> = {
  baby: 5 * 60_000, child: 10 * 60_000, teen: 15 * 60_000, adult: Infinity,
}

const THOUGHTS: Record<string, string[]> = {
  idle: ['...', '~', 'hmm', 'la la la~', '*yawn*', 'boop!', 'hehe', ':3', 'nyoom', '*stretch*', 'hi!', '*wiggle*', 'pet me?', 'blub blub'],
  hungry: ['so hungry...', 'feed me!', 'nom?', '*tummy rumble*', 'food plz', 'snack time?', 'i could eat'],
  tired: ['sleepy...', '*yawn*', 'nap time?', 'zzz...', 'so tired', 'eyes heavy...'],
  sad: ['...', '*sigh*', 'lonely', 'pay attention to me', ':(', '*pout*', 'come back...'],
  happy: ['yay!', ':D', '*happy dance*', 'life is good!', 'love u!', 'wheee~', 'best day!'],
  sick: ["don't feel good...", '*cough*', 'help...', 'medicine plz', 'blegh'],
}

interface Pet {
  name: string
  stage: Stage
  hunger: number; energy: number; mood: number; affection: number
  isSleeping: boolean; isSick: boolean
  careMistakes: number; stageStart: number; lastTick: number
}

const FRESH: Pet = {
  name: 'Inky', stage: 'baby',
  hunger: 0.35, energy: 0.7, mood: 0.7, affection: 0.6,
  isSleeping: false, isSick: false,
  careMistakes: 0, stageStart: Date.now(), lastTick: Date.now(),
}

const KEY = 'hatch-octopus-v1'

function clamp(n: number) { return Math.max(0, Math.min(1, n)) }

function withMood(p: Pet): Pet {
  let mood = (1 - p.hunger) * 0.3 + p.energy * 0.3 + p.affection * 0.4
  if (p.isSick) mood *= 0.5
  return { ...p, mood: clamp(mood) }
}

// one minute of needs decay
function decay(p: Pet): Pet {
  let n = { ...p }
  if (n.isSleeping) {
    n.energy = clamp(n.energy + 0.02); n.hunger = clamp(n.hunger + 0.005)
  } else {
    n.hunger = clamp(n.hunger + 0.018); n.energy = clamp(n.energy - 0.01); n.affection = clamp(n.affection - 0.007)
    if (!n.isSick && n.hunger > 0.85 && n.energy < 0.2 && Math.random() < 0.15) n.isSick = true
    if (n.hunger > 0.9 || n.energy < 0.1) n.careMistakes++
  }
  return withMood(n)
}

function advanceStage(p: Pet): Pet {
  if (p.stage === 'adult') return p
  if (Date.now() - p.stageStart < STAGE_MS[p.stage]) return p
  const next = STAGE_ORDER[STAGE_ORDER.indexOf(p.stage) + 1]
  return { ...p, stage: next, stageStart: Date.now() }
}

function load(): Pet {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...FRESH }
    const saved = { ...FRESH, ...JSON.parse(raw) } as Pet
    // catch up needs for time away (cap 1h)
    const missed = Math.min(60, Math.floor((Date.now() - saved.lastTick) / 60_000))
    let p = saved
    for (let i = 0; i < missed; i++) p = decay(p)
    p.lastTick = Date.now()
    return withMood(p)
  } catch { return { ...FRESH } }
}

const thoughtFor = (p: Pet) => {
  let c = 'idle'
  if (p.hunger > 0.7) c = 'hungry'
  else if (p.energy < 0.3) c = 'tired'
  else if (p.mood < 0.3) c = 'sad'
  else if (p.mood > 0.8) c = 'happy'
  if (p.isSick) c = 'sick'
  const pool = THOUGHTS[c]
  return pool[Math.floor(Math.random() * pool.length)]
}

// Faithful pixel-art reconstruction of the hatch octopus (tan dome, gold crown,
// dark eyes w/ highlights, checkered tan/cream tentacles). Vector so it stays
// crisp; parts animate via CSS. (Original sprite sheets were lost.)
function Octo() {
  const T = '#d9b38a', t = '#c2925f', C = '#f3e7d1', F = '#b07d49'
  const E = '#1c1c1c', H = '#a9c9d4', G = '#f3c12e', R = '#d63b3b', W = '#ffffff'
  const px = (c: number, r: number, w: number, h: number, f: string, k: string) =>
    <rect key={k} x={c * 4} y={r * 4} width={w * 4} height={h * 4} fill={f} />
  const tent: React.ReactNode[] = []
  for (let r = 9; r <= 11; r++) for (let c = 2; c <= 13; c++) tent.push(px(c, r, 1, 1, (c + r) % 2 ? C : T, `t${c}-${r}`))
  for (let c = 2; c <= 13; c += 2) tent.push(px(c, 12, 1, 1, F, `f${c}`))
  return (
    <svg className="octo-svg" viewBox="0 0 64 56" shapeRendering="crispEdges" aria-hidden="true">
      {/* crown */}
      {px(6, 0, 1, 1, G, 'cl')}{px(7, 0, 1, 1, R, 'cm')}{px(8, 0, 1, 1, G, 'cr')}
      {px(5, 1, 6, 1, G, 'cb')}{px(7, 1, 1, 1, W, 'cw')}
      {/* head */}
      {px(4, 2, 8, 1, T, 'h0')}
      {px(3, 3, 10, 1, T, 'h1')}
      {px(2, 4, 12, 5, T, 'h2')}
      {px(2, 4, 1, 5, t, 'hl')}{px(13, 4, 1, 5, t, 'hr')}
      {/* eyes */}
      {px(4, 5, 2, 2, E, 'el')}{px(4, 5, 1, 1, H, 'elh')}
      {px(9, 5, 2, 2, E, 'er')}{px(9, 5, 1, 1, H, 'erh')}
      {/* mouth */}
      {px(7, 7, 2, 1, t, 'mo')}
      {/* tentacles */}
      {tent}
    </svg>
  )
}

const STATS: { key: keyof Pet; label: string; invert?: boolean }[] = [
  { key: 'hunger', label: 'Full', invert: true },
  { key: 'energy', label: 'Energy' },
  { key: 'mood', label: 'Mood' },
  { key: 'affection', label: 'Love' },
]

export function V2LabPet({ onClose }: { onClose: () => void }) {
  const [pet, setPet] = useState<Pet>(load)
  const [thought, setThought] = useState<string | null>('hi!')
  const [reaction, setReaction] = useState<string>('')
  const petRef = useRef(pet)
  petRef.current = pet

  // drag
  const cardRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const drag = useRef<{ ox: number; oy: number } | null>(null)
  useEffect(() => {
    pos.current = { x: window.innerWidth - 280, y: Math.max(40, window.innerHeight / 2 - 170) }
    if (cardRef.current) cardRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
  }, [])
  const onDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.pet-btn')) return
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    drag.current = { ox: e.clientX - pos.current.x, oy: e.clientY - pos.current.y }
  }, [])
  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current) return
    pos.current = { x: e.clientX - drag.current.ox, y: e.clientY - drag.current.oy }
    if (cardRef.current) cardRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
  }, [])
  const onUp = useCallback(() => { drag.current = null }, [])

  // persist on change
  useEffect(() => {
    petRef.current = pet
    try { localStorage.setItem(KEY, JSON.stringify({ ...pet, lastTick: Date.now() })) } catch {}
  }, [pet])

  // needs decay + aging every 60s
  useEffect(() => {
    const id = setInterval(() => setPet(p => advanceStage(decay(p))), 60_000)
    return () => clearInterval(id)
  }, [])

  // ambient thoughts every 12-26s
  useEffect(() => {
    let t: number
    const tick = () => {
      const p = petRef.current
      if (!p.isSleeping && Math.random() < 0.85) flashThought(thoughtFor(p))
      t = window.setTimeout(tick, 12_000 + Math.random() * 14_000)
    }
    t = window.setTimeout(tick, 6000)
    return () => clearTimeout(t)
  }, [])

  const thoughtTimer = useRef<number>()
  function flashThought(text: string) {
    setThought(text)
    clearTimeout(thoughtTimer.current)
    thoughtTimer.current = window.setTimeout(() => setThought(null), 3200)
  }
  const reactTimer = useRef<number>()
  function react(name: string) {
    setReaction(name)
    clearTimeout(reactTimer.current)
    reactTimer.current = window.setTimeout(() => setReaction(''), 700)
  }

  function act(action: string) {
    setPet(prev => {
      let p = { ...prev }
      switch (action) {
        case 'feed': p.hunger = clamp(p.hunger - 0.25); react('feed'); if (p.hunger < 0.3) flashThought('yummy! :3'); break
        case 'play': p.mood = clamp(p.mood + 0.2); p.energy = clamp(p.energy - 0.05); p.affection = clamp(p.affection + 0.1); react('play'); flashThought('wheee~'); break
        case 'pet': p.affection = clamp(p.affection + 0.15); p.mood = clamp(p.mood + 0.05); react('pet'); if (p.affection > 0.8) flashThought('love u! <3'); break
        case 'sleep': p.isSleeping = !p.isSleeping; flashThought(p.isSleeping ? 'goodnight... zzz' : 'good morning! :D'); break
        case 'medicine': if (p.isSick) { p.isSick = false; p.mood = clamp(p.mood + 0.2); react('pet'); flashThought('feeling better!') } break
      }
      return withMood(p)
    })
  }

  const level = STAGE_ORDER.indexOf(pet.stage) + 1
  const cls = [
    'pet-octo',
    pet.isSleeping ? 'is-sleep' : '',
    pet.isSick ? 'is-sick' : '',
    reaction ? `react-${reaction}` : '',
    pet.mood > 0.8 ? 'is-happy' : '',
  ].join(' ')

  return createPortal(
    <div className="lab-layer">
      <button className="lab-dismiss" onClick={onClose} aria-label="Close lab">Close ✕</button>

      <div
        ref={cardRef}
        className="pet-device"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="pet-screen">
          {thought && <div className="pet-thought">{thought}</div>}
          {pet.isSleeping && <div className="pet-zzz">z z z</div>}
          <div className={cls}>
            <Octo />
          </div>
          <div className="pet-shadow" />
        </div>

        <div className="pet-meta">
          <span className="pet-name">{pet.name}</span>
          <span className="pet-lvl">Lv {level} · {pet.stage}</span>
        </div>

        <div className="pet-stats">
          {STATS.map(s => {
            const v = s.invert ? 1 - (pet[s.key] as number) : (pet[s.key] as number)
            return (
              <div key={s.key} className="pet-stat" title={s.label}>
                <span className="pet-stat-label">{s.label}</span>
                <span className="pet-stat-bar"><i style={{ width: `${Math.round(v * 100)}%` }} /></span>
              </div>
            )
          })}
        </div>

        <div className="pet-actions">
          <button className="pet-btn" onClick={() => act('feed')}>Feed</button>
          <button className="pet-btn" onClick={() => act('play')}>Play</button>
          <button className="pet-btn" onClick={() => act('pet')}>Pet</button>
          {pet.isSick
            ? <button className="pet-btn pet-btn-alert" onClick={() => act('medicine')}>Cure</button>
            : <button className="pet-btn" onClick={() => act('sleep')}>{pet.isSleeping ? 'Wake' : 'Sleep'}</button>}
        </div>
      </div>
    </div>,
    document.body,
  )
}
