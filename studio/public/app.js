const STATUS_LABELS = {
  new: 'New',
  drafted: 'Drafted',
  in_review: 'In review',
  approved: 'Approved',
  archived: 'Archived',
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'drafted', label: 'Drafted' },
  { id: 'in_review', label: 'In review' },
  { id: 'approved', label: 'Approved' },
  { id: 'archived', label: 'Archived' },
]

const DETAIL_LABELS = {
  pages: 'Pages required',
  productCount: 'Estimated products',
  commerceNeeds: 'Payment and delivery',
  appProblem: 'Problem to solve',
  userRoles: 'User roles',
  appFeatures: 'Required features',
  automationTask: 'Task to automate',
  currentTools: 'Tools used today',
  existingWebsite: 'Existing website',
  currentWebsite: 'Current website',
}

const HISTORY_LABELS = {
  pulled: 'Lead pulled',
  source_updated: 'Source row updated',
  created: 'Lead added',
  draft_generated: 'Draft generated',
  draft_generated_auto: 'Draft generated automatically',
  draft_failed: 'Draft failed',
  draft_edited: 'Draft edited',
  approval_reset: 'Approval reset after edit',
  review_started: 'Review started',
  approved: 'Approved (not sent)',
  review_returned: 'Returned to draft',
  archived: 'Archived',
  reopened: 'Reopened from archive',
}

const state = {
  config: null,
  stats: null,
  leads: [],
  drafting: [],
  queueLength: 0,
  lastSyncAt: null,
  selectedId: localStorage.getItem('studio.selected') || '',
  filter: 'all',
  search: '',
  tab: 'proposal',
  preview: false,
  dirty: false,
  edits: null,
  editsLeadId: '',
  syncing: false,
  saving: false,
  generatingId: '',
  fatal: '',
  actionError: '',
  autoAttempted: new Set(),
  pollTimer: null,
  polling: false,
}

const $ = (selector, root = document) => root.querySelector(selector)
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}

function selectedLead() {
  return state.leads.find((lead) => lead.id === state.selectedId) || null
}

function formatDate(value, withTime = false) {
  if (!value) return 'Not recorded'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const day = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  if (!withTime) return day
  return `${day}, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
}

function statusChip(status) {
  return `<span class="chip chip--${esc(status)}">${esc(STATUS_LABELS[status] || status)}</span>`
}

function editsFromDraft(draft) {
  if (!draft) return null
  return {
    proposalMarkdown: draft.proposalMarkdown || '',
    checklist: (draft.checklist || []).map((item) => ({
      area: item.area || '',
      item: item.item || '',
      why: item.why || '',
      priority: item.priority || 'medium',
    })),
    questions: (draft.questions || []).join('\n'),
    risks: (draft.risks || []).join('\n'),
    assumptions: (draft.assumptions || []).join('\n'),
    summary: draft.summary || '',
    fit: draft.fit || 'possible',
    fitReason: draft.fitReason || '',
    nextAction: draft.nextAction || '',
    reviewNotes: draft.reviewNotes || '',
  }
}

function resetEdits(lead) {
  state.editsLeadId = lead?.id || ''
  state.edits = editsFromDraft(lead?.draft)
  state.dirty = false
}

function lines(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function toast(message, kind = '') {
  const element = $('#toast')
  if (!element) return
  element.textContent = message
  element.className = `toast is-visible${kind ? ` toast--${kind}` : ''}`
  clearTimeout(toast.timer)
  toast.timer = setTimeout(() => {
    element.classList.remove('is-visible')
  }, kind === 'error' ? 7000 : 4200)
}

async function api(path, { method = 'GET', body } = {}) {
  const options = { method, headers: { Accept: 'application/json' } }
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  const response = await fetch(path, options)
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.error || `Request failed (${response.status}).`)
    error.status = response.status
    error.code = data?.code || ''
    throw error
  }

  return data
}

/* ---------- Render: chrome ---------- */

function renderStatusChips() {
  const element = $('#status-chips')
  if (!element || !state.config) return

  const chips = []
  chips.push(
    state.config.sheetConfigured
      ? `<span class="chip chip--good" title="${esc(state.config.sheetHost || state.config.sheetSource)}">Leads: ${esc(state.config.sheetSource)}</span>`
      : '<span class="chip chip--warn">Leads: not connected</span>',
  )
  chips.push(
    state.config.openrouterConfigured
      ? '<span class="chip chip--good">OpenRouter: ready</span>'
      : '<span class="chip chip--warn">OpenRouter: key missing</span>',
  )
  chips.push(
    `<span class="chip chip--neutral">Auto-draft: ${state.config.autoDraft ? 'on' : 'off'}</span>`,
  )
  chips.push('<span class="chip chip--neutral">Never auto-sends</span>')
  element.innerHTML = chips.join('')
}

function renderFilters() {
  const element = $('#filters')
  if (!element) return
  const counts = { all: state.leads.length, ...state.stats?.byStatus }

  element.innerHTML = FILTERS.map(
    (filter) => `<button class="filter${state.filter === filter.id ? ' is-active' : ''}" type="button" aria-pressed="${state.filter === filter.id}" data-filter="${filter.id}">${filter.label} <span class="count">${counts[filter.id] ?? 0}</span></button>`,
  ).join('')
}

function filteredLeads() {
  const search = state.search.trim().toLowerCase()
  return state.leads.filter((lead) => {
    if (state.filter !== 'all' && lead.status !== state.filter) return false
    if (!search) return true
    return [
      lead.name,
      lead.business,
      lead.businessType,
      lead.service,
      lead.budget,
      lead.description,
      lead.id,
    ]
      .join(' ')
      .toLowerCase()
      .includes(search)
  })
}

function renderList() {
  const element = $('#lead-list')
  if (!element) return
  $('#lead-count').textContent = String(state.leads.length)

  const leads = filteredLeads()
  if (leads.length === 0) {
    element.innerHTML = `<p class="sidebar__empty">${
      state.leads.length === 0
        ? 'No leads yet. Pull the Sheet, import a CSV, or add one manually.'
        : 'No leads match this filter.'
    }</p>`
    return
  }

  element.innerHTML = leads
    .map((lead) => {
      const active = lead.id === state.selectedId
      const drafting = state.drafting.includes(lead.id)
      return `<button type="button" class="lead-card${active ? ' is-active' : ''}" data-select="${esc(lead.id)}" ${active ? 'aria-current="true"' : ''}>
        <span class="lead-card__top">
          <span class="lead-card__name">${esc(lead.business || lead.name || 'Unnamed lead')}</span>
          ${statusChip(lead.status)}
        </span>
        <span class="lead-card__meta">${esc([lead.name, lead.service, lead.budget].filter(Boolean).join(' · ') || 'Details pending')}</span>
        <span class="lead-card__snippet">${esc((lead.description || 'No description supplied.').slice(0, 240))}</span>
        <span class="lead-card__foot">
          <span>${esc(formatDate(lead.receivedAt || lead.addedAt))}</span>
          ${lead.isTest ? '<span class="chip chip--test">Test</span>' : ''}
          ${drafting ? '<span class="draft-dot" aria-label="Drafting"></span>' : ''}
        </span>
      </button>`
    })
    .join('')
}

/* ---------- Render: detail ---------- */

function detailFacts(lead) {
  const contact = [lead.email, lead.phone].filter(Boolean).join(' · ') || 'Not supplied'
  const facts = [
    ['Contact', contact],
    ['Business type', lead.businessType || 'Not supplied'],
    ['Service', lead.service || 'Not supplied'],
    ['Budget', lead.budget || 'Not supplied'],
    ['Timeline', lead.timeline || 'Not supplied'],
    ['Preferred contact', lead.contactMethod || 'Not supplied'],
    ['Source', lead.source || 'Not supplied'],
    ['Received', formatDate(lead.receivedAt || lead.addedAt)],
  ]

  return `<div class="facts">${facts
    .map(
      ([label, value]) =>
        `<div class="fact"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`,
    )
    .join('')}</div>`
}

function detailBrief(lead) {
  const details = Object.entries(lead.details || {})
  return `<details class="brief"${lead.draft ? '' : ' open'}>
    <summary>Their enquiry</summary>
    <p>${esc(lead.description || 'No description supplied. This lead cannot be drafted until a brief is added.')}</p>
    ${
      details.length
        ? `<dl>${details
            .map(
              ([key, value]) =>
                `<dt>${esc(DETAIL_LABELS[key] || key)}</dt><dd>${esc(value)}</dd>`,
            )
            .join('')}</dl>`
        : ''
    }
  </details>`
}

function statusActions(lead) {
  const buttons = []
  if (lead.status === 'drafted') {
    buttons.push('<button class="btn btn--primary btn--small" type="button" data-status="in_review">Start review</button>')
  }
  if (lead.status === 'in_review') {
    buttons.push('<button class="btn btn--primary btn--small" type="button" data-status="approved">Approve draft</button>')
    buttons.push('<button class="btn btn--ghost btn--small" type="button" data-status="drafted">Back to draft</button>')
  }
  if (lead.status === 'approved') {
    buttons.push('<button class="btn btn--ghost btn--small" type="button" data-status="archived">Archive</button>')
  }
  if (lead.status === 'archived') {
    buttons.push(
      lead.draft
        ? '<button class="btn btn--ghost btn--small" type="button" data-status="drafted">Reopen in draft</button>'
        : '<button class="btn btn--ghost btn--small" type="button" data-status="new">Reopen lead</button>',
    )
  }
  if (!['archived', 'approved'].includes(lead.status)) {
    buttons.push('<button class="btn btn--danger btn--small" type="button" data-status="archived">Archive</button>')
  }
  return buttons.join('')
}

function nextStatusButton(lead) {
  if (lead.status === 'drafted') {
    return '<button class="btn btn--primary btn--small" type="button" data-status="in_review">Start review</button>'
  }
  if (lead.status === 'in_review') {
    return '<button class="btn btn--primary btn--small" type="button" data-status="approved">Approve draft</button>'
  }
  if (lead.status === 'approved') {
    return '<button class="btn btn--ghost btn--small" type="button" data-status="archived">Archive</button>'
  }
  if (lead.status === 'archived') {
    return lead.draft
      ? '<button class="btn btn--ghost btn--small" type="button" data-status="drafted">Reopen in draft</button>'
      : '<button class="btn btn--ghost btn--small" type="button" data-status="new">Reopen lead</button>'
  }
  return ''
}

function renderGeneratePanel(lead) {
  const generating = state.generatingId === lead.id || state.drafting.includes(lead.id)
  const missing = lead.missingFields || []
  const canDraft = lead.canDraft && !missing.length
  const keyReady = Boolean(state.config?.openrouterConfigured)

  if (generating) {
    return `<section class="generate">
      <p class="eyebrow">OpenRouter</p>
      <h2>Drafting a proposal…</h2>
      <p>The brief is with ${esc(state.config?.model || 'the model')}. This usually takes 15–40 seconds. You can keep working in other leads.</p>
      <div class="generate__actions"><span class="spin" aria-hidden="true"></span><span class="muted">Writing the proposal and audit checklist…</span></div>
    </section>`
  }

  return `<section class="generate">
    <p class="eyebrow">Ready for a draft</p>
    <h2>No proposal yet</h2>
    <p>${canDraft ? 'Use the enquiry below to draft a bespoke proposal and an internal delivery checklist. The draft waits here for your review.' : 'This lead needs a name and a description of at least 20 characters before a proposal can be written. Fix the source row and pull again, or add a new manual entry with the full brief.'}</p>
    ${
      lead.draftError
        ? `<div class="notice notice--danger"><span class="notice__icon">!</span><span><strong>The last attempt failed.</strong> ${esc(lead.draftError)}</span></div>`
        : ''
    }
    ${
      !keyReady
        ? '<div class="notice notice--warn"><span class="notice__icon">!</span><span><strong>OPENROUTER_API_KEY is missing.</strong> Add it to <code>.env.local</code> and restart the desk. <button class="btn btn--ghost btn--small" type="button" data-action="settings">Open setup</button></span></div>'
        : ''
    }
    ${
      missing.length
        ? `<div class="notice notice--warn"><span class="notice__icon">!</span><span><strong>Missing:</strong> ${esc(missing.join(', '))}. Add it in the source or manually.</span></div>`
        : ''
    }
    <div class="generate__actions">
      <button class="btn btn--primary" type="button" data-action="generate" ${canDraft && keyReady ? '' : 'disabled'}>Generate proposal</button>
      ${
        state.config?.autoDraft && canDraft && keyReady
          ? lead.draftError
            ? '<span class="muted">Automatic retries are off after a failure, so a provider error cannot spend money in a loop. Use Generate proposal to try again.</span>'
            : '<span class="muted">Auto-draft is on. If this lead was just pulled, it may already be queued.</span>'
          : ''
      }
    </div>
    <p class="generate__note">Only the brief fields — name, business, business type, service, budget, timeline and description — are sent to OpenRouter. Email and phone stay local. Nothing is sent to the lead.</p>
  </section>`
}

function renderProposalPanel() {
  const words = String(state.edits?.proposalMarkdown || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return `<section class="panel" id="panel-proposal" role="tabpanel" aria-labelledby="tab-proposal" ${state.tab === 'proposal' ? '' : 'hidden'}>
    <div class="panel__head">
      <div>
        <h2>Client proposal</h2>
        <p>This is the document you will send. Edit it freely; the lead never sees it automatically.</p>
      </div>
      <div class="panel__actions">
        <span class="word-count" id="word-count">${words} words</span>
        <button class="btn btn--ghost btn--small" type="button" data-action="toggle-preview">${state.preview ? 'Write' : 'Preview'}</button>
        <button class="btn btn--primary btn--small" type="button" data-action="save" ${state.dirty ? '' : 'disabled'}>Save changes</button>
      </div>
    </div>
    ${
      state.preview
        ? `<div class="preview"><div class="prose">${renderMarkdown(state.edits?.proposalMarkdown || '')}</div></div>`
        : `<textarea class="editor" id="proposal-md" spellcheck="true" aria-label="Proposal Markdown">${esc(state.edits?.proposalMarkdown || '')}</textarea>`
    }
    <div class="notice notice--safe">
      <span class="notice__icon" aria-hidden="true">✓</span>
      <span><strong>Nothing is sent by Studio Desk.</strong> When the proposal is ready, copy or download it and send it from your own email.</span>
    </div>
  </section>`
}

function checklistRows() {
  const items = state.edits?.checklist || []
  if (items.length === 0) {
    return '<div class="check-empty">No checklist items yet. Add the checks this project needs before delivery.</div>'
  }
  return items
    .map(
      (item, index) => `<div class="check-row" data-check-row="${index}">
        <input data-check-field="area" aria-label="Checklist area" value="${esc(item.area)}" placeholder="Content" />
        <input data-check-field="item" aria-label="Checklist item" value="${esc(item.item)}" placeholder="Concrete check" />
        <input data-check-field="why" aria-label="Why it matters" value="${esc(item.why)}" placeholder="Why it matters" />
        <select data-check-field="priority" aria-label="Priority">
          <option value="high"${item.priority === 'high' ? ' selected' : ''}>High</option>
          <option value="medium"${item.priority === 'medium' ? ' selected' : ''}>Medium</option>
          <option value="low"${item.priority === 'low' ? ' selected' : ''}>Low</option>
        </select>
        <button class="icon-button" type="button" data-action="remove-check" data-index="${index}" aria-label="Remove checklist item">×</button>
      </div>`,
    )
    .join('')
}

function renderChecklistPanel() {
  return `<section class="panel" id="panel-checklist" role="tabpanel" aria-labelledby="tab-checklist" ${state.tab === 'checklist' ? '' : 'hidden'}>
    <div class="panel__head">
      <div>
        <h2>Audit checklist</h2>
        <p>Internal only. These checks never appear in the client proposal.</p>
      </div>
      <div class="panel__actions">
        <button class="btn btn--ghost btn--small" type="button" data-action="add-check">Add check</button>
        <button class="btn btn--primary btn--small" type="button" data-action="save" ${state.dirty ? '' : 'disabled'}>Save changes</button>
      </div>
    </div>
    <div class="check-head" aria-hidden="true">
      <span>Area</span><span>Check</span><span>Why it matters</span><span>Priority</span><span></span>
    </div>
    ${checklistRows()}
  </section>`
}

function renderDiscoveryPanel() {
  return `<section class="panel" id="panel-discovery" role="tabpanel" aria-labelledby="tab-discovery" ${state.tab === 'discovery' ? '' : 'hidden'}>
    <div class="panel__head">
      <div>
        <h2>Questions, risks & assumptions</h2>
        <p>Internal notes to close gaps before the proposal is sent. One item per line.</p>
      </div>
      <div class="panel__actions">
        <button class="btn btn--primary btn--small" type="button" data-action="save" ${state.dirty ? '' : 'disabled'}>Save changes</button>
      </div>
    </div>
    <div class="review-grid">
      <label class="field">
        <span>Questions for the lead</span>
        <textarea class="editor editor--short" id="questions" aria-label="Questions for the lead">${esc(state.edits?.questions || '')}</textarea>
      </label>
      <div>
        <label class="field">
          <span>Delivery risks</span>
          <textarea class="editor editor--short" id="risks" aria-label="Delivery risks">${esc(state.edits?.risks || '')}</textarea>
        </label>
        <label class="field">
          <span>Assumptions</span>
          <textarea class="editor editor--short" id="assumptions" aria-label="Assumptions">${esc(state.edits?.assumptions || '')}</textarea>
        </label>
      </div>
    </div>
  </section>`
}

function renderReviewPanel(lead) {
  const draft = lead.draft
  return `<section class="panel" id="panel-review" role="tabpanel" aria-labelledby="tab-review" ${state.tab === 'review' ? '' : 'hidden'}>
    <div class="panel__head">
      <div>
        <h2>Human review</h2>
        <p>Approving changes the status only. It does not email, message or publish anything.</p>
      </div>
      <div class="panel__actions">
        <button class="btn btn--primary btn--small" type="button" data-action="save" ${state.dirty ? '' : 'disabled'}>Save changes</button>
      </div>
    </div>

    <div class="review-grid">
      <div>
        <label class="field">
          <span>Internal summary</span>
          <textarea class="editor editor--short" id="summary" aria-label="Internal summary">${esc(state.edits?.summary || '')}</textarea>
        </label>
        <label class="field">
          <span>Fit</span>
          <select id="fit" aria-label="Fit">
            <option value="strong"${state.edits?.fit === 'strong' ? ' selected' : ''}>Strong fit</option>
            <option value="possible"${state.edits?.fit === 'possible' ? ' selected' : ''}>Possible fit</option>
            <option value="poor"${state.edits?.fit === 'poor' ? ' selected' : ''}>Poor fit</option>
          </select>
        </label>
        <label class="field">
          <span>Why this fit</span>
          <textarea class="editor editor--short" id="fitReason" aria-label="Fit reason">${esc(state.edits?.fitReason || '')}</textarea>
        </label>
        <label class="field">
          <span>Next internal action</span>
          <textarea class="editor editor--short" id="nextAction" aria-label="Next internal action">${esc(state.edits?.nextAction || '')}</textarea>
        </label>
      </div>

      <div class="review-card">
        <h3>Review status</h3>
        <p class="status-note">${statusChip(lead.status)}</p>
        <p class="status-note"><strong>Reviewer:</strong> ${esc(draft?.reviewer || 'Not reviewed yet')}<br />
          <strong>Approved:</strong> ${esc(draft?.approvedAt ? formatDate(draft.approvedAt, true) : 'Not approved')}</p>
        <div class="status-actions">${statusActions(lead)}</div>
        <p class="status-note">Save edits before approving. Editing an approved draft automatically returns it to review.</p>

        <label class="field" style="margin-top:16px">
          <span>Review notes</span>
          <textarea class="editor editor--short" id="reviewNotes" aria-label="Review notes">${esc(state.edits?.reviewNotes || '')}</textarea>
        </label>
        <button class="btn btn--primary btn--small" type="button" data-action="save" ${state.dirty ? '' : 'disabled'}>Save changes</button>
      </div>
    </div>
  </section>`
}

function renderHistory(lead) {
  const history = (lead.history || []).slice(0, 8)
  if (history.length === 0) return ''
  return `<section class="history">
    <h2>Activity</h2>
    <ol>
      ${history
        .map(
          (event) => `<li><time>${esc(formatDate(event.at, true))}</time><span><strong>${esc(HISTORY_LABELS[event.action] || event.action)}</strong>${event.detail ? ` — ${esc(event.detail)}` : ''}</span></li>`,
        )
        .join('')}
    </ol>
  </section>`
}

function renderDraft(lead) {
  const draft = lead.draft
  return `${detailFacts(lead)}
    ${detailBrief(lead)}

    <div class="draftbar">
      <div class="draftbar__meta">
        <strong>${esc(draft.model || 'Model not recorded')} · generated ${esc(formatDate(draft.generatedAt, true))}</strong>
        <span>${draft.editedAt ? `Edited ${esc(formatDate(draft.editedAt, true))} · ` : ''}${draft.reviewer ? `Reviewer: ${esc(draft.reviewer)} · ` : ''}<span id="save-state">${state.dirty ? '<span class="unsaved">Unsaved changes</span>' : 'Saved locally'}</span></span>
      </div>
      <div class="draftbar__actions">
        ${nextStatusButton(lead)}
        <button class="btn btn--ghost btn--small" type="button" data-action="copy">Copy proposal</button>
        <a class="btn btn--ghost btn--small" href="/api/leads/${encodeURIComponent(lead.id)}/proposal.md" data-download>Download .md</a>
        <a class="btn btn--ghost btn--small" href="/api/leads/${encodeURIComponent(lead.id)}/brief.md" data-download>Internal brief</a>
        <button class="btn btn--ghost btn--small" type="button" data-action="regenerate">Regenerate</button>
      </div>
    </div>

    <div class="tabs" role="tablist" aria-label="Draft sections">
      <button class="tab${state.tab === 'proposal' ? ' is-active' : ''}" type="button" role="tab" id="tab-proposal" aria-controls="panel-proposal" aria-selected="${state.tab === 'proposal'}" data-tab="proposal">Proposal</button>
      <button class="tab${state.tab === 'checklist' ? ' is-active' : ''}" type="button" role="tab" id="tab-checklist" aria-controls="panel-checklist" aria-selected="${state.tab === 'checklist'}" data-tab="checklist">Audit checklist <span class="count">${draft.checklist?.length || 0}</span></button>
      <button class="tab${state.tab === 'discovery' ? ' is-active' : ''}" type="button" role="tab" id="tab-discovery" aria-controls="panel-discovery" aria-selected="${state.tab === 'discovery'}" data-tab="discovery">Questions &amp; risks</button>
      <button class="tab${state.tab === 'review' ? ' is-active' : ''}" type="button" role="tab" id="tab-review" aria-controls="panel-review" aria-selected="${state.tab === 'review'}" data-tab="review">Review</button>
    </div>

    ${renderProposalPanel()}
    ${renderChecklistPanel()}
    ${renderDiscoveryPanel()}
    ${renderReviewPanel(lead)}

    ${state.actionError ? `<div class="notice notice--danger"><span class="notice__icon">!</span><span>${esc(state.actionError)}</span></div>` : ''}
    ${renderHistory(lead)}`
}

function renderDetail() {
  const element = $('#detail')
  if (!element) return

  const lead = selectedLead()
  if (!lead) {
    renderEmpty()
    return
  }

  if (state.editsLeadId !== lead.id) resetEdits(lead)
  if (!lead.draft) {
    state.edits = null
    state.dirty = false
  }

  const drafting = state.drafting.includes(lead.id) || state.generatingId === lead.id

  element.innerHTML = `<article class="detail">
    <header class="detail__head">
      <div>
        <p class="eyebrow">Lead ${esc(lead.id)} · ${esc(formatDate(lead.receivedAt || lead.addedAt))}</p>
        <h1>${esc(lead.business || lead.name || 'Unnamed lead')}</h1>
        <p class="detail__sub">${esc([lead.name, lead.businessType].filter(Boolean).join(' · ') || 'Business type not supplied')}</p>
      </div>
      <div class="detail__badges">
        ${statusChip(lead.status)}
        ${lead.isTest ? '<span class="chip chip--test">Test lead</span>' : ''}
        ${drafting ? '<span class="chip chip--warn">Drafting…</span>' : ''}
      </div>
    </header>

    ${lead.draft ? renderDraft(lead) : `${detailFacts(lead)}${detailBrief(lead)}${renderGeneratePanel(lead)}${renderHistory(lead)}`}
  </article>`

  updateDirtyUi()
}

function renderEmpty() {
  const element = $('#detail')
  if (!element) return

  element.innerHTML = `<div class="empty">
    <div class="empty__inner">
      <p class="eyebrow">Studio Desk</p>
      <h1>${state.leads.length ? 'Choose a lead' : 'Your proposal desk is ready.'}</h1>
      <p>${state.leads.length ? 'Select a lead from the inbox to review its brief and draft.' : 'Pull leads from the Google Sheet CSV, import an export, or add one manually. New leads are drafted for review — never sent.'}</p>
      <div class="empty__actions">
        <button class="btn btn--primary" type="button" data-action="sync">Pull leads</button>
        <button class="btn btn--ghost" type="button" data-action="import">Import CSV</button>
        <button class="btn btn--ghost" type="button" data-action="add">Add a lead</button>
      </div>
      <ol class="empty__steps">
        <li><strong>Pull or add a lead.</strong> The desk reads the brief, budget and business type.</li>
        <li><strong>A draft is generated</strong> with OpenRouter when auto-draft is on, or when you ask for one.</li>
        <li><strong>Review, edit and approve.</strong> Approval only changes the status.</li>
        <li><strong>Copy or download</strong> the proposal and send it yourself.</li>
      </ol>
    </div>
  </div>`
}

function renderFatal() {
  const element = $('#detail')
  if (!element) return
  element.innerHTML = `<div class="empty">
    <div class="empty__inner">
      <p class="eyebrow">Studio Desk</p>
      <h1>Could not load the desk</h1>
      <p>${esc(state.fatal)}</p>
      <div class="empty__actions">
        <button class="btn btn--primary" type="button" data-action="reload">Try again</button>
      </div>
      <p class="muted" style="margin-top:14px">Run <code>npm run studio</code> in the project terminal. This tool is local-only.</p>
    </div>
  </div>`
}

/* ---------- Dirty state ---------- */

function updateDirtyUi() {
  const saveState = $('#save-state')
  if (saveState) {
    saveState.innerHTML = state.dirty
      ? '<span class="unsaved">Unsaved changes</span>'
      : 'Saved locally'
  }
  $$('[data-action="save"]').forEach((button) => {
    button.disabled = !state.dirty
  })
}

function captureEdits() {
  if (!state.edits) return

  const value = (selector) => $(selector)?.value
  const proposal = value('#proposal-md')
  if (proposal !== undefined) state.edits.proposalMarkdown = proposal

  const summary = value('#summary')
  if (summary !== undefined) state.edits.summary = summary
  const fit = value('#fit')
  if (fit !== undefined) state.edits.fit = fit
  const fitReason = value('#fitReason')
  if (fitReason !== undefined) state.edits.fitReason = fitReason
  const nextAction = value('#nextAction')
  if (nextAction !== undefined) state.edits.nextAction = nextAction
  const reviewNotes = value('#reviewNotes')
  if (reviewNotes !== undefined) state.edits.reviewNotes = reviewNotes
  const questions = value('#questions')
  if (questions !== undefined) state.edits.questions = questions
  const risks = value('#risks')
  if (risks !== undefined) state.edits.risks = risks
  const assumptions = value('#assumptions')
  if (assumptions !== undefined) state.edits.assumptions = assumptions

  const rows = $$('[data-check-row]')
  if (rows.length) {
    state.edits.checklist = rows.map((row) => ({
      area: row.querySelector('[data-check-field="area"]')?.value || '',
      item: row.querySelector('[data-check-field="item"]')?.value || '',
      why: row.querySelector('[data-check-field="why"]')?.value || '',
      priority: row.querySelector('[data-check-field="priority"]')?.value || 'medium',
    }))
  }
}

function markDirty() {
  if (!state.edits) return
  state.dirty = true
  updateDirtyUi()
  updateWordCount()
}

function updateWordCount() {
  const element = $('#word-count')
  if (!element) return
  const text = state.edits?.proposalMarkdown || ''
  const words = text.trim().split(/\s+/).filter(Boolean).length
  element.textContent = `${words} words`
}

/* ---------- Actions ---------- */

function replaceLead(lead) {
  const index = state.leads.findIndex((entry) => entry.id === lead.id)
  if (index === -1) state.leads.unshift(lead)
  else state.leads[index] = lead
}

function selectLead(id) {
  const lead = state.leads.find((entry) => entry.id === id)
  if (!lead) return
  if (state.dirty && !window.confirm('Discard your unsaved changes?')) return

  state.selectedId = id
  state.tab = 'proposal'
  state.preview = false
  state.actionError = ''
  localStorage.setItem('studio.selected', id)
  resetEdits(lead)
  renderList()
  renderDetail()
  maybeAutoDraft(lead)
}

function maybeAutoDraft(lead) {
  if (!lead || lead.draft || lead.draftError || !lead.canDraft) return
  if (!state.config?.autoDraft || !state.config?.openrouterConfigured) return
  if (state.drafting.includes(lead.id) || state.queueLength > 0) return
  if (state.autoAttempted.has(lead.id)) return

  state.autoAttempted.add(lead.id)
  generateDraft(lead.id, { auto: true })
}

async function refresh({ forceDetail = false } = {}) {
  clearTimeout(state.pollTimer)
  if (state.polling) return
  state.polling = true

  try {
    const data = await api('/api/state')
    const previousId = state.selectedId

    state.config = data.config
    state.stats = data.stats
    state.leads = data.leads
    state.drafting = data.drafting || []
    state.queueLength = data.queueLength || 0
    state.lastSyncAt = data.lastSyncAt
    state.fatal = ''

    if (!state.selectedId || !state.leads.some((lead) => lead.id === state.selectedId)) {
      state.selectedId = state.leads[0]?.id || ''
      if (state.selectedId) localStorage.setItem('studio.selected', state.selectedId)
      state.dirty = false
      resetEdits(selectedLead())
    }

    renderStatusChips()
    renderFilters()
    renderList()

    if (!state.selectedId) {
      renderEmpty()
    } else if (!state.dirty || forceDetail || previousId !== state.selectedId) {
      if (!state.dirty) resetEdits(selectedLead())
      renderDetail()
      maybeAutoDraft(selectedLead())
    }
  } catch (error) {
    if (!state.config) {
      state.fatal = error.message
      renderFatal()
    } else {
      toast(error.message, 'error')
    }
  } finally {
    state.polling = false
    schedulePoll()
  }
}

function schedulePoll() {
  clearTimeout(state.pollTimer)
  if (document.hidden) return

  const active = Boolean(state.generatingId) || state.drafting.length > 0 || state.queueLength > 0
  state.pollTimer = setTimeout(() => refresh(), active ? 2000 : 10000)
}

async function generateDraft(id, { force = false, auto = false, confirmOverwrite = false } = {}) {
  if (state.generatingId) return
  if (state.dirty) {
    if (!window.confirm('Your unsaved edits will be lost if a new draft is generated. Continue?')) return
    state.dirty = false
  }

  state.actionError = ''
  state.generatingId = id
  renderDetail()

  try {
    const data = await api(`/api/leads/${encodeURIComponent(id)}/draft`, {
      method: 'POST',
      body: { force, confirmOverwrite },
    })
    replaceLead(data.lead)
    if (data.lead.id === state.selectedId) resetEdits(data.lead)
    toast('Draft generated. Review it before anything is sent.', 'success')
    state.generatingId = ''
    await refresh({ forceDetail: true })
  } catch (error) {
    state.generatingId = ''

    if (error.code === 'confirm_overwrite') {
      const confirmed = window.confirm(
        'This draft has manual edits. Replace it with a fresh generation? The current text will be kept in the previous-drafts history.',
      )
      if (confirmed) return await generateDraft(id, { force: true, auto, confirmOverwrite: true })
    }

    state.actionError = error.message
    if (!auto) toast(error.message, 'error')
    await refresh({ forceDetail: true })
  } finally {
    if (state.generatingId === id) state.generatingId = ''
    if (state.selectedId === id) renderDetail()
    schedulePoll()
  }
}

async function saveEdits() {
  const lead = selectedLead()
  if (!lead?.draft || state.saving) return
  captureEdits()
  state.saving = true
  const buttons = $$('[data-action="save"]')
  buttons.forEach((button) => {
    button.disabled = true
  })

  try {
    const data = await api(`/api/leads/${encodeURIComponent(lead.id)}`, {
      method: 'PATCH',
      body: {
        proposalMarkdown: state.edits.proposalMarkdown,
        checklist: state.edits.checklist,
        questions: lines(state.edits.questions),
        risks: lines(state.edits.risks),
        assumptions: lines(state.edits.assumptions),
        summary: state.edits.summary,
        fit: state.edits.fit,
        fitReason: state.edits.fitReason,
        nextAction: state.edits.nextAction,
        reviewNotes: state.edits.reviewNotes,
      },
    })
    replaceLead(data.lead)
    resetEdits(data.lead)
    toast('Draft saved locally. Nothing was sent.', 'success')
    await refresh({ forceDetail: true })
  } catch (error) {
    toast(error.message, 'error')
    state.actionError = error.message
    renderDetail()
  } finally {
    state.saving = false
    updateDirtyUi()
  }
}

async function changeStatus(status) {
  const lead = selectedLead()
  if (!lead) return

  if (state.dirty) {
    toast('Save or discard your edits before changing the review status.', 'error')
    return
  }

  const messages = {
    in_review: 'Start the human review? Nothing is sent to the lead.',
    approved: 'Approve this proposal? This only marks it approved locally. Nothing is sent.',
    drafted: 'Return this proposal to draft? The approval will be cleared.',
    new: 'Reopen this archived lead? Nothing is sent.',
    archived: 'Archive this lead? Nothing is sent.',
  }
  if (!window.confirm(messages[status] || 'Change the status?')) return

  try {
    const data = await api(`/api/leads/${encodeURIComponent(lead.id)}/status`, {
      method: 'POST',
      body: { status },
    })
    replaceLead(data.lead)
    resetEdits(data.lead)
    toast(
      status === 'approved'
        ? 'Approved locally. Copy or download the proposal and send it yourself.'
        : `Status changed to ${STATUS_LABELS[status]}. Nothing was sent.`,
      'success',
    )
    await refresh({ forceDetail: true })
  } catch (error) {
    toast(error.message, 'error')
  }
}

function toggleTab(tab) {
  captureEdits()
  state.tab = tab
  $$('[data-tab]').forEach((button) => {
    const active = button.dataset.tab === tab
    button.classList.toggle('is-active', active)
    button.setAttribute('aria-selected', String(active))
  })
  $$('.panel').forEach((panel) => {
    panel.hidden = panel.id !== `panel-${tab}`
  })
}

async function copyProposal() {
  const lead = selectedLead()
  if (!lead?.draft) return
  const text = state.dirty ? state.edits?.proposalMarkdown : lead.draft.proposalMarkdown
  if (!text) return

  try {
    await navigator.clipboard.writeText(text)
    toast('Proposal copied. Paste it into your email; nothing was sent.', 'success')
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.append(area)
    area.select()
    document.execCommand('copy')
    area.remove()
    toast('Proposal copied. Paste it into your email; nothing was sent.', 'success')
  }
}

async function syncLeads() {
  if (state.syncing) return
  state.syncing = true
  const button = $('#sync-button')
  if (button) {
    button.disabled = true
    button.innerHTML = '<span class="spin" aria-hidden="true"></span> Pulling…'
  }

  try {
    const result = await api('/api/sync', { method: 'POST', body: {} })
    const summary = [
      `${result.added} new`,
      result.updated ? `${result.updated} updated` : '',
      result.skipped ? `${result.skipped} skipped` : '',
      result.queued?.length ? `${result.queued.length} drafting` : '',
    ]
      .filter(Boolean)
      .join(' · ')
    toast(`Sheet pulled: ${summary}.`, 'success')
    await refresh({ forceDetail: false })
  } catch (error) {
    toast(error.message, 'error')
    if (/configured|sign-in|permission|CSV|URL/i.test(error.message)) openSettings()
  } finally {
    state.syncing = false
    if (button) {
      button.disabled = false
      button.textContent = 'Pull leads'
    }
  }
}

async function importCsvFile(file) {
  if (!file) return
  if (file.size > 5_000_000) {
    toast('That CSV is larger than 5 MB. Import a smaller export.', 'error')
    return
  }

  try {
    const csv = await file.text()
    const result = await api('/api/import', { method: 'POST', body: { csv } })
    toast(
      `Imported ${result.added} new lead${result.added === 1 ? '' : 's'}${result.queued?.length ? `; ${result.queued.length} drafting` : ''}.`,
      'success',
    )
    await refresh({ forceDetail: false })
  } catch (error) {
    toast(error.message, 'error')
  }
}

function openSettings() {
  const config = state.config
  if (!config) return

  const source = config.sheetConfigured
    ? `${config.sheetSource}${config.sheetHost ? ` · ${config.sheetHost}` : ''}`
    : 'Not configured'

  $('#settings-body').innerHTML = `
    <p>Studio Desk runs only on this machine. It has no send code: it cannot email, message or publish a proposal.</p>

    <h3>Current configuration</h3>
    <p><strong>Lead source:</strong> ${esc(source)}<br />
    <strong>OpenRouter:</strong> ${config.openrouterConfigured ? `configured · ${esc(config.model)}` : 'API key missing'}<br />
    <strong>Auto-draft:</strong> ${config.autoDraft ? 'on' : 'off'}<br />
    <strong>Reviewer:</strong> ${esc(config.reviewer)}<br />
    <strong>Local data:</strong> <code>${esc(config.dataDir)}</code></p>

    <h3>Connect the leads sheet</h3>
    <p>Add these to <code>.env.local</code> in the project root, then restart the desk:</p>
    <pre>LEADS_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/&lt;sheet-id&gt;/export?format=csv&amp;gid=0

# or use a private, locally downloaded export:
LEADS_CSV_FILE=leads-export.csv</pre>
    <div class="notice notice--warn">
      <span class="notice__icon">!</span>
      <span><strong>Sharing a sheet by link makes it readable by anyone with the link.</strong> Use a dedicated export tab with only the fields this desk needs, or prefer <code>LEADS_CSV_FILE</code> / <strong>Import CSV</strong> for sensitive data.</span>
    </div>

    <h3>Connect OpenRouter</h3>
    <pre>OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=anthropic/claude-sonnet-4.5
AUTO_DRAFT=true</pre>
    <p>The key is read by the local Node server and is never sent to the browser or committed to git.</p>

    <h3>What leaves this machine</h3>
    <p>When a draft is generated, only the lead's name, business, business type, requested service, budget, timeline and written brief are sent to OpenRouter. <strong>Email and phone are withheld.</strong> The model provider processes that text under its own terms. Do not put medical, financial or identity documents into a lead description.</p>

    <h3>The workflow</h3>
    <ol style="margin:0 0 0 18px;padding:0;font-size:12.5px;line-height:1.7">
      <li>Pull from the sheet, import a CSV, or add a lead.</li>
      <li>A draft is generated when auto-draft is on, or when you press Generate.</li>
      <li>Edit the proposal, checklist and questions here.</li>
      <li>Start review, then approve. Approval is local only.</li>
      <li>Copy or download the proposal and send it from your own email.</li>
    </ol>
  `

  $('#settings-dialog').showModal()
}

function closeLeadDialog() {
  const dialog = $('#lead-dialog')
  if (dialog?.open) dialog.close()
}

async function submitLeadForm(event) {
  event.preventDefault()
  const form = event.currentTarget
  const errorElement = $('#lead-form-error')
  const submitButton = form.querySelector('button[type="submit"]')
  const data = new FormData(form)
  errorElement.hidden = true
  submitButton.disabled = true

  try {
    const result = await api('/api/leads', {
      method: 'POST',
      body: {
        name: data.get('name'),
        business: data.get('business'),
        businessType: data.get('businessType'),
        service: data.get('service'),
        email: data.get('email'),
        phone: data.get('phone'),
        budget: data.get('budget'),
        timeline: data.get('timeline'),
        description: data.get('description'),
        draftNow: data.get('draftNow') === 'on',
      },
    })

    form.reset()
    form.querySelector('[name="draftNow"]').checked = true
    closeLeadDialog()
    await refresh()
    if (!result.queued?.length) state.autoAttempted.add(result.lead.id)
    selectLead(result.lead.id)
    toast(
      result.queued?.length
        ? 'Lead added. A draft is being generated.'
        : 'Lead added. Generate a draft when ready.',
      'success',
    )
  } catch (error) {
    errorElement.textContent = error.message
    errorElement.hidden = false
  } finally {
    submitButton.disabled = false
  }
}

/* ---------- Markdown preview ---------- */

function inlineMarkdown(text) {
  return esc(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function renderMarkdown(markdown) {
  const output = []
  let list = null
  let paragraph = []

  const flushParagraph = () => {
    if (paragraph.length) {
      output.push(`<p>${paragraph.join(' ')}</p>`)
      paragraph = []
    }
  }
  const closeList = () => {
    if (list) {
      output.push(`</${list}>`)
      list = null
    }
  }

  for (const rawLine of String(markdown || '').split(/\r?\n/)) {
    const line = rawLine.trimEnd()

    if (!line.trim()) {
      flushParagraph()
      closeList()
      continue
    }
    if (/^---+$/.test(line.trim())) {
      flushParagraph()
      closeList()
      output.push('<hr />')
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    if (heading) {
      flushParagraph()
      closeList()
      const level = heading[1].length
      output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`)
      continue
    }

    const unordered = line.match(/^\s*[-*]\s+(.*)$/)
    if (unordered) {
      flushParagraph()
      if (list !== 'ul') {
        closeList()
        output.push('<ul>')
        list = 'ul'
      }
      output.push(`<li>${inlineMarkdown(unordered[1])}</li>`)
      continue
    }

    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/)
    if (ordered) {
      flushParagraph()
      if (list !== 'ol') {
        closeList()
        output.push('<ol>')
        list = 'ol'
      }
      output.push(`<li>${inlineMarkdown(ordered[1])}</li>`)
      continue
    }

    const quote = line.match(/^>\s?(.*)$/)
    if (quote) {
      flushParagraph()
      closeList()
      output.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`)
      continue
    }

    closeList()
    paragraph.push(inlineMarkdown(line.trim()))
  }

  flushParagraph()
  closeList()
  return output.join('\n')
}

/* ---------- Events ---------- */

document.addEventListener('click', (event) => {
  const actionElement = event.target.closest('[data-action]')
  if (actionElement) {
    const action = actionElement.dataset.action

    if (action === 'sync') syncLeads()
    else if (action === 'import') $('#csv-file').click()
    else if (action === 'add') {
      $('#lead-dialog').showModal()
      setTimeout(() => $('#lead-form [name="name"]')?.focus(), 30)
    } else if (action === 'settings') openSettings()
    else if (action === 'close-settings') $('#settings-dialog').close()
    else if (action === 'close-lead') closeLeadDialog()
    else if (action === 'save') saveEdits()
    else if (action === 'generate') {
      const lead = selectedLead()
      if (lead) generateDraft(lead.id)
    } else if (action === 'regenerate') {
      const lead = selectedLead()
      if (lead) generateDraft(lead.id, { force: true })
    } else if (action === 'copy') copyProposal()
    else if (action === 'toggle-preview') {
      captureEdits()
      state.preview = !state.preview
      renderDetail()
    } else if (action === 'add-check') {
      captureEdits()
      state.edits.checklist.push({ area: '', item: '', why: '', priority: 'medium' })
      markDirty()
      renderDetail()
    } else if (action === 'remove-check') {
      captureEdits()
      state.edits.checklist.splice(Number(actionElement.dataset.index), 1)
      markDirty()
      renderDetail()
    } else if (action === 'reload') {
      window.location.reload()
    }
    return
  }

  const statusElement = event.target.closest('[data-status]')
  if (statusElement) {
    changeStatus(statusElement.dataset.status)
    return
  }

  const download = event.target.closest('[data-download]')
  if (download && state.dirty) {
    event.preventDefault()
    toast('Save or discard your edits before downloading.', 'error')
    return
  }

  const select = event.target.closest('[data-select]')
  if (select) {
    selectLead(select.dataset.select)
    return
  }

  const filter = event.target.closest('[data-filter]')
  if (filter) {
    state.filter = filter.dataset.filter
    renderFilters()
    renderList()
    return
  }

  const tab = event.target.closest('[data-tab]')
  if (tab) toggleTab(tab.dataset.tab)
})

document.addEventListener('input', (event) => {
  if (!event.target.closest('#detail')) return
  captureEdits()
  markDirty()
})

document.addEventListener('change', (event) => {
  if (!event.target.closest('#detail')) return
  captureEdits()
  markDirty()
})

$('#lead-search').addEventListener('input', (event) => {
  state.search = event.target.value
  renderList()
})

$('#lead-form').addEventListener('submit', submitLeadForm)
$('#csv-file').addEventListener('change', async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  await importCsvFile(file)
})

for (const id of ['lead-dialog', 'settings-dialog']) {
  const dialog = document.getElementById(id)
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') return
  const tablist = event.target.closest('[role="tablist"][aria-label="Draft sections"]')
  if (!tablist) return

  const tabs = [...tablist.querySelectorAll('[data-tab]')]
  const index = tabs.indexOf(event.target)
  if (index === -1) return
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return

  event.preventDefault()
  const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length
  tabs[next].focus()
  toggleTab(tabs[next].dataset.tab)
})

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refresh()
})

window.addEventListener('beforeunload', (event) => {
  if (!state.dirty) return
  event.preventDefault()
  event.returnValue = ''
})

refresh()
