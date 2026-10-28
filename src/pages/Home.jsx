import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, ShieldCheck, Star } from 'lucide-react'
import Button from '../components/Button'
import DemoCard from '../components/DemoCard'
import ProjectCard from '../components/ProjectCard'
import ProjectPreview from '../components/ProjectPreview'
import ProcessList from '../components/ProcessList'
import FAQ from '../components/FAQ'
import CTASection from '../components/CTASection'
import SectionHeading from '../components/SectionHeading'
import ServiceIcon from '../components/ServiceIcon'
import { useSeo } from '../hooks/useSeo'
import { homeSeo } from '../config/seo'
import { site, hero, stats, services, process, principles, faqs, projects } from '../config/site'
import { demoSites } from '../demos/demoSites'

const featuredDemos = demoSites.filter((demo) =>
  ['atelier-nine', 'northline-store', 'enquiry-triage'].includes(demo.slug),
)

export default function Home() {
  useSeo(homeSeo)

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero__grid">
            <div>
              <p className="hero__eyebrow">
                <span className="dot" aria-hidden="true" />
                {hero.eyebrow}
              </p>
              <h1>
                {hero.headline} <span className="accent">{hero.headlineAccent}</span>
              </h1>
              <p className="hero__support">{hero.supporting}</p>

              <div className="btn-row">
                <Button to={hero.primaryCta.to} variant="primary" iconRight={ArrowRight}>
                  {hero.primaryCta.label}
                </Button>
                <Button to={hero.secondaryCta.to} variant="outline">
                  {hero.secondaryCta.label}
                </Button>
              </div>

              <div className="hero__points">
                {hero.honestPoints.map((point) => (
                  <span key={point}>
                    <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                    {point}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero__visual">
              <p className="hero__visual-head">
                <span>Selected demo</span>
                <span>01 / Healthcare</span>
              </p>
              <div className="hero__frame">
                <ProjectPreview project={projects.find((project) => project.slug === 'wellness-physiotherapy') || projects[0]} large />
              </div>
              <div className="hero__caption">
                <span>Demo build — not a client project</span>
                <span className="hero__captionlinks">
                  <Link to="/demos/wellness-physiotherapy" className="link-arrow">
                    Open live demo
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                  <Link to="/work/wellness-physiotherapy" className="link-arrow">
                    Case study
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="stats">
          {stats.map((stat) => (
            <div className="stats__item" key={stat.label}>
              <p className="stats__value">{stat.value}</p>
              <p className="stats__label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="section" id="services">
        <div className="container">
          <div className="section-head__row">
            <SectionHeading
              eyebrow="What we do"
              title={
                <>
                  Four categories, <span className="accent">one clear process</span>
                </>
              }
              intro="Website development, e-commerce, custom web applications and AI automation. Every project starts with what your customers need — not with a template."
            />
            <Button to="/services" variant="outline" size="sm" iconRight={ArrowRight}>
              All services
            </Button>
          </div>

          <div className="grid grid--2">
            {services.map((service) => (
              <article key={service.slug} className="service-card">
                <span className="icon-box">
                  <ServiceIcon name={service.icon} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <ul className="tick-list">
                  {service.includes.map((item) => (
                    <li key={item}>
                      <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="service-card__foot">
                  <Link to={`/services#${service.slug}`} className="link-arrow">
                    Details
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </Link>
                  <span style={{ display: 'block', marginTop: '0.35rem' }}>{service.suitableFor}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sunk">
        <div className="container">
          <div className="section-head__row">
            <SectionHeading
              eyebrow="Selected work"
              title={
                <>
                  Built to be <span className="accent">used</span>, not just looked at
                </>
              }
              intro="A small, growing portfolio. Every entry states honestly whether it was a paid project, a demo or a concept."
            />
            <Button to="/work" variant="outline" size="sm" iconRight={ArrowRight}>
              View all work
            </Button>
          </div>

          <div className="grid grid--3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>

          <p className="notice" style={{ marginTop: '1.5rem' }}>
            <ShieldCheck size={15} aria-hidden="true" />
            <span>
              No invented client logos, awards or statistics. Demos are demos, and case studies only claim what was actually
              built.
            </span>
          </p>
        </div>
      </section>

      <section className="section" id="demos">
        <div className="container">
          <div className="section-head__row">
            <SectionHeading
              eyebrow="Live demos"
              title={
                <>
                  Do not take our word for it — <span className="accent">use the work</span>
                </>
              }
              intro="Six working demo sites, one per service. Filter a gallery, add something to a cart, sort an enquiry, open a dashboard. Every business inside them is fictional, and every demo says so."
            />
            <Button to="/demos" variant="outline" size="sm" iconRight={ArrowRight}>
              All six demos
            </Button>
          </div>

          <div className="demo-grid">
            {featuredDemos.map((demo) => (
              <DemoCard key={demo.slug} demo={demo} headingLevel={3} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark section--grid" id="process">
        <div className="container">
          <SectionHeading
            eyebrow="How we work"
            title={
              <>
                Five steps, <span className="accent">no guesswork</span>
              </>
            }
            intro="A simple process designed for business owners who do not want to manage a development team. Work begins only after the scope and commercial terms are agreed in writing."
          />
          <ProcessList steps={process} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split split--wide-left">
            <div>
              <SectionHeading
                eyebrow="Why work with Khatri Solutions"
                title={
                  <>
                    Small studio, <span className="accent">direct answers</span>
                  </>
                }
                intro="You talk to the person doing the work. That means fewer handoffs, clearer decisions, and a site that reflects what you actually asked for."
              />
              <ul className="value-list" style={{ marginTop: '1.75rem' }}>
                <li>
                  <strong>Honest about being new</strong>
                  <span>{site.disclosure}</span>
                </li>
                <li>
                  <strong>Prices published, scope written</strong>
                  <span>Starting ranges are on the pricing page so you can decide before a call.</span>
                </li>
              </ul>
              <div className="btn-row" style={{ marginTop: '1.75rem' }}>
                <Button to="/about#team" variant="primary" iconRight={ArrowRight}>
                  Meet the team
                </Button>
                <Button to="/about" variant="outline">
                  About the studio
                </Button>
              </div>
            </div>

            <div className="grid grid--2">
              {principles.map((item) => (
                <div className="feature" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--sunk">
        <div className="container">
          <div className="split">
            <div>
              <SectionHeading
                eyebrow="Questions"
                title={
                  <>
                    The things clients <span className="accent">actually ask</span>
                  </>
                }
                intro="Clear answers on cost, timelines, ownership and what happens after launch."
              />
              <Button to="/contact" variant="outline" iconRight={ArrowRight}>
                Ask something else
              </Button>
            </div>
            <FAQ items={faqs} />
          </div>
          <p className="tiny muted" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <Star size={13} aria-hidden="true" />
            Looking for reviews? This is a new studio — read the honest status on the reviews page.
            <Link to="/reviews" className="link-arrow" style={{ marginLeft: '0.25rem' }}>
              Reviews
            </Link>
          </p>
        </div>
      </section>

      <CTASection />
    </>
  )
}
