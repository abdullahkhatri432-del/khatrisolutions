import React from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

/**
 * Wraps a section so it fades up on scroll.
 *
 * Usage:
 *   <RevealSection>
 *     <SectionHeading ... />
 *     <div className="grid grid--3">...</div>
 *   </RevealSection>
 *
 * Props:
 *   - stagger: apply staggered delays to children (default false)
 *   - delay:    initial delay before the reveal starts (default 0)
 *   - tag:      HTML tag to render (default 'section')
 */
export default function RevealSection({ children, stagger = false, delay = 0, tag: Tag = 'section', className = '' }) {
  const ref = useScrollReveal({ delay })

  return (
    <Tag ref={ref} className={`reveal ${stagger ? 'reveal--stagger' : ''} ${className}`.trim()}>
      {stagger && React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { className: `reveal-child ${child.props.className || ''}`.trim() })
          : child
      )}
      {!stagger && children}
    </Tag>
  )
}