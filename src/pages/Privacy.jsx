import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useSeo } from '../hooks/useSeo'
import { site } from '../config/site'
import { endpointConfigured } from '../lib/inquiry'

export default function Privacy() {
  useSeo({
    title: 'Privacy notice',
    path: '/privacy',
    description:
      'How Khatri Solutions handles the information you submit through the project inquiry and review forms, and the choices you have.',
  })

  return (
    <>
      <header className="pagehead">
        <div className="container">
          <p className="eyebrow">Legal</p>
          <h1>Privacy notice</h1>
          <p className="lede">
            Plain language, limited data, no tracking for advertising. Last updated October 2026.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container container--narrow prose">
          <h2>What this notice covers</h2>
          <p>
            This notice explains how {site.name} (“we”, “us”) handles personal information submitted through this website. It
            applies to the project inquiry form, the review form, and direct contact by email or messaging.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>Your name, email address and, if you choose to provide one, your phone or WhatsApp number. At least one contact method is required.</li>
            <li>Your business name and business type, when you share them.</li>
            <li>
              The project details you write: service needed, budget range, timeline, preferred contact method and description.
            </li>
            <li>
              The extra details requested for your selected service, such as page count, product count, payment and delivery
              needs, current tools, user roles, an existing website address or the problem you want to solve.
            </li>
            <li>For reviews: your name, optional business name, project type, rating, review text and permission to publish.</li>
          </ul>
          <p>
            We do not ask for payment details through this website, and we do not want medical, financial or identity documents
            sent through these forms. Please describe your requirement, not your customers’ private data.
          </p>

          <h2>How the forms actually work</h2>
          {endpointConfigured ? (
            <>
              <p>
                When you press the send button, your answers are submitted to this website and delivered to the studio
                inbox by {site.formProvider || 'the form service configured for this site'}, which stores the submission
                on our behalf so we can reply. We keep enquiries only as long as needed to respond and manage the project.
              </p>
              <p>
                The form service also records the page you submitted from and basic request information for spam
                protection. It does not receive anything beyond what you type into the form.
              </p>
            </>
          ) : (
            <p>
              This version of the site has no backend or database. When you press the submit button, your answers are prepared
              as a message in WhatsApp or your email app, and nothing is transmitted to us until you send that message yourself.
              The website itself does not store your submission.
            </p>
          )}
          <p>
            Reviews submitted through the form are treated as requests to publish. They are reviewed manually and only published
            if the project and the reviewer can be confirmed, and only with the permission you give on the form.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            This website does not set advertising cookies and does not run third-party analytics or tracking scripts. Fonts are
            served from the site itself. Your hosting provider may keep standard server logs, such as IP address and request
            time, for security and reliability.
          </p>

          <h2>Third-party services</h2>
          <p>
            If you choose to contact us through WhatsApp or email, that conversation is handled by those providers under their
            own privacy terms. Any external links we add later, such as social media or code hosting, take you to platforms
            with their own policies.
          </p>

          <h2>How long we keep information</h2>
          <p>
            Enquiries that do not become projects are deleted within 12 months. Project records, invoices and published reviews
            are kept for as long as needed for the working relationship and for legal or accounting requirements.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask what information we hold about you, ask for a correction, or ask for it to be deleted. Write to{' '}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> and we will respond within a reasonable time. You can
            also ask for a published review to be removed.
          </p>

          <h2>Children</h2>
          <p>
            This site is intended for business owners and is not directed at children. We do not knowingly collect information
            from anyone under 18.
          </p>

          <h2>Changes</h2>
          <p>
            If the way the site handles data changes — for example when a form service or analytics tool is added — this notice
            will be updated with a new date.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this notice: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
          </p>

          <div className="btn-row" style={{ marginTop: '1.5rem' }}>
            <Button to="/contact" variant="primary">
              Back to contact
            </Button>
            <Link className="link-arrow" to="/">
              Home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
