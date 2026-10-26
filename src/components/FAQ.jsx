export default function FAQ({ items, idPrefix = 'faq' }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details className="faq__item" key={item.q} name={idPrefix}>
          <summary>
            <span>{item.q}</span>
            <span className="faq__icon" aria-hidden="true" />
          </summary>
          <div className="faq__answer">{item.a}</div>
        </details>
      ))}
    </div>
  )
}
