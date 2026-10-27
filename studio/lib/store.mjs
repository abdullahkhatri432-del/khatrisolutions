import fs from 'node:fs/promises'
import path from 'node:path'

const queues = new Map()

export function storeFile(dataDir) {
  return path.join(dataDir, 'leads.json')
}

export async function readStore(dataDir) {
  try {
    const raw = await fs.readFile(storeFile(dataDir), 'utf8')
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.leads)) throw new Error('Invalid store shape')
    return {
      version: 1,
      leads: parsed.leads,
      lastSyncAt: parsed.lastSyncAt || null,
    }
  } catch (error) {
    if (error.code === 'ENOENT') return { version: 1, leads: [], lastSyncAt: null }
    if (error instanceof SyntaxError) {
      throw new Error(
        'The Studio Desk data file is not valid JSON. Move .studio-data/leads.json aside and restart.',
      )
    }
    throw error
  }
}

export async function writeStore(dataDir, store) {
  await fs.mkdir(dataDir, { recursive: true })
  const target = storeFile(dataDir)
  const temporary = `${target}.${process.pid}.tmp`
  const payload = `${JSON.stringify(store, null, 2)}\n`

  await fs.writeFile(temporary, payload, 'utf8')
  await fs.rename(temporary, target)
}

/**
 * Serialises read-modify-write cycles per data directory. Generation happens
 * outside this lock so a slow model never blocks the rest of the desk.
 */
export function mutateStore(dataDir, mutator) {
  const previous = queues.get(dataDir) || Promise.resolve()

  const next = previous.then(async () => {
    const store = await readStore(dataDir)
    const result = await mutator(store)
    await writeStore(dataDir, store)
    return result
  })

  queues.set(
    dataDir,
    next.catch(() => {}),
  )

  return next
}
