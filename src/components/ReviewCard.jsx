import { BadgeCheck } from 'lucide-react'
import Stars from './Stars'

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function ReviewCard({ review }) {
  const date = review.date
    ? new Date(review.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : null

  return (
    <figure className="review-card">
      <Stars rating={review.rating} />
      <blockquote className="review-card__quote">“{review.quote}”</blockquote>
      <figcaption className="review-card__foot">
        <span className="avatar" aria-hidden="true">
          {initials(review.name)}
        </span>
        <span>
          <span className="review-card__name">{review.name}</span>
          <span className="review-card__biz">
            {[review.business, review.projectType, date].filter(Boolean).join(' · ')}
          </span>
        </span>
        {review.verified ? (
          <span className="pill pill--success" style={{ marginLeft: 'auto' }}>
            <BadgeCheck size={13} aria-hidden="true" />
            Verified
          </span>
        ) : null}
      </figcaption>
    </figure>
  )
}
