import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeRouteShells } from './scripts/route-shells.mjs'

/**
 * Emits an app-shell copy for every real route (see scripts/route-shells.mjs).
 * Doing this inside the Vite build keeps deep links working on static hosts
 * such as Vercel, even when the build command is a bare `vite build`.
 */
function routeShells() {
  let enabled = true

  return {
    name: 'khatri-route-shells',
    apply: 'build',
    configResolved(config) {
      // The SSR build in scripts/prerender.mjs reuses this config; it must not
      // write shells, because the prerender pass does that with real markup.
      enabled = !config.build.ssr
    },
    async closeBundle() {
      if (enabled) await writeRouteShells()
    },
  }
}

export default defineConfig({
  plugins: [react(), routeShells()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
