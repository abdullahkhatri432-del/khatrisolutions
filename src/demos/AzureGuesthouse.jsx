export default function AzureGuesthouse() {
  return (
    <div style={{ fontFamily: "'Host Grotesk', 'Bauhaus Host', sans-serif", background: '#f5f4ee', color: '#000' }}>
      <section style={{ padding: 'clamp(3rem,6vw,5rem) 5vw 3rem', background: '#0077b6', color: '#fff', borderBottom: '4px solid #000' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>Boutique Hotel</p>
        <h1 style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.05, margin: '0.75rem 0 1.25rem', color: '#fff' }}>Azure Guesthouse</h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '52ch', lineHeight: 1.55, color: '#e0f0f5' }}>A small stay near the coast with clear room cards, timing and direct enquiry.</p>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderTop: '4px solid #000', borderBottom: '4px solid #000', background: '#fff' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Rooms</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1.25rem' }}>
          {[
            { name: 'Sea-view suite', price: 'INR 7,500 / night', note: 'Private balcony, queen bed, morning coffee included.' },
            { name: 'Garden room', price: 'INR 5,200 / night', note: 'Quiet courtyard view, twin beds, garden access.' },
            { name: 'Loft with bath', price: 'INR 6,800 / night', note: 'Open plan, walk-in shower, desk and workspace.' },
          ].map(r => (
            <article key={r.name} style={{ padding: '1.25rem', border: '4px solid #000', background: '#f5f4ee' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>{r.name}</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0077b6', marginBottom: '0.5rem' }}>{r.price}</p>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: '#333' }}>{r.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: '2.5rem 5vw', background: '#ffff00', borderBottom: '4px solid #000' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Availability & enquiry</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 26rem' }}>
            <p style={{ lineHeight: 1.55 }}><strong>Next open:</strong> Thursday — 3 nights. All bookings start after direct confirmation, not automated. No hidden fees.</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); alert('Demo enquiry. Nothing is sent.'); }} style={{ flex: '1 1 22rem', padding: '1.25rem', border: '4px solid #000', background: '#fff', display: 'grid', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Request a stay</h3>
            <label htmlFor="az-name" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Name</label>
            <input id="az-name" type="text" placeholder="Your name" style={{ padding: '0.65rem', border: '3px solid #000', background: '#fff', fontFamily: 'inherit', fontSize: '0.95rem' }} />
            <label htmlFor="az-date" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Dates</label>
            <input id="az-date" type="text" placeholder="e.g. 12–14 Nov" style={{ padding: '0.65rem', border: '3px solid #000', background: '#fff', fontFamily: 'inherit', fontSize: '0.95rem' }} />
            <button type="submit" style={{ padding: '0.85rem', border: '3px solid #000', background: '#0077b6', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>Send enquiry</button>
            <p style={{ fontSize: '0.75rem', color: '#333', margin: 0 }}>This is a demo form. Nothing is transmitted.</p>
          </form>
        </div>
      </section>
    </div>
  )
}
