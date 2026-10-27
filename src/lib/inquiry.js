import { site } from '../config/site'
import { mailtoLink, whatsappLink } from './contact'

export const endpointConfigured = Boolean(site.formEndpoint)

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

/**
 * Google Apps Script Web Apps only accept "simple" CORS requests, so the body
 * is URL-encoded with a single `payload` field holding the JSON string. Sending
 * application/json would trigger a preflight the script does not answer.
 *
 * The script replies with JSON, e.g. {"ok":true,"lead_id":"..."} or
 * {"ok":false,"error":"..."}. Success is only reported when ok is true.
 */
async function postToEndpoint(payload) {
  const body = new URLSearchParams()
  body.set('payload', JSON.stringify(payload))

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
  const timer = controller ? setTimeout(() => controller.abort(), 20000) : null

  try {
    const response = await fetch(site.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: body.toString(),
      signal: controller ? controller.signal : undefined,
    })

    if (!response.ok) {
      throw new Error(`The form service responded with ${response.status}.`)
    }

    const raw = await response.text()
    let result = null
    try {
      result = raw ? JSON.parse(raw) : null
    } catch {
      throw new Error('The form service sent an unexpected response. Please try again or use WhatsApp or email.')
    }

    if (!result || result.ok !== true) {
      const reason = typeof result?.error === 'string' ? result.error.trim() : ''
      throw new Error(
        reason
          ? `The form service rejected the message: ${reason}`
          : 'The form service did not confirm the message was saved. Please try again or use WhatsApp or email.',
      )
    }

    return result
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('The form service took too long to respond. Please try again or use WhatsApp or email.')
    }
    throw error
  } finally {
    if (timer) clearTimeout(timer)
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
      const payload = {
        kind,
        ...values,
        message: text,
        _subject: subject,
        source: typeof window !== 'undefined' ? window.location.href : '',
        _gotcha: '',
      }

      // The Apps Script requires a `service`. Reviews record the reviewer's
      // chosen project type instead, so map it rather than sending a blank.
      if (!payload.service && payload.projectType) {
        payload.service = payload.projectType
      }

      await postToEndpoint(payload)
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
