import { useState, useRef, useEffect } from 'react'
import { PLAYLIST } from '../constants/music'

export function IpodPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25
    }
  }, [])

  const shouldPlayRef = useRef(false)

  const loadTrack = (index: number) => {
    const newIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length
    setCurrentTrack(newIndex)
    return newIndex
  }

  // Auto-play when track changes and shouldPlayRef is true
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !shouldPlayRef.current) return
    const onCanPlay = () => {
      audio.play().catch(() => setIsPlaying(false))
    }
    audio.addEventListener('canplay', onCanPlay, { once: true })
    audio.load()
    return () => audio.removeEventListener('canplay', onCanPlay)
  }, [currentTrack])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      shouldPlayRef.current = false
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false))
      setIsPlaying(true)
      shouldPlayRef.current = true
    }
  }

  const prevTrack = () => {
    shouldPlayRef.current = isPlaying
    loadTrack(currentTrack - 1)
  }

  const nextTrack = () => {
    shouldPlayRef.current = isPlaying
    loadTrack(currentTrack + 1)
  }

  const handleEnded = () => {
    if (PLAYLIST.length > 1) {
      shouldPlayRef.current = true
      loadTrack(currentTrack + 1)
    } else {
      setIsPlaying(false)
    }
  }

  return (
    <div className="ipod-nano">
      <div className="ipod-body">
        <div className={`ipod-screen ${isPlaying ? 'active' : ''}`}>
          <div className="ipod-now-playing">Now Playing</div>
          <div className="song-title">{PLAYLIST[currentTrack]?.title || 'No Track'}</div>
          <div className="equalizer">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
        <div className="click-wheel">
          <div className="wheel-ring">
            <button className="wheel-btn menu">MENU</button>
            <button className="wheel-btn prev" aria-label="Previous track" onClick={prevTrack}>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <path d="M0 0H3V12H0V0ZM3 6L16 12V0L3 6Z"/>
              </svg>
            </button>
            <button className="wheel-btn next" aria-label="Next track" onClick={nextTrack}>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                <path d="M16 0H13V12H16V0ZM13 6L0 12V0L13 6Z"/>
              </svg>
            </button>
            <button className="wheel-btn playpause" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay}>
              {isPlaying ? (
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <rect x="0" y="0" width="3" height="12"/>
                  <rect x="7" y="0" width="3" height="12"/>
                </svg>
              ) : (
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <path d="M0 0V12L10 6L0 0Z"/>
                </svg>
              )}
            </button>
          </div>
          <button className="wheel-center" onClick={togglePlay}></button>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={PLAYLIST[currentTrack]?.src}
        onEnded={handleEnded}
      />
    </div>
  )
}
