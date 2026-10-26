import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ChevronRight, ExternalLink, Github, Info, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import ProjectPreview from '../components/ProjectPreview'
import { useSeo } from '../hooks/useSeo'
import { projects } from '../config/site'

export default function CaseStudy() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  useSeo({
    title: project ? `${project.title} case study` : 'Project not found',
    path: `/work/${slug || ''}`,
    description: project?.summary,
    noindex: !project,
  })

  if (!project) {
    return (
      <section className="section">
        <div className="container notfound">
          <p className="notfound__code">404</p>
          <h1>This project does not exist</h1>
          <p>The link may be outdated. Browse the portfolio to see the work that is published.</p>
          <Button to="/work" variant="primary" icon={ArrowLeft}>
            Back to portfolio
          </Button>
        </div>
      </section>
    )
  }

  const study = project.caseStudy

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link to="/work">Work</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span aria-current="page">{project.title}</span>
          </nav>

          <div style={{ marginTop: '1rem' }}>
            <span className="pill pill--accent">{project.type}</span>
          </div>

          <h1 style={{ marginTop: '0.85rem' }}>
            {project.title}
          </h1>
          <p className="lede">{project.summary}</p>

          <div className="btn-row" style={{ marginTop: '1.6rem' }}>
            {project.demoUrl ? (
              <Button href={project.demoUrl} variant="primary" iconRight={ExternalLink}>
                Open live demo
              </Button>
            ) : (
              <span className="pill">Live demo not published yet</span>
            )}
            {project.repoUrl ? (
              <Button href={project.repoUrl} variant="outline" icon={Github}>
                Source on GitHub
              </Button>
            ) : null}
            <Button to="/contact" variant="outline">
              Discuss a similar project
            </Button>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container case">
          <div className="case__body">
            <div>
              <ProjectPreview project={project} large />
              <p className="tiny muted" style={{ marginTop: '0.6rem' }}>
                <Info size={13} aria-hidden="true" style={{ display: 'inline', marginRight: '0.35rem' }} />
                Design preview generated from the project’s layout — not a screenshot of a deployed site.
              </p>
            </div>

            <div className="case__section">
              <h2>Overview</h2>
              <p>{study.overview}</p>
            </div>

            <div className="case__section">
              <h2>The business problem</h2>
              <p>{study.problem}</p>
            </div>

            <div className="case__section">
              <h2>What we built</h2>
              <p style={{ marginBottom: '1rem' }}>{study.solution}</p>
              <ul className="tick-list">
                {study.highlights.map((item) => (
                  <li key={item}>
                    <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="case__section">
              <h2>Features implemented</h2>
              <ul className="tick-list">
                {project.features.map((feature) => (
                  <li key={feature}>
                    <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="case__section">
              <h2>Project status</h2>
              <div className="notice">
                <ShieldCheck size={15} aria-hidden="true" />
                <span>{study.status}</span>
              </div>
            </div>

            <div className="btn-row">
              <Button to="/work" variant="outline" icon={ArrowLeft}>
                All work
              </Button>
              <Button to="/contact" variant="primary" iconRight={ArrowRight}>
                Start a similar project
              </Button>
            </div>
          </div>

          <aside className="case__aside" aria-label="Project details">
            <div className="meta-card">
              <h2>Project details</h2>
              <dl className="meta-list">
                <div>
                  <dt>Category</dt>
                  <dd>{project.category}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{project.type}</dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd>{project.year}</dd>
                </div>
                <div>
                  <dt>Live demo</dt>
                  <dd>{project.demoUrl ? 'Available' : 'Not published'}</dd>
                </div>
              </dl>
            </div>

            <div className="meta-card">
              <h2>Built with</h2>
              <div className="tag-row">
                {project.stack.map((tech) => (
                  <span className="tag" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="meta-card">
              <h2>Want something like this?</h2>
              <p className="small muted" style={{ marginBottom: '0.9rem' }}>
                Tell us what your business needs. The scope and price will be confirmed in writing before any work begins.
              </p>
              <Button to="/contact" variant="primary" size="sm" wide iconRight={ArrowRight}>
                Request a quote
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <CTASection
        eyebrow="Next step"
        title="A demo is a starting point. Your site should fit your business."
        body="Bring your requirements, content and budget. We will tell you what is realistic and what we would build first."
        primaryLabel="Discuss your project"
        secondaryLabel="See starting prices"
      />
    </>
  )
}
