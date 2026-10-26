export default function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="empty-state">
      {Icon ? (
        <span className="empty-state__icon">
          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
        </span>
      ) : null}
      <h3>{title}</h3>
      {children ? <p>{children}</p> : null}
      {action}
    </div>
  )
}
