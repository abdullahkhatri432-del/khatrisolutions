import { useState } from 'react'
import { Check, Clock, MapPin, Phone, Stethoscope } from 'lucide-react'

const services = [
  {
    title: 'Back & neck pain',
    body: 'Assessment and hands-on treatment for desk-related pain, stiffness and recurring flare-ups.',
    duration: '45 min',
  },
  {
    title: 'Post-surgery rehab',
    body: 'Structured programmes that rebuild strength and movement at a pace your surgeon approves.',
    duration: '60 min',
  },
  {
    title: 'Sports recovery',
    body: 'Return-to-play plans for amateur runners, cricketers and gym-goers with a clear progression.',
    duration: '45 min',
  },
]

const steps = [
  'A 45-minute first assessment, including movement testing',
  'A written plan with exercises you can do at home',
  'Short, regular reviews until you no longer need us',
]

export default function WellnessPhysio() {
  const [form, setForm] = useState({ name: '', phone: '', service: '', day: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Please enter your name.'
    if (!/^[0-9+\s-]{8,15}$/.test(form.phone.trim())) next.phone = 'Enter a phone number we can reach you on.'
    if (!form.service) next.service = 'Choose what you need help with.'
    if (!form.day) next.day = 'Tell us when you would prefer to come in.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setResult({ name: form.name.trim() })
  }

  return (
    <>
      <header className="wp-header">
        <div className="d-shell wp-header__inner">
          <a href="#top" className="wp-brand">
            <span className="wp-brand__mark" aria-hidden="true">
              <Stethoscope size={18} />
            </span>
            Wellness <em>Physiotherapy</em>
          </a>
          <nav className="wp-nav" aria-label="Wellness Physiotherapy">
            <a href="#services">Treatments</a>
            <a href="#team">Practitioner</a>
            <a href="#visit">Visit us</a>
            <a href="#book" className="wp-nav__cta">
              Book an appointment
            </a>
          </nav>
        </div>
      </header>

      <section className="wp-hero" id="top">
        <div className="d-shell wp-hero__grid">
          <div>
            <p className="d-eyebrow">Physiotherapy · Ahmedabad</p>
            <h1>
              Move better.
              <br />
              <em>Stay better.</em>
            </h1>
            <p className="wp-hero__lede">
              One-to-one physiotherapy for back pain, post-surgery recovery and sports injuries. No queues, no rotating
              therapists — you see the same practitioner each visit.
            </p>
            <div className="wp-hero__actions">
              <a href="#book" className="d-btn">
                Request an appointment
              </a>
              <a href="tel:+919875009874" className="d-btn d-btn--ghost">
                <Phone size={15} aria-hidden="true" />
                Call the clinic
              </a>
            </div>
            <ul className="wp-trust">
              <li>
                <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                45-minute assessments
              </li>
              <li>
                <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                Same practitioner every visit
              </li>
              <li>
                <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                Evening slots available
              </li>
            </ul>
          </div>

          <div className="wp-hero__card">
            <div className="wp-hero__art" aria-hidden="true">
              <span className="wp-hero__ring" />
              <span className="wp-hero__ring wp-hero__ring--two" />
              <span className="wp-hero__figure" />
            </div>
            <div className="wp-hero__caption">
              <p className="wp-hero__captionlabel">Today</p>
              <p>2 slots left · 18:30, 19:15</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wp-services" id="services">
        <div className="d-shell">
          <div className="wp-sectionhead">
            <h2>What we treat</h2>
            <p>Every plan starts with an assessment, not a template.</p>
          </div>
          <div className="wp-grid">
            {services.map((service) => (
              <article key={service.title} className="wp-card">
                <span className="wp-card__time">
                  <Clock size={13} aria-hidden="true" />
                  {service.duration}
                </span>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wp-team" id="team">
        <div className="d-shell wp-team__grid">
          <div className="wp-portrait" aria-hidden="true">
            <span>DR</span>
          </div>
          <div>
            <p className="d-eyebrow">Your practitioner</p>
            <h2>Dr. Rhea Desai</h2>
            <p className="wp-team__role">Musculoskeletal physiotherapist</p>
            <p className="wp-team__body">
              Rhea works with desk-bound professionals, runners and post-operative patients. Sessions are hands-on where
              it helps and exercise-led where it lasts longer. You leave with a plan you understand, not a printout you
              ignore.
            </p>
            <ul className="wp-steps">
              {steps.map((step, index) => (
                <li key={step}>
                  <span className="wp-steps__num">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wp-book" id="book">
        <div className="d-shell wp-book__grid">
          <div>
            <p className="d-eyebrow">Appointments</p>
            <h2>Request a time that suits you.</h2>
            <p className="wp-book__lede">
              Send a request and the clinic confirms by phone. A request is not a confirmed booking until you hear back.
            </p>
            <div className="wp-visit" id="visit">
              <p>
                <MapPin size={15} aria-hidden="true" />
                Satellite Road, Ahmedabad
              </p>
              <p>
                <Clock size={15} aria-hidden="true" />
                Mon–Sat · 09:00–13:00, 17:00–20:00
              </p>
              <p>
                <Phone size={15} aria-hidden="true" />
                +91 98750 09874
              </p>
            </div>
          </div>

          {result ? (
            <div className="wp-confirm" role="status">
              <h3>Request recorded — demo only</h3>
              <p>
                Thanks, {result.name}. In a live clinic site this request would now be emailed to the practice and you
                would receive a call to confirm. <strong>Nothing has been sent from this demo.</strong>
              </p>
              <button
                type="button"
                className="d-btn d-btn--ghost"
                onClick={() => {
                  setResult(null)
                  setForm({ name: '', phone: '', service: '', day: '', notes: '' })
                }}
              >
                Try the form again
              </button>
            </div>
          ) : (
            <form className="wp-form" onSubmit={submit} noValidate>
              <div className="wp-field">
                <label htmlFor="wp-name">Your name</label>
                <input
                  id="wp-name"
                  value={form.name}
                  onChange={update('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'wp-name-error' : undefined}
                  autoComplete="name"
                />
                {errors.name ? (
                  <p className="wp-error" id="wp-name-error" role="alert">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="wp-field">
                <label htmlFor="wp-phone">Phone</label>
                <input
                  id="wp-phone"
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'wp-phone-error' : undefined}
                  autoComplete="tel"
                  placeholder="+91"
                />
                {errors.phone ? (
                  <p className="wp-error" id="wp-phone-error" role="alert">
                    {errors.phone}
                  </p>
                ) : null}
              </div>

              <div className="wp-field">
                <label htmlFor="wp-service">What do you need help with?</label>
                <select
                  id="wp-service"
                  value={form.service}
                  onChange={update('service')}
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={errors.service ? 'wp-service-error' : undefined}
                >
                  <option value="">Select one</option>
                  <option>Back or neck pain</option>
                  <option>Post-surgery rehabilitation</option>
                  <option>Sports injury</option>
                  <option>Something else</option>
                </select>
                {errors.service ? (
                  <p className="wp-error" id="wp-service-error" role="alert">
                    {errors.service}
                  </p>
                ) : null}
              </div>

              <div className="wp-field">
                <label htmlFor="wp-day">Preferred day</label>
                <select
                  id="wp-day"
                  value={form.day}
                  onChange={update('day')}
                  aria-invalid={Boolean(errors.day)}
                  aria-describedby={errors.day ? 'wp-day-error' : undefined}
                >
                  <option value="">Select one</option>
                  <option>Weekday morning</option>
                  <option>Weekday evening</option>
                  <option>Saturday morning</option>
                  <option>Any time</option>
                </select>
                {errors.day ? (
                  <p className="wp-error" id="wp-day-error" role="alert">
                    {errors.day}
                  </p>
                ) : null}
              </div>

              <div className="wp-field wp-field--wide">
                <label htmlFor="wp-notes">Anything we should know? (optional)</label>
                <textarea id="wp-notes" rows={3} value={form.notes} onChange={update('notes')} />
              </div>

              <button type="submit" className="d-btn">
                Request appointment
              </button>
              <p className="wp-form__note">Demo form — nothing is sent or stored.</p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
