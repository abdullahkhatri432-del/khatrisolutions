import { useMemo, useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import ProjectCard from '../components/ProjectCard'
import EmptyState from '../components/EmptyState'
import { useSeo } from '../hooks/useSeo'
import { projectCategories, projects } from '../config/site'

export default function Work() {
  const [filter, setFilter] = useState(projectCategories[0])

  useSeo({
    title: 'Work & portfolio',
    path: '/work',
    description:
      'Demo and concept projects by Khatri Solutions: clinic, restaurant, e-commerce and business websites, plus a web app prototype. Every entry is labelled honestly.',
  })

  const visible = useMemo(
    () => (filter === projectCategories[0] ? projects : projects.filter((project) => project.category === filter)),
    [filter],
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
            This portfolio is intentionally small and clearly labelled. Each project states whether it was a paid client
            project, a demo built to show our work, or a concept.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="filters" role="group" aria-label="Filter projects by category">
            {projectCategories.map((category) => (
              <button
                key={category}
                type="button"
                className="chip"
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="results-line">
            <span aria-live="polite">Showing {visible.length} of {projects.length} projects</span>
            <span>Demo and concept projects are not client engagements</span>
          </p>

          {visible.length > 0 ? (
            <div className="project-list">
              {visible.map((project) => (
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
              <strong>How to read this page:</strong> “Demo project” means built to demonstrate capability. “Concept project”
              means a design and workflow prototype with mock data. Neither is presented as paid client work, and no results are
              claimed that were not measured.
            </span>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Start a project"
        title="Your project could be the next entry here."
        body="If you like the direction of this work, send your requirements. You will get a written scope, a fixed quote and a realistic timeline."
        primaryLabel="Discuss your project"
        secondaryLabel="See pricing"
      />
    </>
  )
}
