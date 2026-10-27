import test from 'node:test'
import assert from 'node:assert/strict'

import {
  generateDraft,
  normalizeDraft,
  OpenRouterError,
  parseModelJson,
} from '../lib/openrouter.mjs'

const PROPOSAL = `# Website proposal for Sharma Dental

## What we understand

Sharma Dental needs a calm, mobile-first website that explains its services and makes appointment requests easy. The current site is difficult to update and does not work well on a phone.

## Recommended approach

We recommend the Business Website package: five clear pages, a reusable section system and a direct enquiry path with WhatsApp and a form.

## Investment

The published starting price for the Business Website package is ₹7,999. The final quote is confirmed in writing after scope. Taxes and external costs are separate.

## Next step

A short discovery call will confirm the page list, photography and who will supply the copy.`

const LEAD = {
  id: 'LD-TEST0001',
  name: 'Priya Sharma',
  email: 'priya@example.com',
  phone: '+91 90000 00000',
  business: 'Sharma Dental',
  businessType: 'Dental clinic',
  service: 'Business Website',
  budget: '₹15,000 – ₹30,000',
  timeline: 'Within a month',
  description: 'We need a calm, mobile-first site with services and appointment requests.',
  source: 'Website enquiry',
  receivedAt: '2026-10-27T04:52:23.000Z',
  details: {},
}

const CONFIG = {
  openrouterKey: 'sk-or-test',
  openrouterModel: 'test/model',
  openrouterBaseUrl: 'https://openrouter.test/api/v1/',
  siteUrl: 'https://example.test',
  requestTimeoutMs: 5000,
  maxTokens: 4000,
  temperature: 0.3,
}

function draftJson(overrides = {}) {
  return JSON.stringify({
    summary: 'A strong fit for the Business Website package.',
    fit: 'strong',
    fitReason: 'Five pages and an enquiry form match the brief.',
    proposalMarkdown: PROPOSAL,
    checklist: [
      { area: 'Content', item: 'Confirm who writes the service copy', why: 'Scope excludes copywriting', priority: 'high' },
      { area: 'Forms', item: 'Test appointment requests on a phone', why: 'Enquiries are the goal', priority: 'high' },
    ],
    questions: ['Do you have photography of the clinic?'],
    risks: ['Copy may arrive late.'],
    assumptions: ['The client owns the domain.'],
    nextAction: 'Send the proposal for review.',
    ...overrides,
  })
}

function reply(content, { status = 200, usage = { total_tokens: 1234 } } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({ choices: [{ message: { content } }], usage }),
    text: async () => '',
  }
}

function errorReply(status, body = {}) {
  return {
    ok: false,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

test('parses plain and fenced JSON', () => {
  assert.deepEqual(parseModelJson('{"a":1}'), { a: 1 })
  assert.deepEqual(parseModelJson('```json\n{"a":1}\n```'), { a: 1 })
  assert.deepEqual(parseModelJson('```\n{"a":1}\n```'), { a: 1 })
  assert.deepEqual(parseModelJson('Here is the draft:\n{"a":1}\nThanks.'), { a: 1 })
})

test('rejects empty or non-object responses', () => {
  assert.throws(() => parseModelJson(''), /empty response/i)
  assert.throws(() => parseModelJson('not json'), /expected JSON/i)
  assert.throws(() => parseModelJson('[1,2,3]'), /expected JSON/i)
})

test('normalises a draft and adds a title when the model omits one', () => {
  const draft = normalizeDraft(
    {
      summary: 'Summary',
      fit: 'STRONG',
      fitReason: 'Reason',
      proposalMarkdown: `A proposal without a heading. ${'More detail. '.repeat(30)}`,
      checklist: [{ area: 'Content', item: 'Check copy', why: 'Scope', priority: 'urgent' }],
      questions: 'One question\n- Another question',
      risks: ['A risk'],
      assumptions: 'One assumption',
      nextAction: 'Call them',
    },
    LEAD,
  )

  assert.equal(draft.fit, 'strong')
  assert.match(draft.proposalMarkdown, /^# Proposal for Sharma Dental/)
  assert.equal(draft.checklist[0].priority, 'medium')
  assert.deepEqual(draft.questions, ['One question', 'Another question'])
  assert.deepEqual(draft.assumptions, ['One assumption'])
})

test('rejects a proposal that is too short to review', () => {
  assert.throws(
    () => normalizeDraft({ proposalMarkdown: 'Too short.' }, LEAD),
    /too short/i,
  )
})

test('bracketed placeholders are flagged for review without changing the text', () => {
  const draft = normalizeDraft(
    {
      proposalMarkdown: `# Proposal for Sharma Dental\n\n${'Detail. '.repeat(30)}Patients search for "dentist [your area]" and need a clear answer.`,
      risks: ['Copy may arrive late.'],
    },
    LEAD,
  )

  assert.match(draft.proposalMarkdown, /\[your area\]/)
  assert.match(draft.risks[0], /bracketed placeholders/i)
  assert.match(draft.risks[0], /\[your area\]/)
  assert.equal(draft.risks[1], 'Copy may arrive late.')
})

test('markdown links are not mistaken for placeholders', () => {
  const draft = normalizeDraft(
    {
      proposalMarkdown: `# Proposal for Sharma Dental\n\n${'Detail. '.repeat(30)}See [our process](https://example.test/process) for the next step.`,
      risks: [],
    },
    LEAD,
  )

  assert.deepEqual(draft.risks, [])
})

test('generates a draft through OpenRouter and withholds contact details', async () => {
  let request = null
  const fetchImpl = async (url, options) => {
    request = { url, options }
    return reply(draftJson())
  }

  const { draft, usage } = await generateDraft({ lead: LEAD, config: CONFIG, fetchImpl })

  assert.equal(request.url, 'https://openrouter.test/api/v1/chat/completions')
  assert.equal(request.options.headers.Authorization, 'Bearer sk-or-test')
  assert.equal(request.options.headers['X-Title'], 'Khatri Solutions Studio Desk')

  const body = JSON.parse(request.options.body)
  assert.equal(body.model, 'test/model')
  assert.equal(body.stream, false)
  assert.equal(body.messages[0].role, 'system')

  const sent = body.messages.map((message) => message.content).join('\n')
  assert.match(sent, /Dental clinic/)
  assert.match(sent, /₹15,000 – ₹30,000/)
  assert.equal(sent.includes('priya@example.com'), false)
  assert.equal(sent.includes('+91 90000 00000'), false)

  assert.equal(draft.fit, 'strong')
  assert.equal(draft.proposalMarkdown, PROPOSAL)
  assert.deepEqual(usage, { total_tokens: 1234 })
})

test('refuses to call OpenRouter without a key', async () => {
  await assert.rejects(
    () => generateDraft({ lead: LEAD, config: { ...CONFIG, openrouterKey: '' }, fetchImpl: async () => reply(draftJson()) }),
    (error) => error instanceof OpenRouterError && /OPENROUTER_API_KEY is not set/.test(error.message),
  )
})

test('maps authentication failures to an actionable message', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
    return errorReply(401, { error: { message: 'No auth credentials found' } })
  }

  await assert.rejects(
    () => generateDraft({ lead: LEAD, config: CONFIG, fetchImpl }),
    (error) => {
      assert.equal(error.status, 401)
      assert.match(error.message, /rejected the API key/i)
      return true
    },
  )
  assert.equal(calls, 1)
})

test('retries once on rate limits, then succeeds', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
    if (calls === 1) return errorReply(429, { error: { message: 'rate limited' } })
    return reply(draftJson())
  }

  const { draft } = await generateDraft({ lead: LEAD, config: CONFIG, fetchImpl })
  assert.equal(calls, 2)
  assert.equal(draft.summary, 'A strong fit for the Business Website package.')
})

test('reports server failures after one retry', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
    return errorReply(503, { error: 'upstream down' })
  }

  await assert.rejects(
    () => generateDraft({ lead: LEAD, config: CONFIG, fetchImpl }),
    (error) => {
      assert.equal(error.status, 503)
      assert.match(error.message, /having trouble/i)
      return true
    },
  )
  assert.equal(calls, 2)
})

test('rejects model output that is not the expected JSON', async () => {
  const fetchImpl = async () => reply('I cannot produce that.')
  await assert.rejects(
    () => generateDraft({ lead: LEAD, config: CONFIG, fetchImpl }),
    /expected JSON/i,
  )
})

test('rejects an empty model response', async () => {
  const fetchImpl = async () => reply('')
  await assert.rejects(
    () => generateDraft({ lead: LEAD, config: CONFIG, fetchImpl }),
    /no proposal text/i,
  )
})

test('reports a network failure honestly', async () => {
  const fetchImpl = async () => {
    throw new Error('ECONNREFUSED')
  }

  await assert.rejects(
    () => generateDraft({ lead: LEAD, config: CONFIG, fetchImpl }),
    /Could not reach OpenRouter: ECONNREFUSED/,
  )
})
