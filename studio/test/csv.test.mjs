import test from 'node:test'
import assert from 'node:assert/strict'

import {
  buildManualLead,
  leadsFromCsv,
  normalizeDate,
  parseCsv,
} from '../lib/csv.mjs'

const CSV = `Timestamp,Lead ID,Name,Email,Business Name,Business Type,Service,Budget,Timeline,Description,Pages Required,Kind
27/10/2026 10:22:23,LD-ABC12345,Priya Sharma,priya@example.com,Sharma Dental,Clinic,Business Website,"₹15,000 – ₹30,000",Within a month,"We need a calm, mobile-first site with services, team and appointment requests. Please include location pages for two branches.",5,
28/10/2026 09:00:00,LD-DEF67890,Arjun Rao,arjun@example.com,Rao Interiors,Interior design,Business Plus Website,"₹25,000+",Flexible,"Portfolio-led site. We have 20 projects and need a clear enquiry path.
Images are ready.",8,
29/10/2026 11:00:00,LD-REVIEW01,Meera,meera@example.com,,,Business Website,5,,,,review`

test('parses quoted commas and newlines', () => {
  const rows = parseCsv(CSV)
  assert.equal(rows[0][0], 'Timestamp')
  assert.equal(rows[1][9].includes('two branches'), true)
  assert.equal(rows[2][9].includes('\nImages are ready.'), true)
  assert.equal(rows[1][7], '₹15,000 – ₹30,000')
})

test('maps aliases, normalises dates and keeps a stable lead id', () => {
  const { leads, skipped } = leadsFromCsv(CSV)

  assert.equal(leads.length, 2)
  assert.equal(skipped, 1)

  const first = leads[0]
  assert.equal(first.id, 'LD-ABC12345')
  assert.equal(first.name, 'Priya Sharma')
  assert.equal(first.business, 'Sharma Dental')
  assert.equal(first.businessType, 'Clinic')
  assert.equal(first.service, 'Business Website')
  assert.equal(first.budget, '₹15,000 – ₹30,000')
  assert.equal(first.details.pages, '5')
  assert.equal(first.canDraft, true)
  assert.equal(first.receivedAt, '2026-10-27T04:52:23.000Z')
})

test('derives the same id for identical rows without a lead id', () => {
  const csv = `Name,Email,Timestamp,Description
Test Person,test@example.com,2026-10-27T10:00:00.000Z,"A description long enough to draft from."
Test Person,test@example.com,2026-10-27T10:00:00.000Z,"A description long enough to draft from."`

  const { leads } = leadsFromCsv(csv)
  assert.equal(leads.length, 1)
  assert.match(leads[0].id, /^LD-[A-F0-9]{8}$/)
})

test('normalises ambiguous day/month dates to day-first', () => {
  assert.equal(normalizeDate('03/04/2026'), new Date(2026, 3, 3).toISOString())
  assert.equal(normalizeDate('27/10/2026'), new Date(2026, 9, 27).toISOString())
  assert.equal(normalizeDate('2026-10-27'), '2026-10-27T00:00:00.000Z')
  assert.equal(normalizeDate(''), '')
})

test('manual leads are marked as tests and require a real brief', () => {
  const lead = buildManualLead({
    name: 'TEST lead',
    business: 'Example Co',
    businessType: 'Retail',
    service: 'Business Website',
    budget: '₹10,000',
    description: 'We need a simple five page website for a local retail business.',
  })

  assert.match(lead.id, /^LD-[A-F0-9]{8}$/)
  assert.equal(lead.isTest, true)
  assert.equal(lead.canDraft, true)
  assert.equal(lead.source, 'Manual entry')
})

test('a lead with no description cannot be drafted', () => {
  const lead = buildManualLead({ name: 'No brief', email: 'a@b.com' })
  assert.equal(lead.canDraft, false)
  assert.deepEqual(lead.missingFields, ['description'])
})
