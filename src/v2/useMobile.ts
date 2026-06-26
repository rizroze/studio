import { useSyncExternalStore } from 'react'

// matches the single styles-v2 media query (≤820px) — used to swap touch/desktop interaction models
const QUERY = '(max-width: 820px)'

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
