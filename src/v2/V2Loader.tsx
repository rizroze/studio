import { useState, useEffect } from 'react'

// minimal braille spinner — Claude-loader vibe
const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export function V2Loader() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % FRAMES.length), 90)
    return () => clearInterval(id)
  }, [])
  return <span className="v2-loader" aria-hidden="true">{FRAMES[i]}</span>
}
