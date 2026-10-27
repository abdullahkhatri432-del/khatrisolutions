import { createHash, randomBytes } from 'node:crypto'

/**
 * Column names vary between Google Forms, Apps Script exports and hand-made
 * sheets. Everything is compared after this normalisation.
 */
export function normalizeKey(value) {
  return String(value ?? '')
    .replace(/^\uFEFF/, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '')
}

const FIELD_ALIASES = {
  id: ['leadid', 'id', 'reference', 'referenceid', 'enquiryid', 'inquiryid'],
  kind: ['kind', 'type', 'form', 'formname'],
  receivedAt: ['timestamp', 'submittedat', 'createdat', 'receivedat', 'date', 'datetime', 'time'],
  name: ['name', 'fullname', 'yourname', 'contactname', 'clientname'],
  email: ['email', 'emailaddress', 'mail'],
  phone: ['phone', 'phonenumber', 'whatsapp', 'whatsappnumber', 'mobile', 'contactnumber'],
  business: ['business', 'businessname', 'company', 'companyname', 'organization', 'organisation', 'brand'],
  businessType: ['businesstype', 'typeofbusiness', 'industry', 'sector', 'businesstypeindustry'],
  service: ['service', 'serviceinterestedin', 'projecttype', 'requirement', 'project', 'interestedin'],
  budget: ['budget', 'budgetrange', 'estimatedbudget', 'investment', 'budgetinr'],
  timeline: ['timeline', 'deadline', 'timeframe', 'urgency', 'projecttimeline'],
  description: [
    'description',
    'projectdescription',
    'message',
    'details',
    'brief',
    'notes',
    'requirementdetails',
    'tellusaboutyourproject',
    'whatdoyouneed',
    'projectbrief',
    'projectdetails',
    'projectsummary',
  ],
  contactMethod: ['contactmethod', 'preferredcontact', 'preferredcontactmethod', 'contactpreference'],
  source: ['source', 'page', 'formpage', 'sourcepage', 'url'],
}

const DETAIL_ALIASES = {
  pages: ['pages', 'pagesrequired', 'numberofpages'],
  productCount: ['productcount', 'estimatedproducts', 'numberofproducts', 'products'],
  commerceNeeds: ['commerceneeds', 'paymentanddelivery', 'paymentdelivery'],
  appProblem: ['appproblem', 'problemtosolve', 'problem'],
  userRoles: ['userroles', 'roles'],
  appFeatures: ['appfeatures', 'requiredfeatures', 'features'],
  automationTask: ['automationtask', 'tasktoautomate', 'task'],
  currentTools: ['currenttools', 'toolsusedtoday', 'tools'],
  existingWebsite: ['existingwebsite', 'currentwebsite', 'existingurl'],
  currentWebsite: ['currentwebsiteurl', 'redesignwebsite'],
}

const MAX_DESCRIPTION = 20000

/** RFC 4180-ish CSV parser that handles quoted commas and newlines. */
export function parseCsv(text) {
  const input = String(text ?? '').replace(/^\uFEFF/, '')
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]

    if (quoted) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          quoted = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      quoted = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (char !== '\r') {
      field += char
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((cells) => cells.some((cell) => String(cell).trim() !== ''))
}

function cellValue(values, aliases) {
  for (const alias of aliases) {
    const value = values[alias]
    if (value !== undefined && String(value).trim() !== '') return String(value).trim()
  }
  return ''
}

/** A review form submission must never be turned into a sales proposal. */
function detectKind(rawKind, service) {
  if (/review/i.test(rawKind)) return 'review'
  if (/^client[\s-]?review$/i.test(service)) return 'review'
  return rawKind || 'project-inquiry'
}

/** Handles ISO, dd/mm/yyyy and mm/dd/yyyy. Ambiguous dates default to dd/mm. */
export function normalizeDate(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return ''

  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    const parsed = Date.parse(raw)
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString()
  }

  const match = raw.match(
    /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})(?:[ ,T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
  )
  if (match) {
    const [, first, second, rawYear, hour = '0', minute = '0', secondPart = '0'] = match
    const a = Number(first)
    const b = Number(second)
    const year = rawYear.length === 2 ? 2000 + Number(rawYear) : Number(rawYear)

    // If one side is clearly a day (> 12), use it. Otherwise assume dd/mm.
    const day = a > 12 ? a : b > 12 ? b : a
    const month = a > 12 ? b : b > 12 ? a : b

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(year, month - 1, day, Number(hour), Number(minute), Number(secondPart))
      if (!Number.isNaN(date.getTime())) return date.toISOString()
    }
  }

  const parsed = Date.parse(raw)
  return Number.isNaN(parsed) ? raw : new Date(parsed).toISOString()
}

export function leadIdFor(lead) {
  const source = [lead.name, lead.email, lead.receivedAt, lead.description].join('|')
  const hash = createHash('sha1').update(source).digest('hex').slice(0, 8).toUpperCase()
  return `LD-${hash}`
}

function buildLead(values, raw) {
  const name = cellValue(values, FIELD_ALIASES.name)
  const email = cellValue(values, FIELD_ALIASES.email)
  const description = cellValue(values, FIELD_ALIASES.description).slice(0, MAX_DESCRIPTION)
  const receivedAtRaw = cellValue(values, FIELD_ALIASES.receivedAt)
  const receivedAt = normalizeDate(receivedAtRaw)
  const service = cellValue(values, FIELD_ALIASES.service)

  const details = {}
  for (const [key, aliases] of Object.entries(DETAIL_ALIASES)) {
    const value = cellValue(values, aliases)
    if (value) details[key] = value.slice(0, 4000)
  }

  const lead = {
    id: cellValue(values, FIELD_ALIASES.id),
    kind: detectKind(cellValue(values, FIELD_ALIASES.kind).toLowerCase(), service),
    name,
    email,
    phone: cellValue(values, FIELD_ALIASES.phone),
    business: cellValue(values, FIELD_ALIASES.business),
    businessType: cellValue(values, FIELD_ALIASES.businessType),
    service,
    budget: cellValue(values, FIELD_ALIASES.budget),
    timeline: cellValue(values, FIELD_ALIASES.timeline),
    description,
    contactMethod: cellValue(values, FIELD_ALIASES.contactMethod),
    source: cellValue(values, FIELD_ALIASES.source),
    receivedAt,
    receivedAtRaw,
    details,
    raw,
  }

  if (!lead.id) lead.id = leadIdFor(lead)
  lead.id = String(lead.id).trim().replace(/\s+/g, '-')

  const missing = []
  if (!lead.name) missing.push('name')
  if (!lead.description) missing.push('description')
  lead.missingFields = missing
  lead.canDraft = missing.length === 0 && lead.description.length >= 20
  lead.isTest = /\btest\b/i.test(`${lead.name} ${lead.description}`)

  return lead
}

/**
 * Converts CSV text into lead records. Review-form rows are ignored because
 * this desk drafts sales proposals, not review replies.
 */
export function leadsFromCsv(text) {
  const rows = parseCsv(text)
  if (rows.length < 2) return { leads: [], skipped: 0, headers: [] }

  const headers = rows[0].map((header) => String(header).trim())
  const keys = headers.map(normalizeKey)

  const byId = new Map()
  let skipped = 0

  for (const cells of rows.slice(1)) {
    const values = {}
    keys.forEach((key, index) => {
      if (!key) return
      if (values[key] === undefined) values[key] = cells[index] ?? ''
    })

    const raw = {}
    headers.forEach((header, index) => {
      const value = String(cells[index] ?? '').trim()
      if (header && value) raw[header] = value
    })

    const lead = buildLead(values, raw)
    if (lead.kind === 'review') {
      skipped += 1
      continue
    }
    if (!lead.name && !lead.description) {
      skipped += 1
      continue
    }

    byId.set(lead.id, lead)
  }

  return { leads: [...byId.values()], skipped, headers }
}

export function buildManualLead(input, now = new Date()) {
  const clean = (value) => String(value ?? '').trim()
  const details = {}
  for (const [key, value] of Object.entries(input.details || {})) {
    if (clean(value)) details[key] = clean(value)
  }

  const lead = {
    id: `LD-${randomBytes(4).toString('hex').toUpperCase()}`,
    kind: 'project-inquiry',
    name: clean(input.name),
    email: clean(input.email),
    phone: clean(input.phone),
    business: clean(input.business),
    businessType: clean(input.businessType),
    service: clean(input.service),
    budget: clean(input.budget),
    timeline: clean(input.timeline),
    description: clean(input.description),
    contactMethod: clean(input.contactMethod),
    source: 'Manual entry',
    receivedAt: now.toISOString(),
    receivedAtRaw: '',
    details,
    raw: {},
  }

  const missing = []
  if (!lead.name) missing.push('name')
  if (!lead.description) missing.push('description')
  lead.missingFields = missing
  lead.canDraft = missing.length === 0 && lead.description.length >= 20
  lead.isTest = /\btest\b/i.test(`${lead.name} ${lead.description}`)

  return lead
}
