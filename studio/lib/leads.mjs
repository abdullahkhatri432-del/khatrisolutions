import { buildManualLead } from './csv.mjs'

export const STATUSES = ['new', 'drafted', 'in_review', 'approved', 'archived']

export const STATUS_LABELS = {
  new: 'New',
  drafted: 'Drafted',
  in_review: 'In review',
  approved: 'Approved',
  archived: 'Archived',
}

const ALLOWED_TRANSITIONS = {
  new: ['archived'],
  drafted: ['in_review', 'archived'],
  in_review: ['approved', 'drafted', 'archived'],
  approved: ['in_review', 'archived'],
  archived: ['drafted', 'new'],
}

const SOURCE_FIELDS = [
  'kind',
  'name',
  'email',
  'phone',
  'business',
  'businessType',
  'service',
  'budget',
  'timeline',
  'description',
  'contactMethod',
  'source',
  'receivedAt',
  'receivedAtRaw',
  'details',
  'missingFields',
  'canDraft',
  'isTest',
]

const MAX_HISTORY = 100
const MAX_DRAFT_HISTORY = 5

function nowIso() {
  return new Date().toISOString()
}

export function addHistory(lead, action, detail = '') {
  if (!Array.isArray(lead.history)) lead.history = []
  lead.history.unshift({ at: nowIso(), action, detail })
  if (lead.history.length > MAX_HISTORY) lead.history.length = MAX_HISTORY
}

function sourceChanged(existing, incoming) {
  return SOURCE_FIELDS.some((field) => {
    const before = existing[field]
    const after = incoming[field]
    if (before === after) return false
    // Arrays such as `missingFields` are new objects on every parse, so compare
    // their values instead of their identity.
    if (before && after && typeof before === 'object' && typeof after === 'object') {
      return JSON.stringify(before) !== JSON.stringify(after)
    }
    return true
  })
}

/**
 * New rows become `new` leads and are queued for drafting. Existing rows keep
 * their draft, notes and status so a Sheet refresh never destroys human work.
 */
export function upsertPulledLeads(store, incoming, { addedAt = nowIso(), label = 'the lead source' } = {}) {
  const result = { added: 0, updated: 0, unchanged: 0, queued: [] }

  for (const incomingLead of incoming) {
    const existing = store.leads.find((lead) => lead.id === incomingLead.id)

    if (!existing) {
      const lead = {
        ...incomingLead,
        status: 'new',
        draft: null,
        draftError: '',
        addedAt,
        updatedAt: addedAt,
        history: [],
      }
      addHistory(lead, 'pulled', `Imported from ${label}`)
      store.leads.push(lead)
      result.added += 1
      if (lead.canDraft) result.queued.push(lead.id)
      continue
    }

    // Only overwrite fields that still have a value in the source. Blank cells
    // in a Sheet should not wipe a usable brief.
    const changed = sourceChanged(existing, incomingLead)

    for (const field of SOURCE_FIELDS) {
      const value = incomingLead[field]
      if (field === 'details') {
        if (value && Object.keys(value).length > 0) existing.details = value
        continue
      }
      if (value !== '' && value !== undefined && value !== null) existing[field] = value
    }

    if (changed) {
      existing.updatedAt = addedAt
      addHistory(existing, 'source_updated', 'Source row changed')
      result.updated += 1
    } else {
      result.unchanged += 1
    }
  }

  return result
}

export function createManualLead(store, input) {
  const lead = buildManualLead(input)
  if (!lead.name) throw new Error('A name is required.')
  if (!lead.description || lead.description.length < 20) {
    throw new Error('Please add a project description of at least 20 characters.')
  }

  let id = lead.id
  let suffix = 1
  while (store.leads.some((entry) => entry.id === id)) {
    id = `${lead.id}-${suffix}`
    suffix += 1
  }
  lead.id = id

  const at = nowIso()
  Object.assign(lead, {
    status: 'new',
    draft: null,
    draftError: '',
    addedAt: at,
    updatedAt: at,
    history: [],
  })
  addHistory(lead, 'created', 'Added manually in Studio Desk')
  store.leads.push(lead)

  return lead
}

export function getLead(store, id) {
  return store.leads.find((lead) => lead.id === id) || null
}

const PRIORITIES = new Set(['high', 'medium', 'low'])

function cleanChecklist(checklist) {
  if (!Array.isArray(checklist)) return []
  return checklist
    .map((item) => ({
      area: String(item?.area || '').trim().slice(0, 80),
      item: String(item?.item || '').trim().slice(0, 500),
      why: String(item?.why || '').trim().slice(0, 500),
      priority: PRIORITIES.has(item?.priority) ? item.priority : 'medium',
    }))
    .filter((item) => item.item)
    .slice(0, 30)
}

function cleanList(value, limit = 20) {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => String(item || '').trim().slice(0, 600))
    .filter(Boolean)
    .slice(0, limit)
}

export function applyGeneratedDraft(lead, draft, { model, usage, trigger = 'manual' }) {
  const at = nowIso()
  const previous = lead.draft

  let draftHistory = Array.isArray(lead.draftHistory) ? lead.draftHistory : []
  if (previous?.proposalMarkdown) {
    draftHistory = [
      {
        at: previous.generatedAt || at,
        model: previous.model || '',
        proposalMarkdown: previous.proposalMarkdown,
      },
      ...draftHistory,
    ].slice(0, MAX_DRAFT_HISTORY)
  }

  lead.draftHistory = draftHistory
  lead.draft = {
    summary: String(draft.summary || '').slice(0, 2000),
    fit: ['strong', 'possible', 'poor'].includes(draft.fit) ? draft.fit : 'possible',
    fitReason: String(draft.fitReason || '').slice(0, 2000),
    proposalMarkdown: String(draft.proposalMarkdown || '').trim(),
    checklist: cleanChecklist(draft.checklist),
    questions: cleanList(draft.questions),
    risks: cleanList(draft.risks),
    assumptions: cleanList(draft.assumptions),
    nextAction: String(draft.nextAction || '').slice(0, 1000),

    model,
    usage: usage || null,
    generatedAt: at,
    updatedAt: at,
    editedAt: null,
    reviewNotes: previous?.reviewNotes || '',
    reviewer: '',
    reviewedAt: null,
    approvedAt: null,
  }

  lead.draftError = ''
  if (lead.status !== 'archived') lead.status = 'drafted'
  lead.updatedAt = at
  addHistory(
    lead,
    trigger === 'auto' ? 'draft_generated_auto' : 'draft_generated',
    `Generated with ${model}`,
  )

  return lead
}

function setDraftError(lead, message) {
  lead.draftError = String(message || 'The draft could not be generated.').slice(0, 1000)
  lead.updatedAt = nowIso()
  addHistory(lead, 'draft_failed', lead.draftError)
}

export { setDraftError }

export function editDraft(lead, patch) {
  if (lead.status === 'archived') throw new Error('Reopen this lead before editing its draft.')
  if (!lead.draft) throw new Error('There is no draft to edit yet.')
  const draft = lead.draft
  const at = nowIso()

  if (patch.proposalMarkdown !== undefined) {
    const markdown = String(patch.proposalMarkdown || '').trim()
    if (markdown.length < 40) throw new Error('The proposal is too short to save.')
    draft.proposalMarkdown = markdown.slice(0, 60000)
  }
  if (patch.summary !== undefined) draft.summary = String(patch.summary || '').slice(0, 2000)
  if (patch.fit !== undefined) {
    draft.fit = ['strong', 'possible', 'poor'].includes(patch.fit) ? patch.fit : draft.fit
  }
  if (patch.fitReason !== undefined) draft.fitReason = String(patch.fitReason || '').slice(0, 2000)
  if (patch.nextAction !== undefined) draft.nextAction = String(patch.nextAction || '').slice(0, 1000)
  if (patch.reviewNotes !== undefined) draft.reviewNotes = String(patch.reviewNotes || '').slice(0, 10000)
  if (patch.checklist !== undefined) draft.checklist = cleanChecklist(patch.checklist)
  if (patch.questions !== undefined) draft.questions = cleanList(patch.questions)
  if (patch.risks !== undefined) draft.risks = cleanList(patch.risks)
  if (patch.assumptions !== undefined) draft.assumptions = cleanList(patch.assumptions)

  draft.editedAt = at
  draft.updatedAt = at
  lead.updatedAt = at

  if (lead.status === 'approved') {
    lead.status = 'in_review'
    draft.approvedAt = null
    draft.reviewer = ''
    addHistory(lead, 'approval_reset', 'Draft edited after approval; review required again')
  } else {
    addHistory(lead, 'draft_edited', 'Draft edited by a human')
  }

  return lead
}

export function transitionLead(lead, next, reviewer = '') {
  if (!STATUSES.includes(next)) throw new Error(`Unknown status: ${next}`)
  const allowed = ALLOWED_TRANSITIONS[lead.status] || []
  if (!allowed.includes(next)) {
    throw new Error(`Cannot move a ${STATUS_LABELS[lead.status]} lead to ${STATUS_LABELS[next]}.`)
  }

  if (['in_review', 'approved'].includes(next) && !lead.draft) {
    throw new Error('Generate a draft before starting a review.')
  }
  if (next === 'drafted' && !lead.draft) {
    throw new Error('This lead has no draft to reopen. Reopen it as a new lead instead.')
  }

  const at = nowIso()
  lead.status = next
  lead.updatedAt = at

  if (next === 'in_review') {
    lead.draft.reviewer = ''
    lead.draft.reviewedAt = null
    lead.draft.approvedAt = null
    addHistory(lead, 'review_started', 'Human review started')
  } else if (next === 'approved') {
    lead.draft.reviewer = reviewer
    lead.draft.reviewedAt = at
    lead.draft.approvedAt = at
    addHistory(lead, 'approved', `Approved by ${reviewer}. Nothing was sent.`)
  } else if (next === 'drafted') {
    lead.draft.approvedAt = null
    lead.draft.reviewer = ''
    lead.draft.reviewedAt = null
    addHistory(lead, 'review_returned', 'Returned to draft for changes')
  } else if (next === 'new') {
    addHistory(lead, 'reopened', 'Reopened from the archive with no draft')
  } else if (next === 'archived') {
    addHistory(lead, 'archived', 'Archived; no proposal was sent')
  }

  return lead
}

export function statsFor(leads) {
  const byStatus = Object.fromEntries(STATUSES.map((status) => [status, 0]))
  for (const lead of leads) {
    if (byStatus[lead.status] !== undefined) byStatus[lead.status] += 1
  }

  return {
    total: leads.length,
    byStatus,
    needsReview: byStatus.in_review,
    approved: byStatus.approved,
  }
}

export function sortLeads(leads) {
  return [...leads].sort((a, b) => {
    const aDate = Date.parse(a.receivedAt || a.addedAt || '') || 0
    const bDate = Date.parse(b.receivedAt || b.addedAt || '') || 0
    return bDate - aDate
  })
}

export function publicLead(lead) {
  // `raw` can contain every Sheet column and old drafts can be large; the UI
  // only needs the mapped fields and the current draft.
  const { raw, draftHistory, ...rest } = lead
  return {
    ...rest,
    previousDrafts: Array.isArray(draftHistory) ? draftHistory.length : 0,
    rawColumns: raw ? Object.keys(raw) : [],
  }
}
