const slugify = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default function FAQ({ items, idPrefix = 'faq' }) {
  return (
    <div className="faq">
      {items.map((item) => {
        const id = `${idPrefix}-${slugify(item.q)}`
        return (
          <div key={item.q} className="faq__item">
            <h3 className="faq__question" id={id}>
              {item.q}
            </h3>
            <div className="faq__answer" aria-labelledby={id}>
              <p>{item.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
