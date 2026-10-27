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

const formEndpoint = import.meta.env.VITE_FORM_ENDPOINT || FORM_ENDPOINT_DEFAULT

export const site = {
  name: 'Khatri Solutions',
  tagline: 'Digital Experiences. Smarter Business.',
  positioning: 'Websites and AI-powered solutions for growing businesses.',
  description:
    'Khatri Solutions is an independent studio building professional websites, online stores, web applications and practical AI automation for small businesses and startups.',

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
   * only backend: Render serves static files and cannot store submissions.
   * Override with VITE_FORM_ENDPOINT only if you replace the Apps Script.
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
  { label: 'Services', to: '/services' },
  { label: 'Demos', to: '/demos' },
  { label: 'Work', to: '/work' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Reviews', to: '/reviews' },
]

export const hero = {
  eyebrow: 'Independent web studio · India · Working worldwide',
  headline: 'Websites that help',
  headlineAccent: 'your business grow.',
  supporting:
    'We build professional websites, online stores, custom web applications, and practical AI automation solutions tailored to your business.',
  primaryCta: { label: 'Discuss your project', to: '/contact' },
  secondaryCta: { label: 'Explore our work', to: '/work' },
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
    slug: 'atelier-nine',
    title: 'Atelier Nine',
    category: 'Business websites',
    type: 'Demo project',
    year: 2026,
    accent: '#b08b5c',
    thumbIcon: 'Globe',
    summary:
      'A portfolio-led website for an interior design studio, with project galleries, a services page and a single enquiry path.',
    features: [
      'Project gallery with room-by-room categories',
      'Studio story and service descriptions',
      'Enquiry form with project type and budget',
      'Image-light, type-led layout for fast loading',
    ],
    stack: ['React', 'Vite', 'CSS'],
    demoUrl: '/demos/atelier-nine',
    repoUrl: null,
    caseStudy: {
      overview:
        'A demonstration website for a fictional interior design studio. It shows how a small creative business can present its work without a heavy CMS or a slow gallery.',
      problem:
        'Independent studios often show their work only on social media, where there is no room for context, services or a serious enquiry form.',
      solution:
        'A visual portfolio with short project notes, a services page written for prospective clients, and one enquiry path that asks for the details needed to quote properly.',
      highlights: [
        'Gallery cards that stay readable without large image files',
        'Service descriptions written in client language, not design jargon',
        'Enquiry form with budget and timeline fields',
        'Consistent typography across long and short project titles',
      ],
      status: 'Demo build — not a paying client project. Live deployment not yet published.',
    },
    preview: { headline: 'Rooms with a point of view.', sub: 'Interior design studio · Pune', cta: 'View projects' },
  },
  {
    slug: 'wellness-physiotherapy',
    title: 'Wellness Physiotherapy',
    category: 'Healthcare',
    type: 'Demo project',
    year: 2026,
    accent: '#3f8f7d',
    thumbIcon: 'Stethoscope',
    summary:
      'A calm, appointment-focused site for a physiotherapy clinic, built around services, practitioner trust and easy enquiries.',
    features: [
      'Service sections for manual therapy and rehabilitation',
      'Appointment request form with validation',
      'Floating WhatsApp enquiry button',
      'Patient-focused copy and responsive layout',
    ],
    stack: ['React', 'Vite', 'CSS'],
    demoUrl: '/demos/wellness-physiotherapy',
    repoUrl: null,
    caseStudy: {
      overview:
        'A demonstration website for a fictional physiotherapy clinic, designed to show how a healthcare practice can present its services and take appointment requests without a heavy booking system.',
      problem:
        'Small clinics often rely on a social media page where timings, services and contact details are hard to find, and patients are unsure how to book.',
      solution:
        'A single clear path: what the clinic treats, who the practitioner is, when it is open, and one obvious way to request an appointment — with WhatsApp as the fallback for people who prefer messaging.',
      highlights: [
        'Sticky navigation with a single primary call to action',
        'Appointment form that validates name, phone and preferred time',
        'Clear wording that a request is not a confirmed booking',
        'Reduced-motion support and keyboard-accessible sections',
      ],
      status: 'Demo build — not a paying client project. Live deployment not yet published.',
    },
    preview: { headline: 'Move better, live better.', sub: 'Physiotherapy in Ahmedabad', cta: 'Book appointment' },
  },
  {
    slug: 'saffron-table-restaurant',
    title: 'Saffron Table',
    category: 'Restaurants',
    type: 'Demo project',
    year: 2026,
    accent: '#c2703c',
    thumbIcon: 'UtensilsCrossed',
    summary:
      'A restaurant concept with a scannable digital menu, dish highlights and one-tap directions, calls and table requests.',
    features: [
      'Categorised digital menu with prices',
      'Chef highlights and gallery layout',
      'Table request form with date and party size',
      'Directions, call and WhatsApp shortcuts',
    ],
    stack: ['React', 'Vite', 'CSS'],
    demoUrl: '/demos/saffron-table',
    repoUrl: null,
    caseStudy: {
      overview:
        'A concept restaurant website that treats the menu as the main event: fast to scan on a phone, easy to update, and honest about what the kitchen serves.',
      problem:
        'Guests often arrive from Instagram or Google Maps with the same three questions: what is on the menu, how much is it, and how do I get there.',
      solution:
        'The menu sits above the fold on mobile, prices are visible, and every dish category has a short description. Directions and a table request form are one tap away.',
      highlights: [
        'Menu categories that work without JavaScript-heavy interactions',
        'Table request form clearly labelled as a request, not a booking',
        'Image-light layout for fast loading on mobile data',
        'Accessible colour contrast on accent-coloured elements',
      ],
      status: 'Concept build for demonstration purposes. No client engagement.',
    },
    preview: { headline: 'Slow food, warm rooms.', sub: 'Seasonal kitchen · Ahmedabad', cta: 'View the menu' },
  },
  {
    slug: 'northline-store',
    title: 'Northline Store',
    category: 'E-commerce',
    type: 'Concept project',
    year: 2026,
    accent: '#4b6fd6',
    thumbIcon: 'ShoppingBag',
    summary:
      'A small-catalogue storefront concept: clean product cards, a straightforward cart, and a checkout flow that explains every step.',
    features: [
      'Product catalogue with filters and sorting',
      'Product detail layout with size and stock states',
      'Cart drawer with quantity controls',
      'Checkout form with inline validation',
    ],
    stack: ['React', 'Vite', 'CSS', 'Context API'],
    demoUrl: '/demos/northline-store',
    repoUrl: null,
    caseStudy: {
      overview:
        'A storefront concept built to practise the parts of e-commerce that actually lose orders: unclear stock, surprise shipping costs and a checkout that feels unfinished.',
      problem:
        'Small online sellers frequently run a catalogue through spreadsheets and DMs, which makes stock, sizing and payment status hard to track.',
      solution:
        'A structured product model with stock states, a persistent cart and a checkout summary that shows totals before payment. Real payment gateways are intentionally not connected in this concept.',
      highlights: [
        'Empty, loading and out-of-stock states designed up front',
        'Cart persisted locally so a refresh does not lose the order',
        'Inline validation instead of one error at the top of the form',
        'No fake payment or shipping integrations',
      ],
      status: 'Concept build — payment and shipping integrations are not connected.',
    },
    preview: { headline: 'Everyday goods, made well.', sub: 'Small-batch essentials', cta: 'Shop the collection' },
  },
  {
    slug: 'clinic-ops-dashboard',
    title: 'Clinic Operations Dashboard',
    category: 'Web applications',
    type: 'Concept project',
    year: 2026,
    accent: '#7057ff',
    thumbIcon: 'LayoutDashboard',
    summary:
      'An internal tool concept that turns a clinic’s appointment book, patient follow-ups and daily workload into one screen.',
    features: [
      'Day and week appointment views',
      'Patient follow-up queue with statuses',
      'Simple role-based access model',
      'Printable daily schedule',
    ],
    stack: ['React', 'Vite', 'CSS', 'Local mock data'],
    demoUrl: '/demos/clinic-ops',
    repoUrl: null,
    caseStudy: {
      overview:
        'A dashboard concept for a small clinic that schedules appointments on paper and tracks follow-ups in a notebook. The demo runs on local mock data and is a design and workflow prototype, not a deployed product.',
      problem:
        'Front-desk staff re-enter the same information in three places, and follow-ups get missed when the book is busy.',
      solution:
        'One shared schedule, a follow-up queue with clear statuses, and a printable day sheet for the desk. Data is mocked in the concept; a real build would need a database and authentication.',
      highlights: [
        'Keyboard-friendly navigation between day and week views',
        'Status colours paired with text labels, not colour alone',
        'Explicit empty and no-results states',
        'Clear separation between the prototype and any real patient data',
      ],
      status: 'Workflow prototype with mock data only. No patient information is stored.',
    },
    preview: { headline: 'Today at a glance.', sub: 'Front desk · 18 appointments', cta: 'Open schedule' },
  },
  {
    slug: 'enquiry-triage',
    title: 'Enquiry Triage',
    category: 'AI automation',
    type: 'Demo project',
    year: 2026,
    accent: '#4b3f8f',
    thumbIcon: 'Sparkles',
    summary:
      'A working simulation that sorts an incoming enquiry, sets a priority and drafts a first reply for a human to review.',
    features: [
      'Intent and priority detection from the message text',
      'Draft reply a person can edit before sending',
      'Clear signals showing why a message was sorted that way',
      'Runs entirely in the browser — no message leaves the page',
    ],
    stack: ['React', 'Vite', 'CSS', 'Keyword rules'],
    demoUrl: '/demos/enquiry-triage',
    repoUrl: null,
    caseStudy: {
      overview:
        'A demonstration of assisted enquiry handling for a small studio. It shows the workflow a business would use to sort incoming messages and answer the urgent ones first, without pretending a chatbot is doing the thinking.',
      problem:
        'Enquiries arrive across email, WhatsApp and website forms. The important ones — a complaint, a broken form, a ready-to-buy client — sit in the same list as tyre-kickers, so replies go out late or never.',
      solution:
        'Each message is classified by intent, given a priority, and paired with a draft reply written in the studio’s tone. A person reviews and sends. The demo uses transparent keyword rules so nothing about the result is a black box.',
      highlights: [
        'Priority and intent are shown with the words that triggered them',
        'The draft is editable, not auto-sent',
        'Urgent and complaint messages surface first',
        'No AI API key, account or cost is required for the demo',
      ],
      status: 'Demo build — browser-based keyword rules, not a live AI service.',
    },
    preview: { headline: 'Every enquiry, sorted.', sub: 'Assisted triage · demo', cta: 'Sort an enquiry' },
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
 * The working team.
 *
 * Two collaborators, described by what they actually do — not by invented
 * job titles, qualifications or years of experience.
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
  eyebrow: 'Meet the team',
  title: 'Two collaborators, one project',
  intro:
    'Khatri Solutions is run by two people working together: one builds the work, the other manages the conversation around it. You get a single point of contact for communication, and you can see who is responsible for the technical work.',
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
    {
      id: 'business-development',
      name: 'Muskan Advani',
      initials: 'MA',
      role: 'Business Development & Client Relations',
      tagline: 'Handles the first conversation and keeps it moving.',
      intro:
        'Muskan is the first point of contact for new enquiries. She handles the initial conversation, gathers requirements, coordinates follow-ups, and keeps communication clear between clients and the technical lead.',
      responsibilities: [
        'Client outreach and first contact',
        'Initial consultations and requirement gathering',
        'Follow-ups and coordination',
        'Keeping communication clear between client and developer',
      ],
      photo: null,
      contact: { label: 'Contact Khatri Solutions', href: '/contact' },
      placeholder: false,
    },
  ],
}

/**
 * How the two roles divide the work.
 * Keep this consistent with `team.members` and `process`.
 */
export const collaboration = {
  eyebrow: 'How we work together',
  title: 'One conversation, two sets of hands',
  intro:
    'You should not have to manage two people, repeat your requirements, or guess who to ask. Business development owns the relationship; the technical lead owns the implementation. They hand work to each other at defined points, against the same written scope.',
  lanes: [
    {
      role: 'Business development',
      summary: 'Your main contact from the first message until handover.',
      handles: [
        'First reply and initial consultation',
        'Understanding the business and its requirements',
        'Follow-ups, timelines and coordination',
        'Keeping you updated between milestones',
      ],
    },
    {
      role: 'Technical lead',
      summary: 'Owns the build, the technical decisions and delivery.',
      handles: [
        'Turning requirements into a written technical scope',
        'Design, development and testing',
        'Deployment, handover and documentation',
        'Answering technical questions directly',
      ],
    },
  ],
  stages: [
    {
      step: '01',
      title: 'You make contact',
      body: 'Business development replies, asks the practical questions and confirms what you actually need.',
    },
    {
      step: '02',
      title: 'Requirements become a scope',
      body: 'Both sides review the requirement. The technical lead turns it into pages, features, price and timeline.',
    },
    {
      step: '03',
      title: 'Build and update',
      body: 'The technical lead builds the work while business development keeps you informed and collects your feedback.',
    },
    {
      step: '04',
      title: 'Review and handover',
      body: 'You test the work, changes inside the scope are made, and the technical lead hands over access and documentation.',
    },
  ],
}
