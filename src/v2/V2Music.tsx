import { useState, useRef, useCallback, useEffect } from 'react'
import { PLAYLIST } from '../constants/music'

export function V2Music() {
  const [playing, setPlaying] = useState(false)
  const [track, setTrack] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio()
    const a = audioRef.current
    if (a.src !== window.location.origin + PLAYLIST[track].src) {
      a.src = PLAYLIST[track].src
    }
    if (playing) a.play().catch(() => setPlaying(false))
    else a.pause()
  }, [track, playing])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onEnded = () => setTrack(t => (t + 1) % PLAYLIST.length)
    a.addEventListener('ended', onEnded)
    return () => a.removeEventListener('ended', onEnded)
  }, [])

  const toggle = useCallback(() => setPlaying(p => !p), [])
  const next = useCallback(() => { setTrack(t => (t + 1) % PLAYLIST.length); setPlaying(true) }, [])
  const prev = useCallback(() => { setTrack(t => (t - 1 + PLAYLIST.length) % PLAYLIST.length); setPlaying(true) }, [])

  const t = PLAYLIST[track]

  return (
    <div className={`v2-ipod ${playing ? 'playing' : ''}`}>
      <button className="v2-ipod-cover" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
        <img src={t.cover} alt="" />
        <span className="v2-ipod-dot" />
      </button>
      <div className="v2-ipod-body">
        <div className="v2-ipod-meta">
          <span className="v2-ipod-title">{t.title}</span>
          <span className="v2-ipod-artist">{t.artist}</span>
        </div>
        <div className="v2-ipod-ctrl">
          <button onClick={prev} aria-label="Previous">
            <svg width="11" height="11" viewBox="0 0 12 12"><path d="M3 2v8M10 2L4.5 6 10 10z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
            {playing
              ? <svg width="11" height="11" viewBox="0 0 12 12"><rect x="2.5" y="2" width="2.5" height="8" fill="currentColor"/><rect x="7" y="2" width="2.5" height="8" fill="currentColor"/></svg>
              : <svg width="11" height="11" viewBox="0 0 12 12"><path d="M3 2l7 4-7 4z" fill="currentColor"/></svg>}
          </button>
          <button onClick={next} aria-label="Next">
            <svg width="11" height="11" viewBox="0 0 12 12"><path d="M9 2v8M2 2l5.5 4L2 10z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
