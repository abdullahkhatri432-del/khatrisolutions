import { ArrowRight, Check, CircleAlert, Info } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import ServiceIcon from '../components/ServiceIcon'
import { useSeo } from '../hooks/useSeo'
import { services, pricingNote, pricingNotes } from '../config/site'

export default function Services() {
  useSeo({
    title: 'Services',
    path: '/services',
    description:
      'Four service categories: website development, e-commerce, custom web applications and AI business automation — with clear scope and honest pricing.',
  })

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <p className="eyebrow">Services</p>
          <h1>
            Four ways we can <span className="accent">build with you</span>
          </h1>
          <p className="lede">
            Every category below is a starting point, not a fixed package. We confirm the exact features, price and timeline
            in writing before any work begins.
          </p>

          <nav className="service-jump" aria-label="Service categories">
            {services.map((service) => (
              <a key={service.slug} href={`#${service.slug}`}>
                {service.title}
              </a>
            ))}
          </nav>

          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Button to="/contact" variant="primary" iconRight={ArrowRight}>
              Discuss your requirement
            </Button>
            <Button to="/pricing" variant="outline">
              See starting prices
            </Button>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {services.map((service) => (
            <article className="service-block" id={service.slug} key={service.slug} tabIndex={-1}>
              <div>
                <div className="service-block__head">
                  <span className="icon-box">
                    <ServiceIcon name={service.icon} />
                  </span>
                  <div>
                    <h2>{service.title}</h2>
                    <p className="service-block__summary">{service.summary}</p>
                  </div>
                </div>
                <div className="service-block__panel" style={{ marginTop: '1.25rem' }}>
                  <h3>Who it suits</h3>
                  <p className="small muted">{service.suitableFor}</p>
                  <p className="service-block__note">
                    <Info size={13} aria-hidden="true" style={{ display: 'inline', marginRight: '0.35rem' }} />
                    {service.notes}
                  </p>
                </div>
              </div>

              <div className="service-block__cols">
                <div>
                  <h3 className="field__label" style={{ marginBottom: '0.75rem' }}>
                    What this category covers
                  </h3>
                  <ul className="tick-list">
                    {service.includes.map((item) => (
                      <li key={item}>
                        <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="service-block__cta">
                    <Button
                      to={`/contact?service=${encodeURIComponent(service.inquiryService)}`}
                      variant="outline"
                      iconRight={ArrowRight}
                    >
                      {service.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--sunk">
        <div className="container container--narrow">
          <h2>What is not included by default</h2>
          <p className="lede" style={{ marginBottom: '1.25rem' }}>
            These are the costs and services that catch people out on other quotes. We would rather say it now.
          </p>
          <div className="pricing-note" style={{ marginBottom: '1.25rem' }}>
            <Info size={16} aria-hidden="true" />
            <p>{pricingNote}</p>
          </div>
          <ul className="tick-list">
            {pricingNotes
              .filter((note) => note !== pricingNote)
              .map((note) => (
                <li key={note}>
                  <CircleAlert size={14} aria-hidden="true" style={{ color: 'var(--warning)' }} />
                  <span>{note}</span>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <CTASection
        title="Not sure which category fits?"
        body="Describe the business and what you want the project to achieve. We will recommend the smallest version that does the job — not the biggest one we can sell."
        primaryLabel="Describe your project"
        secondaryLabel="Compare packages"
      />
    </>
  )
}
