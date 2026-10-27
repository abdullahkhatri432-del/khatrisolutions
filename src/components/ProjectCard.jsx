import { Link } from 'react-router-dom'
import { ExternalLink, Check } from 'lucide-react'
import ProjectPreview from './ProjectPreview'
const TYPE_CLASS = {
  'Client project': 'pill--success',
  'Demo project': 'pill--accent',
  'Concept project': 'pill',
}

export default function ProjectCard({ project, row = false, headingLevel: Heading = 'h3' }) {
  return (
    <article className={`project-card ${row ? 'project-card--row' : ''}`.trim()}>
      <div className="project-card__media">
        <ProjectPreview project={project} />
      </div>

      <div className="project-card__body">
        <div className="project-card__meta">
          <span className={`pill ${TYPE_CLASS[project.type] || ''}`.trim()}>
            {project.type === 'Client project' ? null : <span className="dot" />}
            {project.type}
          </span>
          <span>{project.category}</span>
        </div>

        <div className="project-card__title">
          <Heading>
            <Link to={`/work/${project.slug}`}>{project.title}</Link>
          </Heading>
          <span className="project-card__year">{project.year}</span>
        </div>

        <p className="project-card__summary">{project.summary}</p>

        <ul className="tick-list">
          {project.features.slice(0, 3).map((feature) => (
            <li key={feature}>
              <Check size={14} strokeWidth={2.6} aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="project-card__foot">
          <span className="link-arrow">
            Case study
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="project-card__links">
            {project.demoUrl ? (
              project.demoUrl.startsWith('http') ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow project-card__demo"
                >
                  Live demo
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ) : (
                <Link to={project.demoUrl} className="link-arrow project-card__demo">
                  Open live demo
                  <ExternalLink size={13} aria-hidden="true" />
                </Link>
              )
            ) : (
              <span className="tiny muted">Live demo not published yet</span>
            )}
          </span>
        </div>
      </div>
    </article>
  )
}
