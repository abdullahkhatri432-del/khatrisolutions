import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Info,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Button from './Button'
import { Field } from './FormControls'
import WhatsAppIcon from './icons/WhatsAppIcon'
import {
  site,
  businessTypes,
  inquiryServiceOptions,
  inquiryServiceKinds,
  budgetOptions,
  timelineOptions,
  contactMethods,
  pagesOptions,
  productCountOptions,
} from '../config/site'
import { buildInquiryText, endpointConfigured, isLikelySpam, sendMessage } from '../lib/inquiry'
import { contactChannel, mailtoLink, whatsappLink } from '../lib/contact'
import { clean, firstInquiryStepWithErrors, inquiryFieldKeys, validateInquiry, validateInquiryStep } from '../lib/validation'

const EMPTY = {
  name: '',
  business: '',
  email: '',
  phone: '',
  service: '',
  budget: '',
  timeline: '',
  description: '',
  contactMethod: '',
  consent: false,
  website: '',
  businessType: '',
  pages: '',
  existingWebsite: '',
  productCount: '',
  commerceNeeds: '',
  appProblem: '',
  userRoles: '',
  appFeatures: '',
  automationTask: '',
  currentTools: '',
  currentWebsite: '',
  improvements: '',
  primaryGoal: '',
}

const CONDITIONAL_KEYS = [
  'businessType',
  'pages',
  'existingWebsite',
  'productCount',
  'commerceNeeds',
  'appProblem',
  'userRoles',
  'appFeatures',
  'automationTask',
  'currentTools',
  'currentWebsite',
  'improvements',
  'primaryGoal',
]

const STEPS = [
  { number: 1, title: 'What you need' },
  { number: 2, title: 'Your details' },
  { number: 3, title: 'Project details' },
]

export default function InquiryForm({ initialService = '' }) {
  const [values, setValues] = useState({
    ...EMPTY,
    service: initialService,
  })
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const busy = useRef(false)
  const stepHeadingRef = useRef(null)
  const confirmationRef = useRef(null)
  const firstRender = useRef(true)

  const kind = inquiryServiceKinds[values.service] || null
  const channel = contactChannel()
  // The handoff follows the visitor's preferred reply channel.
  const handoffChannel = values.contactMethod === 'Email' ? 'email' : channel
  const handoffChannelName =
    handoffChannel === 'whatsapp' ? 'WhatsApp' : handoffChannel === 'email' ? 'your email app' : 'a direct message'

  const submitLabel = endpointConfigured
    ? 'Send enquiry'
    : handoffChannel === 'whatsapp'
      ? 'Open WhatsApp draft'
      : handoffChannel === 'email'
        ? 'Open email draft'
        : 'Send enquiry'

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value

    setValues((current) => {
      if (field === 'service') {
        const next = { ...current, service: value }
        for (const key of CONDITIONAL_KEYS) next[key] = ''
        return next
      }
      return { ...current, [field]: value }
    })

    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      if (field === 'service') {
        for (const key of CONDITIONAL_KEYS) delete next[key]
      }
      if (field === 'contactMethod') {
        delete next.email
        delete next.phone
      }
      return next
    })
  }

  const focusField = (field) => {
    if (!field) return
    window.requestAnimationFrame(() => {
      const el = document.getElementById(`inquiry-${field}`)
      if (el) el.focus()
    })
  }

  const handleNext = () => {
    const nextErrors = validateInquiryStep(values, step)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      focusField(Object.keys(nextErrors)[0])
      return
    }
    setErrors({})
    setStep((current) => Math.min(current + 1, STEPS.length))
  }

  const handleBack = () => {
    setErrors({})
    setStep((current) => Math.max(current - 1, 1))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy.current) return

    const nextErrors = validateInquiry(values)
    if (Object.keys(nextErrors).length > 0) {
      const errorStep = firstInquiryStepWithErrors(values, nextErrors)
      const field = inquiryFieldKeys(values.service, errorStep).find((key) => nextErrors[key])
      setErrors(nextErrors)
      setStep(errorStep)
      focusField(field || Object.keys(nextErrors)[0])
      return
    }

    const spam = isLikelySpam({ honeypot: values.website })
    const messageText = buildInquiryText(values, kind)
    const conditionalPayload = {}
    for (const key of CONDITIONAL_KEYS) {
      if (clean(values[key])) conditionalPayload[key] = clean(values[key])
    }

    busy.current = true
    setSubmitting(true)
    setErrors({})

    const result = await sendMessage({
      kind: 'project-inquiry',
      values: {
        name: clean(values.name),
        business: clean(values.business),
        email: clean(values.email),
        phone: clean(values.phone),
        service: values.service,
        budget: values.budget,
        timeline: values.timeline,
        description: clean(values.description),
        contactMethod: values.contactMethod,
        ...conditionalPayload,
      },
      text: messageText,
      subject: `Project inquiry — ${clean(values.name)}`,
      spam,
    })

    setSubmitting(false)
    busy.current = false

    if (result.ok) {
      setStatus({
        type: result.mode === 'endpoint' ? 'sent' : 'handoff',
        mode: result.mode,
        name: clean(values.name),
        service: values.service,
        text: messageText,
      })
    } else {
      setStatus({
        type: 'error',
        message: result.error || 'Something went wrong while sending your enquiry.',
      })
    }
  }

  const resetForm = () => {
    setValues({ ...EMPTY, service: initialService })
    setErrors({})
    setStep(1)
    setStatus(null)
  }

  const editAfterHandoff = () => {
    setStatus(null)
    setStep(3)
  }

  const stepTitle = STEPS[step - 1].title
  const handoffMail = status?.text ? mailtoLink('Project inquiry', status.text) : null
  const handoffWhatsApp = status?.text ? whatsappLink(status.text) : null

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (status?.type === 'sent' || status?.type === 'handoff') {
      confirmationRef.current?.focus()
      return
    }
    if (status?.type === 'error') return
    stepHeadingRef.current?.focus()
  }, [step, status])

  if (status?.type === 'sent') {
    return (
      <div className="inquiry-confirmation" role="status" tabIndex={-1} ref={confirmationRef}>
        <span className="inquiry-confirmation__icon inquiry-confirmation__icon--success">
          <CheckCircle2 size={24} aria-hidden="true" />
        </span>
        <div>
          <h3>Enquiry sent</h3>
          <p>
            Thanks{status.name ? `, ${status.name}` : ''}. Your enquiry has reached Khatri Solutions. Reply time: {site.responseTime}.
          </p>
        </div>

        <dl className="inquiry-summary">
          <div>
            <dt>Service</dt>
            <dd>{status.service}</dd>
          </div>
          <div>
            <dt>Preferred contact</dt>
            <dd>{values.contactMethod}</dd>
          </div>
        </dl>

        <div className="btn-row">
          <Button type="button" variant="outline" onClick={resetForm} iconRight={ArrowRight}>
            Send another enquiry
          </Button>
          <Button to="/work" variant="outline">
            See the work
          </Button>
        </div>
      </div>
    )
  }

  if (status?.type === 'handoff') {
    const isWhatsApp = status.mode === 'whatsapp'
    return (
      <div className="inquiry-confirmation inquiry-confirmation--pending" role="status" tabIndex={-1} ref={confirmationRef}>
        <span className="inquiry-confirmation__icon">
          {isWhatsApp ? <WhatsAppIcon size={24} /> : <Send size={23} aria-hidden="true" />}
        </span>
        <div>
          <h3>{isWhatsApp ? 'WhatsApp draft ready' : 'Email draft ready'}</h3>
          <p>
            Nothing has been sent yet. Your answers are prefilled in {isWhatsApp ? 'WhatsApp' : 'your email app'} — open the
            draft and tap send there to deliver it.
          </p>
        </div>

        <dl className="inquiry-summary">
          <div>
            <dt>Service</dt>
            <dd>{status.service}</dd>
          </div>
          <div>
            <dt>Preferred contact</dt>
            <dd>{values.contactMethod}</dd>
          </div>
        </dl>

        <div className="btn-row">
          {isWhatsApp && handoffWhatsApp ? (
            <Button href={handoffWhatsApp} variant="primary" icon={WhatsAppIcon}>
              Open WhatsApp again
            </Button>
          ) : null}
          {!isWhatsApp && handoffMail ? (
            <Button href={handoffMail} variant="primary" icon={Send}>
              Open email again
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={editAfterHandoff}>
            Edit my details
          </Button>
        </div>

        {isWhatsApp && handoffMail ? (
          <p className="tiny muted">
            WhatsApp did not open?{' '}
            <a href={handoffMail} className="link-inline">
              Send the same details by email
            </a>
            .
          </p>
        ) : null}
        {!isWhatsApp && handoffWhatsApp ? (
          <p className="tiny muted">
            Email app did not open?{' '}
            <a href={handoffWhatsApp} className="link-inline" target="_blank" rel="noopener noreferrer">
              Send the same details on WhatsApp
            </a>
            .
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <form className="form inquiry" onSubmit={handleSubmit} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="inquiry-website">Company website</label>
        <input
          id="inquiry-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={update('website')}
        />
      </div>

      <ol className="inquiry-steps" aria-label="Inquiry progress">
        {STEPS.map((item) => {
          const state = step === item.number ? 'current' : step > item.number ? 'done' : 'todo'
          return (
            <li
              key={item.number}
              className={`inquiry-steps__item inquiry-steps__item--${state}`}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span className="inquiry-steps__num" aria-hidden="true">
                {state === 'done' ? <Check size={14} strokeWidth={3} /> : item.number}
              </span>
              <span className="inquiry-steps__label">{item.title}</span>
            </li>
          )
        })}
      </ol>

      <p className="inquiry-progress" aria-live="polite">
        Step {step} of {STEPS.length}: {stepTitle}
      </p>

      <h3 className="inquiry-step-title" tabIndex={-1} ref={stepHeadingRef}>
        {step === 1 ? 'Tell us what you need' : step === 2 ? 'How should we reply?' : 'The last details'}
      </h3>

      {step === 1 ? (
        <div className="inquiry-step">
          <Field
            label="Service required"
            htmlFor="inquiry-service"
            error={errors.service}
            hint="Choose the closest option. You can change it later if we agree on something different."
          >
            <select className="select" name="service" value={values.service} onChange={update('service')} required>
              <option value="">Select a service</option>
              {inquiryServiceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          {values.service ? (
            <p className="inquiry-selected">
              <Sparkles size={15} aria-hidden="true" />
              <span>
                <strong>{values.service}</strong> selected. Keep it, or change it above.
              </span>
            </p>
          ) : null}

          {kind === 'website' ? (
            <fieldset className="inquiry-subpanel">
              <legend>Website details</legend>
              <div className="form__row">
                <Field label="Business type" htmlFor="inquiry-businessType" error={errors.businessType}>
                  <select
                    className="select"
                    name="businessType"
                    value={values.businessType}
                    onChange={update('businessType')}
                    required
                  >
                    <option value="">Select one</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Pages required" htmlFor="inquiry-pages" error={errors.pages}>
                  <select className="select" name="pages" value={values.pages} onChange={update('pages')} required>
                    <option value="">Select one</option>
                    {pagesOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field
                label="Existing website"
                htmlFor="inquiry-existingWebsite"
                optional
                error={errors.existingWebsite}
                hint="Leave blank if there is no current website."
              >
                <input
                  className="input"
                  type="url"
                  name="existingWebsite"
                  inputMode="url"
                  placeholder="https://example.com"
                  value={values.existingWebsite}
                  onChange={update('existingWebsite')}
                />
              </Field>
            </fieldset>
          ) : null}

          {kind === 'ecommerce' ? (
            <fieldset className="inquiry-subpanel">
              <legend>Store requirements</legend>
              <Field label="Estimated product count" htmlFor="inquiry-productCount" error={errors.productCount}>
                <select
                  className="select"
                  name="productCount"
                  value={values.productCount}
                  onChange={update('productCount')}
                  required
                >
                  <option value="">Select one</option>
                  {productCountOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Payments and delivery"
                htmlFor="inquiry-commerceNeeds"
                error={errors.commerceNeeds}
                hint="Which payment methods should be supported, and where do you deliver? Mention cash on delivery, pickup or shipping areas if relevant."
              >
                <textarea
                  className="textarea"
                  name="commerceNeeds"
                  rows={4}
                  value={values.commerceNeeds}
                  onChange={update('commerceNeeds')}
                  required
                />
              </Field>
            </fieldset>
          ) : null}

          {kind === 'application' ? (
            <fieldset className="inquiry-subpanel">
              <legend>Application requirements</legend>
              <Field
                label="Problem to solve"
                htmlFor="inquiry-appProblem"
                error={errors.appProblem}
                hint="What is difficult today, and what should the application make easier?"
              >
                <textarea
                  className="textarea"
                  name="appProblem"
                  rows={4}
                  value={values.appProblem}
                  onChange={update('appProblem')}
                  required
                />
              </Field>

              <Field
                label="User roles"
                htmlFor="inquiry-userRoles"
                error={errors.userRoles}
                hint="For example: owner, front-desk staff, technician, customer."
              >
                <input
                  className="input"
                  type="text"
                  name="userRoles"
                  value={values.userRoles}
                  onChange={update('userRoles')}
                  required
                />
              </Field>

              <Field
                label="Required features"
                htmlFor="inquiry-appFeatures"
                error={errors.appFeatures}
                hint="List the functions you need first. Extras can be added later."
              >
                <textarea
                  className="textarea"
                  name="appFeatures"
                  rows={4}
                  value={values.appFeatures}
                  onChange={update('appFeatures')}
                  required
                />
              </Field>
            </fieldset>
          ) : null}

          {kind === 'automation' ? (
            <fieldset className="inquiry-subpanel">
              <legend>Automation requirements</legend>
              <Field
                label="Task to automate"
                htmlFor="inquiry-automationTask"
                error={errors.automationTask}
                hint="Describe the repetitive task, how often it happens and who does it now."
              >
                <textarea
                  className="textarea"
                  name="automationTask"
                  rows={4}
                  value={values.automationTask}
                  onChange={update('automationTask')}
                  required
                />
              </Field>

              <Field
                label="Tools used today"
                htmlFor="inquiry-currentTools"
                error={errors.currentTools}
                hint="For example: Google Sheets, Gmail, WhatsApp Business, Zoho, Tally. Write “None” if you use paper."
              >
                <input
                  className="input"
                  type="text"
                  name="currentTools"
                  value={values.currentTools}
                  onChange={update('currentTools')}
                  required
                />
              </Field>
            </fieldset>
          ) : null}

          {kind === 'redesign' ? (
            <fieldset className="inquiry-subpanel">
              <legend>Redesign details</legend>
              <Field
                label="Current website"
                htmlFor="inquiry-currentWebsite"
                error={errors.currentWebsite}
                hint="The address of the site you want to improve."
              >
                <input
                  className="input"
                  type="url"
                  name="currentWebsite"
                  inputMode="url"
                  placeholder="https://example.com"
                  value={values.currentWebsite}
                  onChange={update('currentWebsite')}
                  required
                />
              </Field>

              <Field
                label="Desired improvements"
                htmlFor="inquiry-improvements"
                error={errors.improvements}
                hint="What should change? For example: clearer services, better mobile layout, faster loading, a new enquiry form."
              >
                <textarea
                  className="textarea"
                  name="improvements"
                  rows={4}
                  value={values.improvements}
                  onChange={update('improvements')}
                  required
                />
              </Field>
            </fieldset>
          ) : null}

          {kind === 'unsure' ? (
            <fieldset className="inquiry-subpanel">
              <legend>Business and goal</legend>
              <Field label="Business type" htmlFor="inquiry-businessType" error={errors.businessType}>
                <select
                  className="select"
                  name="businessType"
                  value={values.businessType}
                  onChange={update('businessType')}
                  required
                >
                  <option value="">Select one</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Primary goal"
                htmlFor="inquiry-primaryGoal"
                error={errors.primaryGoal}
                hint="What should the website achieve first? Enquiries, bookings, sales, credibility or something else?"
              >
                <textarea
                  className="textarea"
                  name="primaryGoal"
                  rows={3}
                  value={values.primaryGoal}
                  onChange={update('primaryGoal')}
                  required
                />
              </Field>
            </fieldset>
          ) : null}

          <div className="form__row">
            <Field
              label="Approximate budget"
              htmlFor="inquiry-budget"
              error={errors.budget}
              hint="An honest range helps us suggest something realistic."
            >
              <select className="select" name="budget" value={values.budget} onChange={update('budget')} required>
                <option value="">Select a range</option>
                {budgetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Desired timeline" htmlFor="inquiry-timeline" error={errors.timeline}>
              <select className="select" name="timeline" value={values.timeline} onChange={update('timeline')} required>
                <option value="">Select one</option>
                {timelineOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="inquiry-step">
          <div className="form__row">
            <Field label="Full name" htmlFor="inquiry-name" error={errors.name}>
              <input
                className="input"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                value={values.name}
                onChange={update('name')}
                required
              />
            </Field>

            <Field
              label="Business name"
              htmlFor="inquiry-business"
              optional
              error={errors.business}
              hint="Leave blank if you are an individual."
            >
              <input
                className="input"
                type="text"
                name="business"
                autoComplete="organization"
                placeholder="Clinic, café, store…"
                value={values.business}
                onChange={update('business')}
              />
            </Field>
          </div>

          <div className="form__row">
            <Field
              label="Email"
              htmlFor="inquiry-email"
              optional
              error={errors.email}
              hint="Add an email or a phone number — at least one is required."
            >
              <input
                className="input"
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@business.com"
                value={values.email}
                onChange={update('email')}
              />
            </Field>

            <Field
              label="Phone / WhatsApp"
              htmlFor="inquiry-phone"
              optional
              error={errors.phone}
              hint="Include the country code if you are outside India."
            >
              <input
                className="input"
                type="tel"
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                value={values.phone}
                onChange={update('phone')}
              />
            </Field>
          </div>

          <Field
            label="Preferred contact method"
            htmlFor="inquiry-contactMethod"
            error={errors.contactMethod}
            hint="Choose how we should reply. We need the matching email address or phone number above."
          >
            <select
              className="select"
              name="contactMethod"
              value={values.contactMethod}
              onChange={update('contactMethod')}
              required
            >
              <option value="">Select one</option>
              {contactMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </Field>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="inquiry-step">
          <Field
            label="Brief project description"
            htmlFor="inquiry-description"
            error={errors.description}
            hint="What does the business do, what should this project achieve, and is any content ready? Existing links or references are welcome."
          >
            <textarea
              className="textarea"
              name="description"
              rows={6}
              maxLength={2000}
              placeholder="We run a two-chair dental clinic in Surat. We need a simple site with services, timings and an appointment request form…"
              value={values.description}
              onChange={update('description')}
              required
            />
          </Field>

          <div className="inquiry-review">
            <h4>Your selection</h4>
            <dl className="inquiry-summary">
              <div>
                <dt>Service</dt>
                <dd>{values.service || 'Not selected'}</dd>
              </div>
              <div>
                <dt>Budget</dt>
                <dd>{values.budget || 'Not selected'}</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>{values.timeline || 'Not selected'}</dd>
              </div>
              <div>
                <dt>Preferred contact</dt>
                <dd>{values.contactMethod}</dd>
              </div>
            </dl>
          </div>

          <label className="checkbox" htmlFor="inquiry-consent">
            <input
              id="inquiry-consent"
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={update('consent')}
              aria-invalid={errors.consent ? 'true' : undefined}
              aria-describedby={errors.consent ? 'inquiry-consent-error' : undefined}
              required
            />
            <span>
              I agree to the{' '}
              <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                privacy notice
              </Link>{' '}
              and allow Khatri Solutions to contact me about this enquiry. My details will not be sold or shared for marketing.
            </span>
          </label>
          {errors.consent ? (
            <p className="field__error" id="inquiry-consent-error" role="alert">
              <AlertTriangle size={13} aria-hidden="true" />
              {errors.consent}
            </p>
          ) : null}
        </div>
      ) : null}

      {status?.type === 'error' ? (
        <div className="form__status form__status--error" role="alert">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <strong>Your enquiry was not sent</strong>
            {status.message}
            {site.contact.email ? (
              <>
                {' '}
                You can still email <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="inquiry-actions">
        {step > 1 ? (
          <Button type="button" variant="outline" icon={ArrowLeft} onClick={handleBack} disabled={submitting}>
            Back
          </Button>
        ) : null}

        {step < STEPS.length ? (
          <Button type="button" variant="primary" iconRight={ArrowRight} onClick={handleNext}>
            Continue
          </Button>
        ) : (
          <Button type="submit" variant="primary" disabled={submitting} icon={submitting ? Loader2 : Send}>
            {submitting ? 'Preparing…' : submitLabel}
          </Button>
        )}
      </div>

      {!endpointConfigured && step === 3 ? (
        <p className="inquiry-handoff-note">
          <Info size={14} aria-hidden="true" />
          This opens a prefilled draft in {handoffChannelName}. Nothing is sent until you press send there.
        </p>
      ) : null}

      <div className="form__aside">
        <p>
          <ShieldCheck size={14} aria-hidden="true" />
          {endpointConfigured
            ? `Your details are sent to ${site.contact.email} and used only to reply to this enquiry.`
            : `This form prepares a message in ${handoffChannelName}. Nothing is stored on this website.`}
        </p>
        <p>
          <Info size={14} aria-hidden="true" />
          {site.responseTime}. No newsletter, no spam, no sharing your details.
        </p>
      </div>
    </form>
  )
}
