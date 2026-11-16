import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, MapPin, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import FAQ from '../components/FAQ'
import SectionHeading from '../components/SectionHeading'
import { useSeo } from '../hooks/useSeo'
import { pageSeo } from '../config/seo'
import { location } from '../config/location'
import { services, site } from '../config/site'

export default function Location() {
  useSeo({ ...pageSeo['/locations/india'], faqItems: location.faqs })

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link to="/services">Services</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span aria-current="page">{location.title}</span>
          </nav>
          <p className="eyebrow" style={{ marginTop: '1rem' }}>
            <MapPin size={14} aria-hidden="true" />
            {location.eyebrow}
          </p>
          <h1 style={{ marginTop: '0.5rem' }}>{location.h1}</h1>
          <p className="lede">{location.intro}</p>
          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Button to="/contact" variant="primary" iconRight={ArrowRight}>
              Discuss your project
            </Button>
            <Button to="/pricing" variant="outline">
              See starting prices
            </Button>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="stats">
            {location.stats.map((stat) => (
              <div className="stats__item" key={stat.label}>
                <p className="stats__value">{stat.value}</p>
                <p className="stats__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sunk">
        <div className="container container--narrow prose">
          {location.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What we build in India"
            title="Services for Indian small businesses"
            intro="Every category starts with a written scope and a published starting price."
          />
          <div className="grid grid--2">
            {services.map((service) => (
              <article key={service.slug} className="feature">
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <Link to={`/services/${service.slug}`} className="link-arrow">
                  Explore {service.title}
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionHeading eyebrow="Questions" title="Common questions" align="center" />
          <FAQ items={location.faqs} idPrefix="location-faq" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="notice notice--accent">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>
              <strong>Honest about being new:</strong> {site.disclosure}
            </span>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Next step"
        title="Bring the requirement. We will bring the honest answer."
        body="Tell us what you do and we will recommend the smallest version that does the job — not the biggest one we can sell."
        primaryLabel="Discuss your project"
        secondaryLabel="See starting prices"
      />
    </>
  )
}
