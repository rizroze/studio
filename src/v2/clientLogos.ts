// Client logomarks, keyed by the project title used across CASE_STUDIES.
// Assets live in /public/content/logos and vary (dark marks, white marks,
// colored marks) — `invert` flips white-on-transparent logos to dark so they
// read on the light editorial background. Grayscale/opacity is applied in CSS.

export interface ClientLogo {
  src: string
  alt: string
  invert?: boolean // white source → invert to dark silhouette
  wordmark?: boolean // full-height wordmark; icon marks render smaller to match its cap-height
  smaller?: boolean // nudge this mark down 2px (heavier marks that read too big)
}

// project title → mark (shown beside case-study section headers)
export const PROJECT_LOGOS: Record<string, ClientLogo> = {
  Radiants: { src: '/content/logos/rad-BLACK.webp', alt: 'Radiants' },
  WAYY: { src: '/content/logos/wayy-logomark-black.webp', alt: 'WAYY' },
  Hydex: { src: '/content/logos/hydex%20logo.webp', alt: 'Hydex' },
  'Hydex Router': { src: '/content/logos/hydex%20logo.webp', alt: 'Hydex Router' },
  Fullport: { src: '/content/logos/fullport-logo.svg', alt: 'Fullport' },
  "What's for Dinner": { src: '/content/logos/wfd-icon.svg', alt: "What's for Dinner", invert: true },
}

export function projectLogo(project: string): ClientLogo | undefined {
  return PROJECT_LOGOS[project]
}

// Homepage "worked with" strip — external clients only (not Riz's own products).
export const HOMEPAGE_CLIENTS: ClientLogo[] = [
  { src: '/content/logos/solana-mobile.svg', alt: 'Solana Mobile', invert: true, wordmark: true },
  { src: '/content/logos/hydex%20logo.webp', alt: 'Hydex', smaller: true },
  { src: '/content/logos/rad-BLACK.webp', alt: 'Radiants' },
]
