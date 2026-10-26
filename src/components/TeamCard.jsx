import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, UserRound } from 'lucide-react'

export default function TeamCard({ member }) {
  const pending = Boolean(member.placeholder) || !member.name
  const contact = member.contact && member.contact.href ? member.contact : null

  return (
    <article className={`team-card ${pending ? 'team-card--pending' : ''}`.trim()}>
      <div className="team-card__head">
        <div className="team-card__avatar">
          {member.photo ? (
            <img src={member.photo} alt={pending ? '' : `${member.name}, ${member.role}`} loading="lazy" decoding="async" />
          ) : pending || !member.initials ? (
            <UserRound size={28} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <span aria-hidden="true">{member.initials}</span>
          )}
        </div>

        <div className="team-card__id">
          <p className="team-card__role">{member.role}</p>
          <h3 className="team-card__name">{pending ? 'Name to be added' : member.name}</h3>
          {pending ? <span className="pill team-card__pill">Profile pending</span> : null}
        </div>
      </div>

      {member.tagline ? <p className="team-card__tagline">{member.tagline}</p> : null}

      {member.intro ? (
        <p className="team-card__intro">{member.intro}</p>
      ) : (
        <p className="team-card__intro team-card__intro--pending">
          {member.placeholderNote || 'Profile details will be added once confirmed.'}
        </p>
      )}

      <div className="team-card__list">
        <p className="team-card__list-title">Responsibilities</p>
        <ul className="tick-list">
          {member.responsibilities.map((item) => (
            <li key={item}>
              <Check size={14} strokeWidth={2.6} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {contact || pending ? (
        <div className="team-card__foot">
          {contact ? (
            /^https?:\/\//i.test(contact.href) ? (
              <a className="link-arrow" href={contact.href} target="_blank" rel="noopener noreferrer">
                {contact.label || 'Contact'}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            ) : (
              <Link className="link-arrow" to={contact.href}>
                {contact.label || 'Contact'}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            )
          ) : (
            <span className="team-card__pending-note">Details shown are placeholders, not published claims.</span>
          )}
        </div>
      ) : null}
    </article>
  )
}
