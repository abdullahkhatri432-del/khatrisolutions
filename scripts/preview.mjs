import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

/**
 * Serves dist/ the way the host does: a clean URL resolves to that route's
 * own index.html, and anything unknown returns 404.html with a 404 status.
 *
 * `vite preview` cannot do this — it answers every unmatched path with the
 * root index.html, so a deep link shows the home page and prerendered routes
 * look broken. Use this instead when checking SEO or hydration locally.
 */
const root = path.resolve('dist')
const port = Number(process.env.PORT ?? 4173)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

async function isFile(file) {
  try {
    return (await stat(file)).isFile()
  } catch {
    return false
  }
}

async function send(res, file, status = 200) {
  const body = await readFile(file)
  res.writeHead(status, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' })
  res.end(body)
}

const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  const candidates = [
    path.join(root, pathname),
    path.join(root, pathname, 'index.html'),
    path.join(root, `${pathname}.html`),
  ]

  for (const candidate of candidates) {
    if (await isFile(candidate)) {
      await send(res, candidate)
      return
    }
  }

  const notFound = path.join(root, '404.html')
  if (await isFile(notFound)) {
    await send(res, notFound, 404)
    return
  }

  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
  res.end('Not found')
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other server, or run PORT=4174 npm run preview.`)
    process.exit(1)
  }
  throw error
})

server.listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}`)
})
