#!/usr/bin/env node
// Content drift guard — catches the class of bug we keep fixing by hand:
// gallery entries pointing at deleted files, images missing precomputed dims
// (layout reflow), missing .med/.thumb variants (blurry or 404 grid tiles),
// and stale INDEX_LABELS entries.
//
// Errors (missing source files) fail the build. Warnings just print.

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public')
const read = (p) => readFileSync(join(root, p), 'utf8')

// all '/content/....ext' string literals in a source file
const contentPaths = (src) =>
  [...src.matchAll(/'(\/content\/[^']+?\.(webp|png|jpe?g|gif|svg|mp4))'/g)].map((m) => m[1])

const projects = read('src/constants/projects.ts')
const disciplines = read('src/v2/disciplines.ts')
const labelsSrc = read('src/v2/indexLabels.ts')
const dimsSrc = read('src/v2/imageDims.ts')

const referenced = [...new Set([...contentPaths(projects), ...contentPaths(disciplines)])]
const dimKeys = new Set([...dimsSrc.matchAll(/"(\/content\/[^"]+)"/g)].map((m) => m[1]))
const labelKeys = contentPaths(labelsSrc)

const decode = (p) => decodeURIComponent(p)
const errors = []
const warnings = []

for (const ref of referenced) {
  const file = join(pub, decode(ref))
  if (!existsSync(file)) {
    errors.push(`missing file: ${ref}`)
    continue
  }
  if (/\.webp$/.test(ref)) {
    const med = file.replace(/\.webp$/, '.med.jpg')
    const thumb = file.replace(/\.webp$/, '.thumb.jpg')
    if (!existsSync(med)) warnings.push(`no .med.jpg for ${ref}`)
    if (!existsSync(thumb)) warnings.push(`no .thumb.jpg for ${ref}`)
    if (!dimKeys.has(ref)) warnings.push(`no IMAGE_DIMS entry for ${ref} (grid will reflow)`)
  }
}

// labels pointing at files that no longer exist (stale after deletions)
for (const key of labelKeys) {
  if (!existsSync(join(pub, decode(key)))) warnings.push(`stale INDEX_LABELS entry: ${key}`)
}

// index-view galleries whose images have no human label (falls back to filename)
const labelSet = new Set(labelKeys)
const indexSections = ['radiants/community', 'monolith/', 'seeker/']
for (const ref of referenced) {
  if (/\.webp$/.test(ref) && indexSections.some((s) => ref.includes(s)) && !labelSet.has(ref)) {
    warnings.push(`no INDEX_LABELS entry for ${ref} (label falls back to filename)`)
  }
}

if (warnings.length) {
  console.warn(`\ncontent-check: ${warnings.length} warning(s)`)
  warnings.forEach((w) => console.warn(`  ⚠ ${w}`))
}
if (errors.length) {
  console.error(`\ncontent-check: ${errors.length} error(s)`)
  errors.forEach((e) => console.error(`  ✕ ${e}`))
  process.exit(1)
}
console.log(`content-check: ${referenced.length} referenced files OK${warnings.length ? ` (${warnings.length} warnings)` : ''}`)
