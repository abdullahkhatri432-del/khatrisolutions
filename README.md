# Khatri Solutions — agency website

A production-ready marketing site for an independent web development and AI automation studio.
React + Vite + plain CSS (no Tailwind), React Router for real pages, Lucide icons, local fonts.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output in dist/
npm run preview  # preview the production build
```

Node 18+ recommended (built and tested on Node 24).

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, services overview, featured work, process, principles, FAQ, CTA |
| `/services` | Four service categories with specific work, fit and caveats |
| `/work` | Filterable portfolio with honest project-type labels |
| `/work/:slug` | Reusable case-study template |
| `/pricing` | Six INR starting-price packages, scope notes and custom quotes |
| `/about` | Mission, studio overview, team profiles, how the two roles work together |
| `/reviews` | Published reviews, empty state, moderated review form |
| `/contact` | Three-step conditional inquiry form + direct contact options |
| `/privacy` | Privacy notice matching what the site actually does |
| `/demos` | Index of six interactive demo sites |
| `/demos/:slug` | A self-contained demo site, clearly labelled as a demo |
| any other | Custom 404 (noindex) |

## One place to edit content

Everything lives in [`src/config/site.js`](src/config/site.js), except page titles and meta
descriptions, which live in [`src/config/seo.js`](src/config/seo.js):

- **`seo.js`** — the `<title>` and meta description for each static page, plus the helpers that
  build the same tags for case studies and demos from the project data. The build reuses them for
  the static HTML and the sitemap, so there is no second copy to keep in sync.
- **`site.url`** — the canonical hostname used in `canonical`, `og:url`, `sitemap.xml` and
  `robots.txt`.

- **`site.contact`** — email, WhatsApp number, social links.
  - Current values: `khatrisolutions01@gmail.com` and `whatsappNumber: '919875009874'`
    (displayed as +91 98750 09874).
  - `whatsappNumber` must be international format, digits only, no `+` (e.g. `919876543210`).
    While it is empty, every WhatsApp CTA falls back to email so nothing is a dead button.
  - Empty social URLs are hidden automatically. GitHub is set to
    `https://github.com/abdullahkhatri432-del`.
  - Per-project `repoUrl` values stay `null` while the portfolio is demo-only, so no case study
    links to a repository that is not public yet.
- **`site.formEndpoint`** — the live form endpoint (Google Apps Script), read from
  `VITE_FORM_ENDPOINT` or taken from the default in `site.js`. `site.formProvider` is the name shown
  in the privacy notice.
- **`site.founder`** — name and initials used by the team configuration.
- **`team`** — the two collaborators and their responsibilities. See “Edit the team” below.
- **`collaboration`** — the “How we work together” copy, role split and four stages.
- **`packages`**, **`pricingNote`**, **`pricingNotes`** — the six packages, intended customer,
  inclusions, scope notes, shared external-cost note and fine print.
- **`projects`** — portfolio entries and case studies.
- **`reviews`** — approved client reviews only. Empty is a valid state.
- **`services`** — four categories, their specific work, fit and caveats.
- **`process`**, **`principles`**, **`faqs`**, **`inquiryServiceOptions`**,
  **`inquiryServiceKinds`**, **`serviceAliases`** and the other form option lists.

### Packages and service preselection

All prices and package copy live in `packages` in `src/config/site.js`. Each package has an
`inquiryService` that must exactly match one of `inquiryServiceOptions`. For example:

```js
{
  name: 'Business Website',
  price: '₹7,999+',
  inquiryService: 'Business Website',
  // …
}
```

The pricing page builds its CTA as `/contact?service=<inquiryService>`. The contact page resolves
that value, keeps it in form state across all three steps, and shows it in the review panel before
submission. Category CTAs on `/services` use the same mechanism. A general “Request a quote” CTA
links to `/contact` with no query, so nothing is preselected.

If you rename a package or service option, update `inquiryService`, `inquiryServiceOptions` and
the matching key in `inquiryServiceKinds` together. `serviceAliases` keeps older bookmarked links
working.

### Published prices

- Starter Website — ₹3,999+
- Business Website — ₹7,999+
- Business Plus — ₹14,999+
- E-commerce Store — ₹19,999+
- Custom Web Application — Custom Quote
- AI Automation — Custom Quote

`pricingNote` is the shared external-cost note. Do not promise unlimited revisions, guaranteed
leads or sales, free paid integrations or unlimited support.

### Edit the team

The About page renders `team.members` in order. Each member supports:

```js
{
  id: 'business-development',     // stable key, not shown
  name: 'Real name',              // leave '' while unconfirmed
  initials: 'RN',                 // used for the monogram, leave '' if no name
  role: 'Business Development & Client Relations',
  tagline: 'One short line about the role.',
  intro: 'A genuine introduction, or null while pending.',
  responsibilities: ['...'],
  photo: null,                    // import an image or use a URL
  contact: { label: 'LinkedIn', href: 'https://…' }, // or null
  placeholder: false,             // true while details are unconfirmed
  placeholderNote: '...',         // shown instead of the intro when pending
}
```

Rules for this section:

- Never publish an invented name, photo, qualification, achievement or years of experience.
- A real name without a real photo uses an initials monogram instead of a stock or generated
  portrait.
- While a member's details are unconfirmed, keep `placeholder: true`. The card then shows
  “Name to be added” and a “Profile pending” label instead of pretending the details exist.
- `placeholder` is also inferred from an empty `name`, so an empty name cannot leak as a real person.
- A photo is optional: with `photo: null` the card shows initials (or a neutral icon while pending).
- “Team” in the copy means two collaborating freelancers. Do not add legal titles (CEO, Director)
  or claim company registration unless it is genuinely true. The note under `collaboration.note`
  states this explicitly and should stay accurate.

### Add a project

1. Copy an existing object in `projects`.
2. Set a unique `slug`, `title`, `category` (must match a filter), `summary`, `features`, `stack`.
3. `type` must be exactly `"Client project"`, `"Demo project"` or `"Concept project"`.
   Only use `"Client project"` for paid work.
4. Set `demoUrl` **only** when a live deployment is reachable. While `null`, the UI hides
   the demo button and says “Live demo not published yet”.
5. Fill `caseStudy` with real facts only.

### Publish a review

Reviews are moderated manually — there is deliberately no fake admin dashboard.

1. A client submits the review form; it reaches the studio inbox (or an endpoint, if configured).
2. You confirm the project and ask any clarifying question.
3. Add the approved review to the `reviews` array:

```js
{
  id: 'review-2026-01',
  name: 'Client name',
  business: 'Business name',        // optional
  projectType: 'Clinic or healthcare website',
  rating: 5,
  quote: 'What they actually said.',
  date: '2026-10-26',
  verified: true,                  // only if genuinely confirmed
}
```

Only reviews with `verified: true` get the verified badge. Never add invented reviews.

## How the forms work

There is no bundled backend, and the site never pretends there is one.

The project inquiry form has three steps: **what you need**, **your details**, and **project
details**. It validates one step at a time, keeps the selected service across steps, and jumps back
to the first step containing an error on final submit.

- **Service:** one of the eight options in `inquiryServiceOptions`.
- **Conditional questions:** shown from `inquiryServiceKinds`:
  - websites — business type, pages required, optional existing URL;
  - e-commerce — product count, payment and delivery requirements;
  - custom applications — problem, user roles, required features;
  - AI automation — task to automate, tools used today;
  - redesign — current URL, desired improvements;
  - not sure — business type, primary goal.
- **Contact details:** email and phone are both optional individually, but at least one valid
  method is required. Choosing WhatsApp or phone call requires a phone number; choosing email
  requires an email address.
- **Consent:** required before submission, with a link to the privacy notice.

- **Static hosting** (Vercel, plus the Render mirror): there is no server. The form posts to the
  Apps Script endpoint configured in `site.formEndpoint`, which emails the enquiry. Without an
  endpoint it would only validate the input and hand the message to WhatsApp or the visitor's email
  app.
- **`VITE_FORM_ENDPOINT` set**: overrides the default endpoint. The form posts URL-encoded `payload`
  JSON and shows “Enquiry sent” only after the endpoint replies `{"ok":true}`.

A failed request shows an error and keeps the answers so the visitor can retry or email directly.

The review form has its own `reviewProjectTypes` list, separate from inquiry services, so editing
one does not silently change the other.

Protection included: honeypot field, per-step and final validation, disabled buttons while sending,
duplicate-submit guard, and no success message without a real result. Never put an API secret in
client-side code — only a public form endpoint belongs in `VITE_FORM_ENDPOINT`.

WhatsApp is configured, so the floating button, footer link, contact card and form handoff all open
a chat at `wa.me/919875009874` with the message prefilled. The form still says nothing has been sent
until the visitor presses send inside WhatsApp. To change the number, edit
`site.contact.whatsappNumber` (digits only, country code first) and `phoneDisplay` (the human-readable
version). Never invent a number, and never claim that WhatsApp sent a message automatically.

No GitHub links are rendered while `site.contact.github` is empty and every project keeps
`repoUrl: null`. The portfolio is therefore demo-only until a real deployment or repository exists.

## Reviews and honesty rules

- No fake testimonials, ratings, logos, awards, team members or statistics.
- Team profiles use real names and roles; any future unconfirmed profile stays labelled as pending.
- Demo and concept projects are labelled as such in the portfolio and case studies.
- Prices are starting ranges, not fixed promises; the final quote follows the agreed scope.
- The About page says the studio is new instead of implying years of history.

## SEO

- Every route gets its own `<title>`, meta description, canonical URL and Open Graph/Twitter tags.
  The strings live in [`src/config/seo.js`](src/config/seo.js) for static pages and are derived from
  the data for case studies and demos, so there is one copy of each.
- `useSeo` applies the same values in the browser, so client navigation and the static HTML agree.
- The build writes real `<title>`/`<meta>`/`<link rel="canonical">` tags into every route shell
  (`dist/<route>/index.html`), which is what crawlers and chat-app link previews read before any
  JavaScript runs. The 404 shell is `noindex, nofollow`.
- `dist/sitemap.xml` (all 21 routes) and `dist/robots.txt` are generated at build time from the same
  route list, so they cannot fall out of sync with the pages.
- `public/og-image.png` — 1200×630 social card (source layout in `og-image.svg`), referenced
  absolutely in every page's `og:image`.
- The canonical host comes from `site.url` in [`src/config/site.js`](src/config/site.js). Change it
  there when a custom domain replaces the Vercel URL; nothing else needs editing.

No fake structured data is included.

## Deploy

**Live:** <https://khatrisolutions.vercel.app>

Two hosts run the same build from `main`:

| Host | Role |
| --- | --- |
| <https://khatrisolutions.vercel.app> | Primary site. Canonical host for SEO. |
| <https://khatrisolutions.onrender.com> | Live mirror, kept because clients already share this link. |

Every page on both hosts carries a `canonical` link to the Vercel URL, so the mirror does not
compete with the primary site in search results.

### Vercel (primary)

The site runs on Vercel as a static Vite build, linked to
<https://github.com/abdullahkhatri432-del/khatrisolutions>. Every push to `main` builds and
publishes automatically — no workflow file and no manual upload step.

`vercel.json` in the repo root holds the framework preset, the build command (`npm run build`), the
output folder (`dist`) and the cache headers for hashed assets.

There is deliberately **no catch-all rewrite**. The build writes a copy of the app shell to
`dist/<route>/index.html` for every real route (see `scripts/route-shells.mjs`) plus `dist/404.html`,
so Vercel serves deep links as real files and answers unknown paths with a genuine 404 status
instead of a 200 that only looks correct.

> **Plan note.** Vercel's free Hobby plan is limited by their Fair Use Policy to personal,
> non-commercial projects. This is the studio's business site, so it is running on Hobby knowingly;
> if that becomes a concern, Vercel Pro is $20/month.

### Render (mirror)

<https://khatrisolutions.onrender.com> runs the same repository and the same `npm run build`, and
deploys automatically on every push to `main`. `render.yaml` in the repo root describes the service:
static runtime, `dist` as the publish path, long-lived caching for `/assets/*`, and a catch-all
rewrite so unknown paths get the app shell.

The mirror exists because clients already have the old link; it is not a second site to maintain.
Each push deploys to both hosts independently, so the mirror goes live once its own build finishes.
If the mirror is ever retired, delete the service in the Render dashboard and the URL will stop
resolving.

### Other hosts that also work

- **Firebase Hosting** — generous free Spark plan, good performance in India. Needs
  `firebase.json` with a `"rewrites": [{ "source": "**", "destination": "/index.html" }]` rule.
- **GitHub Pages** — free and stable, but SPA routing needs a `404.html` copy of `index.html`, and
  a project site (`username.github.io/repo`) also needs a matching Vite `base` path.

## Checks run

- `npm run lint` (`npx oxlint src`) — 0 warnings, 0 errors.
- `npm run build` — production build succeeds.
- All 21 routes render with no console errors or failed requests, on both hosts.
- Static HTML (no JavaScript) matches the rendered head on every route: title, description,
  canonical, `og:url`, `og:image` and robots all agree, and unknown paths answer 404 with
  `noindex, nofollow` and no canonical.
- 0 axe-core WCAG 2.1 A/AA violations on all routes, plus inquiry steps 2 and 3.
- 0 horizontal overflow at 320, 360, 390, 768, 1024 and 1440 px across all routes and all
  inquiry steps, including the confirmation panel.
- All six package CTAs were clicked and verified to preselect their own service; a general contact
  link starts with no service selected.
- Validation checked for conditional fields, email-or-phone rules, preferred contact consistency,
  consent and focus movement to the first error.
- WhatsApp handoff tested: `wa.me/919875009874` opened with the encoded message, the “nothing has
  been sent yet” state was shown, and “Edit my details” preserved the answers.
- Email handoff tested with Email chosen as preferred contact (prefilled `mailto:` to
  `khatrisolutions01@gmail.com`, explicit “nothing has been sent” state, preserved answers on
  “Edit my details”).
- Rebrand verified: no `Kryvox` text or links remain in the built site, all route titles and the
  footer show Khatri Solutions, and the GitHub profile link resolves without any per-project repo
  buttons.
- Endpoint mode tested with a temporary local endpoint: JSON payload, success confirmation and a
  simulated 500 failure were all verified. The production build was rebuilt afterwards with no
  endpoint configured.
- Internal links, hash navigation, skip link, route-change focus and mobile menu focus checked.

## Not included in this marketing site (by design)

- No database, authentication or admin panel for the website itself.
- No live payment or booking integration in the demo build — client projects that need these require
  separate provider setup and testing.
- No analytics or tracking scripts.
- No invented client results or performance statistics.
