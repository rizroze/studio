import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { V2Root } from './v2/V2Root'

export function App() {
  return (
    <>
      <V2Root />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
