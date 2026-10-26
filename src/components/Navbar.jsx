import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'
import { nav } from '../config/site'
import { useScrolled } from '../hooks/useScrolled'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="container nav">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav__link" end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <Button to="/contact" variant="primary" size="sm" iconRight={ArrowRight} className="nav__cta">
            Discuss a project
          </Button>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="nav__panel" id="mobile-nav">
          <ul>
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}>
                  {item.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </NavLink>
              </li>
            ))}
          </ul>
          <Button to="/contact" variant="primary" wide iconRight={ArrowRight}>
            Discuss a project
          </Button>
        </div>
      ) : null}
    </header>
  )
}
