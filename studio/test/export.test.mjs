import test from 'node:test'
import assert from 'node:assert/strict'

import { clientProposal, downloadName, internalBrief } from '../lib/export.mjs'

const LEAD = {
  id: 'LD-TEST0001',
  name: 'Priya Sharma',
  business: 'Sharma Dental',
  businessType: 'Dental clinic',
  service: 'Business Website',
  budget: '₹15,000 – ₹30,000',
  timeline: 'Within a month',
  status: 'in_review',
  draft: {
    summary: 'A clinic that needs a clearer first impression.',
    fit: 'strong',
    fitReason: 'The budget covers the Business Website package.',
    proposalMarkdown: '# Website proposal for Sharma Dental\n\nA calm, mobile-first site.',
    checklist: [
      { area: 'Forms', item: 'Test appointment requests', why: 'Enquiries must arrive', priority: 'high' },
      { area: 'Content | Copy', item: 'Confirm the copy owner', why: 'Scope excludes copywriting', priority: 'medium' },
    ],
    questions: ['Do you have photography?'],
    risks: ['Content may arrive late.'],
    assumptions: ['The domain is owned by the clinic.'],
    nextAction: 'Book a discovery call.',
    model: 'test/model',
    generatedAt: '2026-10-27T05:10:00.000Z',
    reviewer: 'Abdullah Khatri',
    approvedAt: '2026-10-27T05:20:00.000Z',
    reviewNotes: 'Checked the price and the exclusions.',
  },
}

test('the client proposal contains only the proposal', () => {
  const markdown = clientProposal(LEAD)

  assert.match(markdown, /^# Website proposal for Sharma Dental/)
  assert.match(markdown, /A calm, mobile-first site\./)
  assert.doesNotMatch(markdown, /Test appointment requests/)
  assert.doesNotMatch(markdown, /Abdullah Khatri/)
  assert.doesNotMatch(markdown, /Nothing was sent automatically/)
})

test('a lead without a proposal cannot be exported', () => {
  assert.throws(() => clientProposal({ ...LEAD, draft: null }), /no proposal draft/i)
  assert.throws(() => clientProposal({ ...LEAD, draft: { proposalMarkdown: '' } }), /no proposal draft/i)
})

test('the internal brief includes checklist, risks and review state', () => {
  const markdown = internalBrief(LEAD)

  assert.match(markdown, /# Internal brief — Sharma Dental/)
  assert.match(markdown, /\*\*Status:\*\* in_review/)
  assert.match(markdown, /\*\*Reviewer:\*\* Abdullah Khatri/)
  assert.match(markdown, /\| Area \| Check \| Why it matters \| Priority \|/)
  assert.match(markdown, /Test appointment requests/)
  assert.match(markdown, /Content \\\| Copy/)
  assert.match(markdown, /Do you have photography\?/)
  assert.match(markdown, /Content may arrive late\./)
  assert.match(markdown, /Checked the price and the exclusions\./)
  assert.match(markdown, /Nothing was sent automatically/)
})

test('the brief handles missing sections without inventing content', () => {
  const markdown = internalBrief({
    ...LEAD,
    draft: {
      ...LEAD.draft,
      checklist: [],
      questions: [],
      risks: [],
      assumptions: [],
      nextAction: '',
      reviewNotes: '',
    },
  })

  assert.match(markdown, /_No checklist items\._/)
  assert.match(markdown, /_None recorded\._/)
  assert.match(markdown, /_No next action recorded\._/)
  assert.match(markdown, /_No review notes\._/)
})

test('download names are stable and filesystem-safe', () => {
  assert.equal(
    downloadName(LEAD, 'proposal'),
    'khatri-proposal-sharma-dental-LD-TEST0001.md',
  )
  assert.equal(
    downloadName({ ...LEAD, business: '', name: '  Café 42! ' }, 'brief'),
    'khatri-brief-caf-42-LD-TEST0001.md',
  )
})
