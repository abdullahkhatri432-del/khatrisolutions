import { site } from '../config/site'
import { mailtoLink, whatsappLink } from './contact'

export const endpointConfigured = Boolean(site.formEndpoint) || site.netlifyForms

const DETAIL_SECTIONS = {
  website: {
    label: 'Website details',
    fields: [
      ['Business type', 'businessType'],
      ['Pages required', 'pages'],
      ['Existing website', 'existingWebsite'],
    ],
  },
  ecommerce: {
    label: 'Store requirements',
    fields: [
      ['Estimated products', 'productCount'],
      ['Payment and delivery', 'commerceNeeds'],
    ],
  },
  application: {
    label: 'Application requirements',
    fields: [
      ['Problem to solve', 'appProblem'],
      ['User roles', 'userRoles'],
      ['Required features', 'appFeatures'],
    ],
  },
  automation: {
    label: 'Automation requirements',
    fields: [
      ['Task to automate', 'automationTask'],
      ['Tools used today', 'currentTools'],
    ],
  },
  redesign: {
    label: 'Redesign details',
    fields: [
      ['Current website', 'currentWebsite'],
      ['Desired improvements', 'improvements'],
    ],
  },
  unsure: {
    label: 'Business and goal',
    fields: [
      ['Business type', 'businessType'],
      ['Primary goal', 'primaryGoal'],
    ],
  },
}

export function isLikelySpam({ honeypot }) {
  return Boolean(honeypot)
}

export function buildInquiryText(values, kind) {
  const section = DETAIL_SECTIONS[kind]
  const conditional = section
    ? [
        '',
        `${section.label}:`,
        ...section.fields
          .filter(([, key]) => String(values[key] ?? '').trim())
          .map(([label, key]) => `${label}: ${String(values[key]).trim()}`),
      ]
    : []

  return [
    'New project inquiry — Khatri Solutions',
    '',
    `Name: ${values.name}`,
    values.business ? `Business: ${values.business}` : null,
    values.email ? `Email: ${values.email}` : null,
    values.phone ? `Phone / WhatsApp: ${values.phone}` : null,
    `Service needed: ${values.service}`,
    `Budget: ${values.budget}`,
    `Timeline: ${values.timeline}`,
    `Preferred contact: ${values.contactMethod}`,
    ...conditional,
    '',
    'Project details:',
    values.description,
  ]
    .filter((line) => line !== null && line !== undefined)
    .join('\n')
}

export function buildReviewText(values) {
  return [
    'Review submission — Khatri Solutions',
    '',
    `Name: ${values.name}`,
    values.business ? `Business: ${values.business}` : null,
    `Project type: ${values.projectType}`,
    `Rating: ${values.rating} / 5`,
    `Publish permission: ${values.permission ? 'Yes' : 'No'}`,
    '',
    'Review:',
    values.quote,
    '',
    'I confirm this review describes a real project. Please verify before publishing.',
  ]
    .filter(Boolean)
    .join('\n')
}

async function postToEndpoint(payload) {
  const response = await fetch(site.formEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`The form service responded with ${response.status}.`)
  }
}

/** Form names must match the hidden static forms in index.html. */
const NETLIFY_FORM_NAMES = {
  'project-inquiry': 'project-inquiry',
  review: 'client-review',
}

/**
 * Netlify Forms requires URL-encoded bodies, not JSON. The hidden static
 * forms in index.html exist so Netlify detects the fields at build time.
 */
async function postToNetlifyForms(kind, payload) {
  const body = new URLSearchParams()
  body.set('form-name', NETLIFY_FORM_NAMES[kind] || NETLIFY_FORM_NAMES['project-inquiry'])

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue
    body.set(key, String(value))
  }

  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`The form service responded with ${response.status}.`)
  }
}

/**
 * Sends a message through the configured endpoint, or hands it to the
 * visitor's WhatsApp / email client when no backend is configured.
 * Never reports success unless something actually happened.
 */
export async function sendMessage({ kind, values, text, subject, spam }) {
  if (spam) {
    return { ok: false, mode: 'blocked', error: 'That submission looks automated. Please refresh and try again.' }
  }

  if (site.formEndpoint) {
    try {
      await postToEndpoint({
        kind,
        ...values,
        message: text,
        _subject: subject,
        source: typeof window !== 'undefined' ? window.location.href : '',
        _gotcha: '',
      })
      return { ok: true, mode: 'endpoint' }
    } catch (error) {
      return { ok: false, mode: 'endpoint', error: error.message }
    }
  }

  if (site.netlifyForms) {
    try {
      await postToNetlifyForms(kind, {
        kind,
        ...values,
        subject,
        message: text,
        website: values?.website || '',
        source: typeof window !== 'undefined' ? window.location.href : '',
      })
      return { ok: true, mode: 'endpoint' }
    } catch (error) {
      return { ok: false, mode: 'endpoint', error: error.message }
    }
  }

  // Respect the visitor's chosen reply channel for the handoff.
  const preferEmail = values?.contactMethod === 'Email'

  const whatsapp = preferEmail ? null : whatsappLink(text)
  if (whatsapp) {
    window.open(whatsapp, '_blank', 'noopener,noreferrer')
    return { ok: true, mode: 'whatsapp' }
  }

  const mail = mailtoLink(subject, text)
  if (mail) {
    window.open(mail, '_blank', 'noopener,noreferrer')
    return { ok: true, mode: 'email' }
  }

  const fallbackWhatsApp = preferEmail ? whatsappLink(text) : null
  if (fallbackWhatsApp) {
    window.open(fallbackWhatsApp, '_blank', 'noopener,noreferrer')
    return { ok: true, mode: 'whatsapp' }
  }

  return {
    ok: false,
    mode: 'none',
    error: 'No contact channel is configured yet. Add a WhatsApp number or email in src/config/site.js.',
  }
}
