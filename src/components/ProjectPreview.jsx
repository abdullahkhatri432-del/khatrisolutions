/**
 * A stylised, clearly-labelled design preview.
 * This is deliberately not a screenshot — no fake browser screenshots of
 * websites that do not exist.
 */
export default function ProjectPreview({ project, large = false, className = '', badge = 'Design preview' }) {
  const preview = project.preview || {}

  return (
    <div
      className={`preview ${large ? 'preview--large' : ''} ${className}`.trim()}
      style={{ '--pa': project.accent || '#7057ff' }}
      role="img"
      aria-label={`Design preview for ${project.title}`}
    >
      <div aria-hidden="true">
        <div className="preview__chrome">
          <span className="preview__dot" />
          <span className="preview__dot" />
          <span className="preview__dot" />
          <span className="preview__url">khatrisolutions / {project.slug}</span>
        </div>
        <div className="preview__body">
          <span className="preview__eyebrow">{project.category}</span>
          <span className="preview__headline">{preview.headline || project.title}</span>
          <span className="preview__sub">{preview.sub}</span>
          <span className="preview__cta">{preview.cta || 'Explore'}</span>
          <div className="preview__cards">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      <span className="preview__badge">{badge}</span>
    </div>
  )
}
