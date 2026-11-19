import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'
import './styles/demos.css'

const container = document.getElementById('root')

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Route shells are prerendered at build time (scripts/prerender.mjs), so the
// container already holds matching markup on first load. Hydrate it instead of
// throwing it away; fall back to a client render when it is empty.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
