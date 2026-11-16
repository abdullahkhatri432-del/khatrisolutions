import { useEffect, useRef, useState } from 'react'

/**
 * Animated counter that counts up when it scrolls into view.
 * Formats numbers with Indian locale (en-IN) for ₹ formatting.
 *
 * Usage:
 *   <AnimatedCounter value={6} suffix="+" duration={1.2} />
 */
export default function AnimatedCounter({ value, suffix = '', prefix = '', duration = 1.4, decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return

    const start = 0
    const end = typeof value === 'number' ? value : parseFloat(value) || 0
    const startTime = performance.now()

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const eased = easeOutQuart(progress)
      const current = start + (end - start) * eased

      setDisplay(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplay(end)
      }
    }

    requestAnimationFrame(animate)
  }, [started, value, duration])

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Math.floor(display))

  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  )
}