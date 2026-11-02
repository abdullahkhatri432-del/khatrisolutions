import { useState } from 'react'
import { Check, Play, RotateCcw } from 'lucide-react'
import DemoAutomation from './DemoAutomation'

const initialRules = [
  { id: 'lead', title: 'New enquiry', rule: 'If enquiry contains a keyword → draft reply', enabled: true },
  { id: 'budget', title: 'Large project', rule: 'If budget is over threshold → flag manager', enabled: true },
  { id: 'followup', title: 'No response', rule: 'If response is pending 24h → create reminder', enabled: false },
]

export default function AIAutomationFlow() {
  const [rules, setRules] = useState(initialRules)
  const [running, setRunning] = useState(false)
  const [complete, setComplete] = useState(false)

  const run = () => {
    setRunning(true)
    setComplete(false)
    window.setTimeout(() => {
      setRunning(false)
      setComplete(true)
    }, 550)
  }

  const reset = () => {
    setRules(initialRules)
    setComplete(false)
  }

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: '#f4efe5', color: '#1d1915' }}>
      <section style={{ padding: 'clamp(3rem,6vw,5rem) 5vw 3rem', background: '#8f3030', color: '#fff', borderBottom: '1px solid #14110d' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffe0d9' }}>AI &amp; Business Automation</p>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 400, letterSpacing: '-0.05em', lineHeight: 1.05, margin: '0.75rem 0 1.25rem', color: '#fff' }}>Automation Flow</h1>
        <p style={{ fontSize: '1.05rem', maxWidth: '52ch', lineHeight: 1.65, color: '#ffeaea' }}>Trigger rules, review outputs and confirm actions — a local simulation of a workflow that stays under human control.</p>
      </section>

      <section style={{ padding: '2.5rem 5vw', borderBottom: '1px solid #d8cebd', background: '#fbf7ef' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', fontWeight: 400, margin: 0 }}>Rules</h2>
            <p style={{ marginTop: '0.35rem', color: '#5c5347' }}>Toggle the rules, then run the sample event.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={run} disabled={running} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 0.9rem', border: 0, background: '#8f3030', color: '#fff', fontWeight: 800, cursor: running ? 'wait' : 'pointer' }}>
              <Play size={14} aria-hidden="true" /> {running ? 'Running…' : 'Run sample event'}
            </button>
            <button type="button" onClick={reset} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 0.9rem', border: '1px solid #cdbfb0', background: 'transparent', color: '#5c5347', fontWeight: 700, cursor: 'pointer' }}>
              <RotateCcw size={14} aria-hidden="true" /> Reset
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))', gap: '1rem' }}>
          {rules.map((item) => (
            <button key={item.id} type="button" onClick={() => setRules((current) => current.map((rule) => rule.id === item.id ? { ...rule, enabled: !rule.enabled } : rule))} style={{ display: 'block', textAlign: 'left', padding: '1rem', border: `1px solid ${item.enabled ? '#b85f5f' : '#d8cebd'}`, background: item.enabled ? '#fff4f1' : '#f4efe5', color: '#1d1915', cursor: 'pointer' }} aria-pressed={item.enabled}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <strong>{item.title}</strong>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: item.enabled ? '#8f3030' : '#777', fontSize: '0.72rem', fontWeight: 800 }}>{item.enabled ? <Check size={13} /> : null}{item.enabled ? 'ON' : 'OFF'}</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.9rem', lineHeight: 1.45, color: '#5c5347' }}>{item.rule}</span>
            </button>
          ))}
        </div>
        <div role="status" aria-live="polite" style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #cdbfb0', background: complete ? '#e5f1e8' : '#fff', color: '#5c5347', lineHeight: 1.55 }}>
          {complete ? <><strong style={{ color: '#2f8061' }}>Sample event completed.</strong> Enabled rules produced reviewable actions; no email, CRM or payment system was contacted.</> : 'Nothing has run yet. The preview will show which enabled rules would fire.'}
        </div>
      </section>

      <DemoAutomation
        problem="Repeating follow-ups and routing decisions consume time, but fully automatic sending can create risky mistakes."
        automation="Trigger small, reviewable actions from business rules and keep a human confirmation step before anything external happens."
        outcome="The team handles routine work faster while retaining control over the final message or action."
        steps={['An event enters the workflow', 'Matching rules create suggested actions', 'A person reviews and confirms the output']}
      />
    </div>
  )
}
