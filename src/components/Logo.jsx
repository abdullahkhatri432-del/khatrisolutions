import { site } from '../config/site'

export default function Logo({ showTag = true }) {
  return (
    <span className="logo">
      <svg className="logo__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect x="0.5" y="0.5" width="31" height="31" rx="2" fill="none" stroke="currentColor" opacity="0.3" />
        <path d="M11 9v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
        <path
          d="M22 9l-7 7 7 7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span>{site.name}</span>
      {showTag ? <span className="logo__tag">Independent web studio</span> : null}
    </span>
  )
}
