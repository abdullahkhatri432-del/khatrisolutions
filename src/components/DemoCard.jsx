import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, MonitorPlay } from 'lucide-react'
import Button from './Button'
import ProjectPreview from './ProjectPreview'
import { projects } from '../config/site'

/**
 * One live-demo card, shared by the demos hub and the home page so the two
 * never drift apart. `headingLevel` keeps the document outline valid in both
 * places (h2 on /demos, h3 inside a home-page section).
 */
export default function DemoCard({ demo, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`
  const project =
    projects.find((item) => item.slug === demo.projectSlug) || {
      title: demo.name,
      category: demo.service,
      accent: demo.accent,
      preview: {},
    }

  return (
    <article className="demo-card">
      <Link to={`/demos/${demo.slug}`} className="demo-card__preview" tabIndex={-1} aria-hidden="true">
        <ProjectPreview project={project} badge="Live demo" />
        <span className="demo-card__play">
          <MonitorPlay size={18} aria-hidden="true" />
        </span>
      </Link>

      <div className="demo-card__body">
        <p className="demo-card__service">{demo.service}</p>
        <Heading className="demo-card__title">
          <Link to={`/demos/${demo.slug}`}>{demo.name}</Link>
        </Heading>
        <p className="demo-card__kind">{demo.kind}</p>
        <p className="demo-card__summary">{demo.summary}</p>
        <div className="demo-card__actions">
          <Button to={`/demos/${demo.slug}`} size="sm" iconRight={ArrowUpRight}>
            Open live demo
          </Button>
          <Link to={`/work/${demo.projectSlug}`} className="link-arrow">
            Case study
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
