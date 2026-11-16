import { useEffect } from 'react'

/**
 * Adds a subtle parallax scroll effect to the hero section.
 * Sets a --scroll-offset CSS variable based on scroll position.
 */
export default function useHeroParallax() {
  useEffect(() => {
    const hero = document.querySelector('.hero')
    if (!hero) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset
        const heroHeight = hero.offsetHeight
        const maxScroll = heroHeight - window.innerHeight

        if (scrollY < maxScroll) {
          const offset = Math.min(scrollY / heroHeight, 1)
          hero.setAttribute('data-scroll-offset', String(offset))
        } else {
          hero.removeAttribute('data-scroll-offset')
        }

        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
}