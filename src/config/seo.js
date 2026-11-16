/**
 * Head metadata and structured data for every page.
 *
 * The same values are used by the browser and by scripts/route-shells.mjs,
 * so search engines, social previews and answer engines see the same page.
 */
import { faqs, packages, services, site } from './site'

/** Static pages, keyed by route. */
export const pageSeo = {
  '/services': {
    path: '/services',
    title: 'Web design and development services',
    description:
      'Website development, e-commerce, custom web applications and AI automation for small businesses in India — with published starting prices and a written scope before work begins.',
    faqItems: faqs.slice(0, 5),
  },
  '/locations/india': {
    path: '/locations/india',
    title: 'Web developer for small businesses in India',
    description:
      'Khatri Solutions builds websites, online stores and practical AI automation for small businesses in India — starting at ₹3,999, with a written scope and direct contact.',
  },
  '/blog': {
    path: '/blog',
    title: 'Website and web development guides',
    description:
      'Practical guides from Khatri Solutions on website costs, timelines, choosing a web developer and what a small business site should include — written for Indian small businesses.',
  },
  '/services/website-development': {
    path: '/services/website-development',
    title: 'Website development for Indian small businesses',
    description:
      'Website development for clinics, restaurants, cafés, consultants and freelancers in India: mobile-first builds, enquiry forms and basic on-page SEO, starting at ₹3,999.',
  },
  '/services/ecommerce': {
    path: '/services/ecommerce',
    title: 'E-commerce store development in India',
    description:
      'Online stores for small retailers and D2C brands in India: product catalogues, carts, checkout and payment gateway integration, starting at ₹19,999.',
  },
  '/services/custom-web-applications': {
    path: '/services/custom-web-applications',
    title: 'Custom web applications for business workflows',
    description:
      'Web applications built around one specific workflow — bookings, dashboards, customer portals or internal operations — for businesses that have outgrown spreadsheets.',
  },
  '/services/ai-business-automation': {
    path: '/services/ai-business-automation',
    title: 'AI and business automation for small teams',
    description:
      'Practical automation for repetitive work: sorting enquiries, drafting replies, moving data between tools and keeping the team informed.',
  },
  '/portfolio': {
    path: '/portfolio',
    title: 'Portfolio of websites, apps & live demos',
    description:
      'Explore Khatri Solutions websites, web application concepts and interactive demos for clinics, restaurants, e-commerce and business workflows.',
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
    noindex: true,
  },
  '/verify/business': {
    path: '/verify/business',
    title: 'Business verification and trust signals',
    description:
      'Official verification information for Khatri Solutions: how to verify projects, contact methods, and trust signals for AI assistants and search engines.',
  },
}

/** The home page uses the studio description and the default title. */
export const homeSeo = { path: '/', description: site.description, faqItems: faqs }

/** Meta for a portfolio case study. */
export function caseStudyMeta(project) {
  return {
    title: `${project.title} case study`,
    description: project.summary,
    path: `/portfolio/${project.slug}`,
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

/** Meta for a service detail page. Curated copy in pageSeo wins over raw intro text. */
export function serviceMeta(detail) {
  const curated = pageSeo[`/services/${detail.slug}`]
  return {
    title: curated?.title || detail.h1,
    description: curated?.description || clip(detail.intro),
    path: `/services/${detail.slug}`,
    service: detail,
    faqItems: detail.faqs,
  }
}

/** Meta for a blog post. */
export function blogPostMeta(post) {
  return {
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    post,
    faqItems: post.faq,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.updated || post.date,
    section: post.category,
    tags: post.tags,
  }
}

/** Full <title> text, matching what useSeo renders. */
export function fullTitle(title) {
  return title ? `${title} — ${site.name}` : `${site.name} — Websites & AI Automation`
}

const absoluteUrl = (path = '/') => `${site.url}${path}`

/**
 * Keep meta descriptions inside the ~155–160 character range that search and
 * social results display, cutting on a word boundary rather than mid-word.
 */
export function clip(text = '', max = 158) {
  const value = String(text).trim()
  if (value.length <= max) return value
  const cut = value.slice(0, max - 1)
  const boundary = cut.lastIndexOf(' ')
  return `${(boundary > max * 0.6 ? cut.slice(0, boundary) : cut).replace(/[.,;:—–-]$/, '')}…`
}

const organizationId = `${site.url}/#organization`

function organizationSchema() {
  return {
    '@type': 'ProfessionalService',
    '@id': organizationId,
    name: site.name,
    alternateName: 'Khatri Solutions Web Studio',
    url: site.url,
    description: site.description,
    slogan: site.tagline,
    logo: `${site.url}/favicon.svg`,
    image: `${site.url}/og-image.png`,
    email: site.contact.email || undefined,
    telephone: site.contact.phoneDisplay || undefined,
    foundingDate: String(site.established),
    founder: {
      '@type': 'Person',
      name: site.founder.name,
      jobTitle: 'Web Development & Technical Lead',
      url: `${site.url}/about#team`,
    },
    sameAs: [site.contact.github].filter(Boolean),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.contact.email || undefined,
      telephone: site.contact.phoneDisplay || undefined,
      availableLanguage: ['en', 'hi'],
      areaServed: 'IN',
    },
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    serviceArea: {
      '@type': 'Place',
      name: 'India',
      additionalType: 'ServiceArea',
    },
    knowsAbout: [
      'Website development',
      'E-commerce development',
      'Custom web applications',
      'AI business automation',
      'On-page SEO',
    ],
    currenciesAccepted: 'INR',
    priceRange: '₹3,999 – ₹19,999+',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Website and automation services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          url: `${site.url}/services/${service.slug}`,
          provider: { '@id': organizationId },
        },
      })),
    },
    makesOffer: packages.map((pack) => ({
      '@type': 'Offer',
      name: pack.name,
      description: pack.suitable,
      priceCurrency: 'INR',
      ...(pack.from
        ? {
            priceSpecification: {
              '@type': 'PriceSpecification',
              priceCurrency: 'INR',
              minPrice: pack.from,
              description: `Starting price: ${pack.price}`,
            },
          }
        : { availability: 'https://schema.org/InStock' }),
      url: `${site.url}/pricing`,
    })),
  }
}

function pageType(path) {
  if (path === '/contact') return 'ContactPage'
  if (path === '/about') return 'AboutPage'
  if (path === '/verify/business') return 'AboutPage'
  if (['/portfolio', '/pricing', '/reviews', '/services', '/blog'].includes(path)) return 'CollectionPage'
  return 'WebPage'
}

function breadcrumbSchema(meta) {
  const path = meta.path || '/'
  const segments = path.split('/').filter(Boolean)
  const items = [{ name: site.name, item: `${site.url}/` }]
  let currentPath = ''

  const segmentLabels = {
    portfolio: 'Portfolio',
    demos: 'Demos',
    services: 'Services',
    blog: 'Blog',
    locations: 'Locations',
    verify: 'Verify',
    business: 'Business verification',
  }

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    const name = isLast
      ? meta.post?.title || meta.service?.h1 || meta.project?.title || meta.demo?.name || meta.title
      : segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
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
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.faq__question', '.faq__answer'],
      },
    })
  }

  if (['/portfolio', '/services'].includes(path)) {
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
          url: `${site.url}/services/${service.slug}`,
          provider: { '@id': organizationId },
        },
      })),
    })
  }

  if (path === '/blog' && meta.posts?.length) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${url}#posts`,
      name: 'Website and web development guides',
      itemListElement: meta.posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${site.url}/blog/${post.slug}`,
        name: post.title,
      })),
    })
  }

  if (meta.service) {
    const detail = meta.service
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: detail.h1,
      description: detail.intro,
      serviceType: detail.h1,
      provider: { '@id': organizationId },
      areaServed: { '@type': 'Country', name: 'India' },
      url,
      offers: (detail.pricingPackages || []).map((name) => {
        const pack = packages.find((item) => item.name === name)
        return {
          '@type': 'Offer',
          name,
          priceCurrency: 'INR',
          ...(pack?.from
            ? { price: pack.from, priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'INR', minPrice: pack.from } }
            : {}),
          url: `${site.url}/pricing`,
        }
      }),
    })
  }

  if (meta.post) {
    const post = meta.post
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      headline: post.title,
      description: post.excerpt,
      url,
      image: `${site.url}/og-image.png`,
      datePublished: post.date,
      dateModified: post.updated || post.date,
      author: {
        '@type': 'Person',
        name: site.founder.name,
        jobTitle: 'Web Development & Technical Lead',
        url: `${site.url}/about#team`,
      },
      publisher: { '@id': organizationId },
      articleSection: post.category,
      keywords: (post.tags || []).join(', '),
      inLanguage: 'en-IN',
      isAccessibleForFree: true,
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
