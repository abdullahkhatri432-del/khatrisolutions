export default function FitnessStudio() {
  return (
    <div style={{ fontFamily: "'Host Grotesk', 'Bauhaus Host', sans-serif", background: '#f5f4ee', color: '#000' }}>
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 5vw 3rem', background: '#1a7a2e', color: '#fff', borderBottom: '4px solid #000' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>Fitness & Personal Training</p>
        <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.05, margin: '0.75rem 0 1.25rem', color: '#fff' }}>Form & Flow Studio</h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '52ch', lineHeight: 1.55, color: '#e0e0e0' }}>Class booking, trainer profiles and a direct enquiry path — built to be used, not just looked at. Every business shown is fictional.</p>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderTop: '4px solid #000', borderBottom: '4px solid #000', background: '#fff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 28rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Schedule</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
              {[
                { day: 'Mon', time: '07:00', name: 'HIIT' },
                { day: 'Wed', time: '18:30', name: 'Mobility' },
                { day: 'Sat', time: '09:00', name: 'Strength' },
              ].map(s => (
                <li key={s.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem', border: '3px solid #000', background: '#f5f4ee', fontWeight: 650, fontSize: '1rem' }}>
                  <span>{s.day} — {s.time}</span><span>{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: '1 1 22rem', padding: '1.25rem', border: '4px solid #000', background: '#ffff00' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Book a class</h3>
            <form onSubmit={e => { e.preventDefault(); alert('Demo form. Nothing is sent.'); }} style={{ display: 'grid', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }} htmlFor="fit-name">Name</label>
              <input id="fit-name" type="text" placeholder="Your name" style={{ padding: '0.75rem', border: '3px solid #000', background: '#fff', fontFamily: 'inherit', fontSize: '0.95rem' }} />
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }} htmlFor="fit-email">Email</label>
              <input id="fit-email" type="email" placeholder="you@example.com" style={{ padding: '0.75rem', border: '3px solid #000', background: '#fff', fontFamily: 'inherit', fontSize: '0.95rem' }} />
              <button type="submit" style={{ marginTop: '0.25rem', padding: '0.85rem', border: '3px solid #000', background: '#1a7a2e', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>Request booking</button>
            </form>
            <p style={{ fontSize: '0.75rem', color: '#333', marginTop: '0.75rem' }}>This is a demo. No data is collected or sent.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderBottom: '4px solid #000', background: '#f5f4ee' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>Trainers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1.5rem' }}>
          {[
            { name: 'Aisha Patel', role: 'Strength', bio: 'Five years coaching compound lifts with an emphasis on form and long-term progression.' },
            { name: 'Leo Chen', role: 'Mobility', bio: 'Movement-focused sessions for recovery, posture and everyday flexibility.' },
            { name: 'Maya Okonkwo', role: 'HIIT', bio: 'High-intensity intervals designed for people who want results without guesswork.' },
          ].map(p => (
            <article key={p.name} style={{ padding: '1.25rem', border: '4px solid #000', background: '#fff' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>{p.name}</h3>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#1a7a2e', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{p.role}</p>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: '#333' }}>{p.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderTop: '4px solid #000', borderBottom: '4px solid #000', background: '#fff' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>What members say</h2>
        <blockquote style={{ maxWidth: '60ch', lineHeight: 1.55, fontSize: '1.05rem' }}>
          “The schedule is clear and the trainers actually know their stuff. No hidden contracts — just a form and a reply.”
        </blockquote>
        <p style={{ fontSize: '0.78rem', color: '#555', marginTop: '0.5rem' }}>— Demo testimonial, fictional</p>
      </section>
    </div>
  )
}
