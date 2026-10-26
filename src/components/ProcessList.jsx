export default function ProcessList({ steps }) {
  return (
    <ol className="process">
      {steps.map((item) => (
        <li className="process__item" key={item.step}>
          <span className="process__num" aria-hidden="true">
            {item.step}
          </span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </li>
      ))}
    </ol>
  )
}
