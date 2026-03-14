import { useState, useRef, useEffect } from 'react'
import { PLAYLIST } from '../constants/music'

export function IpodPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const titleWrapRef = useRef<HTMLDivElement>(null)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [remaining, setRemaining] = useState('-0:00')

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25
    }
  }, [])

  const shouldPlayRef = useRef(false)

  const loadTrack = (index: number) => {
    const newIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length
    setCurrentTrack(newIndex)
    setProgress(0)
    setCurrentTime('0:00')
    setRemaining('-0:00')
    return newIndex
  }

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

  // Measure title overflow and set marquee distance
  useEffect(() => {
    const text = titleRef.current
    const wrap = titleWrapRef.current
    if (!text || !wrap) return
    const overflow = text.scrollWidth - wrap.clientWidth
    if (overflow > 0) {
      text.style.setProperty('--marquee-offset', `-${overflow}px`)
      text.style.animationPlayState = 'running'
    } else {
      text.style.animation = 'none'
    }
  }, [currentTrack])

  // Progress tracking
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => {
      if (!audio.duration) return
      setProgress((audio.currentTime / audio.duration) * 100)
      setCurrentTime(formatTime(audio.currentTime))
      setRemaining(`-${formatTime(audio.duration - audio.currentTime)}`)
    }
    audio.addEventListener('timeupdate', onTime)
    return () => audio.removeEventListener('timeupdate', onTime)
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

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

  const track = PLAYLIST[currentTrack]

  return (
    <div className="ipod-nano">
      <div className="ipod-body">
        {/* Screen — classic iPod style */}
        <div className={`ipod-screen ${isPlaying ? 'active' : ''}`}>
          <div className="ipod-screen-header">
            <span>Now Playing</span>
            {isPlaying && (
              <span className="ipod-eq">
                <span className="ipod-eq-bar" />
                <span className="ipod-eq-bar" />
                <span className="ipod-eq-bar" />
              </span>
            )}
          </div>
          <div className="ipod-screen-inner">
            <div className="ipod-album-row">
              <div className="ipod-album-art">
                {track?.cover ? (
                  <img src={track.cover} alt="" className="ipod-album-img" />
                ) : (
                  <span className="ipod-album-initial">{(track?.title || '?')[0]}</span>
                )}
              </div>
              <div className="ipod-track-info">
                <div className="ipod-track-title" ref={titleWrapRef}>
                  <span className="ipod-track-title-text" ref={titleRef} key={currentTrack}>{track?.title || 'No Track'}</span>
                </div>
                {track?.artist && <div className="ipod-track-artist">{track.artist}</div>}
              </div>
            </div>
            <div className="ipod-progress">
              <div className="ipod-progress-bar">
                <div className="ipod-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="ipod-time-row">
                <span className="ipod-time">{currentTime}</span>
                <span className="ipod-time">{remaining}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Click Wheel */}
        <div className="click-wheel">
          <div className="wheel-ring">
            <button className="wheel-btn menu">MENU</button>
            <button className="wheel-btn prev" aria-label="Previous track" onClick={prevTrack}>
              <svg width="14" height="10" viewBox="0 0 16 12" fill="currentColor">
                <path d="M0 0H3V12H0V0ZM3 6L16 12V0L3 6Z"/>
              </svg>
            </button>
            <button className="wheel-btn next" aria-label="Next track" onClick={nextTrack}>
              <svg width="14" height="10" viewBox="0 0 16 12" fill="currentColor">
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
          <button className="wheel-center" onClick={togglePlay} />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={track?.src}
        onEnded={handleEnded}
      />
    </div>
  )
}
