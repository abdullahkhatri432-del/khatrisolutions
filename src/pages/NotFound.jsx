import { Link, useLocation } from 'react-router-dom'
import { Home, Search, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'
import { useSeo } from '../hooks/useSeo'

export default function NotFound() {
  const { pathname } = useLocation()

  useSeo({
    title: 'Page not found',
    description: 'The page you requested does not exist. Browse the Khatri Solutions portfolio, services and pricing instead.',
    path: pathname,
    noindex: true,
  })

  return (
    <section className="section">
      <div className="container notfound">
        <p className="notfound__code" aria-hidden="true">
          404
        </p>
        <h1>That page is not here</h1>
        <p>
          The link may be outdated, or the page may have moved. The portfolio and pricing pages are the best places to continue.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Button to="/" variant="primary" icon={Home}>
            Back home
          </Button>
          <Button to="/work" variant="outline" icon={Search}>
            Browse the work
          </Button>
        </div>
        <p className="tiny muted">
          <ShieldCheck size={13} aria-hidden="true" style={{ display: 'inline', marginRight: '0.3rem' }} />
          If you followed a link from this site, <Link to="/contact" style={{ textDecoration: 'underline' }}>tell us</Link> and it
          will be fixed.
        </p>
      </div>
    </section>
  )
}
