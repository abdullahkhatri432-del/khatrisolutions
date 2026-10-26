import { cloneElement } from 'react'
import { AlertCircle } from 'lucide-react'

export function Field({ label, htmlFor, optional = false, hint, error, children, className = '' }) {
  const hintId = hint ? `${htmlFor}-hint` : null
  const errorId = error ? `${htmlFor}-error` : null
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const control = cloneElement(children, {
    id: htmlFor,
    ...(describedBy ? { 'aria-describedby': describedBy } : {}),
    ...(error ? { 'aria-invalid': 'true' } : {}),
  })

  return (
    <div className={`field ${className}`.trim()}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {optional ? <span className="field__optional">optional</span> : null}
      </label>
      {control}
      {hint && !error ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field__error" id={errorId} role="alert">
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
