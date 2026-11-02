export default function ClaylineStudio() {
  return (
    <div style={{ fontFamily: "'Host Grotesk', 'Bauhaus Host', sans-serif", background: '#f5f4ee', color: '#000' }}>
      <section style={{ padding: 'clamp(3rem,6vw,5rem) 5vw 3rem', background: '#c89f5e', color: '#fff', borderBottom: '4px solid #000' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>Craft Design Studio</p>
        <h1 style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.05, margin: '0.75rem 0 1.25rem', color: '#fff' }}>Clayline Studio</h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '52ch', lineHeight: 1.55, color: '#fff8e8' }}>Portfolio-led craft studio showing process, materials and enquiry path.</p>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderTop: '4px solid #000', borderBottom: '4px solid #000', background: '#ffff00' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Process</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))', gap: '1.25rem' }}>
          {[
            { step: '01', title: 'Material prep', body: 'Selecting raw stone, clay, wood or glass based on piece requirements.' },
            { step: '02', title: 'Making', body: 'Shaping, joining and refining the piece with regular progress updates.' },
            { step: '03', title: 'Finishing', body: 'Surface treatment, final inspection and clear handover notes.' },
          ].map(s => (
            <article key={s.step} style={{ padding: '1.25rem', border: '4px solid #000', background: '#fff' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#c89f5e', lineHeight: 1 }}>{s.step}</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0.35rem 0 0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: '#333' }}>{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderBottom: '4px solid #000', background: '#f5f4ee' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Materials</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '0.75rem' }}>
          {['Ceramic — porcelain', 'Wood — hardwood', 'Glass — clear', 'Stone — limestone'].map(m => (
            <div key={m} style={{ padding: '0.85rem', border: '3px solid #000', background: '#fff', fontWeight: 650 }}>{m}</div>
          ))}
        </div>
      </section>
    </div>
  )
}
