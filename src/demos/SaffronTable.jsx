import { useState } from 'react'
import { Clock, MapPin, UtensilsCrossed } from 'lucide-react'

const menu = {
  Starters: [
    { name: 'Beetroot & peanut chaat', price: '₹320', note: 'Tamarind, mint, puffed rice' },
    { name: 'Tandoori broccoli', price: '₹380', note: 'Cashew cream, chilli oil' },
    { name: 'Prawn koliwada', price: '₹460', note: 'Semolina crust, lime' },
  ],
  Mains: [
    { name: 'Saffron dal, 6 hours', price: '₹440', note: 'Slow-cooked black lentils, ghee' },
    { name: 'Kolhapuri chicken', price: '₹560', note: 'Dry-roasted spice, jowar roti' },
    { name: 'Paneer pasanda', price: '₹490', note: 'Stuffed paneer, tomato & cashew' },
    { name: 'Coastal fish curry', price: '₹620', note: 'Coconut, kokum, steamed rice' },
  ],
  Desserts: [
    { name: 'Mango shrikhand', price: '₹260', note: 'Alphonso, pistachio' },
    { name: 'Dark chocolate halwa', price: '₹280', note: 'Sea salt, vanilla cream' },
  ],
  Drinks: [
    { name: 'Kokum coolers', price: '₹180', note: 'Kokum, cumin, soda' },
    { name: 'Masala chai', price: '₹120', note: 'Whole spice, jaggery' },
    { name: 'Saffron lassi', price: '₹220', note: 'House yoghurt, cardamom' },
  ],
}

const tabs = Object.keys(menu)

export default function SaffronTable() {
  const [tab, setTab] = useState('Mains')
  const [booking, setBooking] = useState({ date: '', time: '', guests: '2', name: '' })
  const [booked, setBooked] = useState(false)

  const update = (key) => (event) => setBooking((current) => ({ ...current, [key]: event.target.value }))

  const reserve = (event) => {
    event.preventDefault()
    if (!booking.date || !booking.time || !booking.name.trim()) return
    setBooked(true)
  }

  return (
    <>
      <header className="st-header">
        <div className="d-shell st-header__inner">
          <a href="#top" className="st-brand">
            Saffron <span>Table</span>
          </a>
          <nav className="st-nav" aria-label="Saffron Table">
            <a href="#menu">Menu</a>
            <a href="#story">Our kitchen</a>
            <a href="#visit">Find us</a>
            <a href="#reserve" className="st-nav__cta">
              Reserve a table
            </a>
          </nav>
        </div>
      </header>

      <section className="st-hero" id="top">
        <div className="d-shell st-hero__inner">
          <p className="d-eyebrow">Modern Indian · Koregaon Park, Pune</p>
          <h1>
            Slow cooking,
            <br />
            <em>bright spice.</em>
          </h1>
          <p className="st-hero__lede">
            A small dining room built around a big kitchen. Six hours on the dal, a fresh grind every morning, and a menu
            short enough to cook properly.
          </p>
          <div className="st-hero__actions">
            <a href="#reserve" className="d-btn">
              Reserve a table
            </a>
            <a href="#menu" className="d-btn d-btn--ghost">
              See the menu
            </a>
          </div>
          <div className="st-strip" aria-hidden="true">
            <span className="st-strip__plate" />
            <span className="st-strip__plate st-strip__plate--two" />
            <span className="st-strip__plate st-strip__plate--three" />
          </div>
        </div>
      </section>

      <section className="st-menu" id="menu">
        <div className="d-shell">
          <div className="st-menu__head">
            <h2>The menu</h2>
            <p>Prices in INR. Vegetarian dishes marked · kitchen closes 22:30.</p>
          </div>

          <div className="st-tabs" role="tablist" aria-label="Menu sections">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                id={`st-tab-${item}`}
                aria-selected={tab === item}
                aria-controls={`st-panel-${item}`}
                className={`st-tab ${tab === item ? 'is-active' : ''}`.trim()}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="st-dishes" role="tabpanel" id={`st-panel-${tab}`} aria-labelledby={`st-tab-${tab}`}>
            {menu[tab].map((dish) => (
              <article key={dish.name} className="st-dish">
                <div>
                  <h3>{dish.name}</h3>
                  <p>{dish.note}</p>
                </div>
                <span className="st-dish__price">{dish.price}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="st-story" id="story">
        <div className="d-shell st-story__grid">
          <div className="st-story__art" aria-hidden="true">
            <span className="st-story__arc" />
            <UtensilsCrossed size={40} />
          </div>
          <div>
            <p className="d-eyebrow">Our kitchen</p>
            <h2>One menu, cooked twice a day.</h2>
            <p>
              We cook in small batches for lunch and again for dinner. Nothing is held over. The spice mixes are ground in
              the kitchen each morning, and the dal goes on the fire before the doors open.
            </p>
            <p className="st-story__note">Ask about the chef’s tasting menu — four courses, seasonal, ₹1,450 per person.</p>
          </div>
        </div>
      </section>

      <section className="st-reserve" id="reserve">
        <div className="d-shell st-reserve__grid">
          <div>
            <p className="d-eyebrow">Reservations</p>
            <h2>Book a table.</h2>
            <p className="st-reserve__lede">
              We hold tables for 15 minutes. For parties over six, call the restaurant directly.
            </p>
            <div className="st-visit" id="visit">
              <p>
                <MapPin size={15} aria-hidden="true" />
                Lane 7, Koregaon Park, Pune
              </p>
              <p>
                <Clock size={15} aria-hidden="true" />
                Tue–Sun · 12:00–15:00, 19:00–22:30
              </p>
            </div>
          </div>

          {booked ? (
            <div className="st-confirm" role="status">
              <h3>Table request received — demo only</h3>
              <p>
                {booking.guests} guests on {booking.date} at {booking.time}. In a live site this would reach the
                restaurant’s reservation inbox. <strong>Nothing has been sent from this demo.</strong>
              </p>
              <button type="button" className="d-btn d-btn--ghost" onClick={() => setBooked(false)}>
                Make another request
              </button>
            </div>
          ) : (
            <form className="st-form" onSubmit={reserve}>
              <div className="st-field">
                <label htmlFor="st-name">Name</label>
                <input id="st-name" value={booking.name} onChange={update('name')} autoComplete="name" required />
              </div>
              <div className="st-field">
                <label htmlFor="st-date">Date</label>
                <input id="st-date" type="date" value={booking.date} onChange={update('date')} required />
              </div>
              <div className="st-field">
                <label htmlFor="st-time">Time</label>
                <select id="st-time" value={booking.time} onChange={update('time')} required>
                  <option value="">Select</option>
                  <option>12:30</option>
                  <option>13:00</option>
                  <option>19:30</option>
                  <option>20:00</option>
                  <option>21:00</option>
                </select>
              </div>
              <div className="st-field">
                <label htmlFor="st-guests">Guests</label>
                <select id="st-guests" value={booking.guests} onChange={update('guests')}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                </select>
              </div>
              <button type="submit" className="d-btn">
                Request table
              </button>
              <p className="st-form__note">Demo form — nothing is sent or stored.</p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
