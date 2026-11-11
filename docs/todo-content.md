# Content to fill in

Everything the site is still waiting on. Facts live in `content/resume.json`; the three case studies are the MDX files in `content/work/`. Fill a gap in, push, and the site, CV, PDF and metadata update together. Nothing on this list has been invented or estimated.

Run `npm run todos` to list what is still marked TODO.

Draft builds (local and Vercel previews) show every TODO in an amber dashed box. The production deployment never shows one: the line or section is left out until the content exists. TODOs never print, so they can’t reach the PDF.

## Blocking launch

### Measured outcomes (`metrics`, and `outcome` on each case-study project)

There are no measured results on the site yet. Write each one in XYZ form: accomplished X, as measured by Y, by doing Z, with a baseline.

- [ ] **Clinic platform: share of bookings made online.** Online vs phone bookings in Cliniko over one full month. Needs the owner's approval. Share it as a percentage, not a count.
- [ ] **Clinic platform: reception time per booking**, before and after. Even "about 5 minutes on the phone, now about 1 to confirm" from reception is usable if they will stand behind it.
- [ ] **Clinic platform: no-shows or late cancellations**, before and after the card-on-file policy.
- [ ] **AI email triage: agreement with staff.** Run the AI sorter over a labelled set of at least 50 emails. Report matches, with the rule-based sorter as the baseline.
- [ ] **Jarvis: outages caught and explained before a customer reported them.** Count from `incidents.json` since the first run, and give the date range.

### BodyMed (`work[0]`)

- [ ] One highlight in XYZ form.
- [ ] Who you work with day to day (owner, reception, therapists), and one example of working through a disagreement or trade-off. The employer checklist asks for both a team story and an ownership story.
- [ ] **Written approval from the owner** for the public case study and any numbers. `approvedForPublic` is `false` until then. The case study will carry no revenue figures.

### Testimonials (`testimonials`)

- [ ] One to three short quotes, each with name, role and company, and `"permission": true`. Good people to ask: the BodyMed owner, a therapist or receptionist who uses the hub, the DEME client. The section is hidden until at least one exists.

### Case studies (`content/work/*.mdx`)

Each one is written only from your READMEs, the code and `resume.json`. What they still need from you:

- [ ] **Read all three for accuracy.** They are in your voice, built from your words, but you should recognise every sentence as true.
- [ ] **“Hardest problem” for email triage and Jarvis.** Your clinic notes name the hardest problem outright (paid but not booked). For the other two I chose the section from what your READMEs spend most time on: emails where tone and content disagree, and letting a model change code safely. Swap them if something else was harder.
- [ ] **Reflection, all three:** what you would do differently, in your own words. Clinic has one real lesson already (refund-at-once became keep-the-payment); the other two are empty.
- [ ] **Timelines:** when you started each project and how long it took.
- [ ] **Email triage context:** how the clinic handled its inbox before, and what prompted the tool.
- [ ] **Jarvis image:** a screenshot of an alert email, a fix pull request or the dashboard. It has no public demo, so its page has no picture.
- [ ] **Clinic platform approval.** The case study names BodyMed. It has no revenue figures and no patient data, and everything in it is already in the public demo’s README and `docs/architecture.md`. Three details are worth showing the owner before launch, because the public README describes an unnamed clinic and this page names it: that the therapists are self-employed, that payments go to their own Stripe accounts, and that staff sign in with passkeys.

A note on Jarvis’s numbers: the `incidents.json` in the public repo holds 17 events from 11 and 12 September 2026, and they look like deliberate tests (a URL that doesn’t exist). A real “outages caught” figure has to come from the private instance.

### About page

- [ ] **Bio.** It is about 80 words. The target is 150 to 250: add what you want to work on next and why.
- [ ] **Beyond the code** shows three of your five interests (football, volunteering, photography). Gym and the school production are still in `resume.json` with `"featured": false`. Swap them if you prefer.

### Portrait

- [ ] The high-resolution original, ideally re-shot (window light, plain wall, eye level). Needed at 4:5 for `/about` and 1:1 for the links page. The current file is 240 × 240 px, which is why it only appears on the links page.

## Please confirm

Facts I took from your public READMEs, or inferred. Correct anything that's off.

- [ ] **"8 modules"**: counted from the "What's in it" list on your old site.
- [ ] **"37 tests"** for email triage (its README). This number goes stale when you add tests.
- [ ] **"Held for 30 minutes"**, **"every 15 minutes"** and the **five guard rails** (your READMEs).
- [ ] **Graduation month.** Add it to `education[0].endDate` when you know it; until then the site says “graduating 2029”.
- [ ] **"FIRST LEGO League"**: I used the organisation's own capitalisation rather than "First Lego League". If you won or placed, add it.
- [ ] **Transition Year entries** are stored as 2022 to 2023 with no months. Add how long the SAP placement was if you remember.

## Before launch, not blocking the build

- [ ] **Domain.** The site is at `cianmccaul.vercel.app` until you buy one. Then change `site` in `astro.config.mjs` and `basics.url` in `resume.json`.
- [ ] **Email.** Once the domain exists, set up Cloudflare Email Routing (`hello@…` to your inbox) and change `basics.email`. Until then the site shows the Outlook address.
- [ ] **LinkedIn.** Make the name, headline and dates match the site exactly.
- [ ] **Optional:** first-year result or notable modules at DCU (`education[0].notes`), and Leaving Certificate points.
- [ ] **Skills on the CV** (`skills`) are taken from the “Built with” lists in your READMEs. Remove anything you wouldn’t be happy to be asked about in an interview.
- [ ] **CV bullets** (`projects[].highlights`) are facts from your READMEs with no numbers in them. When a metric exists, lead the bullet with it.
