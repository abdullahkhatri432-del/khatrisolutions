import { copyFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

/**
 * Render serves a file when one exists at the request path and only falls back
 * to redirect/rewrite rules otherwise. Static hosting has no SPA fallback by
 * default, so deep links like /pricing would 404 on a refresh.
 *
 * Writing a copy of the app shell to <route>/index.html makes each real route
 * resolve to the shell, so React Router can take over on a cold load. Unknown
 * paths still 404, which is the correct signal for crawlers.
 *
 * This runs from the Vite build (see vite.config.js), not a postbuild script,
 * so it also applies when a host runs `vite build` directly.
 *
 * Keep this list in sync with src/App.jsx and public/sitemap.xml.
 */
export const routes = [
  'services',
  'work',
  'work/atelier-nine',
  'work/wellness-physiotherapy',
  'work/saffron-table-restaurant',
  'work/northline-store',
  'work/clinic-ops-dashboard',
  'pricing',
  'about',
  'reviews',
  'contact',
  'privacy',
]

export async function writeRouteShells(dist = path.resolve('dist')) {
  const entries = await readdir(dist)
  if (!entries.includes('index.html')) {
    throw new Error('dist/index.html is missing — run the build first.')
  }

  const shell = path.join(dist, 'index.html')

  for (const route of routes) {
    const dir = path.join(dist, ...route.split('/'))
    await mkdir(dir, { recursive: true })
    await copyFile(shell, path.join(dir, 'index.html'))
  }

  // Unknown paths get this file, so a mistyped URL shows the branded
  // "page not found" screen instead of a blank body. Render still answers 404.
  await copyFile(shell, path.join(dist, '404.html'))

  console.log(`Route shells written: ${routes.length} (+404)`)
}
