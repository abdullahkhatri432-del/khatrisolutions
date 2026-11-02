export default function AIAutomationFlow() {
  return (
    <div style={{ fontFamily: "'Host Grotesk', 'Bauhaus Host', sans-serif", background: '#f5f4ee', color: '#000' }}>
      <section style={{ padding: 'clamp(3rem,6vw,5rem) 5vw 3rem', background: '#e63946', color: '#fff', borderBottom: '4px solid #000' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>AI & Business Automation</p>
        <h1 style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.05, margin: '0.75rem 0 1.25rem', color: '#fff' }}>Automation Flow</h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '52ch', lineHeight: 1.55, color: '#ffeaea' }}>Trigger rules, review outputs and confirm actions — simulated dashboard with working patterns.</p>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderTop: '4px solid #000', borderBottom: '4px solid #000', background: '#fff' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Rules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1rem' }}>
          {[
            'If enquiry contains keyword → draft reply',
            'If budget over threshold → flag manager',
            'If response pending 24h → reminder',
          ].map(r => (
            <div key={r} style={{ padding: '1rem', border: '4px solid #000', background: '#f5f4ee', fontWeight: 650, fontSize: '1rem', lineHeight: 1.45 }}>
              <span style={{ display: 'inline-block', width: '0.5rem', height: '0.5rem', background: '#e63946', marginRight: '0.5rem', verticalAlign: 'middle' }} aria-hidden="true" />
              {r}
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderBottom: '4px solid #000', background: '#ffff00' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Confirm</h2>
        <p style={{ maxWidth: '40ch', lineHeight: 1.55, fontSize: '1.05rem' }}><strong>Next step:</strong> review output, edit if needed, then confirm. Nothing sends without review.</p>
      </section>
    </div>
  )
}
