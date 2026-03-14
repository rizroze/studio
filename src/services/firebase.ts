import { useState, useEffect } from 'react'
import type { Firestore } from 'firebase/firestore'

const env = (key: string) => import.meta.env[key] || ''

const firebaseConfig = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
}

let cachedDb: Firestore | null = null

async function initFirebase(): Promise<Firestore> {
  if (cachedDb) return cachedDb
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Firebase config missing — check VITE_FIREBASE_* env vars')
  }
  const { initializeApp } = await import('firebase/app')
  const { getFirestore } = await import('firebase/firestore')
  const app = initializeApp(firebaseConfig)
  cachedDb = getFirestore(app)
  return cachedDb
}

export function useFirebase() {
  const [db, setDb] = useState<Firestore | null>(cachedDb)
  const [isReady, setIsReady] = useState(!!cachedDb)

  useEffect(() => {
    if (cachedDb) { setDb(cachedDb); setIsReady(true); return }

    let cancelled = false

    const load = () => {
      if (cancelled) return
      initFirebase().then(firestore => {
        if (!cancelled) { setDb(firestore); setIsReady(true) }
      }).catch((e) => { console.error('Firebase init failed:', e) })
    }

    // Lazy load — on first interaction or after 8s fallback
    const triggers = ['pointerdown', 'scroll', 'keydown'] as const
    const onInteraction = () => {
      triggers.forEach(e => window.removeEventListener(e, onInteraction))
      clearTimeout(fallback)
      load()
    }

    triggers.forEach(e => window.addEventListener(e, onInteraction, { once: true, passive: true }))
    const fallback = setTimeout(load, 8000)

    return () => {
      cancelled = true
      clearTimeout(fallback)
      triggers.forEach(e => window.removeEventListener(e, onInteraction))
    }
  }, [])

  return { db, isReady }
}
