/**
 * Keep this in sync with src/config/site.js. The Studio Desk runs in Node and
 * cannot import the Vite config directly (it reads import.meta.env), so the
 * proposal facts are repeated here deliberately.
 */
export const AGENCY = {
  name: 'Khatri Solutions',
  site: 'https://khatrisolutions.onrender.com',
  email: 'khatrisolutions01@gmail.com',
  whatsapp: '+91 98750 09874',
  currency: 'INR',
  positioning: 'Websites and AI-powered solutions for growing businesses.',
  services: [
    {
      name: 'Website Development',
      includes: 'Business websites, restaurant/café sites, clinic sites, portfolios, landing pages, redesigns and maintenance.',
      suitable: 'Local businesses, clinics, restaurants, consultants, freelancers and small teams that need a credible online presence.',
    },
    {
      name: 'E-commerce',
      includes: 'Online stores, product catalogues, cart and checkout, payment gateway integration where supported, order workflows.',
      suitable: 'Small retailers, D2C brands, boutiques and catalogue businesses ready to sell online.',
    },
    {
      name: 'Custom Web Applications',
      includes: 'Booking systems, admin dashboards, customer portals, inventory tools and custom workflow applications.',
      suitable: 'Businesses that have outgrown spreadsheets, notebooks or group chats.',
    },
    {
      name: 'AI & Business Automation',
      includes: 'AI-assisted workflows, repetitive task automation, enquiry management, supported WhatsApp integrations and third-party integrations.',
      suitable: 'Small teams losing time to repetitive enquiries, follow-ups, data entry and manual handoffs.',
    },
  ],
  packages: [
    {
      name: 'Starter Website',
      price: '₹3,999+',
      suitable: 'A sole trader or very small business that needs a simple, credible one-page presence.',
      deliverables: 'One page with up to 4 sections, mobile and desktop layout, contact details, enquiry form and WhatsApp link, basic on-page SEO.',
      timeline: 'Usually 4–7 days after content and scope are confirmed.',
      scope: 'One page and one round of agreed changes. The client supplies text and images; extra pages or features are quoted separately.',
    },
    {
      name: 'Business Website',
      price: '₹7,999+',
      suitable: 'An established local business that needs several pages and room to explain its services.',
      deliverables: 'Up to 5 pages, reusable sections, clear enquiry path, form, WhatsApp button and map details, basic SEO and analytics-ready setup.',
      timeline: 'Usually 7–14 days after content and scope are confirmed.',
      scope: 'Up to five pages and two rounds of agreed changes. Copywriting, photography and paid integrations are quoted separately.',
    },
    {
      name: 'Business Plus',
      price: '₹14,999+',
      suitable: 'A growing business that needs more pages, a stronger content structure or a more tailored design.',
      deliverables: 'Up to 10 pages with a tailored layout, service/location/team sections as needed, advanced forms and basic analytics, content structure support.',
      timeline: 'Usually 2–3 weeks after content and scope are confirmed.',
      scope: 'Up to ten pages and three rounds of agreed changes. Larger content writing, custom illustration and paid integrations are quoted separately.',
    },
    {
      name: 'E-commerce Store',
      price: '₹19,999+',
      suitable: 'A retailer or D2C brand ready to sell a managed product catalogue online.',
      deliverables: 'Storefront, product listing and detail pages, cart and checkout, product/order management, payment gateway and shipping setup where supported.',
      timeline: 'Usually 3–5 weeks after catalogue, scope and payment setup are confirmed.',
      scope: 'Assumes a catalogue the client can supply. Product entry, photography, gateway fees, subscriptions and marketplace listings are separate.',
    },
    {
      name: 'Custom Web Application',
      price: 'Custom quote',
      suitable: 'A business with a specific workflow that off-the-shelf tools do not fit.',
      deliverables: 'Discovery and written requirements, milestone plan and pricing per phase, user roles/database/workflow design, testing, deployment and handover notes.',
      timeline: 'Estimated after discovery, then quoted by milestone.',
      scope: 'No fixed price until workflow, roles and features are understood. Third-party APIs, hosting and subscriptions are separate.',
    },
    {
      name: 'AI Automation',
      price: 'Custom quote',
      suitable: 'A team spending hours each week on repetitive enquiries, follow-ups or data entry.',
      deliverables: 'Review of the task, a written automation plan using current tools where possible, implementation, testing with real examples, handover notes and basic training.',
      timeline: 'Estimated after the workflow review.',
      scope: 'Quoted after the task and tools are reviewed. AI provider usage, subscriptions, message volumes and API fees are billed separately.',
    },
  ],
  process: [
    'Discovery: understand the business, customers and what the work must achieve.',
    'Planning: a written scope covering pages, features, price and timeline.',
    'Design and development: build the agreed solution with shared progress.',
    'Review: the client tests on their own phone and desktop; in-scope changes are made.',
    'Launch and handover: deploy and hand over the access and documentation in scope.',
  ],
  principles: [
    'Scope before price: every quote follows a written scope.',
    'Honest labelling: demo builds are labelled as demos, never presented as paid client work.',
    'No surprise invoices: domains, hosting, plugins/apps and payment fees are disclosed up front.',
    'The client owns their site: on final payment they receive the access included in scope.',
  ],
  limits: [
    'Domain registration, paid hosting, third-party subscriptions, API usage, payment gateway fees and other external costs are separate unless a written quote says otherwise.',
    'Taxes are shown separately on the invoice.',
    'No unlimited pages or revisions, and no guaranteed leads, sales, rankings or ROI.',
    'Photography, copywriting and paid integrations are separate unless explicitly included.',
  ],
}

export function agencyBrief() {
  const packages = AGENCY.packages
    .map(
      (item) =>
        `- ${item.name} — ${item.price}. Fit: ${item.suitable} Includes: ${item.deliverables} Timeline: ${item.timeline} Scope: ${item.scope}`,
    )
    .join('\n')

  return `AGENCY
${AGENCY.name} is an independent web development and AI automation studio in India. ${AGENCY.positioning}
Services:
${AGENCY.services.map((service) => `- ${service.name}: ${service.includes} Suitable for: ${service.suitable}`).join('\n')}

Published starting prices (floors, not fixed quotes):
${packages}

Delivery process:
${AGENCY.process.map((step) => `- ${step}`).join('\n')}

Working principles:
${AGENCY.principles.map((item) => `- ${item}`).join('\n')}

Limits and exclusions:
${AGENCY.limits.map((item) => `- ${item}`).join('\n')}`
}
