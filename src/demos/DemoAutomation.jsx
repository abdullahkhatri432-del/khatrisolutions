import { Check, Play, RotateCcw, Sparkles, Zap } from 'lucide-react'
import { useState } from 'react'

/**
 * A small, local-only workflow simulator shared by the demos.
 * It makes the business problem, the automation and the user-visible result
 * explicit without pretending that a real message, booking or payment was sent.
 */
export default function DemoAutomation({ problem, automation, outcome, steps }) {
  const [ran, setRan] = useState(false)

  return (
    <section className="demo-automation" aria-labelledby="demo-automation-title">
      <div className="d-shell">
        <div className="demo-automation__head">
          <div>
            <p className="d-eyebrow">Behind the experience</p>
            <h2 id="demo-automation-title">A workflow that removes the bottleneck.</h2>
          </div>
          <span className="demo-automation__badge">
            <Sparkles size={14} aria-hidden="true" />
            Interactive simulation
          </span>
        </div>

        <div className="demo-automation__grid">
          <article className="demo-automation__card">
            <span className="demo-automation__number">01</span>
            <p className="demo-automation__label">The problem</p>
            <h3>{problem}</h3>
          </article>
          <article className="demo-automation__card demo-automation__card--accent">
            <span className="demo-automation__number">02</span>
            <p className="demo-automation__label">The automation</p>
            <h3>{automation}</h3>
          </article>
          <article className="demo-automation__card">
            <span className="demo-automation__number">03</span>
            <p className="demo-automation__label">The outcome</p>
            <h3>{outcome}</h3>
          </article>
        </div>

        <div className={`demo-automation__run ${ran ? 'is-complete' : ''}`.trim()} aria-live="polite">
          <div className="demo-automation__run-copy">
            <Zap size={17} aria-hidden="true" />
            <div>
              <strong>{ran ? 'Workflow completed in this demo' : 'See the workflow in action'}</strong>
              <p>
                {ran
                  ? 'The steps below show what a real connected system would do next. No external service was contacted.'
                  : 'Run this local simulation to make the hand-off and the business benefit visible.'}
              </p>
            </div>
          </div>
          <button type="button" className="d-btn demo-automation__button" onClick={() => setRan((current) => !current)}>
            {ran ? <RotateCcw size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
            {ran ? 'Run again' : 'Run automation'}
          </button>
        </div>

        <ol className="demo-automation__steps">
          {steps.map((step, index) => (
            <li key={step} className={ran ? 'is-done' : ''}>
              <span aria-hidden="true">{ran ? <Check size={14} /> : index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
