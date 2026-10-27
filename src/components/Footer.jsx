import { Link } from 'react-router-dom'
import { Mail, MessageCircle } from 'lucide-react'
import Logo from './Logo'
import { site } from '../config/site'
import { socialLinks, whatsappLink, DEFAULT_MESSAGE } from '../lib/contact'

const pages = [
  { label: 'Services', to: '/services' },
  { label: 'Live demos', to: '/demos' },
  { label: 'Work', to: '/work' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  const whatsapp = whatsappLink(DEFAULT_MESSAGE)

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/">
              <Logo showTag={false} />
            </Link>
            <p>{site.positioning}</p>
            <p className="tiny" style={{ marginTop: '0.9rem', opacity: 0.7 }}>
              {site.disclosure}
            </p>
          </div>

          <div>
            <h2 className="footer__heading">Pages</h2>
            <div className="footer__links">
              {pages.map((page) => (
                <Link key={page.to} to={page.to}>
                  {page.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="footer__heading">Contact</h2>
            <div className="footer__links">
              {site.contact.email ? (
                <a href={`mailto:${site.contact.email}`}>
                  <Mail size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '0.4rem' }} />
                  {site.contact.email}
                </a>
              ) : null}
              {whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              ) : (
                <Link to="/contact">
                  <MessageCircle size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '0.4rem' }} />
                  Send an enquiry
                </Link>
              )}
              {socialLinks.map((link) => (
                <a key={link.key} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {site.name}. Built and maintained independently.
          </span>
          <span style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/privacy">Privacy notice</Link>
            <Link to="/work">Portfolio</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
