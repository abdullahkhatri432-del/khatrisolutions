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
| any other | Custom 404 (noindex) |

## One place to edit content

Everything lives in [`src/config/site.js`](src/config/site.js):

- **`site.contact`** — email, WhatsApp number, social links.
  - Current values: `khatrisolutions01@gmail.com` and `whatsappNumber: '919875009874'`
    (displayed as +91 98750 09874).
  - `whatsappNumber` must be international format, digits only, no `+` (e.g. `919876543210`).
    While it is empty, every WhatsApp CTA falls back to email so nothing is a dead button.
  - Empty social URLs are hidden automatically. GitHub is set to
    `https://github.com/abdullahkhatri432-del`.
  - Per-project `repoUrl` values stay `null` while the portfolio is demo-only, so no case study
    links to a repository that is not public yet.
- **`site.formEndpoint`** — optional third-party form service. Read from `VITE_FORM_ENDPOINT`; takes
  precedence over Netlify Forms when set.
- **`site.netlifyForms`** — `true` in Netlify builds (`VITE_NETLIFY_FORMS`), switches the form to
  Netlify Forms. `site.formProvider` supplies the name used in the privacy notice.
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

- **Render static site** (current live setup): there is no server, so unless a form endpoint is
  configured the form validates the input, then opens WhatsApp or the visitor's email app with a
  prefilled message. Nothing is stored, and the result panel says so explicitly until the visitor
  presses send in that app. “Edit my details” preserves every answer.
- **`VITE_FORM_ENDPOINT` set**: the form posts URL-encoded `payload` JSON and shows “Enquiry sent” only after the endpoint replies `{"ok":true}`. On Render this is the Apps Script below, which saves the lead immediately and emails the sales partner a minute or two later.
- **Netlify-hosted build** (opt-in, not used on Render): with `VITE_NETLIFY_FORMS=true` the form
  posts URL-encoded data to the site itself and Netlify stores and emails the submission.

A failed request shows an error and keeps the answers so the visitor can retry or email directly.

The review form has its own `reviewProjectTypes` list, separate from inquiry services, so editing
one does not silently change the other.

### Optional: Netlify Forms (not active on Render)

The support still exists but is disabled by default, because Render cannot process the POST.

- Set `VITE_NETLIFY_FORMS=true` in a build that actually runs on Netlify.
- `index.html` contains two `hidden` static forms (`project-inquiry`, `client-review`) used only for
  Netlify's build-time field detection. They render at zero height and stay out of the accessibility
  tree. Keep their field names in sync with `src/lib/inquiry.js`.
- `src/lib/inquiry.js` posts `application/x-www-form-urlencoded` to `/` with the matching
  `form-name`; Netlify Forms does not accept JSON.
- On Netlify, form detection must be enabled and a `submission_created` email notification created.

To use a form provider on Render:

1. Create a form at your provider and copy the endpoint.
2. Add it locally in `.env` and in Render's environment variables:
   ```
   VITE_FORM_ENDPOINT=https://formspree.io/f/your-id
   ```
3. Redeploy. The endpoint takes precedence over everything else.

Protection included: honeypot field, per-step and final validation, disabled buttons while sending,
duplicate-submit guard, and no success message without a real result. When Netlify Forms is enabled,
Netlify additionally filters obvious spam and drops submissions from headless browsers. Never put an
API secret in client-side code — only a public form endpoint belongs in `VITE_FORM_ENDPOINT`.

WhatsApp is configured, so the floating button, footer link, contact card and form handoff all open
a chat at `wa.me/919875009874` with the message prefilled. The form still says nothing has been sent
until the visitor presses send inside WhatsApp. To change the number, edit
`site.contact.whatsappNumber` (digits only, country code first) and `phoneDisplay` (the human-readable
version). Never invent a number, and never claim that WhatsApp sent a message automatically.

No GitHub links are rendered while `site.contact.github` is empty and every project keeps
`repoUrl: null`. The portfolio is therefore demo-only until a real deployment or repository exists.

## Studio Desk (lead analysis and proposal drafts)

`studio/` is a local-only Node tool for turning inbound enquiries into reviewable proposals. It is **not** part of the deployed marketing site and it has **no send code** — it cannot email, message or publish a proposal.

```bash
# 1. Create your local environment
Copy-Item .env.example .env.local   # Windows PowerShell
# cp .env.example .env.local        # macOS / Linux

# 2. Add LEADS_SHEET_CSV_URL and OPENROUTER_API_KEY to .env.local

# 3. Start the desk
npm run studio
# http://127.0.0.1:4310
```

Studio Desk has **no login**. It holds lead contact details, so it refuses to bind to a non-loopback host. Only set `STUDIO_ALLOW_REMOTE=true` if you have put it behind an authenticated proxy or private tunnel and accept the risk.

### Lead source

| Option | How |
| --- | --- |
| Google Sheet CSV | Set `LEADS_SHEET_CSV_URL` to the sheet's CSV export URL. The sheet must be readable by the link. |
| Local CSV export | Set `LEADS_CSV_FILE=leads-export.csv` and refresh the file yourself. Best for sensitive data. |
| Import in the UI | Press **Import CSV** and choose an export. Nothing needs to be configured first. |
| Manual entry | Press **Add lead** and paste the brief. |

The CSV mapper accepts the usual Google Forms / Apps Script headers (`Timestamp`, `Name`, `Email`, `Business`, `Business Type`, `Service`, `Budget`, `Timeline`, `Description`, conditional form answers). Rows whose `Kind` or `Form` column says `review` are skipped, so review submissions never become sales proposals. Rows with a `Lead ID` keep it; otherwise the desk derives a stable `LD-XXXXXXXX` from the name, email, date and brief.

> **Privacy:** sharing a sheet as "Anyone with the link" exposes every lead in it. Use a dedicated export tab with only the fields this desk needs, or prefer `LEADS_CSV_FILE` / **Import CSV**.

### Proposal generation

Set `OPENROUTER_API_KEY` in `.env.local`. The key is read by the local Node server and never reaches the browser or the deployed site. `OPENROUTER_MODEL` defaults to the free `nvidia/nemotron-3-ultra-550b-a55b:free`, so drafts cost nothing; change it if you prefer another model. Because it reasons before answering, `STUDIO_AI_MAX_TOKENS` is set to 16000 in the example config. Free endpoints have lower rate limits and may log prompts under OpenRouter's data policy, which is why email and phone are never included.

When a lead is pulled (or first opened for review), Studio Desk can draft automatically. Each draft contains:

- a client-ready proposal in Markdown, grounded in the lead's business type, description and budget;
- a fit judgement and internal summary;
- an internal audit checklist with priorities and reasons;
- open questions, risks, assumptions and one next internal action.

The prompt is grounded in `studio/lib/agency.mjs` (services, published INR prices, process, exclusions). It is explicitly instructed not to invent clients, results, testimonials, metrics or discounts, and to treat the lead text as untrusted data.

Only the brief fields — name, business, business type, service, budget, timeline and description — are sent to OpenRouter. **Email and phone stay in the local data file.**

Auto-draft runs once per new lead. A failure is recorded on that lead and is **not retried automatically**, so an expired key or provider outage cannot spend money in a loop. Use **Generate proposal** to try again. Each generation is a paid OpenRouter request.

### Human review workflow

`New → Drafted → In review → Approved → Archived`

- **Drafted** means a model draft exists. Nothing has been sent.
- **In review** is an explicit human step.
- **Approve** marks the draft locally with a reviewer and timestamp. Editing an approved draft automatically returns it to review.
- **Copy proposal** / **Download .md** produce the client document; **Internal brief** adds the checklist, questions, risks and review notes.
- An archived lead reopens in **Draft** if it has a draft, or as **New** if it never had one.
- There is no email, WhatsApp or webhook integration in `studio/`. Sending is deliberately left to you.

Drafts and leads live in `.studio-data/leads.json` (gitignored). Re-pulling the sheet updates source fields but never overwrites a draft, review note or status.

### Commands

```bash
npm run studio        # start the local desk
npm run studio:test   # CSV, workflow, prompt, OpenRouter, export and storage tests
npm run lint          # checks src/ and studio/
npm run build         # marketing site only; Studio Desk is not bundled
```

### Files

| Path | Purpose |
| --- | --- |
| `studio/server.mjs` | Local HTTP server, API and static UI |
| `studio/lib/csv.mjs` | CSV parser, header aliases, lead IDs |
| `studio/lib/store.mjs` | Atomic local JSON storage |
| `studio/lib/leads.mjs` | Status transitions, approval rules, draft history |
| `studio/lib/prompt.mjs` | Proposal and audit-checklist prompt |
| `studio/lib/agency.mjs` | Grounding facts; keep in sync with `src/config/site.js` |
| `studio/lib/openrouter.mjs` | OpenRouter client, JSON parsing and error handling |
| `studio/public/` | Local admin UI |
| `studio/test/` | Node test suite |

## Apps Script automation (live enquiries)

[`apps-script.js`](apps-script.js) is a standalone Google Apps Script that turns a form submission into a reviewable sales brief. It runs only inside Apps Script; it is not bundled into the marketing site and it does not replace Studio Desk.

On each project enquiry it:

1. validates the payload and stores the lead in a Google Sheet;
2. asks OpenRouter (`nvidia/nemotron-3-ultra-550b-a55b:free` by default) for a client proposal and demo copy;
3. deploys a one-page concept site to Vercel, or serves a public Apps Script backup demo if Vercel fails;
4. emails the sales partner a high-priority HTML brief with the client details, proposal, live demo URL and a pre-filled `wa.me` link;
5. records every status and error on the lead row for retries.

Nothing is sent to the client automatically. The sales partner reviews the draft and presses send inside WhatsApp; the link opens the client's chat with the proposal already typed in. Review submissions are stored and emailed as a notification, and never trigger OpenRouter or a demo deployment.

### Why processing is queued

The public form aborts its request after 20 seconds. OpenRouter and Vercel routinely take longer than that, so `doPost` saves the lead and returns immediately. A one-minute trigger does the slow work and sends the email, so the partner normally receives the brief **1–3 minutes** after the enquiry. The form is never told “sent” before the lead has been saved.

### Setup

1. Open <https://script.google.com> and create a project. Paste in `apps-script.js`.
2. Under **Project Settings → Script Properties**, add the properties below.
3. Run `setup()` once from the editor and approve the permissions. It creates or connects the `Leads` sheet and installs the one-minute trigger.
4. **Deploy → New deployment → Web app**: *Execute as* **Me**, *Who has access* **Anyone**. Copy the `/exec` URL.
5. Put that URL in `FORM_ENDPOINT_DEFAULT` in `src/config/site.js`, or set `VITE_FORM_ENDPOINT` in `.env.local` and in Render's environment variables. Then redeploy the site.
6. Open `<the /exec URL>?page=health`. It must return JSON with `"ok": true` and the current `version`. If you get an HTML page instead, the deployment is still running older code.
7. Submit a test enquiry. Either wait for the trigger or run `processQueue()` manually. Check the `Leads` sheet and the sales inbox.

The `/exec` URL checked into `src/config/site.js` belongs to an earlier deployment. A new version of the script is not live until you deploy it and update that URL: Apps Script serves the last deployed version to the web, not the copy saved in the editor.

### Script Properties

| Property | Required | Purpose |
| --- | --- | --- |
| `OPENROUTER_KEY` | Yes | OpenRouter API key. Without it, the grounded template proposal is used instead. |
| `VERCEL_TOKEN` | Yes for Vercel demos | Vercel access token with deployment permission. Without it, the Apps Script backup demo is used. |
| `SALES_EMAIL` | Yes | Recipient Gmail address. Comma-separated addresses are allowed. |
| `LEADS_SHEET_ID` | Optional | Existing spreadsheet ID. If blank, `setup()` creates one and stores its ID. |
| `VERCEL_TEAM_ID` | Optional | Team ID when the token belongs to a Vercel team. |
| `VERCEL_PROJECT_PREFIX` | Optional | Project-name prefix. Default `khatri-demo`. |
| `VERCEL_DEMO_TARGET` | Optional | `production` (default) or `preview`. |
| `DEMO_LINK_MODE` | Optional | `auto` (default), `vercel` or `apps_script`. |
| `OPENROUTER_MODEL` | Optional | Default `nvidia/nemotron-3-ultra-550b-a55b:free`. |
| `OPENROUTER_MAX_TOKENS` | Optional | Default `8000`, clamped to 2000–16000. |
| `AGENCY_WHATSAPP` | Optional | Digits only. Default `919875009874`. |
| `AGENCY_EMAIL` | Optional | Default `khatrisolutions01@gmail.com`. |
| `AGENCY_SITE` | Optional | Default `https://khatrisolutions.onrender.com`. |
| `MAX_LEADS_PER_RUN` | Optional | Default `1`, clamped to 1–5. Long jobs are why this is kept small. |
| `TIMEZONE` | Optional | Default `Asia/Kolkata`. |

Never put these values in the browser bundle or in `src/config/site.js`. Apps Script properties are server-side.

### Demo links

Each lead gets a unique Vercel project, `khatri-demo-<business>-<leadid>`, and a production deployment by default. That keeps the link public and stable. Vercel's preview deployments can require a Vercel login under Deployment Protection, so only set `VERCEL_DEMO_TARGET=preview` if previews are public.

If Vercel is missing, rejects the token or fails during deployment, the email falls back to a public Apps Script URL of the form `?page=demo&id=<leadId>&k=<demoKey>`. The email labels the provider honestly. Both demo pages are `noindex,nofollow` and carry a visible “Demo concept — not a live client website” notice.

Demo pages are public links, so they deliberately leave out the client's phone number, email address and stated budget. They show the business name, who the concept was prepared for, and the concept copy only.

Each lead creates its own Vercel project. Delete old demo projects from the Vercel dashboard periodically to stay within the account's project limit.

Vercel Hobby is explicitly non-commercial. A commercial studio should use a plan that permits this use, or set `DEMO_LINK_MODE=apps_script` and rely on the backup demo.

### Operations

| Action | How |
| --- | --- |
| Health check | Open the web app URL with `?page=health`. It reports configuration flags, never secrets. |
| Retry a full lead | Run `retryLead("LD-XXXXXXXX")` from the editor. It regenerates AI copy, the demo and the email. |
| Re-send only the email | Run `resendLeadEmail("LD-XXXXXXXX")`. It reuses the stored content and demo URL. |
| Reinstall the trigger | Run `installQueueTrigger()`. `removeQueueTrigger()` removes it. |
| Check configuration | Run `healthCheck()` from the editor. |

Statuses on the sheet are `queued`, `processing`, `ready`, `email_failed` and `failed`. A stale `processing` row is requeued automatically after 15 minutes. Duplicate submissions reuse the same lead ID; a retry after a timeout does not create a second row or a second email.

`MailApp.sendEmail` sends from the script owner's Gmail and has daily quotas. The subject starts with `[HIGH PRIORITY]` and the HTML shows a high-priority chip. The script also attempts `X-Priority`/`Importance` headers; Gmail may ignore them, and if the send is rejected the script retries without them rather than dropping the lead.

### Sheet columns

The `Leads` sheet is also readable by Studio Desk's CSV import. It stores the form answers plus `Lead ID`, `Status`, `AI Status`, `AI Summary`, `Proposal Bullets`, `Recommended Package`, `Demo URL`, `Demo Provider`, `Email Status`, `Emailed At`, `Attempts`, `Last Error` and `Content JSON`.

Lead text is written with a leading apostrophe when it starts with `=`, `+`, `-` or `@` to prevent spreadsheet formula injection.

## Reviews and honesty rules

- No fake testimonials, ratings, logos, awards, team members or statistics.
- Team profiles use real names and roles; any future unconfirmed profile stays labelled as pending.
- Demo and concept projects are labelled as such in the portfolio and case studies.
- Prices are starting ranges, not fixed promises; the final quote follows the agreed scope.
- The About page says the studio is new instead of implying years of history.

## SEO

- Per-page titles, descriptions, canonical URL and Open Graph tags via `useSeo`.
- `public/robots.txt` and `public/sitemap.xml`, both pointing at
  `https://khatrisolutions.onrender.com` — the current live URL.
- `public/og-image.png` — 1200×630 social card (source layout in `og-image.svg`).
- If the Render subdomain or a custom domain changes, replace
  `https://khatrisolutions.onrender.com` in `robots.txt` and `sitemap.xml`, and update the sitemap
  when routes change.

No fake structured data is included.

## Deploy (free hosting that works in India)

**Live:** <https://khatrisolutions.onrender.com>

The site runs on Render as a **static site** in the free Hobby workspace, linked to
<https://github.com/abdullahkhatri432-del/khatrisolutions>. Every push to `main` builds and
publishes automatically — no workflow file and no manual upload step.

`render.yaml` in the repo root holds the build command (`npm run build`), the publish folder
(`./dist`), the SPA rewrite and the asset cache headers.

> **Required Render setting.** If the service was created by hand instead of from the Blueprint,
> add the SPA rewrite once in the Render Dashboard under **Settings → Redirects/Rewrites**:
> source `/*`, destination `/index.html`, action **Rewrite**. Without it, `/pricing`,
> `/contact` and other deep links return 404 while in-app navigation still works.

Cloudflare Pages is not usable here: `pages.dev` domains are blocked or unreliable on several
Indian ISPs, and account verification often fails. Vercel Hobby is not suitable because it is
explicitly non-commercial.

### Render — current host

1. Push this folder to a GitHub repository.
2. In Render: **New → Blueprint** and connect the repo. (To create it by hand instead, choose
   **New → Static Site** and copy the same build settings.)
3. Render reads `render.yaml` in the repo root: build `npm run build`, publish `./dist`, rewrite
   every unknown path to `index.html`, and cache hashed assets for a year.
4. Choose the free **Hobby** workspace. Static sites do **not** spin down on idle — that limitation
   only applies to free web services.
5. Free limits: **5 GB outbound bandwidth** and **500 build minutes** per month. At the current
   page weight (~270 KB per first visit), 5 GB is roughly 15,000–18,000 visits; repeat visits are
   cheaper because fonts and assets are cached.
6. Static hosting cannot store form submissions. Set `VITE_FORM_ENDPOINT` under **Environment**
   (Formspree, Basin, Getform) to deliver enquiries, or the form keeps the WhatsApp / email draft
   handoff.
7. Test the `*.onrender.com` URL on Jio and Airtel before pointing a custom domain at it. There are
   no widespread reports of `onrender.com` being blocked in India, but ISP-level filtering varies.
8. If the domain changes, update `robots.txt` and `sitemap.xml`.

If you exceed 5 GB without a payment method on file, Render suspends the site until the next
month. With a payment method, extra bandwidth is billed at $0.15/GB.

Render describes Hobby as being for personal projects, although its terms do not include Vercel's
explicit non-commercial clause. If this becomes the studio's main site, Render Pro is $25/month.

### Other free options

- **Vercel** — `vercel.json` is already correct. Note that the Hobby plan is for personal,
  non-commercial projects; a commercial studio site is expected to use Pro.
- **Firebase Hosting** — generous free Spark plan, good performance in India. Needs
  `firebase.json` with a `"rewrites": [{ "source": "**", "destination": "/index.html" }]` rule.
- **GitHub Pages** — free and stable, but SPA routing needs a `404.html` copy of `index.html`, and
  a project site (`username.github.io/repo`) also needs a matching Vite `base` path.

## Checks run

- `npm run lint` (`npx oxlint src`) — 0 warnings, 0 errors.
- `npm run build` — production build succeeds.
- `node --check apps-script.js` — the Apps Script parses cleanly. A Node VM harness exercised payload parsing,
  validation, deduplication, queue processing, AI and Vercel fallbacks, demo access keys, email re-send,
  the Vercel request shape and email/WhatsApp content (14 checks).
- All 9 routes render with no console errors or failed requests.
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
