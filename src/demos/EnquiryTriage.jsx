import { useState } from 'react'
import { ArrowRight, Copy, Sparkles, Wand2 } from 'lucide-react'

const examples = [
  'Hi, I need a website for my dental clinic. What would it cost and how soon can you start?',
  'URGENT: the enquiry form on our site stopped working yesterday and we are losing leads.',
  'We run a small chain of cafés and would like to partner with you on three new sites.',
]

const rules = [
  {
    intent: 'Booking or appointment',
    words: ['book', 'appointment', 'slot', 'schedule', 'available', 'consult', 'meeting', 'call'],
    reply:
      'Thanks for reaching out — happy to find a time. Could you share two slots that work for you this week, and a sentence about what you need built? I will confirm one and send a short agenda before we speak.',
    action: 'Offer two consultation slots and ask for project context.',
  },
  {
    intent: 'Pricing question',
    words: ['price', 'pricing', 'cost', 'quote', 'budget', 'charge', 'rate', 'how much', 'rupees', '₹'],
    reply:
      'Thanks for the details. Most projects in this range start around the published price for the package that fits, with the final quote set after a short scope conversation. I can send a one-page scope with a fixed price — would you prefer that by email or WhatsApp?',
    action: 'Send the pricing page and ask for page count, features and deadline.',
  },
  {
    intent: 'Support or bug report',
    words: ['not working', 'error', 'issue', 'broken', 'help', 'problem', 'login', 'down', 'bug'],
    reply:
      'Sorry about the trouble — I can look at this today. To reproduce it, could you send the page URL, the device and browser you are using, and a screenshot of what you see? If the site is losing enquiries, I will prioritise it.',
    action: 'Ask for URL, browser, screenshot; treat as priority if leads are affected.',
  },
  {
    intent: 'Complaint',
    words: ['refund', 'angry', 'terrible', 'bad', 'complaint', 'late', 'disappointed', 'unhappy', 'delay'],
    reply:
      'Thank you for telling me directly — I would rather hear it than lose your trust. I will review what happened today and come back with a clear answer and a fix, not an excuse. If a call is easier, I can ring you at a time you choose.',
    action: 'Escalate to a call; reply with a concrete fix and timeline, not a defence.',
  },
  {
    intent: 'Partnership',
    words: ['partner', 'collaborat', 'reseller', 'affiliate', 'bulk', 'agency', 'white label'],
    reply:
      'Thanks for thinking of us. I would like to understand the arrangement before saying yes: how many projects, who owns the client relationship, and what timeline you have in mind. If it fits, I can share a simple collaboration note this week.',
    action: 'Qualify volume, ownership and timeline before committing.',
  },
]

const urgencyWords = ['urgent', 'asap', 'today', 'immediately', 'deadline', 'losing', 'emergency', 'now']

function triage(text) {
  const value = text.toLowerCase()
  let best = null

  for (const rule of rules) {
    const hits = rule.words.filter((word) => value.includes(word)).length
    if (hits > 0 && (!best || hits > best.hits)) best = { ...rule, hits }
  }

  const urgent = urgencyWords.some((word) => value.includes(word))
  const intent = best ? best.intent : 'General enquiry'
  const high = urgent || intent === 'Complaint' || intent === 'Support or bug report'
  const priority = high ? 'High' : intent === 'General enquiry' ? 'Low' : 'Medium'

  return {
    intent,
    priority,
    action: best ? best.action : 'Ask one clarifying question, then route to a human.',
    reply: best
      ? best.reply
      : 'Thanks for getting in touch. Could you tell me a little more about what you need and your timeline? That will let me point you to the right option instead of guessing.',
    signals: best ? best.words.filter((word) => value.includes(word)).slice(0, 4) : [],
    urgent,
  }
}

export default function EnquiryTriage() {
  const [text, setText] = useState(examples[0])
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const run = () => {
    if (!text.trim()) {
      setResult(null)
      return
    }
    setResult(triage(text))
    setCopied(false)
  }

  const copy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.reply)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <header className="tr-header">
        <div className="d-shell tr-header__inner">
          <a href="#top" className="tr-brand">
            <span className="tr-brand__mark" aria-hidden="true">
              <Wand2 size={16} />
            </span>
            Enquiry Triage
          </a>
          <p className="tr-header__tag">A demo of assisted enquiry handling</p>
        </div>
      </header>

      <section className="tr-hero" id="top">
        <div className="d-shell tr-hero__inner">
          <div>
            <p className="d-eyebrow">AI &amp; business automation</p>
            <h1>
              Every enquiry sorted
              <br />
              <em>before you open your inbox.</em>
            </h1>
            <p className="tr-hero__lede">
              This demo sorts an incoming enquiry, sets a priority and drafts a first reply in the tone you would use
              yourself. Edit the message, or load one of the examples, then run it.
            </p>
          </div>
          <div className="tr-badge">
            <Sparkles size={16} aria-hidden="true" />
            <p>
              <strong>Runs in your browser.</strong> Keyword rules, not a live AI service. No message leaves this page.
            </p>
          </div>
        </div>
      </section>

      <section className="tr-work">
        <div className="d-shell tr-grid">
          <div className="tr-card">
            <div className="tr-card__head">
              <h2>Incoming enquiry</h2>
              <span className="tr-chip">{text.trim().length} chars</span>
            </div>

            <label className="sr-only" htmlFor="tr-input">
              Paste an enquiry
            </label>
            <textarea
              id="tr-input"
              className="tr-textarea"
              rows={7}
              value={text}
              onChange={(event) => {
                setText(event.target.value)
                setResult(null)
              }}
              placeholder="Paste an email or WhatsApp message…"
            />

            <div className="tr-examples">
              <span>Try an example:</span>
              {examples.map((example, index) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setText(example)
                    setResult(null)
                  }}
                >
                  {['Pricing', 'Urgent support', 'Partnership'][index]}
                </button>
              ))}
            </div>

            <button type="button" className="d-btn tr-run" onClick={run}>
              <Sparkles size={15} aria-hidden="true" />
              Sort this enquiry
            </button>
          </div>

          <div className="tr-card tr-card--result" aria-live="polite">
            {result ? (
              <>
                <div className="tr-card__head">
                  <h2>Suggested handling</h2>
                  <span className={`tr-priority tr-priority--${result.priority.toLowerCase()}`}>
                    {result.priority} priority
                  </span>
                </div>

                <dl className="tr-facts">
                  <div>
                    <dt>Intent</dt>
                    <dd>{result.intent}</dd>
                  </div>
                  <div>
                    <dt>Next action</dt>
                    <dd>{result.action}</dd>
                  </div>
                  <div>
                    <dt>Signals</dt>
                    <dd>{result.signals.length ? result.signals.join(', ') : 'no strong keywords matched'}</dd>
                  </div>
                </dl>

                <label className="tr-replylabel" htmlFor="tr-reply">
                  Draft reply
                </label>
                <textarea
                  id="tr-reply"
                  className="tr-reply"
                  rows={7}
                  value={result.reply}
                  onChange={(event) => setResult((current) => ({ ...current, reply: event.target.value }))}
                />

                <div className="tr-actions">
                  <button type="button" className="d-btn d-btn--ghost" onClick={copy}>
                    <Copy size={14} aria-hidden="true" />
                    {copied ? 'Copied' : 'Copy reply'}
                  </button>
                  <a href="#top" className="tr-link">
                    Reset
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </>
            ) : (
              <div className="tr-empty">
                <span className="tr-empty__icon" aria-hidden="true">
                  <Sparkles size={22} />
                </span>
                <h2>Nothing sorted yet</h2>
                <p>
                  Run an enquiry and this panel shows the intent, the priority, the next action and a reply you can edit
                  before sending.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="tr-why">
        <div className="d-shell tr-why__grid">
          <div>
            <h2>Why this matters</h2>
            <p>
              A reply that arrives in ten minutes wins more work than a better reply that arrives tomorrow. The point is
              not to let software answer for you — it is to sort, prioritise and draft so a human only has to review.
            </p>
          </div>
          <ul className="tr-list">
            <li>Urgent and complaint messages surface first</li>
            <li>Replies stay in your wording, not a chatbot’s</li>
            <li>Every message still gets a human check</li>
          </ul>
        </div>
      </section>
    </>
  )
}
