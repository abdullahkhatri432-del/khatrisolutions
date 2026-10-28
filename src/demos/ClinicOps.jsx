import { useMemo, useState } from 'react'
import { Activity, CalendarDays, CircleDot, LayoutGrid, Search, Users } from 'lucide-react'

const appointments = [
  { id: 1, time: '09:15', patient: 'Meera Shah', type: 'Follow-up', clinician: 'Dr. Desai', status: 'Completed' },
  { id: 2, time: '09:45', patient: 'Arjun Rao', type: 'New assessment', clinician: 'Dr. Desai', status: 'Completed' },
  { id: 3, time: '10:30', patient: 'Fatima Sheikh', type: 'Rehab session', clinician: 'Dr. Iyer', status: 'Waiting' },
  { id: 4, time: '11:00', patient: 'Nikhil Patil', type: 'Follow-up', clinician: 'Dr. Desai', status: 'Confirmed' },
  { id: 5, time: '11:45', patient: 'Sana Kapoor', type: 'New assessment', clinician: 'Dr. Iyer', status: 'Confirmed' },
  { id: 6, time: '12:15', patient: 'Rohit Menon', type: 'Rehab session', clinician: 'Dr. Desai', status: 'Waiting' },
  { id: 7, time: '14:00', patient: 'Ananya Gupta', type: 'Follow-up', clinician: 'Dr. Iyer', status: 'Confirmed' },
  { id: 8, time: '15:30', patient: 'Vikram Singh', type: 'New assessment', clinician: 'Dr. Desai', status: 'Cancelled' },
  { id: 9, time: '16:15', patient: 'Priya Nair', type: 'Rehab session', clinician: 'Dr. Iyer', status: 'Confirmed' },
]

const statuses = ['All', 'Waiting', 'Confirmed', 'Completed', 'Cancelled']
const sidebar = [
  { label: 'Overview', icon: LayoutGrid },
  { label: 'Appointments', icon: CalendarDays },
  { label: 'Patients', icon: Users },
  { label: 'Reports', icon: Activity },
]

export default function ClinicOps() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [notice, setNotice] = useState('')

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()
    return appointments.filter((row) => {
      const matchesStatus = status === 'All' || row.status === status
      const matchesQuery =
        !term || row.patient.toLowerCase().includes(term) || row.clinician.toLowerCase().includes(term)
      return matchesStatus && matchesQuery
    })
  }, [query, status])

  const waiting = appointments.filter((row) => row.status === 'Waiting').length
  const completed = appointments.filter((row) => row.status === 'Completed').length

  return (
    <div className="co-app">
      <aside className="co-side">
        <div className="co-brand">
          <span className="co-brand__mark" aria-hidden="true">
            C
          </span>
          <div>
            <strong>Clinic Ops</strong>
            <span>Northside Physio</span>
          </div>
        </div>

        <nav className="co-nav" aria-label="Dashboard">
          {sidebar.map((item) => {
            const Icon = item.icon
            const active = item.label === 'Appointments'
            return (
              <button
                key={item.label}
                type="button"
                className={`co-navitem ${active ? 'is-active' : ''}`.trim()}
                aria-current={active ? 'page' : undefined}
                onClick={() => setNotice(active ? '' : `This demo only includes the Appointments view.`)}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="co-side__foot">
          <p>Demo data</p>
          <span>27 Oct 2026</span>
        </div>
      </aside>

      <div className="co-main">
        <header className="co-top">
          <div>
            <p className="co-top__eyebrow">Appointments</p>
            <h1>Today at a glance</h1>
          </div>
          <div className="co-top__date">
            <CalendarDays size={15} aria-hidden="true" />
            Tue, 27 Oct
          </div>
        </header>

        <div className="co-kpis">
          <article className="co-kpi">
            <span>Booked today</span>
            <strong>{appointments.length}</strong>
            <small>Across 2 clinicians</small>
          </article>
          <article className="co-kpi co-kpi--warn">
            <span>Waiting now</span>
            <strong>{waiting}</strong>
            <small>Average wait 8 min</small>
          </article>
          <article className="co-kpi co-kpi--good">
            <span>Completed</span>
            <strong>{completed}</strong>
            <small>On schedule</small>
          </article>
          <article className="co-kpi">
            <span>Utilisation</span>
            <strong>86%</strong>
            <small>Last 7 days</small>
          </article>
        </div>

        <section className="co-panel" aria-labelledby="co-list-title">
          <div className="co-panel__head">
            <h2 id="co-list-title">Appointment list</h2>
            <div className="co-tools">
              <label className="co-search">
                <Search size={15} aria-hidden="true" />
                <span className="sr-only">Search appointments</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search patient or clinician"
                />
              </label>
            </div>
          </div>

          <div className="co-filters" role="group" aria-label="Filter by status">
            {statuses.map((item) => (
              <button
                key={item}
                type="button"
                className={`co-chip ${status === item ? 'is-active' : ''}`.trim()}
                aria-pressed={status === item}
                onClick={() => setStatus(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {notice ? (
            <p className="co-notice" role="status">
              {notice}
            </p>
          ) : null}

          <div className="co-tablewrap">
            <table className="co-table" role="table">
              <caption className="sr-only">Appointments for 27 October 2026</caption>
              <thead role="rowgroup">
                <tr role="row">
                  <th scope="col" role="columnheader">Time</th>
                  <th scope="col" role="columnheader">Patient</th>
                  <th scope="col" role="columnheader">Type</th>
                  <th scope="col" role="columnheader">Clinician</th>
                  <th scope="col" role="columnheader">Status</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {rows.map((row) => (
                  <tr key={row.id} role="row">
                    <td className="co-time" role="cell">{row.time}</td>
                    <td role="cell">{row.patient}</td>
                    <td className="co-muted" role="cell">{row.type}</td>
                    <td className="co-muted" role="cell">{row.clinician}</td>
                    <td role="cell">
                      <span className={`co-badge co-badge--${row.status.toLowerCase()}`}>
                        <CircleDot size={11} aria-hidden="true" />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {rows.length === 0 ? <p className="co-empty">No appointments match that search.</p> : null}
          </div>

          <p className="co-panel__foot" aria-live="polite">
            Showing {rows.length} of {appointments.length} appointments
          </p>
        </section>
      </div>
    </div>
  )
}
