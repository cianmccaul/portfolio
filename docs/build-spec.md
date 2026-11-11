# Timeless v1 Portfolio — Build Spec

Nov 10, 2026 · @Cian

## Purpose and principles

Build a portfolio site that helps win internships at Apple, Google, Microsoft and peers, built once over about four weekends, then frozen. It runs for about $12 a year: a domain plus free hosting.

The site has two layers:

- **Core:** layout, typography, content model, CV pipeline, accessibility and performance. Designed to stay unchanged for years.
- **Skin:** glass tokens, background, accent colour and one signature interaction. Kept in one place so a trend refresh takes an afternoon, not a rebuild.

Rules that decide every call below:

1. **Recruiter first.** Name, target role, availability and a CV button are visible within seconds, on a phone.
2. **Content changes never touch code.** Everything editable lives in `content/resume.json` and MDX files.
3. **Nothing that rots.** No live API widgets, no AI chatbot, no young third-party glass libraries, no pages that need regular posting.
4. **Glass on the chrome only.** Navigation, menus and dialogs. Never behind body text, following Apple's own guidance.
5. **Restraint reads as senior.** Motion is short, purposeful and always respects reduced-motion settings.

This spec replaces sections 5–9 of the research report *The 20k Portfolio for About 12 Dollars a Year*. Keep the report as background for the glass techniques, free-tier limits and the pkodes.com teardown.

## Part 1 — Core

The core is a fully static site generated from one data file, so it can run on any free host for years with nothing server-side to break.

### Stack

| Layer | Choice | Why it lasts |
| --- | --- | --- |
| Framework | Next.js App Router with `output: 'export'` (fully static) | Same family as pkodes; static export means no functions, quotas or runtime to maintain |
| Styling | Tailwind CSS v4 + CSS custom properties | Tokens let the skin be swapped without touching components |
| Motion | Motion (Framer Motion) for springs; CSS View Transitions for page changes | View Transitions degrade silently in unsupported browsers |
| Content | `content/resume.json` + MDX case studies, typed with Velite or Content Collections | Plain files in git; no CMS account to lose |
| Fonts | Geist or Inter (OFL), self-hosted via `next/font`, with `system-ui, -apple-system` first so Apple devices render SF | No licence risk, no font CDN |
| Hosting | Vercel Hobby (pure job-seeking site) or Cloudflare Pages | Static output moves between hosts in minutes |
| Domain + email | Cloudflare Registrar + DNS + Email Routing (`hello@yourname.com` → Gmail) | At-cost renewal, free forwarding |
| Analytics | Cloudflare Web Analytics or Vercel Web Analytics | Cookieless, so no consent banner |

No contact form in v1. A visible email with a copy button and a LinkedIn link cover recruiters, and remove API keys, spam handling and a sending quota.

### Data model

Every fact on the site comes from `content/resume.json`, based on the JSON Resume schema with a few extensions. The home page, case-study headers, CV page and PDF all read from it.

```json
{
  "basics": {
    "name": "", "label": "Software Engineering Student",
    "targetRole": "Summer 2027 SWE internship",
    "location": "Dublin, Ireland", "relocate": true,
    "workAuthorization": "EU citizen",
    "graduation": "2028-06", "availableFrom": "2027-05-15",
    "email": "hello@yourname.com", "profiles": []
  },
  "work": [{ "company": "", "position": "", "startDate": "", "endDate": "",
             "highlights": [], "metrics": [], "stack": [], "caseStudy": "slug" }],
  "projects": [{ "name": "", "outcome": "", "stack": [], "repo": "", "live": "",
                 "featured": true, "caseStudy": "slug" }],
  "education": [], "awards": [], "skills": [],
  "testimonials": [{ "quote": "", "name": "", "role": "", "company": "" }]
}
```

Wording that changes with time is computed from dates. A role whose `startDate` is in the future renders as "Incoming"; a past `endDate` renders as a normal past role. No sentence on the site hard-codes "currently" or a year.

### Sitemap

Six routes, all static:

| Route | Purpose |
| --- | --- |
| `/` | Everything a recruiter needs on one page |
| `/work/[slug]` | Case studies for the 3–4 featured projects and roles |
| `/about` | Longer story, photo, life beyond code |
| `/cv` and `/cv.pdf` | Print-ready HTML CV and the generated PDF |
| `/colophon` | How the site is built: stack, glass technique, Lighthouse scores |
| `/404` | A designed not-found page |

Plus generated `sitemap.xml`, `robots.txt` and per-page Open Graph images, all built at build time.

### Home page, top to bottom

1. **Glass nav:** monogram, Work, About, **CV ↓**, ⌘K button, theme toggle. Collapses to a compact bar on phones.
2. **Hero:** name as H1, target role, one-line value proposition, location, graduation date, availability and work authorisation as small chips. Buttons: View work, Download CV, Copy email.
3. **Proof strip:** company names or monochrome logos plus two or three hard numbers. Static, no marquee.
4. **Selected work:** 3–4 large cards, each with one measured outcome, your role and stack tags. Each card morphs into its case study via a View Transition.
5. **Experience:** compact rows, newest first, each with dates, team, one or two outcome bullets and stack tags.
6. **Testimonials:** one to three short quotes from managers or tech leads.
7. **Education and awards:** degree, expected graduation, notable results.
8. **Footer:** large email with copy button, GitHub, LinkedIn, "last updated" date taken from git.

### Case-study template

Each `/work/[slug]` page follows the same structure: header with outcome, role, team size, timeline and links; a three-line TL;DR (problem, what I did, result); context and constraints; key decisions with the alternatives considered; the hardest problem told as a short story; results with numbers; what I would do differently.

### CV pipeline

A GitHub Action runs on every push to `main`: build the site, open `/cv?print=1` in Playwright, save `cv.pdf` with `page.pdf()` in A4, and deploy it with the site. The PDF uses real selectable text, a single column and standard headings (Experience, Education, Projects, Skills) so applicant tracking systems parse it cleanly.

## Employer essentials checklist

The site ships only when every box below is ticked. These are the things recruiters and interviewers at large companies check once they are interested.

**Logistics (in the hero and on the CV)**

- [ ] Target role and season stated plainly, e.g. "Summer 2027 SWE internship"
- [ ] Expected graduation month and year
- [ ] Earliest start date and internship length available
- [ ] Location, willingness to relocate, and work authorisation

**Proof**

- [ ] Every role and featured project has at least one measured outcome (users, latency, time saved, scale)
- [ ] One to three testimonials with name, role and company, used with permission
- [ ] Big-name employers or programmes visible in the first screen

**Code quality**

- [ ] 4–6 pinned GitHub repos, each with a README: what it is, screenshot, how to run it, architecture note
- [ ] Tests and CI on the flagship repos
- [ ] Every live demo link checked and working; remove any that are not
- [ ] The portfolio repo itself is public and clean, as a work sample

**Teamwork and ownership**

- [ ] Each internship entry names the team and shows collaboration: code review, cross-team work, on-call, mentoring or leading
- [ ] At least one case study describes a disagreement or trade-off and how it was resolved

**Confidentiality**

- [ ] No internal system names, unreleased features or exact internal metrics from employers
- [ ] Confidential numbers expressed as relative change or scope ("cut review time \~40%", "used by 6 teams")
- [ ] Any case study about an internship approved by your former manager

**Mobile and consistency**

- [ ] Checked on a real phone, opened from a LinkedIn link: hero, CV download and email all reachable without hunting
- [ ] Name, headline and dates match LinkedIn, GitHub and the PDF CV exactly

## Accessibility, performance and SEO

These are fixed rules, enforced in CI so the site cannot quietly decay.

### Targets

| Area | Target | How it is enforced |
| --- | --- | --- |
| Lighthouse (mobile) | 95+ in all four categories | Lighthouse CI fails the build below this |
| Largest Contentful Paint | ≤ 1.8 s on 4G (Google's "good" is 2.5 s) | Lighthouse CI budget |
| Interaction to Next Paint | ≤ 100 ms ("good" is 200 ms) | Field data from analytics |
| Cumulative Layout Shift | ≤ 0.02 ("good" is 0.1) | Lighthouse CI budget |
| JavaScript on home | ≤ 90 KB gzipped | Bundle size check in CI |
| Fonts | ≤ 2 files, ≤ 80 KB | Bundle size check in CI |
| Third-party requests before interaction | 0 | Manual review |
| Accessibility | WCAG 2.2 AA | axe-core in Playwright on every route |

### Accessibility rules

- One H1 per page, semantic landmarks, skip link as the first focusable element.
- Visible `:focus-visible` rings; `scroll-padding-top` so the sticky nav never hides focused content.
- Tap targets at least 44×44 px, following Apple's guidance (WCAG minimum is 24×24).
- ⌘K palette is a proper dialog: focus trap, Esc to close, focus returns to the trigger, and a visible button to open it.
- Contrast of 4.5:1 for body text, checked over the brightest background the glass can sit on.
- Respect `prefers-reduced-motion`, `prefers-contrast` and `forced-colors`. Respect `prefers-reduced-transparency` and also offer an in-site "Reduce glass" toggle, because Safari does not support that media query.
- Before launch: a manual pass with VoiceOver on iPhone and Mac, and keyboard-only navigation of every page.

### Performance techniques

- Everything pre-rendered; images optimised at build time to AVIF and WebP with accurate `sizes`.
- Videos in case studies as muted `<video>` with a poster and `preload="none"`; YouTube only behind a click-to-load facade.
- Animate only `transform` and `opacity`; at most three blurred glass surfaces visible at once.
- `content-visibility: auto` on below-the-fold sections.

### SEO

- Per-page title, description, canonical URL and build-time Open Graph image.
- JSON-LD `ProfilePage` with a `Person` entity (name, job title, alumniOf, sameAs links to GitHub and LinkedIn); `BreadcrumbList` on case studies.
- `sitemap.xml` and `robots.txt` generated at build.
- Full name as the About page H1, so searches for your name land on your site.

## Part 2 — Skin

The skin lives in two files: `styles/skin.css` (tokens and glass classes) and `components/Backdrop.tsx` (the background). Components only ever use the token names, so restyling the whole site means editing these two files.

### What belongs to the skin

| Element | v1 choice | Where it lives |
| --- | --- | --- |
| Glass material | Frosted blur with dark rim and bright top highlight, matching the iOS 27 direction (more diffuse, more legible) | `skin.css` tokens |
| Background | Slow aurora of 3–5 blurred colour blobs plus a 3–5% grain layer; frozen under reduced motion | `Backdrop.tsx` |
| Accent colour | One hue, used for links, focus rings and the active nav item | `--accent` token |
| Signature interaction | Project card morphs into its case-study header (View Transition) | One CSS rule + `view-transition-name` |
| Theme | Light, dark and system | `.dark` token overrides |

The glass appears on four components only: nav bar, ⌘K palette, theme and CV buttons, and dialogs. Cards, text sections and the CV page never use it.

### Starting tokens

These are starting values to tune by eye. Apple does not publish CSS equivalents.

```css
:root {
  --glass-blur: 16px;          /* 8px chips, 24px dialogs */
  --glass-saturate: 180%;
  --glass-fill: rgb(255 255 255 / 0.55);
  --glass-fill-solid: rgb(255 255 255 / 0.92);  /* fallback */
  --glass-rim: inset 0 0 0 1px rgb(255 255 255 / 0.35);
  --glass-edge: 0 0 0 0.5px rgb(0 0 0 / 0.18);
  --glass-specular: inset 0 1px 0 rgb(255 255 255 / 0.65);
  --glass-shadow: 0 8px 32px rgb(0 0 0 / 0.12);
  --accent: #0a84ff;
  --r-control: 12px; --r-card: 20px; --r-sheet: 28px;
  --spring: linear(0, 0.35 12%, 0.82 28%, 1.02 44%, 1.01 60%, 1);
}
.dark {
  --glass-fill: rgb(28 28 30 / 0.55);
  --glass-fill-solid: rgb(28 28 30 / 0.94);
  --glass-rim: inset 0 0 0 1px rgb(255 255 255 / 0.10);
  --glass-specular: inset 0 1px 0 rgb(255 255 255 / 0.18);
}
.glass {
  background: var(--glass-fill-solid);
  box-shadow: var(--glass-rim), var(--glass-edge), var(--glass-specular), var(--glass-shadow);
}
@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .glass {
    background: var(--glass-fill);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: var(--glass-fill-solid); backdrop-filter: none; -webkit-backdrop-filter: none; }
}
[data-reduce-glass] .glass { background: var(--glass-fill-solid); backdrop-filter: none; -webkit-backdrop-filter: none; }
```

### Fallback order

1. **Solid:** near-opaque fill with rim and shadow. The default under the reduce-glass toggle, reduced-transparency setting and unsupported browsers. It must look finished on its own.
2. **Frosted:** `backdrop-filter` blur and saturate. The main design, supported in all current browsers.
3. **Refraction (optional, Chromium only):** an SVG displacement filter on the nav only, behind `@supports (backdrop-filter: url(#x))`. Treat it as a bonus; Safari and Firefox never see it.

Write the glass in hand-rolled CSS rather than a library such as `liquid-glass-react`. It is about 60 lines, has no dependency to go stale and works the same in every browser.

## Keeping it current

There are two kinds of upkeep: a five-minute content update whenever something changes, and one afternoon a year for the skin.

### Content update (about 5 minutes)

When you land an internship, finish a project or get a result:

1. Edit `content/resume.json` (and the MDX file, for a new case study).
2. Commit and push to `main`.
3. CI rebuilds the site and regenerates `cv.pdf`; the home page, CV page and PDF all update together.
4. Update LinkedIn with the same wording.

### Annual skin refresh (one afternoon, after WWDC in June)

1. Watch Apple's design session and skim the updated Human Interface Guidelines on materials.
2. Adjust the tokens in `skin.css`: blur, fill opacity, rim, specular highlight, corner radii.
3. Optionally swap the accent colour or the aurora palette in `Backdrop.tsx`.
4. Run the contrast and Lighthouse checks; ship only if they still pass.

Do not touch the core during a refresh. If a refresh needs a component change, the token set is missing something: add the token, then use it.

### Twice-yearly health check (15 minutes)

- [ ] Click every external link and live demo
- [ ] Run `npm outdated`; apply security updates only
- [ ] Confirm the domain auto-renew and payment card are still valid

## Cut list

These items from the research report are left out of v1 because they break over time, need regular attention, or cost more time than they return for big-tech internships.

| Dropped | Reason | Replace with |
| --- | --- | --- |
| Live Spotify / GitHub / WakaTime strip | API tokens expire and APIs change | Nothing; "last updated" date from git |
| "Ask my CV" AI chatbot | Free-tier quotas keep changing; risk of wrong answers about you | A clear CV and case studies |
| Blog / writing section | Looks abandoned if not updated | Add later only if you will post at least quarterly |
| /now and /uses pages | Need monthly upkeep | Fold anything worth saying into /about |
| Contact form (Resend + Turnstile) | API keys, spam handling, sending quota | Email with copy button, via Cloudflare Email Routing |
| View counters and kudos (Upstash) | Database dependency for little value | Nothing |
| Giscus comments and guestbook | Moderation and GitHub dependency | Nothing |
| WebGL glass lens / playground page | Heavy, Chromium-dependent, extra maintenance | The CSS glass system and colophon write-up |
| `liquid-glass-react` and similar libraries | Young projects that may be abandoned | Hand-rolled CSS glass |
| Marquee proof strip | Motion and accessibility overhead | Static proof strip |
| Opt-in UI sounds, custom cursor, preloader | Gimmicks that slow the recruiter skim | Nothing |
| Separate /experience timeline page | Duplicates the home page and CV | Experience section on home + `/cv` |

Kept as delighters because they cost nothing to maintain: ⌘K command palette, View Transitions, light and dark themes, a designed 404 page and a short `console.log` greeting for engineers who open dev tools.

## Build plan and design freeze

Content comes first because writing the case studies is the slowest part and decides what the design must hold.

&#91;embedded content: build plan · 4 weekends, 1 gate\]

The design is frozen when all of these are true:

- Every box in the employer essentials checklist is ticked.
- Lighthouse mobile scores 95+ in all four categories, enforced in CI.
- axe reports no violations on any route; VoiceOver and keyboard passes are done.
- The site has been checked on a real phone, opened from LinkedIn.
- Two people have reviewed it: one engineer, one non-technical reader.

After the freeze, changes go through `resume.json` or the annual skin refresh only. New feature ideas go in a list in the repo README and wait for the next June refresh.
