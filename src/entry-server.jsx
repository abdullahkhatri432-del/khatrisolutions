import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { AppRoutes } from './App'

/**
 * Renders a route to HTML at build time. scripts/route-shells.mjs injects the
 * result into each route's shell so crawlers and answer engines get real page
 * content instead of an empty #root, and the client hydrates it on load.
 */
export function render(path) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={path}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  )
}
