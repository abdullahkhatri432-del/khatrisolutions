import { useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, Send, ShieldCheck, Star } from 'lucide-react'
import Button from './Button'
import { Field } from './FormControls'
import { site, reviewProjectTypes } from '../config/site'
import { buildReviewText, endpointConfigured, isLikelySpam, sendMessage } from '../lib/inquiry'
import { channelName, mailtoLink } from '../lib/contact'
import { clean, validateReview } from '../lib/validation'

const EMPTY = {
  name: '',
  business: '',
  projectType: '',
  rating: 0,
  quote: '',
  permission: false,
  website: '',
}

const PROJECT_TYPES = reviewProjectTypes

export default function ReviewForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const busy = useRef(false)

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const setRating = (rating) => {
    setValues((current) => ({ ...current, rating }))
    if (errors.rating) setErrors((current) => ({ ...current, rating: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy.current) return

    const nextErrors = validateReview(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus(null)
      const first = Object.keys(nextErrors)[0]
      const el = document.getElementById(first === 'rating' ? 'review-rating-1' : `review-${first}`)
      if (el) el.focus()
      return
    }

    const spam = isLikelySpam({ honeypot: values.website })
    const reviewText = buildReviewText(values)
    busy.current = true
    setSubmitting(true)
    setStatus(null)

    const result = await sendMessage({
      kind: 'review',
      values: {
        name: clean(values.name),
        business: clean(values.business),
        projectType: values.projectType,
        rating: values.rating,
        quote: clean(values.quote),
        permission: values.permission,
      },
      text: reviewText,
      subject: `Review from ${clean(values.name)}`,
      spam,
    })

    setSubmitting(false)
    busy.current = false

    if (result.ok) {
      setStatus({ type: 'success', mode: result.mode, text: reviewText })
      setValues(EMPTY)
      setErrors({})
    } else {
      setStatus({
        type: 'error',
        message: result.error || 'Something went wrong while sending your review.',
      })
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="review-website">Company website</label>
        <input
          id="review-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={update('website')}
        />
      </div>

      <div className="form__row">
        <Field label="Your name" htmlFor="review-name" error={errors.name}>
          <input
            className="input"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Name to show publicly"
            value={values.name}
            onChange={update('name')}
            required
          />
        </Field>

        <Field label="Business name" htmlFor="review-business" optional>
          <input
            className="input"
            type="text"
            name="business"
            autoComplete="organization"
            placeholder="Shown only if you agree"
            value={values.business}
            onChange={update('business')}
          />
        </Field>
      </div>

      <Field label="Project type" htmlFor="review-projectType" error={errors.projectType}>
        <select className="select" name="projectType" value={values.projectType} onChange={update('projectType')} required>
          <option value="">Select the work we did</option>
          {PROJECT_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
        <legend className="field__label" id="review-rating-label" style={{ marginBottom: '0.5rem' }}>
          Your rating
        </legend>
        <div className="rating" role="group" aria-labelledby="review-rating-label" aria-describedby={errors.rating ? 'review-rating-error' : undefined}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              id={`review-rating-${star}`}
              type="button"
              className="rating__star"
              aria-pressed={values.rating === star}
              aria-label={`${star} out of 5`}
              onClick={() => setRating(star)}
            >
              <Star size={17} strokeWidth={1.8} fill={star <= values.rating ? 'currentColor' : 'none'} aria-hidden="true" />
            </button>
          ))}
          <span className="rating__value" aria-live="polite">
            {values.rating ? `${values.rating} / 5` : 'Select 1–5'}
          </span>
        </div>
        {errors.rating ? (
          <p className="field__error" id="review-rating-error" role="alert" style={{ marginTop: '0.45rem' }}>
            <AlertTriangle size={13} aria-hidden="true" />
            {errors.rating}
          </p>
        ) : null}
      </fieldset>

      <Field
        label="Your review"
        htmlFor="review-quote"
        error={errors.quote}
        hint="What was the project, what worked well, and how was the communication? Please be specific and honest."
      >
        <textarea
          className="textarea"
          name="quote"
          rows={6}
          maxLength={1000}
          placeholder="We needed a site for our restaurant before the season started…"
          value={values.quote}
          onChange={update('quote')}
          required
        />
      </Field>

      <label className="checkbox" htmlFor="review-permission">
        <input
          id="review-permission"
          name="permission"
          type="checkbox"
          checked={values.permission}
          onChange={update('permission')}
          aria-invalid={errors.permission ? 'true' : undefined}
          aria-describedby={errors.permission ? 'review-permission-error' : undefined}
          required
        />
        <span>
          I give Khatri Solutions permission to publish this review on the website, with my name and business name as entered above. I
          understand it will be checked before it appears.
        </span>
      </label>
      {errors.permission ? (
        <p className="field__error" id="review-permission-error" role="alert">
          <AlertTriangle size={13} aria-hidden="true" />
          {errors.permission}
        </p>
      ) : null}

      {status?.type === 'success' ? (
        <div className="form__status form__status--success" role="status">
          <CheckCircle2 size={18} aria-hidden="true" />
          <div>
            <strong>{status.mode === 'endpoint' ? 'Review received' : 'Nearly done'}</strong>
            {status.mode === 'endpoint' ? (
              <>
                Thank you. Your review is saved for verification and will not appear publicly until the project is confirmed.
              </>
            ) : status.mode === 'whatsapp' ? (
              <>
                Your review is prefilled in WhatsApp. Tap send there to deliver it. We verify every review before publishing, so
                it will not appear immediately. If WhatsApp did not open,{' '}
                <a href={mailtoLink('Client review', status.text)}>send it by email</a>.
              </>
            ) : (
              <>
                Your email app should have opened with the review filled in. Send that email so we can verify it. It will not
                appear on the site until it has been checked. You can also write to{' '}
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
              </>
            )}
          </div>
        </div>
      ) : null}

      {status?.type === 'error' ? (
        <div className="form__status form__status--error" role="alert">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <strong>Your review was not sent</strong>
            {status.message}
            {site.contact.email ? (
              <>
                {' '}
                You can email it to <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="btn-row">
        <Button type="submit" variant="dark" disabled={submitting} icon={submitting ? Loader2 : Send}>
          {submitting ? 'Sending…' : endpointConfigured ? 'Submit review' : `Send review via ${channelName()}`}
        </Button>
      </div>

      <div className="form__aside">
        <p>
          <ShieldCheck size={14} aria-hidden="true" />
          {endpointConfigured
            ? 'Reviews go to a private inbox first. Only approved reviews are added to this page.'
            : `Submitting prepares a message in ${channelName()}. Nothing is stored on this website until you send it.`}
        </p>
      </div>
    </form>
  )
}
