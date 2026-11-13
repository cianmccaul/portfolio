# Consistency audit, 13 November 2026

Every page of the production build (and the draft build), the CV PDF's text, each page's JSON-LD and meta tags, the social image cards and /links, checked against `content/resume.json`, `content/hub.json`, the two remaining case studies, the demo repos' READMEs and Cian's messages.

## Fixed

| # | Where | Was | Now |
| --- | --- | --- | --- |
| 1 | Colophon, Colour | "one dark band on the home page for the clinic platform" | The band belongs to BodyMed Hub, and is on its case study too. |
| 2 | Colophon, Motion | Said the things that move by themselves each do it once | Lists the Hub walkthrough, which loops on wide screens and has a pause button. |
| 3 | /links | The live booking site was titled "Clinic booking system" | Titled with the project's name, BodyMed Hub. |
| 4 | Hub module map | Machine-clash prevention: "never double-booked" | As the demo's architecture notes say it: the Hub never double-books the machines, and clashes made straight in the diary are caught. |
| 5 | Home, Experience | Three separate "Work experience · 2022–23" rows | One Transition Year entry, grouped as on the CV. |
| 6 | Home, proof strip | Repeated the band's 438 tests and 90 API routes | Different facts, worked out from resume.json. |
| 7 | resume.json | Unused figures still in `metrics` (142 demo tests, 37, 15 min, and the Hub's three) that nothing showed but that could come back | Removed. Only the two approval-gated figures remain. |
| 8 | 404 page | Meta description "This page doesn’t exist." (too short for a search result) | A full sentence. Found by the launch check. |

The launch check now guards the names and figures that drifted before: "clinic platform" on any page, links to `/work/clinic-platform`, and the Hub's test and API-route counts disagreeing between `hub.json` and `resume.json`.

## Checked and consistent

| Fact | Value | Where it appears |
| --- | --- | --- |
| BodyMed Hub tests | 438 | Home band, Hub hero, Experience, CV, LinkedIn |
| BodyMed Hub API routes / scheduled jobs | 90 / 9 | Home band, Hub hero, Experience, CV; the diagram lists 9 jobs |
| Email triage tests | 37 | Home, triage case study, CV |
| Clinic chatbot tests | 35 | Home |
| PulsePay demo tests | 122 | Home |
| Hub launch | 30 October 2026 ("October 2026" in the one-line summaries) | Home band, Hub hero and Results, timeline, Experience, CV |
| Dropdown menu live | 12 November 2026 | Hub module map and timeline, Experience |
| Payment kept when a slot is taken | 3 November 2026 | Hub deep dive and reflection |
| Crash-mid-booking fix | 4 November 2026 | Hub deep dive |
| Graduation | April 2029 ("Apr 2029") | Hero spec sheet, About, Education, CV ("2025–2029 (expected)") |
| First Class Honours | First year, 2025–26 | Proof strip, Education, CV |
| BodyMed role | Systems and operations, Aug 2024 – Present | Experience, CV, LinkedIn |
| Rugbytots | Head Coach since Jan 2026, Assistant Coach Nov 2023 – Dec 2025 | Experience, CV ("previously Assistant Coach"), About, LinkedIn |
| Statuses | Hub: Live (20 modules Live, PDF invoices Built). Email triage: prototype | Hub page; triage everywhere it appears, including the CV |
| AI-tools wording | "Built … with AI coding tools" | Experience, CV, Hub "How I built it", About |
| JSON-LD | ProfilePage/Person, Article, BreadcrumbList | Valid, and the launch check validates them on every build |

## Claims I couldn't trace (still on the site, waiting for your answer)

| # | Claim | Where | Why it's here |
| --- | --- | --- | --- |
| 1 | **6 live demos** | Home proof strip | You wrote "5 live demos". resume.json has six projects with a public demo link: BodyMed Hub, AI email triage, Clinic chatbot, PulsePay, Jarvis and DesignRoom. The strip counts them from the data, so it says 6. If one shouldn't count, remove its `demo` link or tell me which, and it updates. |
| 2 | "I build with AI coding tools. I own the product decisions, the architecture, reviewing and testing every change, and running it in production." | About | Written from the Hub's "How I built it" line, at your request, but it reads as true of all the work, including older projects such as the Leaving Cert house-prices site. Confirm, or I'll scope it to "My recent work". |
| 3 | "Checking every 5 minutes means a freed time can wait a few minutes before anyone hears about it" | Hub, waitlist trade-off | My inference from the 5-minute check, not a stated fact. |
| 4 | "A patient can pay for a time that someone else takes a moment later, so the Hub has to put that right by itself." | Hub, double-booking trade-off | My summary of why rebook-or-refund exists; it follows from the design but isn't in your notes word for word. |
