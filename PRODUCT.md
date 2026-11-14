# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: recruiters and hiring managers filling a DCU INTRA work placement, January–August 2028** (available January–September 2028, open to relocating anywhere, EU citizen). That means any good software employer, from Irish companies to big tech's Dublin offices. Earlier planning docs aimed only at Apple, Google and Microsoft for Summer 2027; that framing is out of date.

They arrive from a CV, LinkedIn, an application or the QR code on Cian's business card (`/links/`). They are usually skimming, often on a phone, and want to know quickly who Cian is, when Cian is available and whether Cian has shipped real work. They need a one-click way to the CV.

Engineers who interview Cian are a second audience: they read the case studies in depth and check the code.

## Product Purpose

A static personal site for Cian McCaul, a Computer Science student at DCU (BSc, 2025–2029, First Class Honours in first year). Its job is to win Cian an internship placement. It succeeds when a recruiter decides to shortlist Cian or get in touch, and when an interviewer finds the case studies hold up under questioning.

Routes: `/` (everything a recruiter needs on one page), `/work/[slug]` (case studies: BodyMed Hub, AI email triage, Jarvis), `/about`, `/cv` plus `/cv.pdf`, `/colophon`, `/links` and a designed 404.

## Positioning

**Cian builds production software that a real business runs on.** BodyMed Healthcare, a clinic in Clontarf, runs its booking, payments and staff work on the BodyMed Hub that Cian built. It has measured results: online bookings and appointments paid in advance in the first 10 days after launch. The other projects back this claim up; none of them replaces it as the lead.

Headline in the data: "I build software that runs real businesses."

## Operating Context

- Recruiters check the logistics first: role, availability window, location, work authorisation. Then evidence, then the CV.
- The CV is an ordinary page that prints to a one-page A4 PDF. Applicant tracking systems need to be able to extract its text. CI regenerates the PDF whenever the CV's text changes.
- `/links/` is the target of a QR code printed on business cards, so its address must never change.
- Social shares get an image generated for each page.

## Capabilities and Constraints

- **Stack:** Astro, static output; Tailwind CSS 4 limited to the project's own tokens; MDX case studies; self-hosted Inter Variable; hosted on Vercel Hobby (personal, non-commercial). No server, no CMS, no client-side framework. Each page ships only a few hundred bytes of JavaScript.
- **One source of truth:** every fact lives in `content/resume.json` (checked against a schema at build time) and in `content/work/*.mdx`. Content changes never touch code.
- **Wording that changes with time is computed from dates, never typed** ("Present", "Year 2 of 4", availability windows).
- **Content not written yet is marked `TODO`:** shown in draft builds, absent from production and print.
- **Approval switches:** facts that need sign-off (`approvals` in resume.json, e.g. `bodymedMetrics`, `awardsPhoto`) stay out of production and the PDF until the switch is `true`.
- **Design freeze:** the design stays frozen between yearly refreshes. New ideas wait in the README's "Parked ideas" list, so between refreshes only content changes.
- **Client confidentiality:** the BodyMed Hub's code is private. Diagrams of it have names removed. Public demos run as a fictional clinic, Northbank Physio, with made-up patients and data. Never show revenue figures, patient data, therapist names, rent terms, internal addresses or security internals. BodyMed figures appear only once the owner has approved them.
- **Glass on the chrome only:** the nav pill, the ⌘K palette, the appearance panel and toasts. Never behind body text. It falls back to solid when Reduce glass is on (an in-site toggle), when the system asks for reduced transparency or more contrast, and in forced-colours mode. See `docs/glass.md`.
- **Nothing that rots:** no live API widgets, no chatbot, no pages that need regular posting.

## Brand Commitments

- Name: Cian McCaul. Monogram used for the icons and social cards (`src/lib/monogram.ts`).
- Voice: first person, plain and specific, Irish/British spelling, typographic quotes and dashes. Results are stated as measured facts with their method ("first 10 days after launch against a matched window before it"). Personality comes through in the copy, not in effects.
- Honest about how the work is made: "I build with AI coding tools. I own the product decisions, the architecture, reviewing and testing every change, and running it in production."
- Restraint is part of the identity (`docs/master-report.md`, `docs/build-spec.md`): precise and calm, never "too slick".

## Evidence on Hand

- **BodyMed Hub:** case study at `src/pages/work/bodymed-hub.astro`; live booking at book.bodymed.ie; public demo repo `cianmccaul/clinic-platform-demo`. Two metrics wait for owner approval: 14.5% of appointments paid in advance in the first 10 days, up from 0%; 90% of new online bookings (43 of 48) came through the new system. There is also a Graphify map of the code (3,306 parts, 11,681 connections, names removed).
- **Clinic suite:** four tools with Northbank Physio demos: the Hub, the clinic chatbot (35 tests, urgent-symptom rule checked first), PulsePay (rent statements for self-employed therapists), and AI email triage.
- **Case studies:** `content/work/email-triage.mdx`, `content/work/jarvis.mdx`.
- **Experience:** BodyMed Healthcare (since August 2024); Rugbytots head coach; Transition Year placements at SAP and Progress Systems; the school IT team.
- **Awards:** FIRST LEGO League hackathon at DCU, as lead coder (November 2026); a photo of it waits for approval.
- **Photography:** a real portrait and personal photos (Derry, Budapest) in `src/assets`.
- **Absent, never to be invented:** testimonials (the list is empty), employer logos, client quotes, any metric not in resume.json.

## Product Principles

1. **Recruiter first.** Name, role, availability and the CV are reachable within seconds, on a phone.
2. **Evidence before effects.** Every claim is specific, measured or checkable, and links to the work.
3. **The data is the authority.** Every fact on a page comes from resume.json or the MDX, never from copy hard-coded into a page.
4. **Built once, then left to run.** Choose what will still work in years without maintenance. Between refreshes, only content changes.
5. **Confidentiality is a feature.** Showing real client work responsibly is part of what proves Cian can be trusted with production software.

## Accessibility & Inclusion

WCAG 2.2 AA on every route (axe-core in Playwright). Tap targets of at least 44×44 px. The site respects `prefers-reduced-motion`, `prefers-contrast`, `forced-colors` and `prefers-reduced-transparency`, plus the in-site Reduce glass toggle, since Safari lacks that media query. Focus rings are designed and visible in both themes.
