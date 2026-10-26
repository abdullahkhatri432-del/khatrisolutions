import { Mail } from 'lucide-react'
import WhatsAppIcon from './icons/WhatsAppIcon'
import { contactChannel, contactLink, DEFAULT_MESSAGE, mailtoLink } from '../lib/contact'

export default function FloatingContact() {
  const channel = contactChannel()
  if (channel === 'none') return null

  const href = channel === 'whatsapp' ? contactLink(DEFAULT_MESSAGE) : mailtoLink('Project inquiry', DEFAULT_MESSAGE)

  return (
    <a
      className="fab"
      href={href}
      {...(channel === 'whatsapp' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {channel === 'whatsapp' ? <WhatsAppIcon size={19} /> : <Mail size={19} aria-hidden="true" />}
      <span className="fab__label">{channel === 'whatsapp' ? 'WhatsApp' : 'Email us'}</span>
    </a>
  )
}
