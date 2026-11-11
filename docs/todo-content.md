# Content to fill in

Everything the site is still waiting on. Each item maps to a field in `content/resume.json`: fill it in there, push, and the site, CV and metadata update together. Nothing on this list has been invented or estimated.

Run `npm run todos` to list what is still marked TODO in the data.

Draft builds (local and Vercel previews) show every TODO in an amber dashed box. The production deployment never shows one: the line or section is left out until the content exists.

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

### Portrait

- [ ] The high-resolution original, ideally re-shot (window light, plain wall, eye level). Needed at 4:5 for `/about` and 1:1 for the links page. The current file is 240 × 240 px, which is why it only appears on the links page.

## Please confirm

Facts I took from your public READMEs, or inferred. Correct anything that's off.

- [ ] **"Live since October 2026"** for the clinic platform (`clinic-platform-demo` README).
- [ ] **"8 modules"**: counted from the "What's in it" list on your old site.
- [ ] **"37 tests"** for email triage (its README). This number goes stale when you add tests.
- [ ] **"Held for 30 minutes"**, **"every 15 minutes"** and the **five guard rails** (your READMEs).
- [ ] **DCU start: September 2025.** You gave me the year; I assumed September so the year-of-study chip rolls over at the right time. Add the graduation month to `education[0].endDate` when you know it.
- [ ] **"FIRST LEGO League"**: I used the organisation's own capitalisation rather than "First Lego League". If you won or placed, add it.
- [ ] **Chips:** "Will relocate" and "EU citizen (Irish)" are my wording for "open to relocate anywhere" and "Irish citizen", shortened so the chips fit in three rows on a 360 px phone.
- [ ] **Hero sentence:** "I digitised BodyMed Healthcare…" replaces "For the past two years I've been digitising…", so the sentence stays true without editing.
- [ ] **Transition Year entries** are stored as 2022 to 2023 with no months. Add how long the SAP placement was if you remember.

## Before launch, not blocking the build

- [ ] **Domain.** The site is at `cianmccaul.vercel.app` until you buy one. Then change `site` in `astro.config.mjs` and `basics.url` in `resume.json`.
- [ ] **Email.** Once the domain exists, set up Cloudflare Email Routing (`hello@…` to your inbox) and change `basics.email`. Until then the site shows the Outlook address.
- [ ] **LinkedIn.** Make the name, headline and dates match the site exactly.
- [ ] **Optional:** first-year result or notable modules at DCU (`education[0].notes`), and Leaving Certificate points.
- [ ] **Jarvis image:** a screenshot of an alert email, a fix pull request or the dashboard.
