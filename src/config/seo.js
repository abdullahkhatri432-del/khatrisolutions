/**
 * Head metadata and structured data for every page.
 *
 * The same values are used by the browser and by scripts/route-shells.mjs,
 * so search engines, social previews and answer engines see the same page.
 */
import { faqs, services, site } from './site'

/** Static pages, keyed by route. */
export const pageSeo = {
  '/services': {
    path: '/services',
    title: 'Website, e-commerce & AI automation services',
    description:
      'Website development, e-commerce, custom web applications and practical AI automation for small businesses in India and remote teams worldwide.',
  },
  '/work': {
    path: '/work',
    title: 'Web design portfolio & live demos',
    description:
      'Explore Khatri Solutions demo and concept projects for clinics, restaurants, e-commerce, business websites and workflow automation.',
  },
  '/pricing': {
    path: '/pricing',
    title: 'Website design pricing in India',
    description:
      'Starting website prices in INR from ₹3,999, with e-commerce, custom application and AI automation packages explained clearly.',
    faqItems: faqs.slice(0, 5),
  },
  '/about': {
    path: '/about',
    title: 'About Khatri Solutions web studio',
    description:
      'Meet the independent two-person web studio behind Khatri Solutions: technical development and direct client communication.',
  },
  '/reviews': {
    path: '/reviews',
    title: 'Client reviews',
    description:
      'Verified client reviews of Khatri Solutions projects. This new studio publishes genuine feedback only after it is checked.',
  },
  '/contact': {
    path: '/contact',
    title: 'Contact a web developer in India',
    description:
      'Tell Khatri Solutions about your website, online store, custom application or automation project and receive a written scope and quote.',
    faqItems: faqs.slice(0, 4),
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy notice',
    description:
      'How Khatri Solutions handles information submitted through project inquiry and review forms, and the choices you have.',
  },
  '/demos': {
    path: '/demos',
    title: 'Interactive website demos',
    description:
      'Use interactive Khatri Solutions demos for business websites, clinics, restaurants, online stores, dashboards and AI workflows.',
  },
}

/** The home page uses the studio description and the default title. */
export const homeSeo = { path: '/', description: site.description, faqItems: faqs }

/** Meta for a portfolio case study. */
export function caseStudyMeta(project) {
  return {
    title: `${project.title} case study`,
    description: project.summary,
    path: `/work/${project.slug}`,
    project,
  }
}

/** Meta for a live demo site. */
export function demoMeta(demo) {
  return {
    title: `${demo.name} — live demo`,
    description: `${demo.name} is a ${demo.kind.toLowerCase()} demo site built by Khatri Solutions to demonstrate ${demo.service.toLowerCase()}.`,
    path: `/demos/${demo.slug}`,
    demo,
  }
}

/** Full <title> text, matching what useSeo renders. */
export function fullTitle(title) {
  return title ? `${title} — ${site.name}` : `${site.name} — Websites & AI Automation`
}

const absoluteUrl = (path = '/') => `${site.url}${path}`

const organizationId = `${site.url}/#organization`

function organizationSchema() {
  return {
    '@type': 'ProfessionalService',
    '@id': organizationId,
    name: site.name,
    url: site.url,
    description: site.description,
    logo: `${site.url}/favicon.svg`,
    image: `${site.url}/og-image.png`,
    email: site.contact.email || undefined,
    telephone: site.contact.phoneDisplay || undefined,
    founder: {
      '@type': 'Person',
      name: site.founder.name,
      jobTitle: 'Web Development & Technical Lead',
      url: `${site.url}/about#team`,
    },
    sameAs: [site.contact.github, site.contact.instagram, site.contact.linkedin].filter(Boolean),
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Website and automation services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          url: `${site.url}/services#${service.slug}`,
          provider: { '@id': organizationId },
        },
      })),
    },
  }
}

function pageType(path) {
  if (path === '/contact') return 'ContactPage'
  if (path === '/about') return 'AboutPage'
  if (['/services', '/work', '/pricing', '/reviews', '/demos'].includes(path)) return 'CollectionPage'
  return 'WebPage'
}

function breadcrumbSchema(meta) {
  const path = meta.path || '/'
  const segments = path.split('/').filter(Boolean)
  const items = [{ name: site.name, item: site.url }]
  let currentPath = ''

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    const name = isLast
      ? meta.project?.title || meta.demo?.name || meta.title
      : segment === 'work'
        ? 'Work'
        : segment === 'demos'
          ? 'Demos'
          : segment.charAt(0).toUpperCase() + segment.slice(1)
    items.push({ name, item: absoluteUrl(currentPath) })
  })

  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}

/**
 * Build factual JSON-LD for a route. It deliberately contains no ratings,
 * client results or locations that are not present in the content config.
 */
export function structuredData(meta = {}) {
  if (meta.noindex) return null

  const path = meta.path || '/'
  const url = absoluteUrl(path)
  const pageName =
    meta.title === fullTitle(null) || meta.title?.endsWith(` — ${site.name}`) ? meta.title : fullTitle(meta.title)
  const graph = [
    organizationSchema(),
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { '@id': organizationId },
      inLanguage: 'en-IN',
    },
    {
      '@type': pageType(path),
      '@id': `${url}#webpage`,
      url,
      name: pageName,
      description: meta.description || site.description,
      isPartOf: { '@id': `${site.url}/#website` },
      about: { '@id': organizationId },
      inLanguage: 'en-IN',
    },
    breadcrumbSchema(meta),
  ]

  if (meta.faqItems?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      url,
      mainEntity: meta.faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    })
  }

  if (path === '/services') {
    graph.push({
      '@type': 'ItemList',
      '@id': `${url}#services`,
      name: 'Khatri Solutions services',
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          url: `${site.url}/services#${service.slug}`,
          provider: { '@id': organizationId },
        },
      })),
    })
  }

  if (meta.project) {
    graph.push({
      '@type': 'CreativeWork',
      '@id': `${url}#project`,
      url,
      name: meta.project.title,
      description: meta.project.summary,
      creator: { '@id': organizationId },
      genre: meta.project.category,
      keywords: meta.project.stack.join(', '),
      creativeWorkStatus: meta.project.type,
    })
  }

  if (meta.demo) {
    graph.push({
      '@type': 'CreativeWork',
      '@id': `${url}#demo`,
      url,
      name: meta.demo.name,
      description: meta.description,
      creator: { '@id': organizationId },
      genre: meta.demo.kind,
      keywords: meta.demo.service,
      creativeWorkStatus: 'Demo build',
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

/** Safely serialize JSON-LD so page content cannot terminate the script tag. */
export function serializeJsonLd(value) {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
}
