import { useState } from 'react'
import DemoAutomation from './DemoAutomation'

const schedule = [
  { id: 'hiit', day: 'Mon', time: '07:00', name: 'HIIT', coach: 'Maya Okonkwo', spots: 4 },
  { id: 'mobility', day: 'Wed', time: '18:30', name: 'Mobility', coach: 'Leo Chen', spots: 7 },
  { id: 'strength', day: 'Sat', time: '09:00', name: 'Strength', coach: 'Aisha Patel', spots: 2 },
]

const inputStyle = {
  padding: '0.75rem',
  border: '3px solid #000',
  background: '#fff',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
}

export default function FitnessStudio() {
  const [selected, setSelected] = useState(schedule[0].id)
  const [form, setForm] = useState({ name: '', email: '' })
  const [booked, setBooked] = useState(false)
  const [error, setError] = useState('')
  const session = schedule.find((item) => item.id === selected)

  const submit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setError('Enter your name and email so the studio can confirm the class.')
      return
    }
    setError('')
    setBooked(true)
  }

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: '#f4efe5', color: '#1d1915' }}>
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 5vw 3rem', background: '#245a50', color: '#fff', borderBottom: '1px solid #14110d' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d9eee6' }}>Fitness &amp; Personal Training</p>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 400, letterSpacing: '-0.05em', lineHeight: 1.05, margin: '0.75rem 0 1.25rem', color: '#fff' }}>Form &amp; Flow Studio</h1>
        <p style={{ fontSize: '1.05rem', maxWidth: '52ch', lineHeight: 1.65, color: '#e4f1eb' }}>Class booking, trainer profiles and a direct enquiry path — built to be used, not just looked at. Every business shown is fictional.</p>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderBottom: '1px solid #d8cebd', background: '#fbf7ef' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 28rem' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Choose a class</h2>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {schedule.map((item) => (
                <button key={item.id} type="button" onClick={() => { setSelected(item.id); setBooked(false) }} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', textAlign: 'left', padding: '0.9rem', border: `1px solid ${selected === item.id ? '#245a50' : '#d8cebd'}`, background: selected === item.id ? '#e4f1eb' : '#fff', color: '#1d1915', fontFamily: 'inherit', cursor: 'pointer' }}>
                  <span><strong>{item.day} — {item.time}</strong><br /><small>{item.name} with {item.coach}</small></span>
                  <span style={{ color: '#245a50', fontWeight: 700 }}>{item.spots} spots</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: '1 1 22rem', padding: '1.25rem', border: '1px solid #c6d7cf', background: '#e4f1eb' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>Request {session.name}</h3>
            <p style={{ fontSize: '0.82rem', color: '#4f665e', marginBottom: '0.9rem' }}>{session.day} at {session.time} · {session.spots} spaces shown</p>
            {booked ? (
              <div role="status" style={{ padding: '1rem', border: '1px solid #79a996', background: '#fff', lineHeight: 1.55 }}>
                <strong>Request captured — demo only.</strong>
                <p style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>In a live studio, this would hold the class and send a confirmation email. Nothing was sent here.</p>
                <button type="button" onClick={() => setBooked(false)} style={{ marginTop: '0.7rem', border: 0, background: 'none', color: '#245a50', fontWeight: 800, cursor: 'pointer' }}>Book another class</button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }} htmlFor="fit-name">Name</label>
                <input id="fit-name" type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" style={inputStyle} />
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }} htmlFor="fit-email">Email</label>
                <input id="fit-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" style={inputStyle} />
                {error ? <p role="alert" style={{ margin: 0, color: '#9b3a21', fontSize: '0.78rem' }}>{error}</p> : null}
                <button type="submit" style={{ marginTop: '0.25rem', padding: '0.85rem', border: 0, background: '#245a50', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>Request booking</button>
              </form>
            )}
            <p style={{ fontSize: '0.75rem', color: '#4f665e', marginTop: '0.75rem' }}>Demo workflow — no data is collected or sent.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderBottom: '1px solid #d8cebd', background: '#f4efe5' }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>Trainers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1.5rem' }}>
          {[{ name: 'Aisha Patel', role: 'Strength', bio: 'Compound lifts with an emphasis on form and long-term progression.' }, { name: 'Leo Chen', role: 'Mobility', bio: 'Movement-focused sessions for recovery, posture and everyday flexibility.' }, { name: 'Maya Okonkwo', role: 'HIIT', bio: 'High-intensity intervals designed without guesswork.' }].map((person) => (
            <article key={person.name} style={{ padding: '1.25rem', border: '1px solid #d8cebd', background: '#fbf7ef' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.35rem' }}>{person.name}</h3>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#245a50', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{person.role}</p>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: '#5c5347' }}>{person.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <DemoAutomation
        problem="People want to join a class, but the studio loses leads when schedules, capacity and contact details live in separate places."
        automation="Let a visitor select a class, capture their details and create a confirmation-ready booking request."
        outcome="The studio gets a complete lead and the visitor knows which class they requested."
        steps={['Visitor selects a class with visible capacity', 'Contact details are validated', 'The studio receives a structured request to confirm']}
      />
    </div>
  )
}
