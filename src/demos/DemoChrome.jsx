import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

/**
 * The strip above every demo. It makes clear that this is a demonstration
 * built by Khatri Solutions, not a client's live business site, and gives a
 * one-click route back to the agency site and to the contact form.
 */
export default function DemoChrome({ demo, children }) {
  return (
    <div className={`demo-site demo--${demo.theme}`}>
      <header className="demo-bar">
        <div className="demo-bar__inner">
          <Link to="/" className="demo-bar__brand">
            <span className="demo-bar__mark" aria-hidden="true">
              K
            </span>
            <span className="demo-bar__brandtext">
              <strong>Khatri Solutions</strong>
              <span>Live demo</span>
            </span>
          </Link>

          <p className="demo-bar__meta">
            <span className="demo-bar__dot" aria-hidden="true" />
            {demo.name} · {demo.kind}
          </p>

          <div className="demo-bar__actions">
            <Link to="/demos" className="demo-bar__link">
              <ArrowLeft size={14} aria-hidden="true" />
              All demos
            </Link>
            <Link to="/contact" className="demo-bar__cta">
              Build one like this
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main className="demo-body">{children}</main>

      <footer className="demo-foot">
        <p>
          <strong>Demo notice.</strong> {demo.name} is a fictional business. This site was built by Khatri Solutions to
          demonstrate {demo.service.toLowerCase()}; nothing here is a real client, price or booking.
        </p>
        <Link to="/contact" className="demo-foot__cta">
          Get a quote for your own site
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </footer>
    </div>
  )
}
