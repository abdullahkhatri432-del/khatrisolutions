export default function SectionHeading({ eyebrow, title, intro, align = 'left', className = '', children }) {
  return (
    <div
      className={`section-head ${align === 'center' ? 'section-head--center' : ''} ${className}`.trim()}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {intro ? <p className="lede">{intro}</p> : null}
      {children}
    </div>
  )
}
