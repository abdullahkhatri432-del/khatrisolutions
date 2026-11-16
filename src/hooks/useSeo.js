import { useEffect, useRef } from 'react'
import { site } from '../config/site'
import { fullTitle, serializeJsonLd, structuredData } from '../config/seo'

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value))
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(data) {
  let el = document.head.querySelector('script[data-seo-schema]')
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.dataset.seoSchema = 'true'
    document.head.appendChild(el)
  }
  el.textContent = serializeJsonLd(data)
}

export function useSeo(meta = {}) {
  const { title, description, path = '/', image = '/og-image.png', noindex = false, type = 'website' } = meta

  // Pages build their meta object inline, so the reference changes on every
  // render. Compare serialized content instead, otherwise the head would be
  // rewritten on each keystroke in a form.
  const latest = useRef(meta)
  latest.current = meta
  const metaKey = JSON.stringify(meta)

  useEffect(() => {
    const meta = latest.current
    const pageTitle = fullTitle(title)
    const desc = description || site.description
    const origin = site.url || window.location.origin
    const url = new URL(path, origin).toString()
    const imageUrl = new URL(image, origin).toString()

    document.title = pageTitle
    document.documentElement.lang = 'en-IN'

    upsertMeta('meta[name="author"]', { name: 'author', content: site.name })
    upsertMeta('meta[name="description"]', { name: 'description', content: desc })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: site.name })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_IN' })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: desc })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
    upsertMeta('meta[property="og:image:type"]', { property: 'og:image:type', content: 'image/png' })
    upsertMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: `${site.name} — websites and AI automation`,
    })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:site"]', { name: 'twitter:site', content: '@khatrisolutions' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: desc })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl })
    upsertMeta('meta[name="twitter:image:alt"]', {
      name: 'twitter:image:alt',
      content: `${site.name} — websites and AI automation`,
    })

    // Article-specific metadata. Removed again on pages that are not articles.
    const articleMeta = [
      ['article:published_time', meta.publishedTime],
      ['article:modified_time', meta.modifiedTime],
      ['article:section', meta.section],
      ['article:tag', Array.isArray(meta.tags) ? meta.tags.join(', ') : meta.tags],
    ]
    articleMeta.forEach(([property, content]) => {
      const selector = `meta[property="${property}"]`
      if (content) {
        upsertMeta(selector, { property, content })
      } else {
        document.head.querySelector(selector)?.remove()
      }
    })

    // Error pages stay out of the index and carry no canonical.
    if (noindex) {
      document.head.querySelector('link[rel="canonical"]')?.remove()
      document.head.querySelector('script[data-seo-schema]')?.remove()
    } else {
      upsertLink('canonical', url)
      upsertJsonLd(structuredData({ ...meta, title, description: desc, path, image, noindex, type }))
    }
  }, [metaKey])
}
