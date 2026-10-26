import { BadgeCheck, Info, MessageSquarePlus, ShieldCheck } from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'
import SectionHeading from '../components/SectionHeading'
import { useSeo } from '../hooks/useSeo'
import { reviews, site } from '../config/site'
import { endpointConfigured } from '../lib/inquiry'
import { channelName } from '../lib/contact'

export default function Reviews() {
  useSeo({
    title: 'Reviews',
    path: '/reviews',
    description:
      'Genuine, verified client reviews of Khatri Solutions projects. This is a new studio, so the page starts empty rather than with invented testimonials.',
  })

  const verified = reviews.filter((review) => review.verified)
  const average =
    verified.length > 0 ? (verified.reduce((total, review) => total + review.rating, 0) / verified.length).toFixed(1) : null

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <p className="eyebrow">Reviews</p>
          <h1>
            Real feedback, <span className="accent">published carefully</span>
          </h1>
          <p className="lede">
            Every review on this page comes from a real project and is checked before it is published. There are no invented
            names, stock photos or filler testimonials — even if that means an empty page for now.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container review-layout">
          <div>
            <SectionHeading
              eyebrow="What clients say"
              title={reviews.length > 0 ? `${reviews.length} published review${reviews.length === 1 ? '' : 's'}` : 'The honest starting point'}
            />

            {reviews.length === 0 ? (
              <EmptyState
                icon={MessageSquarePlus}
                title="We’re building our portfolio."
                action={
                  <Button to="/work" variant="outline" size="sm">
                    Explore the work
                  </Button>
                }
              >
                Explore our demo projects and be among our first clients. No client review has been published yet — once a
                project is delivered and the client agrees, their words will appear here, verified and unedited.
              </EmptyState>
            ) : (
              <div className="review-summary">
                {average ? (
                  <div className="notice notice--accent">
                    <BadgeCheck size={16} aria-hidden="true" />
                    <span>
                      <strong>{average} out of 5</strong> across {verified.length} verified review
                      {verified.length === 1 ? '' : 's'}. Unverified submissions are never published.
                    </span>
                  </div>
                ) : null}
                <div className="grid grid--2">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}

            <div className="panel panel--muted" style={{ marginTop: '1.5rem' }}>
              <h3>How reviews work here</h3>
              <ul className="tick-list" style={{ marginTop: '0.9rem' }}>
                <li>
                  <ShieldCheck size={14} strokeWidth={2.4} aria-hidden="true" />
                  <span>A review form submission is a request to publish, not an automatic post.</span>
                </li>
                <li>
                  <ShieldCheck size={14} strokeWidth={2.4} aria-hidden="true" />
                  <span>We confirm the project and the reviewer before anything appears on this page.</span>
                </li>
                <li>
                  <ShieldCheck size={14} strokeWidth={2.4} aria-hidden="true" />
                  <span>Only reviews marked “Verified” are confirmed client feedback.</span>
                </li>
                <li>
                  <ShieldCheck size={14} strokeWidth={2.4} aria-hidden="true" />
                  <span>Negative feedback is not deleted — if a project went badly, that belongs in the record too.</span>
                </li>
              </ul>
            </div>

            <div className="notice" style={{ marginTop: '1rem' }}>
              <Info size={15} aria-hidden="true" />
              <span>
                Reviews are stored and moderated by hand. {endpointConfigured
                  ? 'Submissions arrive in the studio inbox and are published from the central content file only after verification.'
                  : `Because there is no review database on this site, the form hands your review to ${channelName()} — nothing is stored here.`}
              </span>
            </div>
          </div>

          <div className="panel">
            <h2 style={{ fontSize: '1.25rem' }}>Review an existing project</h2>
            <p className="small muted" style={{ marginTop: '0.4rem', marginBottom: '1.5rem' }}>
              Worked with Khatri Solutions? Share what it was like. Please only review a project that actually happened.
            </p>

            <div className="notice notice--accent" style={{ marginBottom: '1.5rem' }}>
              <ShieldCheck size={15} aria-hidden="true" />
              <span>
                Every review is checked before publishing. A submission will not appear immediately, and only verified feedback
                is marked as such.
              </span>
            </div>

            <ReviewForm />

            <p className="tiny muted" style={{ marginTop: '1.25rem' }}>
              Questions about a review? Email <a href={`mailto:${site.contact.email}`} style={{ textDecoration: 'underline' }}>{site.contact.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
