import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
export const PROJECT_ROOT = path.resolve(HERE, '..', '..')

/** Tiny .env parser: no dependency, no surprises. */
export function parseEnv(text) {
  const out = {}

  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const withoutExport = line.startsWith('export ') ? line.slice(7).trim() : line
    const equals = withoutExport.indexOf('=')
    if (equals === -1) continue

    const key = withoutExport.slice(0, equals).trim()
    let value = withoutExport.slice(equals + 1).trim()
    if (!key) continue

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    out[key] = value
  }

  return out
}

function readEnvFile(file) {
  try {
    return parseEnv(fs.readFileSync(file, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return {}
    throw error
  }
}

function envValue(env, key, fallback = '') {
  const value = env[key]
  return value === undefined || value === '' ? fallback : value
}

function booleanValue(value, fallback) {
  if (value === undefined || value === '') return fallback
  return !['0', 'false', 'no', 'off'].includes(String(value).toLowerCase())
}

/**
 * Values come from .env, then .env.local, then the real process environment.
 * Nothing here is ever exposed to the browser except via `publicConfig`.
 */
export function loadConfig(overrides = {}) {
  const fileEnv = {
    ...readEnvFile(path.join(PROJECT_ROOT, '.env')),
    ...readEnvFile(path.join(PROJECT_ROOT, '.env.local')),
  }
  const env = { ...fileEnv, ...process.env, ...overrides }

  const port = Number(envValue(env, 'STUDIO_PORT', '4310'))
  const dataDir = path.resolve(PROJECT_ROOT, envValue(env, 'STUDIO_DATA_DIR', '.studio-data'))

  return {
    host: envValue(env, 'STUDIO_HOST', '127.0.0.1'),
    port: Number.isFinite(port) && port > 0 ? port : 4310,
    dataDir,
    reviewer: envValue(env, 'STUDIO_REVIEWER', 'Abdullah Khatri'),
    siteUrl: envValue(env, 'STUDIO_SITE_URL', 'https://khatrisolutions.onrender.com'),

    sheetUrl: envValue(env, 'LEADS_SHEET_CSV_URL', ''),
    csvFile: envValue(env, 'LEADS_CSV_FILE', ''),

    openrouterKey: envValue(env, 'OPENROUTER_API_KEY', ''),
    openrouterModel: envValue(env, 'OPENROUTER_MODEL', 'nvidia/nemotron-3-ultra-550b-a55b:free'),
    openrouterBaseUrl: envValue(env, 'OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1'),
    autoDraft: booleanValue(envValue(env, 'AUTO_DRAFT', 'true'), true),
    allowRemote: booleanValue(envValue(env, 'STUDIO_ALLOW_REMOTE', 'false'), false),

    requestTimeoutMs: Number(envValue(env, 'STUDIO_AI_TIMEOUT_MS', '120000')),
    maxTokens: Number(envValue(env, 'STUDIO_AI_MAX_TOKENS', '5000')),
    temperature: Number(envValue(env, 'STUDIO_AI_TEMPERATURE', '0.4')),
  }
}

export function publicConfig(config) {
  let sheetHost = ''
  if (config.sheetUrl) {
    try {
      sheetHost = new URL(config.sheetUrl).hostname
    } catch {
      sheetHost = 'invalid URL'
    }
  }

  return {
    sheetConfigured: Boolean(config.sheetUrl || config.csvFile),
    sheetSource: config.sheetUrl ? 'Google Sheet CSV' : config.csvFile ? 'Local CSV file' : '',
    sheetHost,
    openrouterConfigured: Boolean(config.openrouterKey),
    model: config.openrouterModel,
    autoDraft: config.autoDraft,
    reviewer: config.reviewer,
    dataDir: config.dataDir,
  }
}
