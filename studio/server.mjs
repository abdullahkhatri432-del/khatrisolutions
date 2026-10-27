import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadConfig, publicConfig, PROJECT_ROOT } from './lib/env.mjs'
import { leadsFromCsv } from './lib/csv.mjs'
import { readStore, mutateStore } from './lib/store.mjs'
import {
  applyGeneratedDraft,
  createManualLead,
  editDraft,
  getLead,
  publicLead,
  setDraftError,
  sortLeads,
  statsFor,
  transitionLead,
  upsertPulledLeads,
} from './lib/leads.mjs'
import { generateDraft } from './lib/openrouter.mjs'
import { clientProposal, downloadName, internalBrief } from './lib/export.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(HERE, 'public')
const FONT_DIR = path.join(PROJECT_ROOT, 'src', 'assets', 'fonts')

const config = loadConfig()
const drafting = new Set()
const autoQueue = []
let queueRunning = false

function httpError(status, message, code = '') {
  const error = new Error(message)
  error.status = status
  error.code = code
  return error
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    ...securityHeaders(),
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

function decodePath(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    throw httpError(400, 'The request path is not valid.')
  }
}

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  }
}

async function readJson(req, limit = 2_000_000) {
  const type = String(req.headers['content-type'] || '')
  if (!type.includes('application/json')) {
    throw httpError(415, 'Send JSON with an application/json content type.')
  }

  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) throw httpError(413, 'That request is too large.')
    chunks.push(chunk)
  }

  const text = Buffer.concat(chunks).toString('utf8')
  if (!text.trim()) return {}

  try {
    return JSON.parse(text)
  } catch {
    throw httpError(400, 'The request body is not valid JSON.')
  }
}

function assertSameOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return
  try {
    if (new URL(origin).host !== req.headers.host) {
      throw httpError(403, 'Cross-origin requests are blocked.')
    }
  } catch (error) {
    if (error.status) throw error
    throw httpError(403, 'Cross-origin requests are blocked.')
  }
}

async function readCsvSource() {
  if (config.sheetUrl) {
    let url
    try {
      url = new URL(config.sheetUrl)
    } catch {
      throw httpError(400, 'LEADS_SHEET_CSV_URL is not a valid URL.')
    }
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw httpError(400, 'LEADS_SHEET_CSV_URL must start with http:// or https://.')
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30000)
    let response
    try {
      response = await fetch(url, {
        redirect: 'follow',
        headers: { Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.5' },
        signal: controller.signal,
      })
    } catch (error) {
      if (error.name === 'AbortError') throw httpError(504, 'The Sheet took too long to respond.')
      throw httpError(502, `Could not reach the Sheet: ${error.message}`)
    } finally {
      clearTimeout(timer)
    }

    if (!response.ok) {
      throw httpError(
        502,
        `The Sheet returned ${response.status}. Check that the CSV export URL is correct.`,
      )
    }

    const type = String(response.headers.get('content-type') || '')
    const text = await response.text()
    if (type.includes('text/html') || /^\s*<!doctype html/i.test(text)) {
      throw httpError(
        502,
        'Google returned a sign-in or permission page instead of CSV. Share the sheet as "Anyone with the link – Viewer", publish it to the web as CSV, or set LEADS_CSV_FILE to a local export.',
      )
    }
    if (text.length > 10_000_000) throw httpError(413, 'That CSV file is larger than 10 MB.')
    return text
  }

  if (config.csvFile) {
    const file = path.resolve(PROJECT_ROOT, config.csvFile)
    try {
      const text = await fs.readFile(file, 'utf8')
      if (text.length > 10_000_000) throw httpError(413, 'That CSV file is larger than 10 MB.')
      return text
    } catch (error) {
      if (error.status) throw error
      throw httpError(404, `Could not read LEADS_CSV_FILE: ${error.message}`)
    }
  }

  throw httpError(
    400,
    'No lead source is configured. Set LEADS_SHEET_CSV_URL or LEADS_CSV_FILE in .env.local, or import a CSV from the desk.',
  )
}

async function importCsv(text, label) {
  const { leads, skipped } = leadsFromCsv(text)
  if (leads.length === 0) {
    throw httpError(422, 'No usable lead rows were found in that CSV.')
  }

  let result = null
  await mutateStore(config.dataDir, (store) => {
    result = upsertPulledLeads(store, leads, { label })
    store.lastSyncAt = new Date().toISOString()
  })

  const queued = config.autoDraft ? result.queued : []
  enqueueAutoDrafts(queued)

  return {
    added: result.added,
    updated: result.updated,
    unchanged: result.unchanged,
    skipped,
    queued,
    total: leads.length,
  }
}

async function draftLead(id, { trigger = 'manual', force = false, confirmOverwrite = false } = {}) {
  const store = await readStore(config.dataDir)
  const lead = getLead(store, id)
  if (!lead) throw httpError(404, 'That lead no longer exists.')
  if (lead.status === 'archived') throw httpError(409, 'Archived leads cannot be drafted. Reopen it first.')
  const canDraft = lead.canDraft ?? Boolean(lead.name && String(lead.description || '').length >= 20)
  if (!canDraft) {
    const missing = lead.missingFields?.length ? lead.missingFields.join(' and ') : 'a usable brief'
    throw httpError(422, `This lead is missing ${missing}. Add the missing detail before drafting.`)
  }
  if (lead.draft && !force) {
    throw httpError(409, 'A draft already exists for this lead.', 'draft_exists')
  }
  if (lead.draft?.editedAt && !confirmOverwrite) {
    throw httpError(
      409,
      'This draft has manual edits. Confirm that you want to replace them.',
      'confirm_overwrite',
    )
  }
  if (drafting.has(id)) {
    throw httpError(409, 'A draft is already being generated for this lead.', 'already_drafting')
  }

  drafting.add(id)
  try {
    const { draft, usage } = await generateDraft({ lead, config })
    let updated = null

    await mutateStore(config.dataDir, (current) => {
      const currentLead = getLead(current, id)
      if (!currentLead) return
      updated = applyGeneratedDraft(currentLead, draft, {
        model: config.openrouterModel,
        usage,
        trigger,
      })
    })

    if (!updated) throw httpError(404, 'That lead was removed while the draft was being generated.')
    return updated
  } catch (error) {
    const message = error.message || 'The draft could not be generated.'
    await mutateStore(config.dataDir, (current) => {
      const currentLead = getLead(current, id)
      if (currentLead) setDraftError(currentLead, message)
    }).catch(() => {})
    if (error.status) throw error
    throw httpError(502, message, 'draft_failed')
  } finally {
    drafting.delete(id)
  }
}

function enqueueAutoDrafts(ids) {
  for (const id of ids) {
    if (!id || drafting.has(id) || autoQueue.includes(id)) continue
    autoQueue.push(id)
  }
  runAutoQueue()
}

async function runAutoQueue() {
  if (queueRunning) return
  queueRunning = true

  try {
    while (autoQueue.length > 0) {
      const id = autoQueue.shift()
      try {
        await draftLead(id, { trigger: 'auto' })
      } catch {
        // The error is stored on the lead and shown in the desk.
      }
    }
  } finally {
    queueRunning = false
  }
}

function statePayload(store) {
  const leads = sortLeads(store.leads).map(publicLead)
  return {
    config: publicConfig(config),
    stats: statsFor(store.leads),
    leads,
    drafting: [...drafting],
    queueLength: autoQueue.length,
    lastSyncAt: store.lastSyncAt,
  }
}

async function handleApi(req, res, pathname) {
  assertSameOrigin(req)

  if (pathname === '/api/state' && req.method === 'GET') {
    const store = await readStore(config.dataDir)
    return sendJson(res, 200, statePayload(store))
  }

  if (pathname === '/api/sync' && req.method === 'POST') {
    const text = await readCsvSource()
    const label = config.sheetUrl ? 'the Google Sheet' : 'the local CSV file'
    return sendJson(res, 200, await importCsv(text, label))
  }

  if (pathname === '/api/import' && req.method === 'POST') {
    const body = await readJson(req, 5_000_000)
    if (!String(body.csv || '').trim()) throw httpError(422, 'Paste or choose a CSV file first.')
    return sendJson(res, 200, await importCsv(String(body.csv), 'an imported CSV'))
  }

  if (pathname === '/api/leads' && req.method === 'POST') {
    const body = await readJson(req)
    if (!String(body.name || '').trim()) throw httpError(422, 'A name is required.')
    if (String(body.description || '').trim().length < 20) {
      throw httpError(422, 'Please add a project description of at least 20 characters.')
    }

    let created = null
    await mutateStore(config.dataDir, (store) => {
      try {
        created = createManualLead(store, body)
      } catch (error) {
        throw httpError(422, error.message, 'invalid_lead')
      }
    })

    const queued = created.canDraft && body.draftNow !== false ? [created.id] : []
    enqueueAutoDrafts(queued)
    return sendJson(res, 201, { lead: publicLead(created), queued })
  }

  const leadMatch = pathname.match(/^\/api\/leads\/([^/]+)(?:\/(draft|status|proposal\.md|brief\.md))?$/)
  if (leadMatch) {
    const id = decodePath(leadMatch[1])
    const action = leadMatch[2] || ''

    if (!action && req.method === 'PATCH') {
      const body = await readJson(req)
      let updated = null
      await mutateStore(config.dataDir, (store) => {
        const lead = getLead(store, id)
        if (!lead) throw httpError(404, 'That lead no longer exists.')
        try {
          updated = editDraft(lead, body || {})
        } catch (error) {
          throw httpError(422, error.message, 'invalid_edit')
        }
      })
      return sendJson(res, 200, { lead: publicLead(updated) })
    }

    if (action === 'draft' && req.method === 'POST') {
      const body = await readJson(req)
      const updated = await draftLead(id, {
        trigger: 'manual',
        force: Boolean(body.force),
        confirmOverwrite: Boolean(body.confirmOverwrite),
      })
      return sendJson(res, 200, { lead: publicLead(updated) })
    }

    if (action === 'status' && req.method === 'POST') {
      const body = await readJson(req)
      let updated = null
      await mutateStore(config.dataDir, (store) => {
        const lead = getLead(store, id)
        if (!lead) throw httpError(404, 'That lead no longer exists.')
        try {
          updated = transitionLead(lead, String(body.status || ''), config.reviewer)
        } catch (error) {
          throw httpError(409, error.message, 'invalid_status')
        }
      })
      return sendJson(res, 200, { lead: publicLead(updated) })
    }

    if (action === 'proposal.md' && req.method === 'GET') {
      const store = await readStore(config.dataDir)
      const lead = getLead(store, id)
      if (!lead) throw httpError(404, 'That lead no longer exists.')
      const markdown = clientProposal(lead)
      res.writeHead(200, {
        ...securityHeaders(),
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${downloadName(lead, 'proposal')}"`,
        'Cache-Control': 'no-store',
      })
      return res.end(markdown)
    }

    if (action === 'brief.md' && req.method === 'GET') {
      const store = await readStore(config.dataDir)
      const lead = getLead(store, id)
      if (!lead) throw httpError(404, 'That lead no longer exists.')
      const markdown = internalBrief(lead)
      res.writeHead(200, {
        ...securityHeaders(),
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${downloadName(lead, 'brief')}"`,
        'Cache-Control': 'no-store',
      })
      return res.end(markdown)
    }
  }

  throw httpError(404, 'No such API route.')
}

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
}

async function serveFile(res, file, cache = 'no-cache') {
  try {
    const data = await fs.readFile(file)
    res.writeHead(200, {
      ...securityHeaders(),
      'Content-Type': CONTENT_TYPES[path.extname(file)] || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': cache,
    })
    res.end(data)
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
  return true
}

async function handleStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    throw httpError(405, 'Method not allowed.')
  }

  if (pathname === '/' || pathname === '/index.html') {
    const served = await serveFile(res, path.join(PUBLIC_DIR, 'index.html'))
    if (!served) throw httpError(500, 'The Studio Desk UI is missing.')
    return
  }

  const fontMatch = pathname.match(/^\/fonts\/([a-z0-9-]+\.woff2)$/)
  if (fontMatch) {
    const served = await serveFile(res, path.join(FONT_DIR, fontMatch[1]), 'public, max-age=86400')
    if (!served) throw httpError(404, 'Font not found.')
    return
  }

  const relative = decodePath(pathname).replace(/^\/+/, '')
  const file = path.resolve(PUBLIC_DIR, relative)
  if (!file.startsWith(PUBLIC_DIR + path.sep)) throw httpError(403, 'Forbidden.')
  if (!CONTENT_TYPES[path.extname(file)]) throw httpError(404, 'Not found.')

  const served = await serveFile(res, file)
  if (!served) throw httpError(404, 'Not found.')
}

const server = http.createServer(async (req, res) => {
  try {
    // Only the path matters here. A fixed base keeps a malformed Host header
    // from rejecting the whole handler before the error boundary exists.
    const pathname = new URL(req.url, 'http://localhost').pathname

    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, pathname)
    } else {
      await handleStatic(req, res, pathname)
    }
  } catch (error) {
    if (res.headersSent) {
      res.end()
      return
    }

    const status = error.status || 500
    if (status >= 500) console.error(error)

    sendJson(res, status, {
      error: status >= 500 && !error.status ? 'Studio Desk hit an unexpected error. Check the terminal.' : error.message,
      code: error.code || '',
    })
  }
})

// Studio Desk has no login. Binding it to a LAN or public interface would
// expose every lead's contact details, so require an explicit opt-in.
const LOOPBACK = new Set(['127.0.0.1', 'localhost', '::1', '[::1]'])
if (!LOOPBACK.has(config.host) && !config.allowRemote) {
  console.error('')
  console.error(`  Refusing to start on ${config.host}.`)
  console.error('  Studio Desk has no login and stores lead contact details.')
  console.error('  Keep STUDIO_HOST on 127.0.0.1, or put it behind an authenticated')
  console.error('  proxy and set STUDIO_ALLOW_REMOTE=true only if you accept that risk.')
  console.error('')
  process.exit(1)
}

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('')
    console.error(`  Port ${config.port} is already in use.`)
    console.error('  Stop the other Studio Desk, or set STUDIO_PORT to a free port.')
    console.error('')
  } else {
    console.error(error)
  }
  process.exit(1)
})

server.listen(config.port, config.host, () => {
  const sheet = config.sheetUrl ? 'Google Sheet CSV' : config.csvFile ? `local CSV (${config.csvFile})` : 'not configured'
  const key = config.openrouterKey ? `configured · ${config.openrouterModel}` : 'MISSING OPENROUTER_API_KEY'

  console.log('')
  console.log('  Khatri Solutions · Studio Desk')
  console.log(`  ${`http://${config.host}:${config.port}`}`)
  console.log(`  Leads: ${sheet}`)
  console.log(`  OpenRouter: ${key}`)
  console.log(`  Auto-draft: ${config.autoDraft ? 'on' : 'off'}`)
  console.log(`  Data: ${config.dataDir}`)
  console.log('  Nothing is sent automatically. Review and send proposals yourself.')
  console.log('')

  if (!config.openrouterKey) {
    console.log('  Add OPENROUTER_API_KEY to .env.local, then restart.')
  }
  if (!config.sheetUrl && !config.csvFile) {
    console.log('  Set LEADS_SHEET_CSV_URL or use "Import CSV" in the desk.')
  }
  console.log('')
})

process.on('SIGINT', () => {
  console.log('\nStudio Desk stopped.')
  server.close(() => process.exit(0))
})
