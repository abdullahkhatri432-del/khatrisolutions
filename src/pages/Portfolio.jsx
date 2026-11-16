import { useMemo, useState } from 'react'
import { ArrowRight, MonitorPlay, ShieldCheck, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import DemoCard from '../components/DemoCard'
import EmptyState from '../components/EmptyState'
import ProjectCard from '../components/ProjectCard'
import RevealSection from '../components/RevealSection'
import SectionHeading from '../components/SectionHeading'
import ServiceIcon from '../components/ServiceIcon'
import { useSeo } from '../hooks/useSeo'
import { pageSeo } from '../config/seo'
import { projectCategories, projects, services } from '../config/site'
import { demoSites as demoSitesImport } from '../demos/demoSites'

const demoFilters = ['All demos', ...new Set(demoSitesImport.map((demo) => demo.service))]

export default function Portfolio() {
  const [projectFilter, setProjectFilter] = useState(projectCategories[0])
  const [demoFilter, setDemoFilter] = useState(demoFilters[0])

  useSeo(pageSeo['/portfolio'])

  const visibleProjects = useMemo(
    () =>
      projectFilter === projectCategories[0]
        ? projects
        : projects.filter((project) => project.category === projectFilter),
    [projectFilter],
  )

  const visibleDemos = useMemo(
    () => (demoFilter === demoFilters[0] ? demoSitesImport : demoSitesImport.filter((demo) => demo.service === demoFilter)),
    [demoFilter],
  )

  // Map project filter category to service slug for demos
  const demosForCategory = (category) => {
    const categoryToServiceSlug = {
      'Business websites': 'website-development',
      'E-commerce': 'ecommerce',
      'Web applications': 'custom-web-applications',
      'AI automation': 'ai-business-automation',
    }
    const serviceSlug = categoryToServiceSlug[category]
    if (!serviceSlug) return []
    return demoSitesImport.filter((demo) => demo.serviceSlug === serviceSlug)
  }

  // Get category context from services config
  const getCategoryContext = (category) => {
    const categoryToServiceSlug = {
      'Business websites': 'website-development',
      'E-commerce': 'ecommerce',
      'Web applications': 'custom-web-applications',
      'AI automation': 'ai-business-automation',
    }
    const serviceSlug = categoryToServiceSlug[category]
    if (!serviceSlug) return null
    return services.find((s) => s.slug === serviceSlug)
  }

  return (
    <>
      <header className="pagehead reveal">
        <div className="container">
          <p className="eyebrow">Portfolio</p>
          <h1>
            Work you can inspect, <span className="accent">not just admire</span>
          </h1>
          <p className="lede">
            Explore project case studies and working demos in one place. Every entry is labelled clearly as client work, a demo
            or a concept, so you know exactly what you are looking at.
          </p>
          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Button to="/contact" iconRight={ArrowRight}>
              Discuss your project
            </Button>
            <Button to="/pricing" variant="outline">
              See pricing
            </Button>
          </div>
        </div>
      </header>

      <RevealSection id="projects" stagger>
        <div className="container">
          <SectionHeading
            eyebrow="Projects & case studies"
            title={
              <>
                Built to be <span className="accent">used</span>, not just shown
              </>
            }
            intro="A small, growing collection of websites, applications and workflow prototypes. Each project states what was actually built."
          />

          <div className="filters" role="group" aria-label="Filter projects by category">
            {projectCategories.map((category) => (
              <button
                key={category}
                type="button"
                className="chip"
                aria-pressed={projectFilter === category}
                onClick={() => setProjectFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Category context from services - shown above filtered projects */}
          {projectFilter !== projectCategories[0] && (() => {
            const ctx = getCategoryContext(projectFilter)
            if (!ctx) return null
            return (
              <div className="category-context" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <div className="category-context__head" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <span className="icon-box" style={{ flexShrink: 0 }}>
                    <ServiceIcon name={ctx.icon} />
                  </span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{ctx.title}</h2>
                    <p className="service-block__summary" style={{ margin: '0.5rem 0 0', color: 'var(--muted-foreground)' }}>{ctx.summary}</p>
                  </div>
                </div>
                <div className="category-context__panel">
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Who it suits</h3>
                  <p className="small muted" style={{ margin: '0 0 1rem' }}>{ctx.suitableFor}</p>
                  <p className="service-block__note" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', margin: 0 }}>
                    <Info size={13} aria-hidden="true" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                    <span>{ctx.notes}</span>
                  </p>
                  {demosForCategory(projectFilter).length > 0 && (
                    <p className="service-demo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.9rem' }}>
                      <MonitorPlay size={14} aria-hidden="true" />
                      <span>Live demo:</span>
                      {demosForCategory(projectFilter).map((demo) => (
                        <Link key={demo.slug} to={`/demos/${demo.slug}`} style={{ marginLeft: '0.5rem' }}>
                          {demo.name}
                        </Link>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            )
          })()}

          <p className="results-line">
            <span aria-live="polite">
              Showing {visibleProjects.length} of {projects.length} projects
            </span>
            <span>Demo and concept projects are not client engagements</span>
          </p>

          {visibleProjects.length > 0 ? (
            <div className="project-list">
              {visibleProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} row headingLevel="h2" />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ShieldCheck}
              title="No projects in this category yet"
              action={
                <Button to="/contact" variant="outline" size="sm" iconRight={ArrowRight}>
                  Ask about this kind of project
                </Button>
              }
            >
              We are adding work as it is completed. If you need a specific type of website, ask — we will tell you honestly
              whether we can build it well.
            </EmptyState>
          )}

          <div className="notice notice--accent" style={{ marginTop: '2rem' }}>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>How to read this section:</strong> “Demo project” means built to demonstrate capability. “Concept project”
              means a design and workflow prototype with mock data. Neither is presented as paid client work, and no results are
              claimed that were not measured.
            </span>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="demos" stagger className="section section--sunk">
        <div className="container">
          <SectionHeading
            eyebrow="Interactive demos"
            title={
              <>
                Click through working demos, <span className="accent">not screenshots</span>
              </>
            }
            intro="Use filters, menus, carts, dashboards and forms to see how the work behaves. Every business inside these demos is fictional and clearly labelled."
          />

          <div className="demo-filters" role="group" aria-label="Filter demos by service">
            {demoFilters.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip ${demoFilter === item ? 'is-active' : ''}`.trim()}
                aria-pressed={demoFilter === item}
                onClick={() => setDemoFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="results-line">
            <span aria-live="polite">
              Showing {visibleDemos.length} of {demoSitesImport.length} demos
            </span>
            <span>All demos use fictional businesses and sample data</span>
          </p>

          <div className="demo-grid reveal-child">
            {visibleDemos.map((demo) => (
              <DemoCard key={demo.slug} demo={demo} />
            ))}
          </div>

          <div className="notice notice--accent" style={{ marginTop: '2.5rem' }}>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>Why demos are included:</strong> a demo is work you can actually test. The names, prices, bookings and
              forms are fictional sample content; nothing here is a real client or live business.
            </span>
          </div>
        </div>
      </RevealSection>

      <CTASection
        eyebrow="Start a project"
        title="Your project could be the next portfolio entry."
        body="Tell us what you do and we will recommend the right structure, pages and features before giving you a written scope and quote."
        primaryLabel="Discuss your project"
        secondaryLabel="See pricing"
      />
    </>
  )
}
