import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronRight, Info, MonitorPlay } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import FAQ from '../components/FAQ'
import SectionHeading from '../components/SectionHeading'
import { useSeo } from '../hooks/useSeo'
import { serviceMeta } from '../config/seo'
import { getServiceDetail } from '../config/serviceDetails'
import { services } from '../config/site'
import { blogPosts } from '../config/blog'

export default function ServiceDetail({ slug }) {
  const detail = getServiceDetail(slug)

  useSeo(
    detail
      ? serviceMeta(detail)
      : { title: 'Service not found', path: `/services/${slug || ''}`, noindex: true },
  )

  if (!detail) {
    return (
      <section className="section">
        <div className="container notfound">
          <p className="notfound__code" aria-hidden="true">
            404
          </p>
          <h1>Service page not found</h1>
          <p>The service page you requested does not exist. Browse the services or the portfolio instead.</p>
          <Button to="/services" variant="primary" iconRight={ArrowRight}>
            View all services
          </Button>
        </div>
      </section>
    )
  }

  const related = services.filter((service) => service.slug !== slug).slice(0, 2)
  const guides = blogPosts.slice(0, 3)

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link to="/services">Services</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span aria-current="page">{detail.h1}</span>
          </nav>
          <h1 style={{ marginTop: '1rem' }}>{detail.h1}</h1>
          <p className="lede">{detail.intro}</p>
          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Button to="/contact" variant="primary" iconRight={ArrowRight}>
              Discuss this service
            </Button>
            <Button to="/pricing" variant="outline">
              See starting prices
            </Button>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container container--narrow prose">
          <h2>Why this matters</h2>
          <p>{detail.problem}</p>
          <h2>What we build</h2>
          <p>{detail.solution}</p>
          <h2>What is included</h2>
          <ul className="tick-list">
            {detail.includes.map((item) => (
              <li key={item}>
                <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--sunk">
        <div className="container">
          <div className="split">
            <div>
              <SectionHeading
                eyebrow="Who this is for"
                title="Built for"
                intro={detail.whoItSuits}
              />
              <div className="notice">
                <Info size={15} aria-hidden="true" />
                <span>{detail.pricingIntro}</span>
              </div>
              <div className="btn-row" style={{ marginTop: '1.25rem' }}>
                <Button to="/pricing" variant="primary" iconRight={ArrowRight}>
                  {detail.pricingCta}
                </Button>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="See the work"
                title="Live demos"
                intro={detail.demoIntro}
              />
              <ul className="demo-links">
                {detail.demoLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>
                      <MonitorPlay size={15} aria-hidden="true" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionHeading eyebrow="Questions" title="Common questions" align="center" />
          <FAQ items={detail.faqs} idPrefix={`${slug}-faq`} />
        </div>
      </section>

      <section className="section section--sunk">
        <div className="container">
          <SectionHeading
            eyebrow="Keep reading"
            title="Guides that answer the next question"
            intro="Practical answers on cost, timelines and choosing a developer."
          />
          <ul className="demo-links">
            {guides.map((post) => (
              <li key={post.slug}>
                <Link to={`/blog/${post.slug}`}>
                  <ArrowRight size={15} aria-hidden="true" />
                  <span>{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            {related.map((service) => (
              <Button key={service.slug} to={`/services/${service.slug}`} variant="outline" size="sm">
                {service.title}
              </Button>
            ))}
            <Button to="/services" variant="outline" size="sm">
              All services
            </Button>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Next step"
        title="Bring the requirement. We will bring the honest answer."
        body="Tell us what you do and we will recommend the smallest version that does the job — not the biggest one we can sell."
        primaryLabel="Discuss this service"
        secondaryLabel="See all services"
      />
    </>
  )
}
