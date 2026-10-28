import { Link, useSearchParams } from 'react-router-dom'
import { Clock, Mail, MapPin, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react'
import InquiryForm from '../components/InquiryForm'
import WhatsAppIcon from '../components/icons/WhatsAppIcon'
import FAQ from '../components/FAQ'
import SectionHeading from '../components/SectionHeading'
import { useSeo } from '../hooks/useSeo'
import { pageSeo } from '../config/seo'
import { site, faqs, inquiryServiceOptions, serviceAliases } from '../config/site'
import { whatsappLink } from '../lib/contact'

export default function Contact() {
  const [params] = useSearchParams()
  const requested = params.get('service')
  const initialService = inquiryServiceOptions.includes(requested)
    ? requested
    : serviceAliases[requested] || ''
  const whatsapp = whatsappLink()

  useSeo(pageSeo['/contact'])

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>
            Tell us what you need <span className="accent">built</span>
          </h1>
          <p className="lede">
            Fill in the project form and you will get a reply with honest questions, a realistic timeline and a written quote.
            No obligation, no sales call unless you ask for one.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container contact-layout">
          <div className="panel">
            <h2>Project inquiry</h2>
            <p className="small muted" style={{ marginTop: '0.4rem', marginBottom: '1.5rem' }}>
              Three short steps. Fields marked “optional” can be left blank, but we need at least one valid email or phone
              number to reply.
            </p>
            <InquiryForm initialService={initialService} key={initialService} />
          </div>

          <aside className="contact-aside" aria-label="Contact details">
            <a className="contact-method" href={`mailto:${site.contact.email}`}>
              <Mail size={19} aria-hidden="true" />
              <span>
                <strong>Email</strong>
                <span>{site.contact.email}</span>
              </span>
            </a>

            {whatsapp ? (
              <a className="contact-method" href={whatsapp} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={19} />
                <span>
                  <strong>WhatsApp</strong>
                  <span>{site.contact.phoneDisplay || 'Message with your requirement'}</span>
                </span>
              </a>
            ) : null}

            <div className="contact-method" style={{ cursor: 'default' }}>
              <Clock size={19} aria-hidden="true" />
              <span>
                <strong>Response time</strong>
                <span>{site.responseTime}</span>
              </span>
            </div>

            <div className="contact-method" style={{ cursor: 'default' }}>
              <MapPin size={19} aria-hidden="true" />
              <span>
                <strong>Working with</strong>
                <span>Indian small businesses and startups · remote projects welcome</span>
              </span>
            </div>

            <div className="panel panel--muted">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <MessageSquare size={17} aria-hidden="true" />
                What happens next
              </h3>
              <ol className="next-steps" style={{ marginTop: '0.9rem' }}>
                <li>We read your requirement and reply with any missing details.</li>
                <li>You receive a written scope, price and timeline to approve.</li>
                <li>Work starts after approval — not before.</li>
              </ol>
            </div>

            <div className="notice">
              <ShieldCheck size={15} aria-hidden="true" />
              <span>
                Your details are used only to reply to your enquiry. Read the{' '}
                <Link to="/privacy" style={{ textDecoration: 'underline' }}>
                  privacy notice
                </Link>
                .
              </span>
            </div>

            <div className="notice notice--accent">
              <Sparkles size={15} aria-hidden="true" />
              <span>
                Prefer to look around first? Browse the <Link to="/work" style={{ textDecoration: 'underline' }}>portfolio</Link> or
                check <Link to="/pricing" style={{ textDecoration: 'underline' }}>starting prices</Link>.
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--sunk">
        <div className="container container--narrow">
          <SectionHeading eyebrow="Before you send" title="Quick answers" align="center" />
          <FAQ items={faqs.slice(0, 4)} idPrefix="contact-faq" />
        </div>
      </section>
    </>
  )
}
