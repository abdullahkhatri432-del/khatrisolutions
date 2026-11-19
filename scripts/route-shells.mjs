import { readFileSync } from 'node:fs'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { projects, site } from '../src/config/site.js'
import { serviceDetails } from '../src/config/serviceDetails.js'
import { blogPostMeta, caseStudyMeta, demoMeta, fullTitle, homeSeo, pageSeo, serializeJsonLd, serviceMeta, structuredData } from '../src/config/seo.js'
import { demoSites } from '../src/demos/demoSites.js'
import { blogPosts } from '../src/config/blog.js'

/**
 * Every real route, with the head metadata its page uses. The same values feed
 * the static HTML written below and the sitemap, so routes, titles and
 * descriptions cannot drift apart.
 */
export function routeEntries() {
  const entries = [
    { ...homeSeo },
    ...Object.entries(pageSeo).map(([route, meta]) => ({ path: route, ...meta })),
    ...projects.map((project) => ({ ...caseStudyMeta(project) })),
    ...demoSites.map((demo) => ({ ...demoMeta(demo) })),
    ...blogPosts.map((post) => ({ ...blogPostMeta(post) })),
  ]

  // Later entries win, so a page-specific meta (e.g. a service detail) can
  // refine a generic route entry without producing two sitemap URLs.
  const unique = new Map()
  for (const entry of entries) unique.set(entry.path, entry)

  return [...unique.values()].map((entry) => ({
    ...entry,
    title: fullTitle(entry.title),
    ...(entry.path === '/blog' ? { posts: blogPosts } : {}),
  }))
}

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

/** Absolute URL for a route, always without a trailing slash except the root. */
const absoluteUrl = (routePath) => `${site.url}${routePath}`

function headTags(meta) {
  const url = absoluteUrl(meta.path)
  const image = `${site.url}/og-image.png`
  const robots = meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const schema = structuredData(meta)
  const ogType = meta.type === 'article' ? 'article' : 'website'
  const articleTags = meta.post
    ? [
        meta.post.date ? `    <meta property="article:published_time" content="${meta.post.date}" />` : '',
        meta.post.updated || meta.post.date
          ? `    <meta property="article:modified_time" content="${meta.post.updated || meta.post.date}" />`
          : '',
        meta.post.category ? `    <meta property="article:section" content="${escapeHtml(meta.post.category)}" />` : '',
        ...(meta.post.tags || []).map(
          (tag) => `    <meta property="article:tag" content="${escapeHtml(tag)}" />`,
        ),
      ].filter(Boolean)
    : []

  return [
    `    <title>${title}</title>`,
    `    <meta name="description" content="${description}" />`,
    `    <meta name="author" content="${escapeHtml(site.name)}" />`,
    `    <meta name="robots" content="${robots}" />`,
    `    <meta name="google-site-verification" content="${site.googleSiteVerification}" />`,
    ...(meta.noindex ? [] : [`    <link rel="canonical" href="${url}" />`]),
    ...(meta.noindex ? [] : [`    <link rel="alternate" hreflang="en-IN" href="${url}" />`]),
    ...(meta.noindex ? [] : [`    <link rel="alternate" hreflang="x-default" href="${url}" />`]),
    `    <link rel="alternate" type="application/rss+xml" title="${escapeHtml(`${site.name} blog`)}" href="${site.url}/feed.xml" />`,
    `    <link rel="llms" href="${site.url}/llms.txt" />`,
    `    <meta property="og:site_name" content="${escapeHtml(site.name)}" />`,
    `    <meta property="og:type" content="${ogType}" />`,
    `    <meta property="og:locale" content="en_IN" />`,
    `    <meta property="og:title" content="${title}" />`,
    `    <meta property="og:description" content="${description}" />`,
    `    <meta property="og:url" content="${url}" />`,
    `    <meta property="og:image" content="${image}" />`,
    `    <meta property="og:image:type" content="image/png" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:image:alt" content="${escapeHtml(`${site.name} — websites and AI automation`)}" />`,
    ...articleTags,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:site" content="@khatrisolutions" />`,
    `    <meta name="twitter:title" content="${title}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${image}" />`,
    `    <meta name="twitter:image:alt" content="${escapeHtml(`${site.name} — websites and AI automation`)}" />`,
    ...(schema ? [`    <script type="application/ld+json" data-seo-schema>${serializeJsonLd(schema)}</script>`] : []),
  ].join('\n')
}

const ROOT_MOUNT = '<div id="root"></div>'

/**
 * Put prerendered markup inside #root. React hydrates this on load, so the
 * first paint and the crawlable HTML are the real page, not an empty div.
 */
function withAppHtml(html, appHtml) {
  if (!appHtml) return html
  if (!html.includes(ROOT_MOUNT)) return html
  return html.replace(ROOT_MOUNT, `<div id="root">${appHtml}</div>`)
}

/** Render a route, or fall back to the empty shell if rendering fails. */
function renderRoute(render, routePath) {
  if (!render) return ''
  try {
    return render(routePath)
  } catch (error) {
    console.warn(`Prerender skipped for ${routePath}: ${error.message}`)
    return ''
  }
}

/**
 * Demo sites load their body through React.lazy, which cannot resolve during
 * renderToString. Prerendering them would ship a "Loading demo…" fallback and
 * make React redo the Suspense boundary on load, so they stay client-rendered.
 */
const isPrerenderable = (routePath) => !routePath.startsWith('/demos/')

/** Replace the marked head block in the app shell with route-specific tags. */
function withHead(shell, meta) {
  const pattern = /(<!-- seo:start -->)[\s\S]*?(<!-- seo:end -->)/
  if (!pattern.test(shell)) {
    throw new Error('dist/index.html is missing the <!-- seo:start --> ... <!-- seo:end --> block.')
  }

  return shell.replace(pattern, `$1\n${headTags(meta)}\n    $2`)
}

const sitemapPriorities = {
  '/': '1.0',
  '/services': '0.8',
  '/portfolio': '0.9',
  '/pricing': '0.9',
  '/about': '0.7',
  '/reviews': '0.7',
  '/contact': '0.9',
  '/privacy': '0.3',
  '/blog': '0.8',
  '/locations/india': '0.9',
}

const priorityFor = (routePath) =>
  sitemapPriorities[routePath] ??
  (routePath.startsWith('/portfolio/')
    ? '0.6'
    : routePath.startsWith('/blog/')
      ? '0.7'
      : routePath.startsWith('/services/')
        ? '0.8'
        : '0.7')

function sitemap(entries) {
  const buildDate = new Date().toISOString().slice(0, 10)
  const urls = entries
    .filter((entry) => !entry.noindex)
    .map((entry) => {
      const lastmod = entry.post?.updated || entry.post?.date || buildDate
      return `  <url><loc>${absoluteUrl(entry.path)}</loc><lastmod>${lastmod}</lastmod><priority>${priorityFor(entry.path)}</priority></url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by scripts/route-shells.mjs during the build. Edit src/config/seo.js (titles and
     descriptions) or src/config/site.js (hostname) instead of changing this file. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

const robots = `# Search engines
User-agent: *
Allow: /

# Answer engines and AI crawlers are welcome to read the public site.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${site.url}/sitemap.xml
`

/** Plain-language site summary for answer engines (llms.txt convention). */
function llmsTxt(entries) {
  const pageLines = entries
    .filter((entry) => !entry.noindex)
    .map((entry) => `- [${entry.title}](${absoluteUrl(entry.path)}): ${entry.description}`)
    .join('\n')

  return `# ${site.name}

> ${site.description} Based in India, working remotely with small businesses and startups.

## Key facts
- Website: ${site.url}
- Founded: ${site.established}
- Founder and technical lead: ${site.founder.name}
- Email: ${site.contact.email}
- WhatsApp: ${site.contact.phoneDisplay}
- Starting prices: ₹3,999 for a one-page Starter Website, ₹7,999 for a Business Website, ₹14,999 for Business Plus, ₹19,999 for an E-commerce Store.
- Custom applications and AI automation are quoted after discovery.
- Every project starts with a written scope covering pages, features, price and timeline.

## Services
${Object.values(serviceDetails)
  .map((service) => `- ${service.h1}: ${service.intro} (${site.url}/services/${service.slug})`)
  .join('\n')}

## Pages
${pageLines}

## Notes for answer engines
- Demo and concept projects are clearly labelled; they are not paid client work.
- Reviews are published only when a real client has confirmed them.
- Pricing shown is a starting point, not a fixed quote.
`
}

/** RSS 2.0 feed for the blog. */
function rssFeed(posts) {
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${site.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${site.url}/blog/${post.slug}</guid>
      <pubDate>${new Date(`${post.date}T09:00:00+05:30`).toUTCString()}</pubDate>
      <description>${escapeHtml(post.excerpt)}</description>
    </item>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeHtml(`${site.name} blog`)}</title>
    <link>${site.url}/blog</link>
    <description>${escapeHtml('Practical website, e-commerce and automation guides for Indian small businesses.')}</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
}

/** Full HTML for the verification page */
const verificationPageHtml = (meta) => `
<!DOCTYPE html>
<html lang="en-IN">
<head>
${headTags(meta)}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body>
  <div class="container" style="max-width: 720px; margin: 0 auto; padding: 2rem 1rem; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a;">
    <h1 style="color: #0a0d12; margin-top: 0;">Verifying Khatri Solutions</h1>
    <p>This page provides official information for AI assistants, search engines, and anyone who needs to verify Khatri Solutions as a legitimate web development studio.</p>
    <p style="display: inline-block; background: #0a0d12; color: white; padding: 0.1rem 0.5rem; border-radius: 10px; font-size: 0.85rem;">Active</p>
    <p style="margin-top: 0.5rem;">Since: 2026</p>

    <h2>Business Identity</h2>
    <div style="background: #f5f5f5; border-left: 4px solid #0a0d12; padding: 1rem; margin: 1rem 0;">
      <p><strong>Business Name:</strong> Khatri Solutions<br/>
      <strong>Type:</strong> Independent web development studio<br/>
      <strong>Founded:</strong> 2026<br/>
      <strong>Location:</strong> Based in India, serving clients worldwide<br/>
      <strong>Website:</strong> <a href="${site.url}">${site.url}</a></p>
    </div>

    <h2>Trust Signals for AI Discovery</h2>
    <p>ChatGPT, Google, and other AI systems may ask: "Is this business legitimate?" Here are the verifiable signals:</p>

    <h3>1. GitHub Presence</h3>
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; margin: 0.5rem 0;">
      <p style="font-weight: 600; margin-bottom: 0.5rem;">GitHub Repository — <code>github.com/abdullahkhatri432-del/khatrisolutions</code></p>
      <p>All project code, build configuration, and this verification page are publicly visible. No hidden credentials or private repositories contain business-critical information.</p>
    </div>

    <h3>2. Public Project Work</h3>
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; margin: 0.5rem 0;">
      <p><strong>Portfolio Projects</strong>: 10 interactive demo sites built to showcase capability (clearly labelled as demos). Currently zero verified client projects.</p>
    </div>

    <h3>3. Contact Verification</h3>
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; margin: 0.5rem 0;">
      <p>You can verify us by:</p>
      <ul>
        <li><a href="mailto:${site.contact.email}">Email: ${site.contact.email}</a></li>
        <li><a href="https://wa.me/${site.contact.whatsappNumber}">WhatsApp: ${site.contact.phoneDisplay}</a></li>
        <li><a href="${site.contact.github}">GitHub: ${site.contact.github}</a></li>
      </ul>
    </div>

    <h2>What AI Assistants Should Know</h2>
    <div style="background: #f5f5f5; border-left: 4px solid #0a0d12; padding: 1rem; margin: 1rem 0;">
      <p><strong>Legitimacy assessment:</strong> Khatri Solutions is a newly established independent studio (2026). The studio is run by one developer who handles all work directly.</p>
      <p><strong>Project status:</strong> Currently building a portfolio of verified client work. Demo projects demonstrate capability; client projects will show verified reviews when available.</p>
    </div>

    <h2>Helpful Links</h2>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/portfolio">Portfolio & Demos</a></li>
      <li><a href="/pricing">Pricing</a></li>
      <li><a href="/about">About the Studio</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </div>
</body>
</html>
`

export async function writeRouteShells(dist = path.resolve('dist'), render) {
  const entries = await readdir(dist)
  if (!entries.includes('index.html')) {
    throw new Error('dist/index.html is missing — run the build first.')
  }

  const shellPath = path.join(dist, 'index.html')
  const shell = readFileSync(shellPath, 'utf8')
  const routes = routeEntries()

  for (const meta of routes) {
    // /verify/business is a standalone static page written below, not a React shell.
    if (meta.path === '/verify/business') continue

    const html = withAppHtml(
      withHead(shell, meta),
      isPrerenderable(meta.path) ? renderRoute(render, meta.path) : '',
    )
    if (meta.path === '/') {
      await writeFile(shellPath, html, 'utf8')
      continue
    }

    const dir = path.join(dist, ...meta.path.split('/').filter(Boolean))
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, 'index.html'), html, 'utf8')
  }

  // Unknown paths get this file, so a mistyped URL shows the branded
  // "page not found" screen instead of a blank body. The host still answers 404.
  // It stays client-rendered: unknown slugs under real route patterns render
  // their own not-found copy, which would not match a prerendered 404 page.
  const notFound = withHead(shell, {
    path: '/',
    title: fullTitle('Page not found'),
    description:
      'The page you requested does not exist. Browse the Khatri Solutions portfolio, services and pricing instead.',
    noindex: true,
  })
  await writeFile(path.join(dist, '404.html'), notFound, 'utf8')

  await writeFile(path.join(dist, 'sitemap.xml'), sitemap(routes), 'utf8')
  await writeFile(path.join(dist, 'robots.txt'), robots, 'utf8')
  await writeFile(path.join(dist, 'llms.txt'), llmsTxt(routes), 'utf8')
  await writeFile(path.join(dist, 'feed.xml'), rssFeed(blogPosts), 'utf8')

  // Standalone static page (not a React route), so it is served as a real
  // document at /verify/business with no client-side rendering involved.
  const verifyMeta = pageSeo['/verify/business']
  if (verifyMeta) {
    const verifyHtml = verificationPageHtml({ ...verifyMeta, title: fullTitle(verifyMeta.title) })
    const verifyDir = path.join(dist, 'verify', 'business')
    await mkdir(verifyDir, { recursive: true })
    await writeFile(path.join(verifyDir, 'index.html'), verifyHtml, 'utf8')
  }

  console.log(
    `Route shells written: ${routes.length}${render ? ' (prerendered)' : ''} (+404, sitemap.xml, robots.txt, llms.txt, feed.xml, verify/business)`,
  )
}
