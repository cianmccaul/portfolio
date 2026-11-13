# Content to fill in

What the site is still waiting on. Facts live in `content/resume.json`. The BodyMed Hub case study is `content/hub.json`; the other two case studies are the MDX files in `content/work/`. Change one, push, and the site, CV, PDF and metadata update together. Nothing on this list has been invented or estimated.

Run `npm run todos` to list what is outstanding.

How unfinished content behaves:

- **TODOs** show in draft builds (local and Vercel previews) in an amber dashed box. Production leaves the line or section out. They never print, so they can't reach the PDF.
- **Pending approval** is content that is written and true but needs a sign-off first. It is tagged with a switch in `approvals` in `resume.json`. Draft builds show it with a "Pending approval" marker; production and the PDF leave it out until the switch is `true`.

## Before this portfolio goes live

- [ ] **Merge and deploy three branches in other repos.** The chatbot's urgent-symptom path and DesignRoom's demo mode are only on `claude/intelligent-bell-4dvkw8`, not on `main` or the live sites, and the portfolio describes both. Until DesignRoom's is deployed, its "safe to try" demo link would send a real brief. Details in `docs/project-followups.md`, item 0.

## Waiting for the BodyMed owner

One conversation covers all of this.

- [ ] **The BodyMed Hub case study** (`/work/bodymed-hub/`; the old `/work/clinic-platform/` redirects to it). It names BodyMed. It has no revenue figures, no patient data, no therapist names or rent terms, no internal addresses and no security internals. Show the owner the whole page, and these in particular:
  - the therapists are self-employed, and payments go to their own Stripe accounts (direct charges);
  - what the Hub replaced: Jane online booking with no payment at booking, manual phone payments, the Kendlebell PDF and 7-page document, the shared admin key, and the Mailchimp sync that ignored consent;
  - the module map, the architecture (the services by name: Cliniko, Stripe, Twilio, Resend, MailerLite, Upstash Redis, Postgres) and the shipping timeline;
  - the four deep dives, including the 4 November fix and the refund bug and repair of older records;
  - staff sign in with passkeys and approved computers (described at a high level only);
  - the story of the therapists' feedback that led to the dropdowns.
- [ ] **Tools the Hub was weighed against.** A waitlist add-on quoted at €150–200 a month, Vaoucher, HR Locker and ClinicExec. These sit behind the same `approvals.bodymedMetrics` switch, with a TODO: confirm with the owner which subscriptions were actually dropped, and correct the line in `content/hub.json` (`replaced.pending`) before switching it on.
- [ ] **The launch figures.** Set `approvals.bodymedMetrics` to `true` once the owner agrees. That one switch publishes all of these at once:
  - the headline figure in the home page's BodyMed Hub band, under the Role / Client / Live since / Stack sheet: 14.5% of appointments paid in advance in the first 10 days, up from 0%;
  - the BodyMed highlight on the home page ("Moved payment from the end of the appointment to booking time…");
  - the Results block on the BodyMed Hub page, and the tools it was weighed against (above);
  - the two CV lines ("Built a pay-at-booking system… 0% to 14.5%" and "Moved 90% of the clinic's new online bookings…"). The CV has been checked with them in: one page, 93% full.
- [ ] **Not to be published** (the sample is too small): changes in total appointments, no-shows, late cancellations or fees. See `docs/project-followups.md` for the re-run in January 2027.
- [ ] **A quote**, if the owner is willing: one or two sentences, with name and role, and their permission. It goes in `testimonials` with `"permission": true` and appears on the home page and in the case study.

## To confirm yourself

- [ ] **The therapists' reaction to the dropdowns.** The dropdown version of the patient booking site went live on 12 November 2026. Once you know how the therapists found it, add a sentence to the BodyMed highlight in `resume.json` and to the reflection in `content/hub.json`, then delete both TODOs.

## Testimonials

- [ ] One to three short quotes, each with name, role and company, used with permission. Besides the BodyMed owner: a therapist or receptionist who uses the hub, or the DEME client. The section is hidden until at least one exists.

## Portrait

- [ ] The high-resolution original, ideally re-shot (window light, plain wall, eye level). Needed at 4:5 for `/about` and 1:1 for the links page. The current file is 240 × 240 px, so it is shown small on About and only appears elsewhere on the links page.

## Optional

- [ ] **Leaving Certificate points**, if you want them shown.
- [ ] **A fourth Jarvis image.** `src/assets/work/jarvis-ai-insight.png` is in the repo but not used: the case study already has three screenshots, and a fourth crowded it.

## Pictures

- [ ] **The BodyMed Hub tour and hero** are captured from the public demo (fictional clinic) with `node scripts/capture-work.mjs hub`: `hub-*.png` at desktop size and `hub-*-mobile.png` on a phone. The demo still shows the older card-based treatment picker; the page says the live site uses dropdowns. Once the demo is updated, re-run the capture.
- [ ] **The walkthrough video** on the BodyMed Hub page (`public/media/hub-walkthrough.webm` and `.mp4`, about 26 seconds, 0.7–0.8 MB each) is recorded from the demo with `node scripts/record-hub.mjs`. It shows the waitlist at work (offers sent, one booked) and never the demo's "texts are switched off" notice. Re-record it when the demo changes, and watch the waitlist part before committing.
- [ ] **PulsePay's picture** (`pulsepay.png`) is the public demo's first screen: a fictional clinic and five made-up therapists. The real PulsePay is private and is never linked or shown.

- [ ] **The three phone screenshots in the clinic band** still show the older card-based booking screens. To update them, replace these files in `src/assets/work/` with new phone screenshots of the same three steps. Nothing else needs to change: the frame crops each image from the top, and the alt text only names the step.
  - `clinic-step-treatment.png` (choose a treatment)
  - `clinic-step-practitioner.png` (choose a practitioner)
  - `clinic-booking-phone.png` (choose a time)
- [ ] **Phone crops.** A file named `NAME-mobile.png` beside `NAME.png` is shown instead of it on screens under 640 px. Today there is one: `jarvis-dashboard-approve-mobile.png`, the Ask Jarvis panel cut from the dashboard screenshot. If you replace the dashboard screenshot, run `node scripts/crop-work.mjs` and check the crop still frames the panel (the region is set in that script).
- [ ] **More projects now has a screenshot per project**, captured from the live sites on 12 November 2026: `designroom.png` (demo mode), `house-prices.png`, `deme-housepainting.png`. Their alt text is in `resume.json` (`imageAlt`); correct it if anything reads wrong. Re-capture with `node scripts/capture-work.mjs`.

## Before launch, not blocking the build

- [ ] **Domain.** The site is at `cianmccaul.vercel.app` until you buy one. Step by step, including email and keeping the QR code working: `docs/launch.md`.
- [ ] **Email.** Once the domain exists, Cloudflare Email Routing (`hello@…` to your Outlook), then change `basics.email`: `docs/launch.md`, section B. Until then the site shows the Outlook address.
- [ ] **LinkedIn.** Paste the sections of `docs/linkedin.md` (generated from `resume.json` by `npm run linkedin`), so the profile matches the site exactly. Leave the line marked Pending approval off until the owner signs off.

## Please confirm

Wording I tidied or chose. Correct anything that's off.

- [ ] **Bio.** Now 185 words. The new last paragraph is from your notes; the second paragraph now ends with the lesson from the therapists' feedback.
- [ ] **CV wording** is shorter than the site in places, to keep one page: the BodyMed description, the dropdown bullet, the second Rugbytots bullet ("Work with parents…") and the three Transition Year lines.
- [ ] **Rugbytots on the CV** is one entry: "Head Coach (previously Assistant Coach)", Nov 2023 – Present. The site shows both titles with their own dates.
- [ ] **Graduation** shows as "Graduating Apr 2029". Education still reads "2025–2029", years only, to match the rows below it.
