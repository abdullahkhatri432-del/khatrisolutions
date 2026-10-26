import { ArrowRight, Check } from 'lucide-react'
import Button from './Button'
import { site } from '../config/site'

export default function CTASection({
  eyebrow = 'Next step',
  title = 'Tell us what you are trying to build.',
  body = 'Share your requirements and budget. You will get an honest answer about what is realistic, what it will cost, and how long it will take.',
  primaryLabel = 'Discuss your project',
  primaryTo = '/contact',
  secondaryLabel = 'See starting prices',
  secondaryTo = '/pricing',
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{body}</p>
          <div className="btn-row">
            <Button to={primaryTo} variant="primary" iconRight={ArrowRight}>
              {primaryLabel}
            </Button>
            <Button to={secondaryTo} variant="ghostDark">
              {secondaryLabel}
            </Button>
          </div>
          <div className="cta-band__meta">
            <span>
              <Check size={14} aria-hidden="true" />{site.responseTime}
            </span>
            <span>
              <Check size={14} aria-hidden="true" />
              No obligation, no pressure
            </span>
            <span>
              <Check size={14} aria-hidden="true" />
              Written scope before payment
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
