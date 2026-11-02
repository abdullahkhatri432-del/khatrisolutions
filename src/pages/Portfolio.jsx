import { useMemo, useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import DemoCard from '../components/DemoCard'
import EmptyState from '../components/EmptyState'
import ProjectCard from '../components/ProjectCard'
import SectionHeading from '../components/SectionHeading'
import { useSeo } from '../hooks/useSeo'
import { pageSeo } from '../config/seo'
import { projectCategories, projects } from '../config/site'
import { demoSites } from '../demos/demoSites'

const demoFilters = ['All demos', ...new Set(demoSites.map((demo) => demo.service))]

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
    () => (demoFilter === demoFilters[0] ? demoSites : demoSites.filter((demo) => demo.service === demoFilter)),
    [demoFilter],
  )

  return (
    <>
      <header className="pagehead">
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

      <section className="section" id="projects">
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
      </section>

      <section className="section section--sunk" id="demos">
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
              Showing {visibleDemos.length} of {demoSites.length} demos
            </span>
            <span>All demos use fictional businesses and sample data</span>
          </p>

          <div className="demo-grid">
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
      </section>

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
