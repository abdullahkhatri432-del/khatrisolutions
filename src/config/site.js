/**
 * Khatri Solutions — central content configuration.
 *
 * Everything a business owner is likely to change lives in this file:
 * contact details, services, prices, portfolio entries, approved reviews.
 *
 * IMPORTANT
 * - Only add reviews that a real client genuinely gave you, and only after
 *   you have confirmed the project with them.
 * - Only set a project's `type` to "Client project" when a client actually
 *   paid for it. Use "Demo project" or "Concept project" otherwise.
 * - `demoUrl` stays null until a live demo is actually deployed. The UI
 *   hides the live-demo button automatically while it is empty.
 */

const FORM_ENDPOINT_DEFAULT =
  'https://script.google.com/macros/s/AKfycbxo1MH6bdnGLihIQD6sg88xLLqQlMrd-aOajoGXMZAR87V5Sz1JDyppR0rJoMjHfdg/exec'

const formEndpoint = import.meta.env?.VITE_FORM_ENDPOINT || FORM_ENDPOINT_DEFAULT

export const site = {
  name: 'Khatri Solutions',
  tagline: 'Digital Experiences. Smarter Business.',
  positioning: 'Websites and AI-powered solutions for growing businesses.',
  /**
   * Canonical origin used for the static SEO tags that the build writes into
   * each route shell (canonical link, og:url, og:image, sitemap.xml, robots.txt).
   * Change this if a custom domain replaces the Vercel URL.
   */
  url: 'https://khatrisolutions.vercel.app',
  /** Search Console HTML-tag verification token (also present in index.html). */
  googleSiteVerification: 'PF_duwiGanJudCHxoHjsg3Iazt1b_h4KsvMwKTD6agw',
  description:
    'Khatri Solutions builds professional websites, online stores, web applications and practical AI automation for small businesses and startups.',

  /**
   * Contact details.
   * - whatsappNumber: international format, digits only, no "+" (e.g. 919876543210).
   *   While empty, WhatsApp buttons fall back to email so nothing is dead.
   * - Leave social URLs empty to hide those links.
   */
  contact: {
    email: 'khatrisolutions01@gmail.com',
    whatsappNumber: '919875009874',
    phoneDisplay: '+91 98750 09874',
    instagram: '',
    linkedin: '',
    github: 'https://github.com/abdullahkhatri432-del',
  },

  currency: '₹',
  established: 2026,

  /**
   * Live form endpoint. This is a Google Apps Script Web App that accepts a
   * form-encoded `payload` field and forwards the enquiry by email. It is the
   * only backend: the site is static hosting, so the page cannot store
   * submissions itself. Override with VITE_FORM_ENDPOINT only if you replace
   * the Apps Script.
   */
  formEndpoint,

  formProvider: formEndpoint === FORM_ENDPOINT_DEFAULT ? 'Google Apps Script' : '',

  /** Correct. We are a new, independent studio. Don't change this to a fake claim. */
  disclosure:
    'Khatri Solutions is a new, independent studio. Projects shown as demos or concepts were built to demonstrate our work, not for paying clients.',

  founder: {
    name: 'Abdullah Khatri',
    initials: 'AK',
  },

  responseTime: 'Usually within one business day',
}

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Services', to: '/services' },
  { label: 'Blog', to: '/blog' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Contact', to: '/contact' },
]

export const hero = {
  eyebrow: 'Independent web studio · India · Working worldwide',
  headline: 'Websites that help',
  headlineAccent: 'your business grow.',
  supporting:
    'We build professional websites, online stores, custom web applications, and practical AI automation solutions tailored to your business.',
  primaryCta: { label: 'Discuss your project', to: '/contact' },
  secondaryCta: { label: 'Explore our portfolio', to: '/portfolio' },
  honestPoints: [
    'Fixed-scope quotes before work begins',
    'Mobile-first, fast-loading builds',
    'Direct WhatsApp and email communication',
  ],
}

export const stats = [
  { value: '6', label: 'Demo and concept builds in the portfolio' },
  { value: '5–14 days', label: 'Typical delivery for a starter or business website' },
  { value: '₹3,999+', label: 'Starting price for a compact website' },
]

/**
 * Four service categories.
 * `includes` lists the specific work inside each category, in plain language.
 * `inquiryService` must match one of `inquiryServiceOptions` below so the
 * contact form can preselect the right option from a category CTA.
 */
export const services = [
  {
    slug: 'website-development',
    icon: 'Globe',
    title: 'Website Development',
    summary:
      'A clear, credible website that explains what you do, answers common questions and makes it easy for customers to get in touch.',
    includes: [
      'Business websites',
      'Restaurant and café websites',
      'Clinic and healthcare websites',
      'Portfolio websites',
      'Landing pages',
      'Website redesign and maintenance',
    ],
    suitableFor:
      'Local businesses, clinics, restaurants and cafés, consultants, freelancers and small teams that need a professional online presence.',
    notes:
      'Domain registration and hosting are arranged in your name and paid to the provider. Existing websites can be redesigned or maintained instead of rebuilt.',
    cta: 'Start a website project',
    inquiryService: 'Business Website',
  },
  {
    slug: 'ecommerce',
    icon: 'ShoppingBag',
    title: 'E-commerce',
    summary:
      'An online store where customers can browse products, add items to a cart and complete an order without confusion.',
    includes: [
      'Online stores',
      'Product catalogue and product pages',
      'Cart and checkout implementation',
      'Payment gateway integration where supported',
      'Order workflow setup',
    ],
    suitableFor:
      'Small retailers, D2C brands, boutiques and catalogue businesses that are ready to sell online.',
    notes:
      'Payment gateways, shipping providers and subscriptions are third-party services with their own fees and approval requirements. Availability depends on the provider.',
    cta: 'Plan an online store',
    inquiryService: 'E-commerce / Online Store',
  },
  {
    slug: 'custom-web-applications',
    icon: 'LayoutDashboard',
    title: 'Custom Web Applications',
    summary:
      'A web tool built around one specific workflow — bookings, dashboards, customer accounts or internal operations — instead of a generic template.',
    includes: [
      'Booking and appointment systems',
      'Admin dashboards',
      'Customer portals',
      'Inventory and business management tools',
      'Custom workflow applications',
    ],
    suitableFor:
      'Businesses that have outgrown spreadsheets, notebooks or a group chat and need one place for their day-to-day work.',
    notes:
      'Custom applications are quoted after a discovery conversation. Scope, user roles, data and hosting requirements are agreed in writing first.',
    cta: 'Discuss a custom application',
    inquiryService: 'Custom Web Application',
  },
  {
    slug: 'ai-business-automation',
    icon: 'Sparkles',
    title: 'AI & Business Automation',
    summary:
      'Practical automation for repetitive work: sorting enquiries, drafting replies, moving data between tools and keeping the team informed.',
    includes: [
      'AI-assisted business workflows',
      'Repetitive task automation',
      'Enquiry management workflows',
      'Supported WhatsApp integrations',
      'Third-party application integrations',
    ],
    suitableFor:
      'Small teams losing time to repetitive enquiries, follow-ups, data entry and manual handoffs.',
    notes:
      'Automation depends on the tools you already use and on third-party API access. AI usage, subscriptions and message volumes are billed by those providers.',
    cta: 'Explore automation',
    inquiryService: 'AI & Business Automation',
  },
]

export const process = [
  {
    step: '01',
    title: 'Discovery',
    body: 'We talk about your business, your customers and what the website needs to achieve. No jargon, no obligation.',
  },
  {
    step: '02',
    title: 'Planning',
    body: 'You receive a written scope: pages, features, price and timeline. Work starts only after we both agree on it.',
  },
  {
    step: '03',
    title: 'Design & development',
    body: 'We design and build the agreed solution, sharing progress so there are no surprises at handover.',
  },
  {
    step: '04',
    title: 'Review',
    body: 'You test the site on your own phone and desktop. Changes inside the agreed scope are made before launch.',
  },
  {
    step: '05',
    title: 'Launch & handover',
    body: 'We deploy the project and hand over the access and documentation included in your scope.',
  },
]

export const principles = [
  {
    title: 'Scope before price',
    body: 'Every quote is based on a written scope, so you know what is included before you pay anything.',
  },
  {
    title: 'Honest labelling',
    body: 'Demo builds are labelled as demos. We never present concept work as a paid client project.',
  },
  {
    title: 'No surprise invoices',
    body: 'Third-party costs such as domains, hosting, plugins and payment fees are disclosed up front.',
  },
  {
    title: 'You own your site',
    body: 'On final payment you receive the access included in your scope — domain, hosting and code where applicable.',
  },
]

/** Published starting prices. Always edited here, never in page components. */
export const packages = [
  {
    name: 'Starter Website',
    price: '₹3,999+',
    from: 3999,
    quoteOnly: false,
    suitable: 'A sole trader or very small business that needs a simple, credible one-page presence.',
    deliverables: [
      'One-page website with up to 4 sections',
      'Mobile and desktop layout',
      'Contact details, enquiry form and WhatsApp link',
      'Basic on-page SEO and fast-loading pages',
    ],
    timeline: 'Usually 4–7 days after content and scope are confirmed',
    scope:
      'One page and one round of agreed changes. You supply the text and images; extra pages or features are quoted separately.',
    cta: 'Start with Starter',
    inquiryService: 'Starter Website',
    featured: false,
  },
  {
    name: 'Business Website',
    price: '₹7,999+',
    from: 7999,
    quoteOnly: false,
    suitable: 'An established local business that needs several pages and room to explain its services.',
    deliverables: [
      'Up to 5 pages, including Home, About, Services and Contact',
      'Reusable page sections and a clear enquiry path',
      'Enquiry form, WhatsApp button and map details',
      'Basic on-page SEO, sitemap and analytics-ready setup',
    ],
    timeline: 'Usually 7–14 days after content and scope are confirmed',
    scope:
      'Up to five pages and two rounds of agreed changes. Copywriting, photography and paid integrations are quoted separately.',
    cta: 'Request a quote',
    inquiryService: 'Business Website',
    featured: true,
    badge: 'Suggested starting point',
  },
  {
    name: 'Business Plus',
    price: '₹14,999+',
    from: 14999,
    quoteOnly: false,
    suitable: 'A growing business that needs more pages, stronger content structure or a more tailored design.',
    deliverables: [
      'Up to 10 pages with a tailored layout',
      'Service, location or team sections as needed',
      'Advanced enquiry forms and basic analytics',
      'Content structure support and three rounds of agreed changes',
    ],
    timeline: 'Usually 2–3 weeks after content and scope are confirmed',
    scope:
      'Up to ten pages and three rounds of agreed changes. Larger content writing, custom illustration and paid integrations are quoted separately.',
    cta: 'Discuss Business Plus',
    inquiryService: 'Business Plus Website',
    featured: false,
  },
  {
    name: 'E-commerce Store',
    price: '₹19,999+',
    from: 19999,
    quoteOnly: false,
    suitable: 'A retailer or D2C brand ready to sell a managed product catalogue online.',
    deliverables: [
      'Storefront, product listing and product detail pages',
      'Cart and checkout flow',
      'Product and order management setup',
      'Payment gateway and shipping setup where supported',
    ],
    timeline: 'Usually 3–5 weeks after catalogue, scope and payment setup are confirmed',
    scope:
      'Pricing assumes a catalogue you can supply. Product entry, photography, gateway fees, subscriptions and marketplace listings are separate.',
    cta: 'Plan my store',
    inquiryService: 'E-commerce / Online Store',
    featured: false,
  },
  {
    name: 'Custom Web Application',
    price: 'Custom Quote',
    from: null,
    quoteOnly: true,
    suitable: 'A business with a specific workflow that off-the-shelf tools do not fit.',
    deliverables: [
      'Discovery call and written requirements',
      'Milestone plan with pricing per phase',
      'User roles, database and workflow design where required',
      'Testing, deployment and handover notes',
    ],
    timeline: 'Estimated after discovery, then quoted by milestone',
    scope:
      'No fixed price until the workflow, user roles and features are understood. Third-party APIs, hosting and subscriptions are separate.',
    cta: 'Request a quote',
    inquiryService: 'Custom Web Application',
    featured: false,
  },
  {
    name: 'AI Automation',
    price: 'Custom Quote',
    from: null,
    quoteOnly: true,
    suitable: 'A team spending hours each week on repetitive enquiries, follow-ups or data entry.',
    deliverables: [
      'Review of the task you want to automate',
      'A written automation plan using your current tools where possible',
      'Implementation and testing with real examples',
      'Handover notes and basic training',
    ],
    timeline: 'Estimated after the workflow review',
    scope:
      'Quoted after the task and tools are reviewed. AI provider usage, subscriptions, message volumes and API fees are billed separately.',
    cta: 'Discuss automation',
    inquiryService: 'AI & Business Automation',
    featured: false,
  },
]

/** Shown with every package card and repeated on the contact page. */
export const pricingNote =
  'Final pricing depends on your requirements. Domain registration, paid hosting, third-party subscriptions, API usage, payment gateway fees and other external costs are separate unless they are explicitly included in a written quote.'

export const pricingNotes = [
  'Prices are starting points. The final quote depends on pages, features, content readiness and integrations.',
  pricingNote,
  'Scope and revision rounds are agreed in writing. There are no unlimited revisions, unlimited pages or guaranteed leads or sales.',
  'Any applicable taxes will be shown separately on the invoice.',
]

export const faqs = [
  {
    q: 'How much does a website cost?',
    a: 'Published starting prices are ₹3,999 for a Starter Website, ₹7,999 for a Business Website, ₹14,999 for Business Plus and ₹19,999 for an E-commerce Store. Custom applications and AI automation are quoted after discovery. The final price depends on the pages, features and integrations you need, and you receive it in writing before work begins.',
  },
  {
    q: 'How long does a project take?',
    a: 'A Starter Website usually takes 4–7 days after content and scope are confirmed, a Business Website 7–14 days, Business Plus 2–3 weeks, and an e-commerce store 3–5 weeks depending on catalogue size. Custom applications and automation are estimated after discovery. Timelines start after the agreed content and any advance payment are received.',
  },
  {
    q: 'Can you build a website within my budget?',
    a: 'Tell us your budget honestly and we will tell you what is realistic at that number. If your wish list does not fit, we will suggest a smaller first version that can grow later.',
  },
  {
    q: 'Do I need to purchase a domain?',
    a: 'Yes — domains and hosting are registered in your name, so you keep control of them. We can recommend options and help with the setup. Those costs are paid directly to the provider.',
  },
  {
    q: 'Will my website work on mobile?',
    a: 'Yes. Every build is designed mobile-first and tested on common phone sizes as well as desktop, because most local customers will visit from a phone.',
  },
  {
    q: 'Can I request changes?',
    a: 'Yes. Each package includes a set number of revision rounds within the agreed scope. Larger changes, new pages or new features are quoted separately before any work is done.',
  },
  {
    q: 'Do you provide maintenance?',
    a: 'Basic guidance is included at handover. Ongoing maintenance, content updates and backups are available as a separate arrangement, agreed in writing.',
  },
  {
    q: 'Can you add online booking or payments?',
    a: 'Yes, when it is part of the agreed scope. Payments and some booking features rely on third-party services that charge their own fees, and those are disclosed before you commit.',
  },
  {
    q: 'Do you build custom applications?',
    a: 'Yes. Dashboards, booking systems and internal workflow tools are quoted individually after a discovery call, because the scope varies a lot from one business to another.',
  },
  {
    q: 'How do I get started?',
    a: 'Send the project form with your requirements, or message on WhatsApp. You will get a reply, a few questions, and then a written scope and quote to approve.',
  },
]

/**
 * Portfolio.
 * `type` must be one of: "Client project", "Demo project", "Concept project".
 * Set `demoUrl` only when a live deployment is actually reachable.
 */
export const projects = [
  {
    slug: 'speedersmania',
    title: 'Speeders Mania',
    category: 'E-commerce',
    type: 'E-commerce project',
    year: 2024,
    accent: '#7c3aed',
    thumbIcon: 'ShoppingBag',
    summary:
      'A multi-vendor e-commerce platform with dedicated dashboards for admin, vendors, and customers. Handles vendor onboarding, product approval, split orders, commission management, and customer-facing marketplace.',
    features: [
      'Admin dashboard: vendors, products, orders, commissions, reports',
      'Vendor dashboard: product management, earnings, payouts, analytics',
      'Customer marketplace: search, filters, cart, checkout, order tracking',
      'Commission system: percentage, fixed, tiered rules per vendor',
      'Split fulfillment: each vendor ships their own items',
    ],
    stack: ['Vite', 'React', 'TypeScript', 'Firebase', 'Firestore', 'Tailwind CSS'],
    demoUrl: 'https://speedersmania.vercel.app',
    videoUrl: '/videos/speedersmania.mp4',
    posterUrl: '/videos/speedersmania-poster.jpg',
    repoUrl: null,
    caseStudy: {
      overview:
        'A multi-vendor marketplace platform enabling multiple vendors to sell through a single storefront. Built with dedicated dashboards for each role — admin manages the platform, vendors manage their business, customers shop seamlessly.',
      problem:
        'Building a marketplace requires solving vendor operations, not just customer shopping. Most platforms ignore the vendor side.',
      solution:
        'Vendor-first architecture: dedicated dashboard, real-time order notifications, transparent earnings, automated commission splits. Firebase provides real-time sync for orders and inventory across vendors.',
      highlights: [
        'Vendor onboarding with document upload and approval',
        'Automated commission calculation per order',
        'Split fulfillment: each vendor ships their items',
        'Real-time inventory sync across vendor dashboards',
      ],
      status: 'Production codebase. Firebase backend on Vercel.',
    },
    preview: { headline: 'Many vendors. One marketplace.', sub: 'Multi-vendor e-commerce · Vite · Firebase', cta: 'View live' },
  },
]

export const projectCategories = [
  'All work',
  'Business websites',
  'Healthcare',
  'Restaurants',
  'E-commerce',
  'Web applications',
  'AI automation',
]

/**
 * Approved client reviews only.
 * Empty is a valid, honest state — the UI says we are building the portfolio.
 * Add objects shaped like:
 * { id, name, business, projectType, rating, quote, date, verified: true }
 * Only set verified: true if you can genuinely confirm the client and project.
 */
export const reviews = []

export const businessTypes = [
  'Clinic or healthcare',
  'Restaurant or café',
  'Retail or e-commerce',
  'Professional services',
  'Startup or SaaS',
  'Education',
  'Freelancer or solo professional',
  'Other',
]

/** Exact values used by the project inquiry form. */
export const inquiryServiceOptions = [
  'Starter Website',
  'Business Website',
  'Business Plus Website',
  'E-commerce / Online Store',
  'Custom Web Application',
  'AI & Business Automation',
  'Website Redesign',
  'Not Sure — Help Me Choose',
]

/** Project types for the separate review form. */
export const reviewProjectTypes = [
  'Business website',
  'Restaurant or café website',
  'Clinic or healthcare website',
  'Portfolio website',
  'E-commerce store',
  'Custom web application',
  'AI or automation project',
  'Other',
]

/** Which conditional questions the inquiry form shows for each service. */
export const inquiryServiceKinds = {
  'Starter Website': 'website',
  'Business Website': 'website',
  'Business Plus Website': 'website',
  'E-commerce / Online Store': 'ecommerce',
  'Custom Web Application': 'application',
  'AI & Business Automation': 'automation',
  'Website Redesign': 'redesign',
  'Not Sure — Help Me Choose': 'unsure',
}

/**
 * Older links and bookmarks used different service names.
 * Contact.jsx resolves these to a current option instead of silently dropping
 * the visitor's selection.
 */
export const serviceAliases = {
  'Business website': 'Business Website',
  'Starter business website': 'Starter Website',
  'Professional business website': 'Business Website',
  'Restaurant website': 'Business Website',
  'Clinic website': 'Business Website',
  'Portfolio website': 'Business Website',
  'E-commerce website': 'E-commerce / Online Store',
  'E-commerce Store': 'E-commerce / Online Store',
  'Custom web application': 'Custom Web Application',
  'AI automation': 'AI & Business Automation',
  'Website redesign': 'Website Redesign',
  'Not sure yet': 'Not Sure — Help Me Choose',
}

export const budgetOptions = [
  'Under ₹4,000',
  '₹4,000 – ₹8,000',
  '₹8,000 – ₹15,000',
  '₹15,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  'Above ₹50,000',
  'Need guidance',
]

export const timelineOptions = [
  'As soon as possible',
  'Within 2 weeks',
  'Within a month',
  '1–3 months',
  'Just exploring',
]

export const contactMethods = ['WhatsApp', 'Phone call', 'Email']

export const pagesOptions = [
  '1 page',
  '2–3 pages',
  '4–6 pages',
  '7–10 pages',
  'More than 10 pages',
  'Not sure yet',
]

export const productCountOptions = [
  'Under 20 products',
  '20–100 products',
  '100–500 products',
  'More than 500 products',
  'Not sure yet',
]

/**
 * The person behind the studio.
 *
 * Described by what they actually do — not by invented job titles,
 * qualifications or years of experience.
 *
 * Fill in `name`, `initials`, `photo`, `intro` and `contact` only with real,
 * confirmed details. Anything left empty is rendered as a clearly labelled
 * placeholder, never as a real person.
 *
 * If you add a photo, place it in `src/assets/images/` and import it here,
 * or use a full URL. Leave `photo: null` to show a monogram instead.
 *
 * Do not add legal titles (CEO, Director, Pvt Ltd) or employment claims unless
 * they are genuinely true.
 */
export const team = {
  eyebrow: 'Who you work with',
  title: 'One developer, start to finish',
  intro:
    'Khatri Solutions is run by one person. The person who answers your first message is the same person who plans, builds and hands over the work, so nothing is lost between the enquiry and the build.',
  members: [
    {
      id: 'technical-lead',
      name: site.founder.name,
      initials: site.founder.initials,
      role: 'Web Development & Technical Lead',
      tagline: 'Plans, builds and ships the work.',
      intro:
        'Responsible for technical planning, website development, custom applications, testing, deployment and project delivery. Technical questions about how something is built, or why a decision was made, are answered by this person.',
      responsibilities: [
        'Technical planning and written scope',
        'Website and custom application development',
        'Testing, deployment and project delivery',
        'Handover and project documentation',
      ],
      photo: null,
      contact: { label: 'GitHub', href: site.contact.github },
      placeholder: false,
    },
  ],
}

/**
 * How a project runs from first contact to handover.
 * Keep this consistent with `team.members` and `process`.
 */
export const collaboration = {
  eyebrow: 'How a project runs',
  title: 'One conversation, start to finish',
  intro:
    'There is no handoff to a sales team or a junior developer. You speak with the person doing the work, and every stage runs against the same written scope.',
  lanes: [
    {
      role: 'What the studio handles',
      summary: 'Everything from the first reply to handover.',
      handles: [
        'First reply and initial consultation',
        'Turning requirements into a written scope',
        'Design, development and testing',
        'Deployment, handover and documentation',
      ],
    },
    {
      role: 'What you bring',
      summary: 'The decisions only you can make.',
      handles: [
        'Your business goals and priorities',
        'Content, images and brand assets',
        'Feedback at agreed review points',
        'Timely answers on scope decisions',
      ],
    },
  ],
  stages: [
    {
      step: '01',
      title: 'You make contact',
      body: 'Khatri Solutions replies, asks the practical questions and confirms what you actually need.',
    },
    {
      step: '02',
      title: 'Requirements become a scope',
      body: 'The requirement becomes a written scope: pages, features, price and timeline.',
    },
    {
      step: '03',
      title: 'Build and update',
      body: 'The work is built, and you are kept informed at agreed points with a link you can test.',
    },
    {
      step: '04',
      title: 'Review and handover',
      body: 'You test the work, changes inside the scope are made, and you receive access and documentation.',
    },
  ],
  note: 'Khatri Solutions is an independent studio, not a registered company or a large agency team.',
}
