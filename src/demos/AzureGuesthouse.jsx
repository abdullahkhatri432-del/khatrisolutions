import { useState } from 'react'
import DemoAutomation from './DemoAutomation'

const rooms = [
  { name: 'Sea-view suite', price: 'INR 7,500 / night', note: 'Private balcony, queen bed, morning coffee included.' },
  { name: 'Garden room', price: 'INR 5,200 / night', note: 'Quiet courtyard view, twin beds, garden access.' },
  { name: 'Loft with bath', price: 'INR 6,800 / night', note: 'Open plan, walk-in shower, desk and workspace.' },
]

export default function AzureGuesthouse() {
  const [form, setForm] = useState({ name: '', dates: '', room: rooms[0].name })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.dates.trim()) {
      setError('Add your name and dates so the guesthouse can check the request.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: '#f4efe5', color: '#1d1915' }}>
      <section style={{ padding: 'clamp(3rem,6vw,5rem) 5vw 3rem', background: '#245a66', color: '#fff', borderBottom: '1px solid #14110d' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d7edf0' }}>Boutique Hotel</p>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 400, letterSpacing: '-0.05em', lineHeight: 1.05, margin: '0.75rem 0 1.25rem', color: '#fff' }}>Azure Guesthouse</h1>
        <p style={{ fontSize: '1.05rem', maxWidth: '52ch', lineHeight: 1.65, color: '#e4f1f2' }}>A small stay near the coast with clear room cards, timing and direct enquiry. Availability is confirmed by a person.</p>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderBottom: '1px solid #d8cebd', background: '#fbf7ef' }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Rooms</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1.25rem' }}>
          {rooms.map((room) => (
            <article key={room.name} style={{ padding: '1.25rem', border: '1px solid #d8cebd', background: '#fff' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem' }}>{room.name}</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#245a66', marginBottom: '0.5rem' }}>{room.price}</p>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: '#5c5347' }}>{room.note}</p>
              <button type="button" onClick={() => { setForm((current) => ({ ...current, room: room.name })); document.getElementById('az-enquiry')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ marginTop: '0.9rem', border: 0, background: 'none', padding: 0, color: '#245a66', fontWeight: 800, cursor: 'pointer' }}>Request this room →</button>
            </article>
          ))}
        </div>
      </section>

      <section id="az-enquiry" style={{ padding: '2.5rem 5vw', background: '#e4f1f2', borderBottom: '1px solid #c5dfe2' }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Availability &amp; enquiry</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 26rem' }}>
            <p style={{ lineHeight: 1.65 }}><strong>Next open:</strong> Thursday — 3 nights. Requests are checked against the room calendar and confirmed directly. No payment is taken in this demo.</p>
          </div>
          {sent ? (
            <div role="status" style={{ flex: '1 1 22rem', padding: '1.25rem', border: '1px solid #8ab8bd', background: '#fff', lineHeight: 1.55 }}>
              <strong>Availability request captured — demo only.</strong>
              <p style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>The host would now check the calendar and reply with availability for {form.room}. Nothing was transmitted.</p>
              <button type="button" onClick={() => setSent(false)} style={{ marginTop: '0.7rem', border: 0, background: 'none', color: '#245a66', fontWeight: 800, cursor: 'pointer' }}>Try another request</button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ flex: '1 1 22rem', padding: '1.25rem', border: '1px solid #8ab8bd', background: '#fff', display: 'grid', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Request a stay</h3>
              <label htmlFor="az-room" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Room</label>
              <select id="az-room" value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} style={{ padding: '0.65rem', border: '1px solid #9bbfc3', background: '#fff', fontFamily: 'inherit', fontSize: '0.95rem' }}>{rooms.map((room) => <option key={room.name}>{room.name}</option>)}</select>
              <label htmlFor="az-name" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Name</label>
              <input id="az-name" type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" style={{ padding: '0.65rem', border: '1px solid #9bbfc3', background: '#fff', fontFamily: 'inherit', fontSize: '0.95rem' }} />
              <label htmlFor="az-date" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Dates</label>
              <input id="az-date" type="text" value={form.dates} onChange={(event) => setForm({ ...form, dates: event.target.value })} placeholder="e.g. 12–14 Nov" style={{ padding: '0.65rem', border: '1px solid #9bbfc3', background: '#fff', fontFamily: 'inherit', fontSize: '0.95rem' }} />
              {error ? <p role="alert" style={{ margin: 0, color: '#9b3a21', fontSize: '0.78rem' }}>{error}</p> : null}
              <button type="submit" style={{ padding: '0.85rem', border: 0, background: '#245a66', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>Check availability</button>
            </form>
          )}
        </div>
      </section>

      <DemoAutomation
        problem="Guests send incomplete booking messages and staff spend time asking for dates, room type and contact details again."
        automation="Show room choices, collect the minimum booking context and route one availability-ready request to the host."
        outcome="The host can check the calendar once and reply with a clear yes, no or alternative."
        steps={['Guest chooses a room and dates', 'The request is checked for missing details', 'Host receives a structured enquiry to confirm']}
      />
    </div>
  )
}
