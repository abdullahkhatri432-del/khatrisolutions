import { rm } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'
import { writeRouteShells } from './route-shells.mjs'

/**
 * Second build pass: bundle src/entry-server.jsx for Node, render every route
 * with StaticRouter, and inject the markup into the shells the client build
 * just wrote. Crawlers and answer engines then get real content in the HTML
 * instead of an empty #root, and the browser hydrates the same markup.
 */
const ssrDir = path.resolve('.ssr-build')

try {
  await build({
    logLevel: 'warn',
    build: {
      ssr: path.resolve('src/entry-server.jsx'),
      outDir: ssrDir,
      emptyOutDir: true,
      minify: false,
      sourcemap: false,
      ssrEmitAssets: false,
    },
  })

  const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
  await writeRouteShells(path.resolve('dist'), render)
} finally {
  await rm(ssrDir, { recursive: true, force: true })
}
