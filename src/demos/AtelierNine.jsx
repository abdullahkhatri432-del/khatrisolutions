import { useMemo, useState } from 'react'
import { ArrowRight, MapPin, Ruler, Sparkles } from 'lucide-react'

const filters = ['All', 'Residential', 'Retail', 'Hospitality']

const works = [
  {
    id: 'juniper-house',
    name: 'Juniper House',
    type: 'Residential',
    place: 'Koregaon Park, Pune',
    year: '2025',
    art: 'art--clay',
  },
  {
    id: 'the-fold-cafe',
    name: 'The Fold Café',
    type: 'Hospitality',
    place: 'Kalyani Nagar, Pune',
    year: '2025',
    art: 'art--olive',
  },
  {
    id: 'meridian-studio',
    name: 'Meridian Studio',
    type: 'Retail',
    place: 'Bandra West, Mumbai',
    year: '2024',
    art: 'art--sand',
  },
  {
    id: 'quiet-rooms',
    name: 'Quiet Rooms',
    type: 'Residential',
    place: 'Baner, Pune',
    year: '2024',
    art: 'art--ink',
  },
  {
    id: 'marigold-hotel',
    name: 'Marigold Hotel',
    type: 'Hospitality',
    place: 'Lonavala',
    year: '2023',
    art: 'art--rust',
  },
  {
    id: 'atelier-flagship',
    name: 'Atelier Flagship',
    type: 'Retail',
    place: 'Camp, Pune',
    year: '2023',
    art: 'art--stone',
  },
]

const services = [
  {
    title: 'Residential interiors',
    body: 'Full-home design from layout and lighting to the last switch plate. Built around how you actually live.',
  },
  {
    title: 'Retail & hospitality',
    body: 'Shops, cafés and small hotels that need to work hard: clear circulation, durable finishes, a memorable room.',
  },
  {
    title: 'Styling & handover',
    body: 'Furniture, textiles, art and lighting sourced and installed, with a maintenance pack at handover.',
  },
]

export default function AtelierNine() {
  const [filter, setFilter] = useState('All')
  const visible = useMemo(
    () => (filter === 'All' ? works : works.filter((work) => work.type === filter)),
    [filter],
  )

  return (
    <>
      <header className="at-header">
        <div className="d-shell at-header__inner">
          <a href="#top" className="at-brand">
            Atelier <span>Nine</span>
          </a>
          <nav className="at-nav" aria-label="Atelier Nine">
            <a href="#work">Work</a>
            <a href="#studio">Studio</a>
            <a href="#services">Services</a>
            <a href="#contact" className="at-nav__cta">
              Start a project
            </a>
          </nav>
        </div>
      </header>

      <section className="at-hero" id="top">
        <div className="d-shell">
          <p className="d-eyebrow">Interior architecture · Pune · Mumbai</p>
          <h1 className="at-hero__title">
            Rooms with a<br />
            <em>point of view.</em>
          </h1>
          <div className="at-hero__foot">
            <p className="at-hero__lede">
              We design calm, liveable interiors for people who would rather own fewer, better things. Residential,
              retail and small hospitality projects across Maharashtra.
            </p>
            <div className="at-hero__actions">
              <a href="#work" className="d-btn">
                View projects
                <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a href="#contact" className="d-btn d-btn--ghost">
                Book a consultation
              </a>
            </div>
          </div>
          <ul className="at-facts">
            <li>
              <Ruler size={15} aria-hidden="true" />
              Turnkey interiors
            </li>
            <li>
              <MapPin size={15} aria-hidden="true" />
              Pune &amp; Mumbai
            </li>
            <li>
              <Sparkles size={15} aria-hidden="true" />
              Limited projects each year
            </li>
          </ul>
        </div>
      </section>

      <section className="at-work" id="work">
        <div className="d-shell">
          <div className="at-sectionhead">
            <h2>Selected work</h2>
            <div className="at-filters" role="group" aria-label="Filter projects">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`at-chip ${filter === item ? 'is-active' : ''}`.trim()}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="at-grid">
            {visible.map((work) => (
              <article key={work.id} className="at-card">
                <div className={`at-art ${work.art}`} aria-hidden="true">
                  <span className="at-art__mark">{work.name.charAt(0)}</span>
                  <span className="at-art__tag">{work.type}</span>
                </div>
                <div className="at-card__body">
                  <h3>{work.name}</h3>
                  <p>
                    {work.place} · {work.year}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="at-count" aria-live="polite">
            Showing {visible.length} of {works.length} projects
          </p>
        </div>
      </section>

      <section className="at-studio" id="studio">
        <div className="d-shell at-studio__grid">
          <div>
            <p className="d-eyebrow">The studio</p>
            <h2>
              Small by choice.
              <br />
              <em>Detailed by habit.</em>
            </h2>
          </div>
          <div className="at-studio__text">
            <p>
              Atelier Nine is a two-person studio. One of us draws, one of us builds — and both of us show up on site.
              That means fewer projects a year, and a room that looks like the drawing you approved.
            </p>
            <ul className="at-list">
              <li>Site visits at every stage, not just handover</li>
              <li>Fixed design fee, transparent vendor costs</li>
              <li>Material samples you can hold before deciding</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="at-services" id="services">
        <div className="d-shell">
          <div className="at-sectionhead">
            <h2>What we take on</h2>
          </div>
          <div className="at-servicegrid">
            {services.map((service, index) => (
              <article key={service.title} className="at-service">
                <span className="at-service__num">{String(index + 1).padStart(2, '0')}</span>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="at-contact" id="contact">
        <div className="d-shell at-contact__inner">
          <div>
            <p className="d-eyebrow">Next step</p>
            <h2>Tell us about the space.</h2>
            <p className="at-contact__lede">
              Share the location, the size and roughly when you would like to start. You will get a reply with the next
              available consultation slot.
            </p>
          </div>
          <div className="at-contact__panel">
            <p className="at-contact__label">Studio hours</p>
            <p>Monday to Friday, 10:00 – 18:00</p>
            <p className="at-contact__label">Email</p>
            <p>studio@ateliernine.example</p>
            <p className="at-contact__note">
              Demo site — this address and these hours are fictional.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
