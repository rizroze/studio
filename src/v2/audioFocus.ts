// One room, one sound. Videos play with sound when you click them open, so
// whatever music is running has to step aside and come back after.
//
// The two music players (rail + Lab iPod) each own a detached `new Audio()`,
// so there's nothing in the DOM to coordinate through and no store to hang
// this off. A window event is the smallest thing that reaches both.

const CLAIM = 'v2-audio-claim'
const RELEASE = 'v2-audio-release'

/** A video with sound is taking over: music should pause. */
export const claimAudio = () => window.dispatchEvent(new Event(CLAIM))

/** The video is done: music that was ducked can resume. */
export const releaseAudio = () => window.dispatchEvent(new Event(RELEASE))

/**
 * Pause while something louder is playing, resume after — but only if we were
 * the one paused by it. Music the user stopped by hand stays stopped.
 */
export function onAudioFocus(
  isPlaying: () => boolean,
  setPlaying: (playing: boolean) => void,
) {
  let ducked = false
  const claim = () => {
    ducked = isPlaying()
    if (ducked) setPlaying(false)
  }
  const release = () => {
    if (!ducked) return
    ducked = false
    setPlaying(true)
  }
  window.addEventListener(CLAIM, claim)
  window.addEventListener(RELEASE, release)
  return () => {
    window.removeEventListener(CLAIM, claim)
    window.removeEventListener(RELEASE, release)
  }
}
