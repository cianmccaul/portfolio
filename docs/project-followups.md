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

## 0. Merge and deploy before this portfolio goes live

The portfolio now describes changes that exist only on unmerged branches. Checked on 12 November 2026: `main` and the deployed sites don't have them yet.

- [ ] **`physio-chatbot`, branch `claude/intelligent-bell-4dvkw8`:** the urgent-symptom safety path and its tests. The live demo today answers "I have chest pain" with "Sorry, I'm not quite sure what you mean". The portfolio card says urgent symptoms get "call 112 or 999, or your GP", so this must be live first.
- [ ] **`cm-studio-designroom`, branch `claude/intelligent-bell-4dvkw8`:** demo mode (`?demo=1`). The deployed `js/submit.js` has no demo mode yet, so today the portfolio's demo link would save and email a real brief.
- [ ] **`email-triage-demo`, branch `claude/intelligent-bell-4dvkw8`:** the README that says the live demo sorts with the built-in rules. The portfolio already says so; the README on `main` doesn't yet.

## 3. Clinic chatbot: add an urgent-symptom path, and describe it honestly

`physio-chatbot/app.py` on `main` is 115 lines of rules, with no red-flag terms, rate limiting or kill switch.

- [x] **Urgent-symptom safety path.** Done on `claude/intelligent-bell-4dvkw8` (see item 0): a word list checked before every other rule, replying "call 112 or 999, or your GP", with 35 tests.
- [ ] **Describe it as rule-based everywhere.** The README already says "plain rules, not AI", which is the right call and a good story. Match it in the repo description (currently empty) and on the demo page, which says "Ask our assistant". The portfolio card now says "rule-based on purpose".
- [ ] **Rate limiting.** `/ask-text` and `/handoff` accept unlimited requests. In the real clinic `/handoff` sends email, so limit it per IP and validate harder.
- [ ] **Kill switch.** One environment variable that swaps the widget for "please call reception", so staff can turn it off without a deploy. The clinic platform already has this pattern.
- [ ] **Canonical URL.** Both `physio-chatbot.vercel.app` and `cian-physio-chatbot.vercel.app` serve the app. The portfolio links to `physio-chatbot.vercel.app`. Update the README and the repo's homepage field to match.

## 4. CM Studio DesignRoom: make it safe to hand to a recruiter

- [x] **Demo-safe mode.** Done on `claude/intelligent-bell-4dvkw8` (see item 0): `?demo=1` runs the whole flow but uploads, saves and emails nothing, with a "Demo" badge. The portfolio links it.
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

## 6. Email triage: “Send all 12” needs two clicks

- [ ] In `email-triage-demo`, pressing **Send all 12** on the test bench only shows the results table on the second click. Find out why (likely the results render from state that is set after the first run finishes, or the queue isn’t awaited) and add a test that one click shows all 12 results. The portfolio describes this bench, so a recruiter may try it.

## 7. BodyMed: re-run the before/after analysis in early January 2027

- [ ] The published figures cover only the first 10 days after launch on 30 October 2026, against a matched window before it. No-shows, late cancellations, fees and total appointments were left out because the sample was too small.
- [ ] In early January 2027, with about 8 weeks of data, re-run the same matched-window comparison for no-shows and late cancellations. Publish only what the owner approves, as percentages.

## 8. Clinic platform demo: update to the dropdown booking flow

- [ ] The live BodyMed patient booking site has used dropdowns for treatment and practitioner since 12 November 2026. `clinic-platform-demo` still shows the older card-based selection. Update the demo to match, so the case study, its screenshots and the demo agree. Then re-run `node scripts/capture-work.mjs hub` and `node scripts/record-hub.mjs` here, and re-capture the `clinic-booking-*` and `clinic-step-*` phone screenshots, which also show cards. Consider renaming the repo to `bodymed-hub-demo` to match the case study (the site links to whatever `repo` says in `resume.json`).

## 9. DEME House Painting: switch to the new domain

- [ ] Switch DEME link to https://demehousepainting.ie once it's connected in Vercel. The portfolio links `https://deme-housepainting.vercel.app` until then: change `live` on the `deme-housepainting` project in `resume.json`.
- [ ] In the `deme-housepainting` repo, the README still says the live site is `demehousepainting.com`. Point it, and the repo's homepage field, at the new domain at the same time.

## 10. Smaller items

- [ ] **Email triage demo:** if the deployed demo has a Groq key, confirm `/api/triage` and `/api/learn` are rate-limited and the key has a spend cap. Without a key it falls back to rules, which is safe.
- [ ] **The demos still use the purple colour wash** the portfolio has dropped (it shows in the email triage demo). Worth removing there too for consistency.
- [ ] **LinkedIn** (`https://www.linkedin.com/in/cian-mccaul-7a9b01397`) blocks automated requests, so the link check can't verify it. Check it by hand now and then.

## pulsepay-demo

- [ ] **Security wording in the README.** The real PulsePay now has server-side sign-in and a protected API. The README's "What's real vs simulated" table still describes it as "A sign-in screen" (Login row) and mentions "the password screen" (Look and layout row), which reads like a client-side password. Change the Login row to "Server-side sign-in" and the Storage row to "A protected API on Vercel with Blob storage", and drop "the password screen" from the stylesheet note. The portfolio itself only says the real tool is private, and needs no change.
- [ ] The README says "my rent and payout tool" and the portfolio says the real tool is private. Keep both true: never link the real PulsePay, and keep every therapist, deal and figure in the demo fictional.
