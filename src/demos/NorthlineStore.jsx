import { useMemo, useState } from 'react'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'

const products = [
  { id: 'lamp', name: 'Pleated paper lamp', category: 'Lighting', price: 2450, art: 'nl-art--1' },
  { id: 'throw', name: 'Handloom throw', category: 'Textiles', price: 1890, art: 'nl-art--2' },
  { id: 'mug', name: 'Stoneware mug, set of 2', category: 'Ceramics', price: 1150, art: 'nl-art--3' },
  { id: 'stool', name: 'Teak side stool', category: 'Furniture', price: 5400, art: 'nl-art--4' },
  { id: 'cushion', name: 'Block-print cushion', category: 'Textiles', price: 890, art: 'nl-art--5' },
  { id: 'bowl', name: 'Wide serving bowl', category: 'Ceramics', price: 1320, art: 'nl-art--6' },
  { id: 'sconce', name: 'Brass wall sconce', category: 'Lighting', price: 3100, art: 'nl-art--7' },
  { id: 'tray', name: 'Oak catch-all tray', category: 'Furniture', price: 1450, art: 'nl-art--8' },
]

const categories = ['All', ...new Set(products.map((product) => product.category))]
const format = (value) => `₹${value.toLocaleString('en-IN')}`

export default function NorthlineStore() {
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [notice, setNotice] = useState('')

  const visible = useMemo(
    () => (category === 'All' ? products : products.filter((product) => product.category === category)),
    [category],
  )

  const lines = cart.map((line) => ({ ...line, product: products.find((product) => product.id === line.id) }))
  const count = cart.reduce((total, line) => total + line.qty, 0)
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.qty, 0)

  const add = (product) => {
    setCart((current) => {
      const existing = current.find((line) => line.id === product.id)
      if (existing) {
        return current.map((line) => (line.id === product.id ? { ...line, qty: line.qty + 1 } : line))
      }
      return [...current, { id: product.id, qty: 1 }]
    })
    setNotice(`${product.name} added to cart.`)
  }

  const changeQty = (id, delta) => {
    setCart((current) =>
      current
        .map((line) => (line.id === id ? { ...line, qty: line.qty + delta } : line))
        .filter((line) => line.qty > 0),
    )
  }

  return (
    <>
      <div className="nl-announce">Free delivery across India on orders over ₹2,000</div>

      <header className="nl-header">
        <div className="d-shell nl-header__inner">
          <a href="#top" className="nl-brand">
            Northline
          </a>
          <nav className="nl-nav" aria-label="Northline">
            <a href="#shop">Shop</a>
            <a href="#story">Our story</a>
            <a href="#cart" className="nl-cartlink">
              <ShoppingBag size={16} aria-hidden="true" />
              Cart
              <span className="nl-cartcount" aria-hidden="true">
                {count}
              </span>
              <span className="sr-only">{count} items in cart</span>
            </a>
          </nav>
        </div>
      </header>

      <section className="nl-hero" id="top">
        <div className="d-shell nl-hero__inner">
          <div>
            <p className="d-eyebrow">Home &amp; lifestyle · Made in India</p>
            <h1>
              Fewer things,
              <br />
              <em>better made.</em>
            </h1>
            <p className="nl-hero__lede">
              Lighting, textiles, ceramics and small furniture from workshops we visit ourselves. Small batches, honest
              materials, no seasonal churn.
            </p>
            <a href="#shop" className="d-btn">
              Shop the collection
            </a>
          </div>
          <div className="nl-hero__art" aria-hidden="true">
            <span className="nl-hero__shelf" />
            <span className="nl-hero__vase" />
            <span className="nl-hero__book" />
            <span className="nl-hero__ball" />
          </div>
        </div>
      </section>

      <section className="nl-shop" id="shop">
        <div className="d-shell">
          <div className="nl-shop__head">
            <h2>The collection</h2>
            <p>{visible.length} products · prices include GST</p>
          </div>

          <div className="nl-filters" role="group" aria-label="Filter products">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`nl-filter ${category === item ? 'is-active' : ''}`.trim()}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="nl-grid">
            {visible.map((product) => (
              <article key={product.id} className="nl-card">
                <div className={`nl-card__art ${product.art}`} aria-hidden="true">
                  <span className="nl-card__shape" />
                </div>
                <div className="nl-card__body">
                  <p className="nl-card__cat">{product.category}</p>
                  <h3>{product.name}</h3>
                  <div className="nl-card__foot">
                    <span className="nl-card__price">{format(product.price)}</span>
                    <button type="button" className="nl-add" onClick={() => add(product)}>
                      Add to cart
                      <span className="sr-only"> — {product.name}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {notice}
          </p>
        </div>
      </section>

      <section className="nl-story" id="story">
        <div className="d-shell nl-story__grid">
          <div>
            <p className="d-eyebrow">Our story</p>
            <h2>We buy from the workshop, not the warehouse.</h2>
            <p>
              Northline started with one potter in Jaipur and a suitcase of mugs. Today we work with eleven small
              workshops, all paid directly, all named on the product page. If a piece is out of stock, it is because the
              maker has not finished the next batch — not because a container is late.
            </p>
          </div>
          <ul className="nl-badges">
            <li>
              <strong>11</strong>
              <span>workshops, paid directly</span>
            </li>
            <li>
              <strong>48h</strong>
              <span>dispatch on in-stock items</span>
            </li>
            <li>
              <strong>7 days</strong>
              <span>returns, no questions</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="nl-cart" id="cart">
        <div className="d-shell">
          <div className="nl-cart__head">
            <h2>Your cart</h2>
            <p>
              {count} {count === 1 ? 'item' : 'items'}
            </p>
          </div>

          {lines.length === 0 ? (
            <div className="nl-cart__empty">
              <ShoppingBag size={22} aria-hidden="true" />
              <p>Your cart is empty. Add something from the collection above.</p>
            </div>
          ) : (
            <div className="nl-cart__grid">
              <ul className="nl-lines">
                {lines.map((line) => (
                  <li key={line.id} className="nl-line">
                    <div className={`nl-line__art ${line.product.art}`} aria-hidden="true" />
                    <div className="nl-line__info">
                      <p className="nl-line__name">{line.product.name}</p>
                      <p className="nl-line__meta">{format(line.product.price)} each</p>
                    </div>
                    <div className="nl-qty">
                      <button
                        type="button"
                        onClick={() => changeQty(line.id, -1)}
                        aria-label={`Remove one ${line.product.name}`}
                      >
                        <Minus size={13} aria-hidden="true" />
                      </button>
                      <span aria-live="polite">{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(line.id, 1)}
                        aria-label={`Add one more ${line.product.name}`}
                      >
                        <Plus size={13} aria-hidden="true" />
                      </button>
                    </div>
                    <span className="nl-line__total">{format(line.product.price * line.qty)}</span>
                    <button
                      type="button"
                      className="nl-line__remove"
                      onClick={() => setCart((current) => current.filter((item) => item.id !== line.id))}
                      aria-label={`Remove ${line.product.name} from cart`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>

              <aside className="nl-summary">
                <h3>Order summary</h3>
                <div className="nl-summary__row">
                  <span>Subtotal</span>
                  <span>{format(subtotal)}</span>
                </div>
                <div className="nl-summary__row">
                  <span>Delivery</span>
                  <span>{subtotal >= 2000 ? 'Free' : format(120)}</span>
                </div>
                <div className="nl-summary__row nl-summary__row--total">
                  <span>Total</span>
                  <span>{format(subtotal + (subtotal >= 2000 ? 0 : 120))}</span>
                </div>
                <button type="button" className="d-btn" disabled aria-describedby="nl-checkout-note">
                  Checkout
                </button>
                <p className="nl-summary__note" id="nl-checkout-note">
                  Demo checkout is disabled — no payment is taken and no order is placed.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
