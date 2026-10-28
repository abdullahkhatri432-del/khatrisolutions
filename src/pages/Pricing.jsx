import { ArrowRight, Check, CircleAlert, Info } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import FAQ from '../components/FAQ'
import SectionHeading from '../components/SectionHeading'
import { useSeo } from '../hooks/useSeo'
import { pageSeo } from '../config/seo'
import { packages, pricingNote, pricingNotes, faqs } from '../config/site'

const serviceLink = (service) => `/contact?service=${encodeURIComponent(service)}`

export default function Pricing() {
  useSeo(pageSeo['/pricing'])

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <p className="eyebrow">Pricing</p>
          <h1>
            Starting prices, <span className="accent">stated plainly</span>
          </h1>
          <p className="lede">
            Six starting points, not fixed promises. Choose a package and the enquiry form opens with that service already
            selected. Custom applications and automation are quoted from your requirements.
          </p>
          <div className="btn-row" style={{ marginTop: '1.75rem' }}>
            <Button to="/contact" variant="primary" iconRight={ArrowRight}>
              Request a quote
            </Button>
            <Button to="/work" variant="outline">
              See the work first
            </Button>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            {packages.map((pack) => (
              <article className={`price-card ${pack.featured ? 'price-card--featured' : ''}`.trim()} key={pack.name}>
                <div>
                  <div className="price-card__top">
                    <div>
                      <p className="price-card__label">{pack.quoteOnly ? 'Requirements-based quote' : 'Starting at'}</p>
                      <h2 className="price-card__name">{pack.name}</h2>
                    </div>
                    {pack.badge ? <span className="pill pill--accent">{pack.badge}</span> : null}
                  </div>

                  <p className="price-card__price">
                    {pack.price}
                    <small>{pack.quoteOnly ? 'No fixed price before discovery' : 'INR · project start price'}</small>
                  </p>
                </div>

                <p className="price-card__suitable">
                  <strong>Who it suits:</strong> {pack.suitable}
                </p>

                <ul className="price-card__list">
                  {pack.deliverables.map((item) => (
                    <li key={item}>
                      <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="price-card__meta">
                  <span>
                    <strong>Timeline:</strong> {pack.timeline}
                  </span>
                  <span>
                    <strong>Scope:</strong> {pack.scope}
                  </span>
                </div>

                <Button
                  to={serviceLink(pack.inquiryService)}
                  variant={pack.featured ? 'primary' : 'outline'}
                  wide
                  iconRight={ArrowRight}
                >
                  {pack.cta}
                </Button>
              </article>
            ))}
          </div>

          <div className="pricing-note" style={{ marginTop: '2rem' }}>
            <Info size={16} aria-hidden="true" />
            <p>
              <strong>What the starting price does not include.</strong> {pricingNote}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--sunk">
        <div className="container">
          <SectionHeading
            eyebrow="The fine print, in plain words"
            title="What the quote does and does not cover"
            intro="Nobody likes surprises after a project starts. These rules apply to every engagement."
          />

          <div className="grid grid--2">
            <div className="panel">
              <h3 style={{ marginBottom: '0.9rem' }}>How pricing works</h3>
              <ul className="tick-list">
                {pricingNotes.map((note) => (
                  <li key={note}>
                    <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel panel--muted">
              <h3 style={{ marginBottom: '0.9rem' }}>If your budget is smaller</h3>
              <p className="small muted" style={{ marginBottom: '0.9rem' }}>
                Say so honestly. We will suggest the smallest useful version — often a single strong page — and you can add
                sections later when the business is ready.
              </p>
              <div className="notice">
                <CircleAlert size={15} aria-hidden="true" />
                <span>
                  No unlimited revisions, no unlimited pages, and no promise of ranking on Google, guaranteed leads or
                  guaranteed sales. Those claims usually hide a much larger invoice.
                </span>
              </div>
              <div className="btn-row" style={{ marginTop: '1.25rem' }}>
                <Button to="/contact" variant="dark" iconRight={ArrowRight}>
                  Ask for a custom quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionHeading eyebrow="Common questions" title="Pricing questions" align="center" />
          <FAQ items={faqs.slice(0, 5)} idPrefix="pricing-faq" />
        </div>
      </section>

      <CTASection />
    </>
  )
}
