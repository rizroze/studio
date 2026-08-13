import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DISCIPLINES } from './src/v2/disciplines'

const SITE = 'https://rizzy.today'

interface RoutePage {
  path: string          // no leading slash: 'works/design'
  title: string         // prefixed to the site title
  description: string
}

// Every URL the site answers on besides '/'. The discipline pages come from
// DISCIPLINES itself so a new wall can't ship without its own meta.
function routePages(): RoutePage[] {
  return [
    ...DISCIPLINES.map(d => ({
      path: `works/${d.id}`,
      // derived from what the page already prints in its own header, so there
      // is no second copy of this text to keep in sync
      title: d.label,
      description: d.description ?? `${d.label} work by Riz. ${sentence(d.blurb)}.`,
    })),
    {
      path: 'lab',
      title: 'Lab',
      description: 'Toys that float over the site: an iPod, a liquid glass panel, and a pet octopus.',
    },
  ]
}

// 'Launch films · Logo animation · Titles' → 'Launch films, logo animation, titles'.
// The blurb is a row of capitalized column headings on the page; in a sentence
// those capitals read as a list of proper nouns.
const sentence = (blurb: string) =>
  blurb
    .split(' · ')
    .map((part, i) => (i === 0 ? part : part.charAt(0).toLowerCase() + part.slice(1)))
    .join(', ')

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

// Rewrite one meta tag's content. Throws rather than no-ops when the tag isn't
// found: renaming a tag in index.html would otherwise ship every route with the
// homepage's preview and nothing would say so.
function setMeta(html: string, kind: 'name' | 'property', key: string, value: string): string {
  const re = new RegExp(`(<meta ${kind}="${key}" content=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`route-meta: no <meta ${kind}="${key}"> in index.html`)
  return html.replace(re, `$1${esc(value)}$2`)
}

function setTitle(html: string, value: string): string {
  if (!/<title>[^<]*<\/title>/.test(html)) throw new Error('route-meta: no <title> in index.html')
  return html.replace(/<title>[^<]*<\/title>/, `<title>${esc(value)}</title>`)
}

function setCanonical(html: string, url: string): string {
  return html.replace(/<title>/, `<link rel="canonical" href="${url}">\n    <title>`)
}

// The app is a client-rendered SPA served from one index.html, so every URL
// used to carry the homepage's title, description and share card — /works/motion
// and /works/product previewed identically in a chat. This writes a real HTML
// file per route at build time with its own meta, which Vercel serves ahead of
// the catch-all rewrite (rewrites run after the filesystem check). The app
// itself is untouched: same bundle, same mount, it just boots from a file whose
// head already describes the page it is about to render.
function routeMeta(): Plugin {
  let root = process.cwd()
  let outDir = 'dist'
  return {
    name: 'route-meta',
    apply: 'build',
    configResolved(cfg) {
      root = cfg.root
      outDir = cfg.build.outDir
    },
    closeBundle() {
      const dir = resolve(root, outDir)
      const index = readFileSync(resolve(dir, 'index.html'), 'utf8')
      // whatever the homepage currently calls itself — this follows a retitle
      // instead of pinning a second copy of the site name here
      const siteTitle = index.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'Rizzy Today'

      for (const page of routePages()) {
        const url = `${SITE}/${page.path}`
        let html = setTitle(index, `${page.title} · ${siteTitle}`)
        html = setMeta(html, 'name', 'description', page.description)
        html = setMeta(html, 'property', 'og:title', `${page.title} · ${siteTitle}`)
        html = setMeta(html, 'property', 'og:description', page.description)
        html = setMeta(html, 'property', 'og:url', url)
        html = setMeta(html, 'name', 'twitter:title', `${page.title} · ${siteTitle}`)
        html = setMeta(html, 'name', 'twitter:description', page.description)
        html = setMeta(html, 'name', 'twitter:url', url)
        html = setCanonical(html, url)

        const target = resolve(dir, page.path)
        mkdirSync(target, { recursive: true })
        writeFileSync(resolve(target, 'index.html'), html)
      }

      // the homepage points at itself, so the four legacy /<discipline> aliases
      // and any ?ref= link don't read as separate pages
      writeFileSync(resolve(dir, 'index.html'), setCanonical(index, `${SITE}/`))
      console.log(`route-meta: ${routePages().length} static route pages written`)
    },
  }
}

export default defineConfig({
  plugins: [react(), routeMeta()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom']
        }
      }
    }
  }
})
