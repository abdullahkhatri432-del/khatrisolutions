import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingContact from './FloatingContact'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const mainRef = useRef(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    const pathChanged = previousPath.current !== pathname
    previousPath.current = pathname

    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView()
        if (pathChanged && typeof target.focus === 'function') {
          target.focus({ preventScroll: true })
        }
        return
      }
    }

    window.scrollTo(0, 0)

    // Only move focus on client-side route changes. On the initial load the
    // browser's natural tab order (skip link, then header) must be preserved.
    if (pathChanged && mainRef.current) {
      mainRef.current.focus({ preventScroll: true })
    }
  }, [pathname, hash])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
        <Outlet />
      </main>
      <Footer />
      {/* Kept off the contact page: the form and contact cards already offer WhatsApp there. */}
      {pathname === '/contact' ? null : <FloatingContact />}
    </>
  )
}
