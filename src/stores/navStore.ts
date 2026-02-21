import { useSyncExternalStore } from 'react'

interface NavState {
  mobileOpen: boolean
  scrolledPastHero: boolean
  pillExpanded: boolean
}

let state: NavState = {
  mobileOpen: false,
  scrolledPastHero: false,
  pillExpanded: false
}

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach(fn => fn())
}

export const navStore = {
  getSnapshot: () => state,
  subscribe: (fn: () => void) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  toggle: () => {
    state = { ...state, mobileOpen: !state.mobileOpen }
    emit()
  },
  close: () => {
    state = { ...state, mobileOpen: false }
    emit()
  },
  setScrolledPastHero: (scrolled: boolean) => {
    if (state.scrolledPastHero !== scrolled) {
      state = { ...state, scrolledPastHero: scrolled, pillExpanded: scrolled ? state.pillExpanded : false }
      emit()
    }
  },
  togglePill: () => {
    state = { ...state, pillExpanded: !state.pillExpanded }
    emit()
  },
  closePill: () => {
    if (state.pillExpanded) {
      state = { ...state, pillExpanded: false }
      emit()
    }
  }
}

export function useMobileNav() {
  const s = useSyncExternalStore(navStore.subscribe, navStore.getSnapshot)
  return s.mobileOpen
}

export function useNavScroll() {
  const s = useSyncExternalStore(navStore.subscribe, navStore.getSnapshot)
  return { scrolledPastHero: s.scrolledPastHero, pillExpanded: s.pillExpanded }
}
