# Project follow-ups

Recommendations for the other repositories and deployments. Nothing here has been changed: this session only edits `cianmccaul/portfolio`. Findings are from a read-only look on 11 November 2026 (public READMEs, raw files, response headers and the GitHub search API).

Ordered by how much damage each could do if left.

## 1. Audit the public `clinic-booking` repo for secrets and BodyMed data

`cianmccaul/clinic-booking` is public, was last pushed on 22 September 2026 and is not one of the seven projects on the site. It has no README, so I could not tell what is in it. Given the name, treat it as possibly holding an early copy of the real clinic system until proven otherwise.

- [ ] Look for committed secrets: `.env*` files and any Stripe, Cliniko, Twilio, Resend, Upstash or Supabase keys, webhook signing secrets, and passwords in config or test fixtures.
- [ ] Scan the **whole history**, not only the current files. A key deleted in a later commit is still public. `gitleaks detect --source . --log-opts="--all"` or `trufflehog git file://.` both do this.
- [ ] Look for real clinic data: patient or staff names, emails, phone numbers, therapist payment account IDs, real prices or internal notes.
- [ ] If anything turns up: **rotate the key first**, then deal with the repo. Making it private does not un-leak a key.
- [ ] If the repo has been replaced by `clinic-platform-demo`, make it private or archive it. If it should stay public, give it a README that says what it is.

## 2. BodyMed's booking system is served by Vercel: move it to Pro

`book.bodymed.ie` returns `server: Vercel`. I can't see which plan it is on. If it is on Hobby:

- Hobby is for non-commercial personal use only. A clinic taking bookings and card payments is commercial use.
- Going over a Hobby limit can pause the project, in some cases for 30 days. For this system that means patients can't book or pay.

Recommended:

- [ ] Put the production project on a **Vercel Pro** team that the clinic owns and pays for, with you added as a member. The clinic should own the billing, the domain and the project, not your personal account.
- [ ] Confirm the same for the clinic's other deployments (`clinic-payment-system`, `bodymed-tools`).
- [ ] The same clause applies to **DEME House Painting** (`deme-housepainting.vercel.app`, a real business with a contact-form function) and arguably to **CM Studio DesignRoom** (it collects client briefs). Move them to the client's own account, to Pro, or to Cloudflare.
- [ ] The demos (`cian-clinic-demo`, `cian-email-triage`, `physio-chatbot`, `irish-house-prices`) are personal and fine on Hobby.

## 3. Clinic chatbot: add an urgent-symptom path, and describe it honestly

`physio-chatbot/app.py` is 115 lines of rules. A search of it for red-flag terms (chest pain, numbness, emergency, 999/112), rate limiting and a kill switch found none.

- [ ] **Urgent-symptom safety path.** Typed messages are matched to a therapist by body part. Someone who types "numb leg and can't control my bladder" or "chest pain" should not be offered a booking link. Check typed input against a red-flag list first and reply with "contact your GP or emergency department" before anything else. `email-triage-demo/src/lib/triage/rules.ts` already has this list and logic: reuse it, and add tests for each red flag.
- [ ] **Describe it as rule-based everywhere.** The README already says "plain rules, not AI", which is the right call and a good story. Match it in the repo description (currently empty) and on the demo page, which says "Ask our assistant". The portfolio card now says "rule-based on purpose".
- [ ] **Rate limiting.** `/ask-text` and `/handoff` accept unlimited requests. In the real clinic `/handoff` sends email, so limit it per IP and validate harder.
- [ ] **Kill switch.** One environment variable that swaps the widget for "please call reception", so staff can turn it off without a deploy. The clinic platform already has this pattern.
- [ ] **Canonical URL.** Both `physio-chatbot.vercel.app` and `cian-physio-chatbot.vercel.app` serve the app. The portfolio links to `physio-chatbot.vercel.app`. Update the README and the repo's homepage field to match.

## 4. CM Studio DesignRoom: make it safe to hand to a recruiter

- [ ] **Demo-safe mode.** A recruiter clicking through should not write a row to Supabase, upload to the `moodboards` bucket or trigger EmailJS. Add `?demo=1` (and use it in the portfolio link) that runs the whole flow but stops before `js/submit.js` sends anything, with a visible "Demo: nothing is sent" note.
- [ ] **Skip the intro for recruiter links.** `js/intro.js` plays before the showroom. Add a `?skip-intro` parameter, respect `prefers-reduced-motion`, and remember the choice.
- [ ] The repo's homepage field points to `uf-showroom.vercel.app`. Point it at `cm-studio-designroom.vercel.app`, or retire the old alias.

## 5. Pinned repos: READMEs, CI and metadata

A recruiter is unlikely to open GitHub, but an engineer on the interview loop will. Checked across all seven project repos:

| Repo | Screenshot | Setup steps | Architecture note | Description set | Homepage set |
| --- | --- | --- | --- | --- | --- |
| clinic-platform-demo | No | Yes | Yes (`docs/architecture.md`) | Yes | Yes |
| email-triage-demo | No | Yes | Yes | No | No |
| site-monitor | No | Yes | Yes | No | No |
| physio-chatbot | No | Yes | Brief | No | Yes (old alias) |
| cm-studio-designroom | No | Yes | Yes | No | Yes (old alias) |
| Irish-house-prices | No | Yes | Brief | No | Yes |
| deme-housepainting | No | Yes | Brief | No | Yes (`.vercel.app`, not the domain) |

- [ ] **Add one screenshot to each README**, directly under the first paragraph. `scripts/capture-work.mjs` in this repo shows how the portfolio's own shots were taken.
- [ ] **Fill in the description, homepage and topics** on each repo. Five of seven have no description.
- [ ] **CI on the flagship repos.** I could not confirm any workflow that runs tests. `clinic-platform-demo`, `email-triage-demo`, `physio-chatbot` and `Irish-house-prices` all have test suites: add a GitHub Actions workflow that runs them on every push, and put the badge in the README.
- [ ] **Pin four to six repos** on your profile: the three case studies first.
- [ ] `site-monitor` says `status.json` and `incidents.json` are real data from your sites. Check they name nothing a client would mind being public.

## 6. Smaller items

- [ ] **Email triage demo:** if the deployed demo has a Groq key, confirm `/api/triage` and `/api/learn` are rate-limited and the key has a spend cap. Without a key it falls back to rules, which is safe.
- [ ] **Jarvis has nothing to show.** There is no public demo, so its card on the portfolio has no image. A screenshot of an alert email or a fix pull request, or a 4 to 8 second recording of the dashboard, would give the case study its visual.
- [ ] **The demos still use the purple colour wash** the portfolio has dropped (it shows in the email triage demo). Worth removing there too for consistency.
- [ ] **Links I couldn't reach from my network. Please check by hand:**
  - `https://demehousepainting.com` (the connection failed; `deme-housepainting.vercel.app` works)
  - `https://www.linkedin.com/in/cian-mccaul-7a9b01397` (LinkedIn blocks automated requests)
