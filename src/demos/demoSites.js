/**
 * Live demo sites.
 *
 * Each entry is a self-contained mini-website rendered inside this app at
 * /demos/<slug>. They exist to show how a real build would look and behave;
 * every one is clearly labelled as a demo, and no demo claims a client,
 * a result or a real business.
 *
 * `projectSlug` links the demo back to its portfolio entry in site.js.
 */
export const demoSites = [
  {
    slug: 'atelier-nine',
    projectSlug: 'atelier-nine',
    name: 'Atelier Nine',
    kind: 'Interior design studio',
    service: 'Website Development',
    serviceSlug: 'website-development',
    theme: 'atelier',
    accent: '#9a7a4e',
    summary: 'A portfolio-led studio site with room-by-room filtering and a serious enquiry path.',
  },
  {
    slug: 'wellness-physiotherapy',
    projectSlug: 'wellness-physiotherapy',
    name: 'Wellness Physiotherapy',
    kind: 'Physiotherapy clinic',
    service: 'Website Development',
    serviceSlug: 'website-development',
    theme: 'wellness',
    accent: '#2f6f63',
    summary: 'A calm clinic site built around one action: requesting an appointment.',
  },
  {
    slug: 'saffron-table',
    projectSlug: 'saffron-table-restaurant',
    name: 'Saffron Table',
    kind: 'Restaurant',
    service: 'Website Development',
    serviceSlug: 'website-development',
    theme: 'saffron',
    accent: '#a8412a',
    summary: 'A restaurant site where the menu, timings and table request are all one tap away.',
  },
  {
    slug: 'northline-store',
    projectSlug: 'northline-store',
    name: 'Northline',
    kind: 'Home & lifestyle store',
    service: 'E-commerce',
    serviceSlug: 'ecommerce',
    theme: 'northline',
    accent: '#1f2d3d',
    summary: 'A working storefront demo: filter products, add to cart, see a live total.',
  },
  {
    slug: 'clinic-ops',
    projectSlug: 'clinic-ops-dashboard',
    name: 'Clinic Ops',
    kind: 'Practice operations dashboard',
    service: 'Custom Web Application',
    serviceSlug: 'custom-web-applications',
    theme: 'clinicops',
    accent: '#2b3a67',
    summary: 'An internal tool demo: search and filter today’s appointments without a spreadsheet.',
  },
  {
    slug: 'enquiry-triage',
    projectSlug: 'enquiry-triage',
    name: 'Enquiry Triage',
    kind: 'AI-assisted enquiry handling',
    service: 'AI & Business Automation',
    serviceSlug: 'ai-business-automation',
    theme: 'triage',
    accent: '#4b3f8f',
    summary: 'A browser-based simulation of sorting enquiries and drafting a first reply.',
  },
]

export const getDemo = (slug) => demoSites.find((demo) => demo.slug === slug) || null
