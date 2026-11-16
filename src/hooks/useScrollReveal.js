import { useEffect, useRef } from 'react'

/**
 * Triggers a CSS animation class when an element scrolls into view.
 * Respects prefers-reduced-motion — no animation, just visible.
 *
 * Usage:
 *   const ref = useScrollReveal({ delay: 0.12 })
 *   <section ref={ref} className="reveal">...
 */
export default function useScrollReveal({ delay = 0, threshold = 0.12, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.classList.add('reveal--visible')
      return
    }

    // Add pending class immediately so animation can trigger
    el.classList.add('reveal--pending')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove('reveal--pending')
            el.classList.add('reveal--visible')
            observer.disconnect()
          }
        })
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, threshold, rootMargin])

  return ref
}