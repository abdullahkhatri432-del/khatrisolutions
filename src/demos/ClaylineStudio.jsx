import { useState } from 'react'
import DemoAutomation from './DemoAutomation'

const materials = ['Ceramic — porcelain', 'Wood — hardwood', 'Glass — clear', 'Stone — limestone']

export default function ClaylineStudio() {
  const [form, setForm] = useState({ name: '', material: materials[0], brief: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.brief.trim()) {
      setError('Add your name and a short brief so the studio can understand the request.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: '#f4efe5', color: '#1d1915' }}>
      <section style={{ padding: 'clamp(3rem,6vw,5rem) 5vw 3rem', background: '#8b5e3c', color: '#fff', borderBottom: '1px solid #14110d' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f4ddc8' }}>Craft Design Studio</p>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 400, letterSpacing: '-0.05em', lineHeight: 1.05, margin: '0.75rem 0 1.25rem', color: '#fff' }}>Clayline Studio</h1>
        <p style={{ fontSize: '1.05rem', maxWidth: '52ch', lineHeight: 1.65, color: '#f9eade' }}>Portfolio-led craft studio showing process, materials and a clear route from a loose idea to a considered object.</p>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderBottom: '1px solid #d8cebd', background: '#fbf7ef' }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Process</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))', gap: '1.25rem' }}>
          {[{ step: '01', title: 'Material prep', body: 'Select raw material based on the piece and where it will live.' }, { step: '02', title: 'Making', body: 'Shape, join and refine with progress updates at the right moments.' }, { step: '03', title: 'Finishing', body: 'Inspect, document and hand over with care notes.' }].map((item) => (
            <article key={item.step} style={{ padding: '1.25rem', border: '1px solid #d8cebd', background: '#fff' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5e3c', lineHeight: 1 }}>{item.step}</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.35rem 0 0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: '#5c5347' }}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: '2.5rem 5vw', background: '#eee2d5', borderBottom: '1px solid #d8cebd' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 24rem' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 400, marginBottom: '1rem' }}>Start with a brief</h2>
            <p style={{ lineHeight: 1.65, color: '#5c5347' }}>Choose a material direction and describe what you want made. The studio can then decide whether it is a fit before a longer conversation.</p>
          </div>
          {sent ? (
            <div role="status" style={{ flex: '1 1 24rem', padding: '1.25rem', border: '1px solid #c4a180', background: '#fff', lineHeight: 1.55 }}>
              <strong>Brief organised — demo only.</strong>
              <p style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>In a live studio, this would create a project record with your selected material and brief. Nothing was sent.</p>
              <button type="button" onClick={() => setSent(false)} style={{ marginTop: '0.7rem', border: 0, background: 'none', color: '#8b5e3c', fontWeight: 800, cursor: 'pointer' }}>Submit another brief</button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ flex: '1 1 24rem', padding: '1.25rem', border: '1px solid #c4a180', background: '#fff', display: 'grid', gap: '0.75rem' }}>
              <label htmlFor="cl-name" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Your name</label>
              <input id="cl-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" style={{ padding: '0.7rem', border: '1px solid #c4a180', fontFamily: 'inherit' }} />
              <label htmlFor="cl-material" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Material direction</label>
              <select id="cl-material" value={form.material} onChange={(event) => setForm({ ...form, material: event.target.value })} style={{ padding: '0.7rem', border: '1px solid #c4a180', fontFamily: 'inherit' }}>{materials.map((material) => <option key={material}>{material}</option>)}</select>
              <label htmlFor="cl-brief" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Short brief</label>
              <textarea id="cl-brief" rows={3} value={form.brief} onChange={(event) => setForm({ ...form, brief: event.target.value })} placeholder="What would you like made?" style={{ padding: '0.7rem', border: '1px solid #c4a180', fontFamily: 'inherit', resize: 'vertical' }} />
              {error ? <p role="alert" style={{ margin: 0, color: '#9b3a21', fontSize: '0.78rem' }}>{error}</p> : null}
              <button type="submit" style={{ padding: '0.85rem', border: 0, background: '#8b5e3c', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Organise my enquiry</button>
            </form>
          )}
        </div>
      </section>

      <DemoAutomation
        problem="Custom-work enquiries arrive as scattered inspiration with no material, scope or decision context."
        automation="Capture the material direction and brief in a repeatable intake before the studio spends time scoping."
        outcome="The maker can quickly decide fit, ask a precise follow-up and keep the project history together."
        steps={['Client selects a material direction', 'A short brief is captured', 'Studio reviews a structured enquiry before replying']}
      />
    </div>
  )
}
