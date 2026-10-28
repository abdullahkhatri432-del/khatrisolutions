import { ArrowRight, Check, Clock, Info, MapPin, ShieldCheck, Users } from 'lucide-react'
import Button from '../components/Button'
import CTASection from '../components/CTASection'
import SectionHeading from '../components/SectionHeading'
import TeamCard from '../components/TeamCard'
import { useSeo } from '../hooks/useSeo'
import { pageSeo } from '../config/seo'
import { collaboration, principles, site, team } from '../config/site'

const expectations = [
  'A reply to your enquiry with honest questions, not a sales pitch.',
  'A written scope listing pages, features, price and timeline.',
  'Progress updates at agreed points, and a link you can test before launch.',
  'A clear handover: what you own, what you need to renew, and how to edit content.',
]

const approach = [
  'Start with the customer, not the template. The first page is designed around what a visitor needs to decide.',
  'Prefer fewer, better pages over a long menu nobody reads.',
  'Keep the build light: fast on a mid-range phone and a slow connection.',
  'Document what is included, and say plainly what is not.',
]

export default function About() {
  useSeo(pageSeo['/about'])

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <p className="eyebrow">About</p>
          <h1>
            A new studio with an <span className="accent">old-fashioned rule</span>
          </h1>
          <p className="lede">
            Say what you will do, do what you said, and price it clearly. Khatri Solutions is an independent web studio run by two
            collaborators, helping small businesses establish a professional online presence.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="split split--wide-left">
            <div>
              <SectionHeading
                eyebrow="Our mission"
                title="Good websites should not be a mystery purchase"
                intro="Most small businesses do not need a five-figure digital transformation. They need a clear website, a way for customers to contact them, and someone who answers questions directly."
              />
              <p className="prose" style={{ marginTop: '1.1rem' }}>
                We help businesses establish a professional online presence through thoughtful website development and practical
                digital solutions. Every project starts with understanding the client’s goals, requirements and budget — then
                building the smallest version that genuinely does the job.
              </p>

              <h3 style={{ marginTop: '2rem' }}>How we approach a project</h3>
              <ul className="value-list" style={{ marginTop: '1rem' }}>
                {approach.map((item) => (
                  <li key={item}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="stack-md">
              <div className="studio-card">
                <p className="studio-card__eyebrow">Studio at a glance</p>
                <h2>Small by design, direct by default</h2>
                <p>
                  No account managers, no handoff to a junior team, no invented history. Two collaborators work on Khatri Solutions
                  projects, and the next section shows exactly who does what.
                </p>
                <ul className="studio-card__facts">
                  <li>
                    <Users size={15} aria-hidden="true" />
                    <span>Two collaborators: development and client relations</span>
                  </li>
                  <li>
                    <MapPin size={15} aria-hidden="true" />
                    <span>Based in India, working remotely with clients</span>
                  </li>
                  <li>
                    <Clock size={15} aria-hidden="true" />
                    <span>{site.responseTime}</span>
                  </li>
                  <li>
                    <ShieldCheck size={15} aria-hidden="true" />
                    <span>Scope and price agreed in writing before work begins</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--raised" id="team" tabIndex={-1}>
        <div className="container">
          <SectionHeading eyebrow={team.eyebrow} title={team.title} intro={team.intro} />

          <div className="team-grid">
            {team.members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark section--grid" id="collaboration" tabIndex={-1}>
        <div className="container">
          <SectionHeading eyebrow={collaboration.eyebrow} title={collaboration.title} intro={collaboration.intro} />

          <div className="collab">
            <div className="collab__lanes">
              {collaboration.lanes.map((lane) => (
                <div className="collab-lane" key={lane.role}>
                  <h3>{lane.role}</h3>
                  <p className="collab-lane__summary">{lane.summary}</p>
                  <ul>
                    {lane.handles.map((item) => (
                      <li key={item}>
                        <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <ol className="collab__stages">
              {collaboration.stages.map((stage) => (
                <li className="collab-step" key={stage.step}>
                  <span className="collab-step__num" aria-hidden="true">
                    {stage.step}
                  </span>
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                </li>
              ))}
            </ol>

            <p className="collab__note">
              <Info size={15} aria-hidden="true" />
              <span>{collaboration.note}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="section section--sunk">
        <div className="container">
          <SectionHeading
            eyebrow="Working principles"
            title="What “professional” means here"
            intro="These are the promises that hold up when a project gets difficult."
          />
          <div className="grid grid--4">
            {principles.map((item) => (
              <div className="feature" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <SectionHeading
                eyebrow="What to expect"
                title="No mystery, no disappearing act"
                intro="A project is a working relationship. This is what that looks like from your side."
              />
              <div className="btn-row" style={{ marginTop: '1.5rem' }}>
                <Button to="/contact" variant="primary" iconRight={ArrowRight}>
                  Start a conversation
                </Button>
                <Button to="/work" variant="outline">
                  See the work
                </Button>
              </div>
            </div>
            <ul className="value-list">
              {expectations.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '0.6rem' }}>
                  <Check
                    size={17}
                    strokeWidth={2.4}
                    aria-hidden="true"
                    style={{ flex: 'none', marginTop: '0.2rem', color: 'var(--accent-strong)' }}
                  />
                  <span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text)' }}>{item}</strong>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Work together"
        title="Bring the requirement. We will bring the honest answer."
        body="Tell us the business, the goal and the budget. One of the two people above will read it and reply."
        primaryLabel="Discuss your project"
        secondaryLabel="See starting prices"
      />
    </>
  )
}
