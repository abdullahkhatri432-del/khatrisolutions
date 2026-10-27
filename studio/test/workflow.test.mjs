import test from 'node:test'
import assert from 'node:assert/strict'

import {
  applyGeneratedDraft,
  createManualLead,
  editDraft,
  getLead,
  publicLead,
  sortLeads,
  statsFor,
  transitionLead,
  upsertPulledLeads,
} from '../lib/leads.mjs'

const DRAFT = {
  summary: 'A clinic needs a calm, mobile-first site.',
  fit: 'strong',
  fitReason: 'The brief matches the Business Website package.',
  proposalMarkdown: '# Website proposal for Sharma Dental\n\nA complete proposal body.',
  checklist: [
    { area: 'Content', item: 'Collect service descriptions', why: 'Needed for the services page', priority: 'high' },
    { area: 'Forms', item: 'Test appointment requests', why: 'Enquiries must arrive', priority: 'high' },
  ],
  questions: ['Do you have existing photography?'],
  risks: ['Content may arrive late.'],
  assumptions: ['The client owns the domain.'],
  nextAction: 'Book a 20 minute discovery call.',
}

function incoming(overrides = {}) {
  return {
    id: 'LD-TEST0001',
    kind: 'project-inquiry',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 90000 00000',
    business: 'Sharma Dental',
    businessType: 'Clinic',
    service: 'Business Website',
    budget: '₹15,000 – ₹30,000',
    timeline: 'Within a month',
    description: 'We need a calm, mobile-first site with services and appointment requests.',
    contactMethod: 'WhatsApp',
    source: 'Website enquiry',
    receivedAt: '2026-10-27T04:52:23.000Z',
    receivedAtRaw: '27/10/2026 10:22:23',
    details: { pages: '5' },
    missingFields: [],
    canDraft: true,
    isTest: false,
    raw: { Timestamp: '27/10/2026 10:22:23', Notes: 'internal only' },
    ...overrides,
  }
}

function emptyStore() {
  return { version: 1, leads: [], lastSyncAt: null }
}

function seededStore() {
  const store = emptyStore()
  upsertPulledLeads(store, [incoming()], { addedAt: '2026-10-27T05:00:00.000Z' })
  return store
}

test('a pulled lead starts as new and is queued for drafting', () => {
  const store = emptyStore()
  const result = upsertPulledLeads(store, [incoming()], { addedAt: '2026-10-27T05:00:00.000Z' })

  assert.equal(result.added, 1)
  assert.deepEqual(result.queued, ['LD-TEST0001'])

  const lead = store.leads[0]
  assert.equal(lead.status, 'new')
  assert.equal(lead.draft, null)
  assert.equal(lead.addedAt, '2026-10-27T05:00:00.000Z')
  assert.equal(lead.history[0].action, 'pulled')
  assert.match(lead.history[0].detail, /the lead source/)
})

test('a lead without a usable brief is not queued', () => {
  const store = emptyStore()
  const result = upsertPulledLeads(store, [
    incoming({ id: 'LD-TEST0002', description: '', canDraft: false, missingFields: ['description'] }),
  ])

  assert.equal(result.added, 1)
  assert.deepEqual(result.queued, [])
})

test('re-pulling a sheet row keeps the draft, notes and status', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')
  applyGeneratedDraft(lead, DRAFT, { model: 'test/model', trigger: 'auto' })
  editDraft(lead, { reviewNotes: 'Check the branch locations before sending.' })
  transitionLead(lead, 'in_review')
  transitionLead(lead, 'approved', 'Abdullah Khatri')

  const result = upsertPulledLeads(store, [incoming()], { addedAt: '2026-10-28T05:00:00.000Z' })

  assert.equal(result.added, 0)
  assert.equal(result.unchanged, 1)
  assert.equal(lead.status, 'approved')
  assert.equal(lead.draft.reviewNotes, 'Check the branch locations before sending.')
  assert.equal(lead.draft.reviewer, 'Abdullah Khatri')
  assert.equal(lead.draft.approvedAt !== null, true)
  assert.equal(lead.addedAt, '2026-10-27T05:00:00.000Z')
})

test('re-pulling changed source fields updates them without touching the draft', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')
  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })
  const draftBefore = lead.draft

  const result = upsertPulledLeads(
    store,
    [incoming({ budget: '₹30,000 – ₹50,000', description: 'Updated brief with two branches and a booking form.' })],
    { addedAt: '2026-10-29T05:00:00.000Z' },
  )

  assert.equal(result.updated, 1)
  assert.equal(lead.budget, '₹30,000 – ₹50,000')
  assert.equal(lead.draft, draftBefore)
  assert.equal(lead.updatedAt, '2026-10-29T05:00:00.000Z')
  assert.equal(lead.history[0].action, 'source_updated')
})

test('blank sheet cells do not wipe an existing brief', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')

  upsertPulledLeads(store, [incoming({ budget: '', timeline: '', details: {} })])

  assert.equal(lead.budget, '₹15,000 – ₹30,000')
  assert.equal(lead.timeline, 'Within a month')
  assert.deepEqual(lead.details, { pages: '5' })
})

test('manual leads must have a real name and brief', () => {
  const store = emptyStore()

  assert.throws(() => createManualLead(store, { name: '' }), /name is required/i)
  assert.throws(
    () => createManualLead(store, { name: 'Sam', description: 'too short' }),
    /at least 20 characters/i,
  )

  const lead = createManualLead(store, {
    name: 'Sam',
    business: "Sam's Bakery",
    businessType: 'Bakery',
    service: 'Starter Website',
    budget: '₹5,000',
    description: 'We need a one page site with our menu, timings and a WhatsApp link.',
  })

  assert.match(lead.id, /^LD-[A-F0-9]{8}$/)
  assert.equal(lead.status, 'new')
  assert.equal(lead.source, 'Manual entry')
  assert.equal(lead.history[0].action, 'created')
  assert.equal(store.leads.length, 1)
})

test('manual lead ids never collide', () => {
  const store = emptyStore()
  const base = {
    name: 'Sam',
    description: 'We need a one page site with our menu, timings and a WhatsApp link.',
  }

  const first = createManualLead(store, base)
  const second = createManualLead(store, base)

  assert.notEqual(first.id, second.id)
  assert.equal(store.leads.length, 2)
})

test('a generated draft moves the lead to drafted and records history', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')

  applyGeneratedDraft(lead, { ...DRAFT, fit: 'unknown', checklist: [{ area: '', item: '  ', why: '' }] }, {
    model: 'test/model',
    usage: { total_tokens: 1200 },
    trigger: 'auto',
  })

  assert.equal(lead.status, 'drafted')
  assert.equal(lead.draft.fit, 'possible')
  assert.equal(lead.draft.checklist.length, 0)
  assert.deepEqual(lead.draft.usage, { total_tokens: 1200 })
  assert.equal(lead.history[0].action, 'draft_generated_auto')
})

test('regenerating keeps previous drafts and review notes', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')
  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })
  editDraft(lead, { reviewNotes: 'Tighten the investment section.' })

  applyGeneratedDraft(lead, { ...DRAFT, proposalMarkdown: '# Second draft\n\nNew body text.' }, {
    model: 'test/model',
  })

  assert.equal(lead.draftHistory.length, 1)
  assert.equal(lead.draftHistory[0].proposalMarkdown, DRAFT.proposalMarkdown)
  assert.equal(lead.draft.reviewNotes, 'Tighten the investment section.')
  assert.equal(lead.draft.proposalMarkdown.startsWith('# Second draft'), true)
})

test('editing an approved draft returns it to review and clears approval', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')
  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })
  transitionLead(lead, 'in_review')
  transitionLead(lead, 'approved', 'Abdullah Khatri')

  editDraft(lead, { proposalMarkdown: `${DRAFT.proposalMarkdown}\n\nOne more paragraph for the client.` })

  assert.equal(lead.status, 'in_review')
  assert.equal(lead.draft.approvedAt, null)
  assert.equal(lead.draft.reviewer, '')
  assert.equal(lead.history[0].action, 'approval_reset')
})

test('editing is blocked for archived leads and empty drafts', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')

  assert.throws(() => editDraft(lead, { summary: 'x' }), /no draft/i)

  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })
  transitionLead(lead, 'archived')

  assert.throws(() => editDraft(lead, { summary: 'x' }), /reopen/i)
})

test('too-short proposals cannot be saved', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')
  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })

  assert.throws(() => editDraft(lead, { proposalMarkdown: 'Nope.' }), /too short/i)
})

test('status transitions follow the review workflow', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')

  assert.throws(() => transitionLead(lead, 'in_review'), /Cannot move/i)

  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })
  assert.throws(() => transitionLead(lead, 'approved'), /Cannot move/i)

  transitionLead(lead, 'in_review')
  assert.equal(lead.status, 'in_review')

  transitionLead(lead, 'approved', 'Abdullah Khatri')
  assert.equal(lead.status, 'approved')
  assert.equal(lead.draft.reviewer, 'Abdullah Khatri')
  assert.equal(lead.draft.approvedAt !== null, true)
  assert.match(lead.history[0].detail, /Nothing was sent/)

  transitionLead(lead, 'archived')
  assert.equal(lead.status, 'archived')

  transitionLead(lead, 'drafted')
  assert.equal(lead.status, 'drafted')
  assert.equal(lead.draft.approvedAt, null)
  assert.equal(lead.draft.reviewer, '')
})

test('unknown statuses are rejected', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')

  assert.throws(() => transitionLead(lead, 'sent'), /Unknown status/i)
})

test('an archived lead with no draft reopens as a new lead', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')

  transitionLead(lead, 'archived')
  assert.equal(lead.status, 'archived')

  assert.throws(() => transitionLead(lead, 'drafted'), /no draft to reopen/i)

  transitionLead(lead, 'new')
  assert.equal(lead.status, 'new')
  assert.equal(lead.draft, null)
  assert.equal(lead.history[0].action, 'reopened')
})

test('an archived lead with a draft reopens in draft', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')
  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })
  transitionLead(lead, 'archived')

  transitionLead(lead, 'drafted')

  assert.equal(lead.status, 'drafted')
  assert.equal(lead.draft.proposalMarkdown, DRAFT.proposalMarkdown)
})

test('approved drafts can be returned to review without losing the proposal', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')
  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })
  transitionLead(lead, 'in_review')
  transitionLead(lead, 'approved', 'Abdullah Khatri')

  transitionLead(lead, 'in_review')

  assert.equal(lead.status, 'in_review')
  assert.equal(lead.draft.proposalMarkdown, DRAFT.proposalMarkdown)
  assert.equal(lead.draft.approvedAt, null)
  assert.equal(lead.draft.reviewer, '')
})

test('stats and sorting summarise the inbox', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')
  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })

  upsertPulledLeads(
    store,
    [incoming({ id: 'LD-TEST0002', name: 'Older', receivedAt: '2026-01-01T00:00:00.000Z' })],
    { addedAt: '2026-10-01T00:00:00.000Z' },
  )

  const stats = statsFor(store.leads)
  assert.equal(stats.total, 2)
  assert.equal(stats.byStatus.drafted, 1)
  assert.equal(stats.byStatus.new, 1)

  const sorted = sortLeads(store.leads)
  assert.deepEqual(sorted.map((entry) => entry.id), ['LD-TEST0001', 'LD-TEST0002'])
})

test('the public lead shape hides raw sheet columns and draft history', () => {
  const store = seededStore()
  const lead = getLead(store, 'LD-TEST0001')
  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })
  applyGeneratedDraft(lead, DRAFT, { model: 'test/model' })

  const exposed = publicLead(lead)

  assert.equal(exposed.raw, undefined)
  assert.equal(exposed.draftHistory, undefined)
  assert.equal(exposed.previousDrafts, 1)
  assert.deepEqual(exposed.rawColumns, ['Timestamp', 'Notes'])
  assert.equal(exposed.draft.proposalMarkdown, DRAFT.proposalMarkdown)
})
