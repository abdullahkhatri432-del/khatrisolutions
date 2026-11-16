/**
 * Long-form content for the /services/:slug detail pages.
 *
 * Keep every claim here consistent with site.js (packages, faqs, process).
 * Demo references point at demoSites slugs.
 */
export const serviceDetails = {
  'website-development': {
    slug: 'website-development',
    h1: 'Website development for Indian small businesses',
    intro:
      'Clinics, restaurants, cafés, consultants and freelancers in India need a website that explains what they do, answers the questions customers always ask, and makes contact obvious. That is the standard build we start with — one site, a few strong pages, mobile first, fast on a mid-range phone.',
    problem:
      'Most local businesses in India are reachable on Instagram or Google Maps, but both of those are rented surfaces. When the page is busy, customers cannot find the menu, the timings, the prices or the phone number. A website puts the information in the order the business decides, and it belongs to the business, not the platform.',
    solution:
      'Every build starts from one question: what should a visitor be able to decide after this page? From that we choose the pages, the sections and the enquiry path. The result is a mobile-first site built with modern tools — fast loading, clean structure, and an enquiry form or WhatsApp button wired into every important section.',
    includesHeading: 'What is in a typical website build',
    includes: [
      'Home, About, Services and Contact pages sized to the business (not padded out)',
      'Enquiry form with validation, plus WhatsApp as the fallback channel',
      'Map, timings, phone and email visible on mobile without scrolling through menus',
      'On-page SEO: unique titles, meta descriptions, sitemap and structured data',
      'Basic performance: preloaded fonts, cached assets, image-light layouts',
      'Redesign and maintenance for existing websites instead of a rebuild when that fits',
    ],
    whoItSuits:
      'Local businesses, clinics, restaurants and cafés, consultants, freelancers and small teams in India and elsewhere that need a professional online presence they control.',
    pricingIntro:
      'Website work starts at ₹3,999 for a one-page Starter Website and ₹7,999 for a multi-page Business Website. These are starting prices — the final quote depends on pages, features and content readiness, and is confirmed in writing before work begins.',
    pricingPackages: ['Starter Website', 'Business Website', 'Business Plus Website'],
    pricingCta: 'See all starting prices',
    demoIntro: 'Working examples of the kind of site we build:',
    demoLinks: [
      { label: 'Wellness Physiotherapy — clinic site with appointment requests', to: '/demos/wellness-physiotherapy' },
      { label: 'Saffron Table — restaurant site with a scannable digital menu', to: '/demos/saffron-table' },
      { label: 'Atelier Nine — studio portfolio with project galleries', to: '/demos/atelier-nine' },
      { label: 'Azure Guesthouse — boutique hotel with room cards and booking enquiry', to: '/demos/azure-guesthouse' },
    ],
    faqs: [
      {
        q: 'How long does a business website take?',
        a: 'A Starter Website usually takes 4–7 days after content and scope are confirmed, a Business Website 7–14 days, and Business Plus 2–3 weeks. The clock starts once the agreed content and any advance payment are received.',
      },
      {
        q: 'Who registers the domain and hosting?',
        a: 'Your domain and hosting are registered in your name and paid to the provider, so you keep control of both. We recommend options and help with the setup; those costs are separate from the build.',
      },
      {
        q: 'Will the website work on a phone?',
        a: 'Yes. Every build is designed mobile-first and tested on common phone sizes, because most local customers arrive from a phone — usually on mobile data.',
      },
      {
        q: 'Can you redesign an existing website?',
        a: 'Yes. When the content is sound and the structure works, a redesign or maintenance pass is cheaper and faster than rebuilding from scratch. We say so in the quote when that is the better option.',
      },
      {
        q: 'What do I need to provide?',
        a: 'Your text and images: business details, what you offer, prices or ranges, timings, and photos. Where the existing copy is weak, we can suggest a clearer structure — full copywriting is quoted separately.',
      },
      {
        q: 'Do you handle local SEO for my business?',
        a: 'Every build includes the technical base: unique titles, meta descriptions, sitemap, structured data and fast loading. Google Business Profile setup and local citations are handled as a separate, clearly priced step if you want them.',
      },
    ],
  },

  ecommerce: {
    slug: 'ecommerce',
    h1: 'E-commerce store development in India',
    intro:
      'If you sell through a group chat or take orders by DM, a store lets customers browse, choose and pay without the back-and-forth. We build online stores where the product page, the cart and the checkout are all easy to follow — starting from ₹19,999 for a catalogue you can supply.',
    problem:
      'Small online sellers in India frequently run their catalogue through spreadsheets and direct messages. Stock, sizing, delivery and payment status get hard to track, and a customer who cannot see the total before ordering does not complete the order.',
    solution:
      'A store built around the parts of e-commerce that actually lose orders: a clear product catalogue, a cart that survives a refresh, and a checkout that shows every step and its cost. Payment gateway and shipping setup are third-party services with their own approval and fee terms, and we are honest about what is and is not included.',
    includesHeading: 'What is in a typical store build',
    includes: [
      'Storefront, product listing and product detail pages',
      'Cart with quantity controls, persisted so a refresh does not lose the order',
      'Checkout flow that shows totals before payment',
      'Payment gateway integration where the provider supports it (fees separate)',
      'Order workflow setup and basic order management',
      'Empty, loading and out-of-stock states handled, not afterthoughts',
    ],
    whoItSuits:
      'Small retailers, D2C brands, boutiques and catalogue businesses in India that are ready to sell online with a product list they can actually supply.',
    pricingIntro:
      'E-commerce store work starts at ₹19,999, assuming a product catalogue you can supply. Product entry, photography, payment gateway fees, shipping subscriptions and marketplace listings are separate and always disclosed before you commit.',
    pricingPackages: ['E-commerce Store'],
    pricingCta: 'See the e-commerce package',
    demoIntro: 'A working storefront you can click through:',
    demoLinks: [
      { label: 'Northline — filter products, add to cart, watch the total update', to: '/demos/northline-store' },
    ],
    faqs: [
      {
        q: 'Which payment gateways can I use?',
        a: 'The common Indian gateways — Razorpay, Stripe, Paytm and others — can be integrated where they support your business structure. Gateway approval, KYC and fees are handled with the provider; availability depends on your setup, and we confirm it before quoting.',
      },
      {
        q: 'Who enters my products?',
        a: 'The starting price assumes a catalogue you can supply. If you need us to write product descriptions or enter a large catalogue, that is quoted separately up front.',
      },
      {
        q: 'Can you handle shipping?',
        a: 'Shipping providers are third-party services. We can set up rates, labels and workflows in the store, but the provider account, its fees and its approval are on your side, with support from us.',
      },
      {
        q: 'How long does a store take?',
        a: 'Usually 3–5 weeks after the catalogue, scope and payment setup are confirmed. Catalogue size is the biggest variable — a tight, well-described range is faster than a sprawling one.',
      },
      {
        q: 'What happens if a customer orders?',
        a: 'Orders land in a simple order view with status, and the store can be wired to email you or your team. Complex fulfilment, returns workflows and marketplace sync are separate scope, quoted when needed.',
      },
      {
        q: 'Is the store mobile friendly?',
        a: 'Yes. Most store traffic in India is on phones, so the mobile layout is the primary design: product pages, cart and checkout are all built for a phone screen first.',
      },
    ],
  },

  'custom-web-applications': {
    slug: 'custom-web-applications',
    h1: 'Custom web applications for small business workflows',
    intro:
      'When a spreadsheet, a notebook and a group chat stop holding a business together, the fix is usually one focused tool — not a platform. We build web applications around one specific workflow: bookings, dashboards, customer portals or internal operations.',
    problem:
      'Small teams in India that have outgrown spreadsheets usually face the same pattern: the same information re-entered in three places, follow-ups lost when things get busy, and no single screen that shows the day.',
    solution:
      'Instead of a generic template, we map the workflow first — who does what, where the handoffs break, what a good day looks like — and build the smallest application that fixes it. Scope, user roles, data and hosting are agreed in writing before any work starts.',
    includesHeading: 'What we typically build',
    includes: [
      'Booking and appointment systems for clinics, studios and service businesses',
      'Admin dashboards that replace a wall of spreadsheets with one screen',
      'Customer portals for accounts, orders or records',
      'Inventory and business management tools around a real process',
      'Custom workflow applications for operations that are too specific for off-the-shelf tools',
    ],
    whoItSuits:
      'Businesses that have outgrown spreadsheets, notebooks or a group chat and need one place for their day-to-day work.',
    pricingIntro:
      'Custom applications are quoted after a discovery conversation, because the scope varies a lot from one workflow to another. You receive a milestone plan with pricing per phase before committing.',
    pricingPackages: ['Custom Web Application'],
    pricingCta: 'Request a quote',
    demoIntro: 'A working prototype of the pattern:',
    demoLinks: [
      { label: 'Clinic Ops — a front-desk schedule and follow-up queue in one screen', to: '/demos/clinic-ops' },
    ],
    faqs: [
      {
        q: 'How is the price decided?',
        a: 'After a discovery call, you get a milestone plan: the features per phase, the price per phase and the timeline. Nothing starts until that plan is agreed in writing.',
      },
      {
        q: 'Who hosts the application?',
        a: 'Hosting is arranged with the provider you choose, in your name, so you keep control. The plan spells out what is included in the build and what runs on the provider side.',
      },
      {
        q: 'Do I own the code?',
        a: 'On final payment you receive the access included in your scope — code and hosting access where applicable. That is written into the scope before work begins.',
      },
      {
        q: 'Can it connect to the tools I already use?',
        a: 'Often, yes — WhatsApp, Google Sheets, payment providers and other tools have integrations or APIs. We confirm the specific integrations in discovery, because they change the scope.',
      },
      {
        q: 'What happens when a requirement changes later?',
        a: 'Changes outside the agreed scope are quoted separately before work, the same rule as every other engagement. The milestone structure makes that easy to price.',
      },
    ],
  },

  'ai-business-automation': {
    slug: 'ai-business-automation',
    h1: 'AI and business automation for small teams',
    intro:
      'The automation work that pays off for a small team is unglamorous: sorting incoming enquiries, drafting first replies, moving data between tools, keeping the team informed. That is where we start — practical workflow automation built on the tools you already use.',
    problem:
      'Enquiries arrive across email, WhatsApp and website forms. The urgent ones — a complaint, a broken form, a ready-to-buy customer — sit in the same list as everyone else, so replies go out late or never. Every hour spent on that is an hour not spent on the business.',
    solution:
      'We review one specific repetitive task, write down the workflow it should follow, and build the automation around it with the tools you already use where possible. AI usage, subscriptions and message volumes are billed by the providers, and we say so before you commit.',
    includesHeading: 'What automation work covers',
    includes: [
      'Enquiry management: sort incoming messages by intent and priority, draft first replies',
      'Repetitive task automation across the tools a team already uses',
      'Supported WhatsApp integrations for follow-ups and notifications',
      'Third-party application integrations where the provider allows them',
      'Handover notes and basic training so the workflow survives without us',
    ],
    whoItSuits:
      'Small teams in India losing hours each week to repetitive enquiries, follow-ups, data entry and manual handoffs.',
    pricingIntro:
      'AI automation is quoted after the task and the tools are reviewed. AI provider usage, subscriptions, message volumes and API fees are billed by those providers, never hidden in our quote.',
    pricingPackages: ['AI Automation'],
    pricingCta: 'Discuss automation',
    demoIntro: 'Working examples of the pattern:',
    demoLinks: [
      { label: 'Enquiry Triage — a browser demo that sorts an enquiry and drafts a first reply', to: '/demos/enquiry-triage' },
      { label: 'Automation Flow — a simulated automation dashboard: triggers, review, confirm', to: '/demos/ai-automation-flow' },
    ],
    faqs: [
      {
        q: 'Does the automation need an AI subscription?',
        a: 'Sometimes. Simple rules — sorting, routing, reminders — often do not. Where a model is genuinely the right tool, the provider, the usage costs and the message volumes are shown before you commit.',
      },
      {
        q: 'Which tools can it connect to?',
        a: 'Whatever you already use, within what its API allows: email, WhatsApp (where supported), sheets and documents, forms, CRMs. The discovery review lists each integration and its limits.',
      },
      {
        q: 'Will it send anything on its own?',
        a: 'Only what the written plan says it will. Draft replies are reviewed by a person before sending unless you explicitly agree to fully automated sending for a specific step.',
      },
      {
        q: 'How do we know it works before paying for the full build?',
        a: 'The plan starts with one real workflow, tested with your real examples. If the demo does not beat the current process, that is a useful and honest outcome.',
      },
      {
        q: 'What if the provider prices change?',
        a: 'Usage is billed by the provider under its own terms. The plan names each provider up front so there is no ambiguity about what your monthly cost tracks to.',
      },
    ],
  },
}

export const getServiceDetail = (slug) => serviceDetails[slug] || null
