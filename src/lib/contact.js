import { site } from '../config/site'

export const DEFAULT_MESSAGE =
  "Hello, I'm interested in your web development services. I'd like to discuss a project for my business."

export function digitsOnly(value) {
  return String(value || '').replace(/[^\d]/g, '')
}

export function whatsappLink(message = DEFAULT_MESSAGE) {
  const number = digitsOnly(site.contact.whatsappNumber)
  if (!number) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function mailtoLink(subject, body) {
  if (!site.contact.email) return null
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString()
  return `mailto:${site.contact.email}${query ? `?${query}` : ''}`
}

/** Best available direct-contact link: WhatsApp, then email. */
export function contactLink(message = DEFAULT_MESSAGE) {
  return whatsappLink(message) || mailtoLink('Project inquiry', message)
}

export function contactChannel() {
  if (digitsOnly(site.contact.whatsappNumber)) return 'whatsapp'
  if (site.contact.email) return 'email'
  return 'none'
}

export function channelName() {
  const channel = contactChannel()
  if (channel === 'whatsapp') return 'WhatsApp'
  if (channel === 'email') return 'email'
  return 'direct message'
}

export const socialLinks = [
  { key: 'instagram', label: 'Instagram', href: site.contact.instagram },
  { key: 'linkedin', label: 'LinkedIn', href: site.contact.linkedin },
  { key: 'github', label: 'GitHub', href: site.contact.github },
].filter((item) => Boolean(item.href))
