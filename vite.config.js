import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeRouteShells } from './scripts/route-shells.mjs'

/**
 * Emits an app-shell copy for every real route (see scripts/route-shells.mjs).
 * Doing this inside the Vite build keeps deep links working on static hosts
 * such as Render, even when the build command is a bare `vite build`.
 */
function routeShells() {
  return {
    name: 'khatri-route-shells',
    apply: 'build',
    async closeBundle() {
      await writeRouteShells()
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
