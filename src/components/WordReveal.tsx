import { useEffect, useRef, useState } from 'react'

interface WordRevealProps {
  text: string
  className?: string
  tag?: 'h2' | 'h3' | 'h4' | 'span'
  delay?: number  // base delay in ms before first word
}

export function WordReveal({ text, className = '', tag: Tag = 'h3', delay = 0 }: WordRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')

  let wordIndex = 0

  return (
    <Tag ref={ref as any} className={`word-reveal ${revealed ? 'word-revealed' : ''} ${className}`}>
      {words.map((word, i) => {
        if (word === '\\n') {
          return <br key={i} />
        }
        const idx = wordIndex++
        return (
          <span
            key={i}
            className="word-reveal-word"
            style={{ transitionDelay: `${delay + idx * 80}ms` }}
          >
            {word}
          </span>
        )
      })}
    </Tag>
  )
}
