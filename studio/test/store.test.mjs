import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { mutateStore, readStore, storeFile } from '../lib/store.mjs'

async function tempDir(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'studio-store-'))
  t.after(() => fs.rm(dir, { recursive: true, force: true }))
  return dir
}

test('a missing store reads as empty', async (t) => {
  const dir = await tempDir(t)
  const store = await readStore(dir)

  assert.deepEqual(store, { version: 1, leads: [], lastSyncAt: null })
})

test('mutations are written atomically and survive a reload', async (t) => {
  const dir = await tempDir(t)

  await mutateStore(dir, (store) => {
    store.leads.push({ id: 'LD-ONE' })
    store.lastSyncAt = '2026-10-27T05:00:00.000Z'
  })

  const store = await readStore(dir)
  assert.equal(store.leads.length, 1)
  assert.equal(store.leads[0].id, 'LD-ONE')
  assert.equal(store.lastSyncAt, '2026-10-27T05:00:00.000Z')

  const raw = await fs.readFile(storeFile(dir), 'utf8')
  assert.match(raw, /"version": 1/)
  assert.equal(raw.endsWith('\n'), true)

  const leftovers = (await fs.readdir(dir)).filter((name) => name.endsWith('.tmp'))
  assert.deepEqual(leftovers, [])
})

test('concurrent mutations are serialised and do not lose writes', async (t) => {
  const dir = await tempDir(t)

  await Promise.all(
    Array.from({ length: 25 }, (_, index) =>
      mutateStore(dir, async (store) => {
        // Yield between read and write to prove the lock holds.
        await new Promise((resolve) => setTimeout(resolve, 1))
        store.leads.push({ id: `LD-${index}` })
      }),
    ),
  )

  const store = await readStore(dir)
  assert.equal(store.leads.length, 25)
  assert.equal(new Set(store.leads.map((lead) => lead.id)).size, 25)
})

test('a failed mutation is surfaced and the next one still runs', async (t) => {
  const dir = await tempDir(t)

  await assert.rejects(
    () =>
      mutateStore(dir, (store) => {
        store.leads.push({ id: 'LD-KEPT' })
        throw new Error('boom')
      }),
    /boom/,
  )

  const afterFailure = await readStore(dir)
  assert.equal(afterFailure.leads.length, 0)

  await mutateStore(dir, (store) => {
    store.leads.push({ id: 'LD-AFTER' })
  })

  const store = await readStore(dir)
  assert.deepEqual(store.leads.map((lead) => lead.id), ['LD-AFTER'])
})

test('invalid JSON is reported with a recovery instruction', async (t) => {
  const dir = await tempDir(t)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(storeFile(dir), '{ not json', 'utf8')

  await assert.rejects(() => readStore(dir), /not valid JSON/i)
})

test('an unexpected store shape is rejected rather than silently replaced', async (t) => {
  const dir = await tempDir(t)
  await fs.writeFile(storeFile(dir), JSON.stringify({ leads: 'nope' }), 'utf8')

  await assert.rejects(() => readStore(dir), /Invalid store shape/i)
})
