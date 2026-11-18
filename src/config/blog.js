/**
 * Blog posts.
 *
 * Each post is a full route at /blog/<slug>. Content here is the source of
 * truth — write real, useful answers. No invented statistics, client names
 * or results.
 *
 * `sections` are the body: { heading, body } rendered as H2 + paragraphs.
 * `faq` (optional) adds a small FAQ block at the end, matching faqItems.
 */
export const blogPosts = [
  {
    slug: 'how-much-does-a-website-cost-in-india',
    title: 'How much does a website cost in India (2026, honest prices)',
    excerpt:
      'Real starting prices for websites in India in 2026: one-page sites from ₹3,999, business sites from ₹7,999, stores from ₹19,999 — and what each price actually includes or excludes.',
    date: '2026-11-06',
    category: 'Pricing',
    tags: ['website cost', 'india', 'pricing'],
    serviceSlug: 'website-development',
    sections: [
      {
        heading: 'The short answer',
        body: 'A credible one-page website for a small business in India starts around ₹3,999. A multi-page business website (Home, About, Services, Contact) typically starts around ₹7,999 to ₹15,000. An online store starts around ₹19,999. Custom applications and automation work are quoted after requirements are understood, because the scope varies too much to quote blindly. Our [current price list](/pricing) shows what each tier includes and, just as importantly, what it leaves out.',
      },
      {
        heading: 'Why quotes swing so wildly',
        body: 'You will see "websites from ₹999" and "websites for ₹5 lakh" in the same week, and both can be describing real work. The difference is pages, content, features and who does what. A ₹999 site is usually a template with your logo swapped in. A ₹5 lakh project usually includes design systems, custom features and ongoing support. The honest middle is a fixed-scope quote: the pages, features, price and timeline are written down before anything is paid.',
      },
      {
        heading: 'What the starting price usually includes',
        body: 'At the lower end, a starter website usually includes: one page with up to four sections, mobile and desktop layout, contact details, an enquiry form or WhatsApp link, and basic on-page SEO. At the business level, expect up to five pages, an enquiry path, map details, and a sitemap. The number of revision rounds is the most commonly hidden variable — some quotes include one round, some two, some "unlimited" (which usually means the price was too low to be real).',
      },
      {
        heading: 'What is not in the build price',
        body: 'Domain registration and hosting are paid to the provider, in your name. Copywriting and photography are separate. Payment gateways, WhatsApp Business API access and similar third-party services carry their own fees. A transparent quote lists each of these separately instead of folding them in quietly — or folding your budget in quietly and delivering less.',
      },
      {
        heading: 'How to check a quote is real',
        body: 'Three questions separate a real quote from a bait price: "Which pages exactly are included?" "How many rounds of changes are in the price?" and "Who holds the domain and hosting account?" If the answers are written down, you are looking at a professional scope. If the answers are "we will figure it out", the price is not a price. You can [ask us those three questions before paying anything](/contact) and we will answer them in writing.',
      },
    ],
    faq: [
      {
        q: 'Can I get a website for under ₹4,000?',
        a: 'For a single strong page, yes — a Starter Website starts at ₹3,999. The trade-off is scope: one page, one round of changes, and you supply the text and images. It is a legitimate way to get online and grow into more pages later.',
      },
      {
        q: 'Why are some websites quoted so much higher?',
        a: 'Higher quotes usually cover more pages, custom design, custom features, content writing or ongoing maintenance. None of that is inherently bad — it is worth paying for when it is what you need. What is not worth paying for is vague scope hiding inside a high number.',
      },
    ],
  },
  {
    slug: 'how-long-does-it-take-to-build-a-website',
    title: 'How long does it take to build a website (real timelines)',
    excerpt:
      'Realistic 2026 timelines: one-page sites in 4–7 days, business sites in 7–14 days, stores in 3–5 weeks. Where the clock starts, what slows a project down, and why "fast" is not the only thing that matters.',
    date: '2026-11-06',
    category: 'Timelines',
    tags: ['timelines', 'planning', 'india'],
    serviceSlug: 'website-development',
    sections: [
      {
        heading: 'Typical timelines, stated plainly',
        body: 'A one-page [Starter Website](/pricing) usually takes 4–7 days. A business website with up to five pages takes 7–14 days. A larger site with up to ten pages takes 2–3 weeks. An [e-commerce store](/services/ecommerce) takes 3–5 weeks depending on catalogue size. All of these clocks start after the content and scope are confirmed — not when the invoice is paid.',
      },
      {
        heading: 'Where the time actually goes',
        body: 'Most of the time in a small website project is waiting, not building: waiting for the business text, the photos, the decisions. A builder can turn a page around in a day if the content is ready. A project that slips past its timeline almost always slipped on the content or the decisions, not the coding. That is why a good process writes the timeline against confirmed inputs.',
      },
      {
        heading: 'What slows projects down',
        body: 'The usual three: content arriving in fragments instead of one pass, feedback that restarts earlier decisions, and unconfirmed choices (prices, timings, photos, legal names) that force rework. None of these are anyone\'s fault by default — they are just what happens when a project has no written scope to point back to.',
      },
      {
        heading: 'Why "we deliver in 3 days" is a red flag',
        body: 'A genuinely good one-pager can be ready in a few days if the content is supplied and confirmed. But when a three-day promise covers a five-page site with forms and SEO, something in the process is being skipped: the scope is not written, the revisions are not real, or the "content" is a template with your logo on it. Speed is a feature only when the scope is fixed first.',
      },
    ],
    faq: [
      {
        q: 'What if I need the website urgently?',
        a: 'Tell the timeline honestly. A one-page build with your content ready can sometimes move faster than the standard window. What should never be rushed is the written scope — that is what protects both sides.',
      },
      {
        q: 'Do the timelines include domain setup?',
        a: 'Domain registration usually takes a few hours to a day with most providers. It can run in parallel with the build, so it rarely adds to the total timeline.',
      },
    ],
  },
  {
    slug: 'what-should-a-small-business-website-include',
    title: 'What should a small business website include in 2026?',
    excerpt:
      'The pages and sections a small business in India actually needs: what to put on the home page, how many pages is enough, and the five things customers check before they trust a website.',
    date: '2026-11-06',
    category: 'Website basics',
    tags: ['small business', 'website structure', 'seo'],
    serviceSlug: 'website-development',
    sections: [
      {
        heading: 'The five things customers check first',
        body: 'Before anything else, a visitor answers five questions: what do you do, is this for me, how much does it cost, how do I contact you, and can I trust this? A website that answers all five quickly is doing its job, no matter how many pages it has. Most failed small-business sites fail on #3 (no price signal at all) or #5 (no real person, no address, no way to verify).',
      },
      {
        heading: 'The home page, section by section',
        body: 'A strong home page for a local business usually has: a headline that says what you do for whom, a short supporting line, one primary action (call, WhatsApp, or enquiry form), a compact list of services, one or two [concrete examples of the work](/portfolio), and contact details with hours. That is it. Anything beyond that on the home page is usually padding that pushes the important content below the fold.',
      },
      {
        heading: 'How many pages is enough?',
        body: 'One page is enough for a sole trader or a single-location service. Four to five pages — Home, About, Services, Contact — is the right size for an established local business. Ten or more pages usually means the site has outgrown its content, not its audience. The rule is: a page should exist because it answers a question customers actually ask, not because every other site has one.',
      },
      {
        heading: 'Mobile is not a version, it is the site',
        body: 'In India, the majority of visits to a small-business website come from phones, often on mobile data. That means the mobile layout is the real design: the menu should be scannable, the contact button should be reachable without hunting, and the images should be light enough to load on a decent connection. If the desktop looks great and the phone looks like a shrunk-down desktop, the site is built backwards.',
      },
      {
        heading: 'The basics that are not optional',
        body: 'Fast loading on a mid-range phone, a working contact path (form or WhatsApp — both if possible), correct business details (phone, email, hours, location), and [on-page SEO](/services/website-development): unique page titles, meta descriptions, a sitemap and structured data. None of these are glamorous, and all of them are what separate a website that brings customers from one that merely exists.',
      },
    ],
    faq: [
      {
        q: 'Do I need a blog?',
        a: 'Not on day one. A blog earns its keep once you have something to write about that customers search for — a clinic can, a one-person consultancy can wait. Add it when there is real content, not to tick a box.',
      },
      {
        q: 'Do I need a separate About page?',
        a: 'A short About section is enough for a one-page site. Once the business has more than one page, a real About page — who runs it, how the work is done, what to expect — is worth having. Trust is the reason.',
      },
    ],
  },
  {
    slug: 'how-to-choose-a-web-developer-in-india',
    title: 'How to choose a web developer in India (without getting burned)',
    excerpt:
      'A practical checklist for hiring a web developer or studio in India: the five questions to ask, the red flags to walk away on, and why a written scope matters more than a portfolio.',
    date: '2026-11-06',
    category: 'Hiring',
    tags: ['web developer', 'hiring', 'india'],
    serviceSlug: 'website-development',
    sections: [
      {
        heading: 'Start with the scope, not the price',
        body: 'The single most useful habit when hiring a developer is to insist on a written scope before payment: which pages, which features, how many revision rounds, the timeline, and the price. It sounds bureaucratic, but it is the difference between a working agreement and an argument. A developer who writes the scope down quickly is telling you how they will run the project.',
      },
      {
        heading: 'The five questions to ask',
        body: 'One: "Who will hold the domain and hosting, and in whose name?" It should be yours. Two: "How many rounds of changes are included, and what happens after?" Three: "What do I need to provide, and by when?" Four: "How will I see progress before launch?" Five: "What happens to the code and access at handover?" Vague answers to any of these are the actual product being tested.',
      },
      {
        heading: 'Red flags worth walking away on',
        body: 'A quote that arrives before a single question was asked. A portfolio full of polished sites with no way to see the builder. A price that is dramatically below the market with no explanation of the scope — compare it against [published starting prices](/pricing). Pressure to pay a large deposit immediately. And the classic: "you do not need a domain, we will host it" — a site you cannot take with you is not your site.',
      },
      {
        heading: 'What a small or new studio should look like',
        body: 'A new independent studio can be a genuinely good buy if it is honest about being new: the portfolio shows [real work](/portfolio) (even demos clearly labelled as demos), the process is written down, the prices are published, and the person doing the work talks to you directly. The risk with a new studio is not that the work is bad — it is that the process is not proven yet. The written scope is the fix for that.',
      },
      {
        heading: 'What to check after handover',
        body: 'Before final payment: open the site on your own phone, check the contact form actually delivers, check the domain and hosting accounts are in your name, and check you can reach the person who built it if something breaks. Handover documents — access, what to renew, how to edit content — are part of the job, not a favour.',
      },
    ],
    faq: [
      {
        q: 'Should I hire an agency or a freelancer?',
        a: 'For a small business website, a freelancer or a two-person studio is usually the better price-to-accountability ratio: you talk to the person building it. Agencies make sense at larger scale — multiple properties, ongoing content, support contracts.',
      },
      {
        q: 'How do I verify a demo is real work?',
        a: 'Ask to use it. A real build can be clicked through: forms validate, the cart behaves, the phone opens the right number. A mockup cannot. If a "live demo" has a password you must chase for, that tells you something too.',
      },
    ],
  },
]

export const getBlogPost = (slug) => blogPosts.find((post) => post.slug === slug) || null
