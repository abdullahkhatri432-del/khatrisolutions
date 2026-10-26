import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'btn--primary',
  dark: 'btn--dark',
  outline: 'btn--outline',
  light: 'btn--light',
  ghostDark: 'btn--ghost-dark',
}

export default function Button({
  to,
  href,
  variant = 'primary',
  size,
  icon: Icon,
  iconRight: IconRight,
  wide = false,
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', VARIANTS[variant] || VARIANTS.primary, size === 'sm' ? 'btn--sm' : '', wide ? 'btn--wide' : '', className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {Icon ? <Icon size={17} strokeWidth={2.2} aria-hidden="true" /> : null}
      <span>{children}</span>
      {IconRight ? <IconRight size={17} strokeWidth={2.2} aria-hidden="true" /> : null}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    const external = /^https?:\/\//i.test(href)
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  )
}
