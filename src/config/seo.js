/**
 * Head metadata for every page.
 *
 * This is the single source for the <title>, meta description and canonical
 * path each page uses. The build reads the same values to write static tags
 * into every route shell (see scripts/route-shells.mjs), so the HTML that
 * crawlers and link previews see matches the page after React renders.
 *
 * Edit a title or description here and both versions change together.
 */
import { site } from './site'

/** Static pages, keyed by route. */
export const pageSeo = {
  '/services': {
    path: '/services',
    title: 'Services',
    description:
      'Four service categories: website development, e-commerce, custom web applications and AI business automation — with clear scope and honest pricing.',
  },
  '/work': {
    path: '/work',
    title: 'Work & portfolio',
    description:
      'Demo and concept projects by Khatri Solutions: clinic, restaurant, e-commerce and business websites, plus a web app prototype. Every entry is labelled honestly.',
  },
  '/pricing': {
    path: '/pricing',
    title: 'Pricing',
    description:
      'Starting prices for websites, e-commerce, custom web applications and AI automation. INR packages from ₹3,999, with scope and exclusions stated up front.',
  },
  '/about': {
    path: '/about',
    title: 'About & team',
    description:
      'Meet the two collaborators behind Khatri Solutions: a technical lead and a client relations partner. Honest roles, no invented credentials.',
  },
  '/reviews': {
    path: '/reviews',
    title: 'Reviews',
    description:
      'Genuine, verified client reviews of Khatri Solutions projects. This is a new studio, so the page starts empty rather than with invented testimonials.',
  },
  '/contact': {
    path: '/contact',
    title: 'Contact & project inquiry',
    description:
      'Tell Khatri Solutions about your website, online store, custom application or automation project. Three short steps, then a scope and quote.',
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy notice',
    description:
      'How Khatri Solutions handles the information you submit through the project inquiry and review forms, and the choices you have.',
  },
  '/demos': {
    path: '/demos',
    title: 'Live demos',
    description:
      'Interactive demo sites by Khatri Solutions: a design studio, a clinic, a restaurant, an online store, a dashboard and an AI enquiry workflow.',
  },
}

/** The home page uses the studio description and the default title. */
export const homeSeo = { path: '/', description: site.description }

/** Meta for a portfolio case study. */
export function caseStudyMeta(project) {
  return {
    title: `${project.title} case study`,
    description: project.summary,
    path: `/work/${project.slug}`,
  }
}

/** Meta for a live demo site. */
export function demoMeta(demo) {
  return {
    title: `${demo.name} — live demo`,
    description: `${demo.name} is a ${demo.kind.toLowerCase()} demo site built by Khatri Solutions to demonstrate ${demo.service.toLowerCase()}.`,
    path: `/demos/${demo.slug}`,
  }
}

/** Full <title> text, matching what useSeo renders. */
export function fullTitle(title) {
  return title ? `${title} — ${site.name}` : `${site.name} — Websites & AI Automation`
}
