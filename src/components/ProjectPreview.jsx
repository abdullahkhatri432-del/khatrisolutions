/**
 * A stylised preview — shows video if available, otherwise design preview.
 */
export default function ProjectPreview({ project, large = false, className = '', badge = 'Design preview' }) {
  const preview = project.preview || {}
  const hasVideo = project.videoUrl && project.videoUrl.startsWith('/videos/')

  const artSlug = (project.slug || '').replace(/-/g, '')
  const artClass = `preview--${artSlug}`

  return (
    <div
      className={`preview ${large ? 'preview--large' : ''} ${artClass} ${hasVideo ? 'preview--video-box' : ''} ${className}`.trim()}
      style={{ '--pa': project.accent || '#7057ff' }}
      role="img"
      aria-label={hasVideo ? `Video walkthrough for ${project.title}` : `Design preview for ${project.title}`}
    >
      <div aria-hidden="true">
        {hasVideo ? (
          <video
            className="preview__video"
            src={project.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            width="100%"
            height="100%"
            poster=""
          />
        ) : (
          <>
            <div className="preview__art" />
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
          </>
        )}
      </div>
      <span className="preview__badge">{badge}</span>
    </div>
  )
}
