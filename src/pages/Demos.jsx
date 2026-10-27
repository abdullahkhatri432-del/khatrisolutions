import { useMemo, useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import DemoCard from '../components/DemoCard'
import SectionHeading from '../components/SectionHeading'
import { useSeo } from '../hooks/useSeo'
import { demoSites } from '../demos/demoSites'

const serviceFilters = ['All demos', ...new Set(demoSites.map((demo) => demo.service))]

export default function Demos() {
  const [filter, setFilter] = useState(serviceFilters[0])

  useSeo({
    title: 'Live demos',
    path: '/demos',
    description:
      'Click through live demo websites built by Khatri Solutions: a design studio, a clinic, a restaurant, an online store, a dashboard and an AI enquiry workflow. Every demo is interactive and clearly labelled.',
  })

  const visible = useMemo(
    () => (filter === serviceFilters[0] ? demoSites : demoSites.filter((demo) => demo.service === filter)),
    [filter],
  )

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <p className="eyebrow">Live demos</p>
          <h1>
            Click through working demos, <span className="accent">not screenshots</span>
          </h1>
          <p className="lede">
            Every demo below is a working site you can use: filters, menus, a cart, a dashboard, a form. They are built by
            us to show how we work, and each one is labelled as a demo — never as a client you can call.
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

      <section className="section">
        <div className="container">
          <div className="demo-filters" role="group" aria-label="Filter demos by service">
            {serviceFilters.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip ${filter === item ? 'is-active' : ''}`.trim()}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="results-line">
            <span aria-live="polite">
              Showing {visible.length} of {demoSites.length} demos
            </span>
            <span>All demos use fictional businesses and sample data</span>
          </p>

          <div className="demo-grid">
            {visible.map((demo) => (
              <DemoCard key={demo.slug} demo={demo} />
            ))}
          </div>

          <div className="notice notice--accent" style={{ marginTop: '2.5rem' }}>
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>Why demos instead of a logo wall:</strong> a demo is work you can actually test. Every business name,
              price and booking shown inside these demos is fictional sample content, and the forms never send anything.
            </span>
          </div>
        </div>
      </section>

      <section className="section section--sunk">
        <div className="container">
          <div className="split split--wide-left">
            <div>
              <SectionHeading
                eyebrow="How to judge a demo"
                title={
                  <>
                    Look at the boring parts, <span className="accent">not the hero</span>
                  </>
                }
                intro="Anyone can make a homepage look expensive. These are the things worth checking before you hire anyone — including us."
              />
            </div>
            <ul className="value-list">
              <li>
                <strong>Does it work on your phone?</strong>
                <span>Resize the demo, tap the filters, use the forms. Everything here is responsive and keyboard-usable.</span>
              </li>
              <li>
                <strong>Is the content written for a customer?</strong>
                <span>Read the services and menu copy. It should answer real questions, not describe the software.</span>
              </li>
              <li>
                <strong>Is anything dishonest?</strong>
                <span>No fake reviews, no invented clients, no “trusted by” logos. What you see is what was built.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Start a project"
        title="Want a demo for your own business?"
        body="Tell us what you do and we will show you the structure we would use, the pages you need and a fixed price before any work starts."
        primaryLabel="Discuss your project"
        secondaryLabel="See pricing"
      />
    </>
  )
}
