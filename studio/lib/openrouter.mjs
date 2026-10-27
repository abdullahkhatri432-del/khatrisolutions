import { buildMessages } from './prompt.mjs'

export class OpenRouterError extends Error {
  constructor(message, { status = 0 } = {}) {
    super(message)
    this.name = 'OpenRouterError'
    this.status = status
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function stringList(value, limit = 20) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .slice(0, limit)
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n/)
      .map((item) => item.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean)
      .slice(0, limit)
  }
  return []
}

function normaliseChecklist(value) {
  if (!Array.isArray(value)) return []
  const allowed = new Set(['high', 'medium', 'low'])
  return value
    .map((item) => ({
      area: String(item?.area || 'General').trim().slice(0, 80),
      item: String(item?.item || '').trim().slice(0, 500),
      why: String(item?.why || '').trim().slice(0, 500),
      priority: allowed.has(item?.priority) ? item.priority : 'medium',
    }))
    .filter((item) => item.item)
    .slice(0, 20)
}

export function parseModelJson(content) {
  const text = String(content || '').trim()
  if (!text) throw new OpenRouterError('OpenRouter returned an empty response.')

  const unfenced = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const candidates = [unfenced]
  const first = unfenced.indexOf('{')
  const last = unfenced.lastIndexOf('}')
  if (first !== -1 && last > first) candidates.push(unfenced.slice(first, last + 1))

  let parsed = null
  for (const candidate of candidates) {
    try {
      parsed = JSON.parse(candidate)
      break
    } catch {
      // Try the next candidate.
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new OpenRouterError('The model did not return the expected JSON. No draft was saved.')
  }
  return parsed
}

export function normalizeDraft(parsed, lead) {
  let proposalMarkdown = String(parsed.proposalMarkdown || '').trim()
  if (proposalMarkdown.length < 200) {
    throw new OpenRouterError('The model returned a proposal that was too short. No draft was saved.')
  }

  if (!/^#\s+/m.test(proposalMarkdown.split('\n')[0] || '')) {
    const title = lead.business || lead.name || 'your project'
    proposalMarkdown = `# Proposal for ${title}\n\n${proposalMarkdown}`
  }

  const fit = String(parsed.fit || '').toLowerCase()
  return {
    summary: String(parsed.summary || '').trim(),
    fit: ['strong', 'possible', 'poor'].includes(fit) ? fit : 'possible',
    fitReason: String(parsed.fitReason || '').trim(),
    proposalMarkdown: proposalMarkdown.slice(0, 60000),
    checklist: normaliseChecklist(parsed.checklist),
    questions: stringList(parsed.questions),
    risks: stringList(parsed.risks),
    assumptions: stringList(parsed.assumptions),
    nextAction: String(parsed.nextAction || '').trim(),
  }
}

function providerMessage(body) {
  if (!body) return ''
  if (typeof body === 'string') return body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)
  const error = body.error
  const message = typeof error === 'string' ? error : error?.message || body.message || ''
  return String(message).replace(/\s+/g, ' ').trim().slice(0, 300)
}

function statusMessage(status, provider) {
  if (status === 401 || status === 403) {
    return 'OpenRouter rejected the API key. Check OPENROUTER_API_KEY in .env.local.'
  }
  if (status === 402) {
    return 'OpenRouter reports insufficient credits for this account.'
  }
  if (status === 429) {
    return 'OpenRouter is rate limiting requests. Wait a moment and try again.'
  }
  if (status >= 500) {
    return 'OpenRouter is having trouble right now. Try again shortly.'
  }
  return `OpenRouter returned ${status}${provider ? `: ${provider}` : '.'}`
}

export async function generateDraft({ lead, config, fetchImpl = fetch }) {
  if (!config.openrouterKey) {
    throw new OpenRouterError(
      'OPENROUTER_API_KEY is not set. Add it to .env.local and restart Studio Desk.',
    )
  }

  const url = `${String(config.openrouterBaseUrl).replace(/\/+$/, '')}/chat/completions`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs || 120000)

  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      let response
      try {
        response = await fetchImpl(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.openrouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': config.siteUrl,
            'X-Title': 'Khatri Solutions Studio Desk',
          },
          body: JSON.stringify({
            model: config.openrouterModel,
            messages: buildMessages(lead),
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            stream: false,
          }),
          signal: controller.signal,
        })
      } catch (error) {
        if (error?.name === 'AbortError') {
          throw new OpenRouterError('OpenRouter did not respond in time. No draft was saved.')
        }
        throw new OpenRouterError(`Could not reach OpenRouter: ${error.message}`)
      }

      if (!response.ok) {
        let body = null
        try {
          body = await response.json()
        } catch {
          try {
            body = await response.text()
          } catch {
            body = null
          }
        }

        if ((response.status === 429 || response.status >= 500) && attempt === 0) {
          await delay(1500)
          continue
        }

        throw new OpenRouterError(statusMessage(response.status, providerMessage(body)), {
          status: response.status,
        })
      }

      let data
      try {
        data = await response.json()
      } catch {
        throw new OpenRouterError('OpenRouter returned a response that was not JSON.')
      }

      const choice = data?.choices?.[0]
      const content = choice?.message?.content
      const text = Array.isArray(content)
        ? content.map((part) => (typeof part === 'string' ? part : part?.text || '')).join('')
        : content

      if (!text) {
        throw new OpenRouterError(
          choice?.finish_reason === 'content_filter'
            ? 'The model blocked this request. No draft was saved.'
            : 'OpenRouter returned no proposal text. No draft was saved.',
        )
      }

      const parsed = parseModelJson(text)
      return {
        draft: normalizeDraft(parsed, lead),
        usage: data?.usage || null,
      }
    }

    throw new OpenRouterError('OpenRouter did not return a usable response.')
  } finally {
    clearTimeout(timer)
  }
}
