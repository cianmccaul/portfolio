# Cian McCaul's portfolio

Live at [cianmccaul.vercel.app](https://cianmccaul.vercel.app). The links page behind the QR code on my business card is [/links/](https://cianmccaul.vercel.app/links/).

A fully static site, generated from one data file. There is no server, no CMS and no client-side framework: each page ships a few hundred bytes of JavaScript, for the copy-email button.

## Changing the content

Every fact on the site lives in [`content/resume.json`](content/resume.json). The three case studies are the MDX files in [`content/work/`](content/work). Edit, commit and push; the site, the CV page, the PDF, the structured data and the social images all rebuild from the same source.

- The data is checked against a schema at build time ([`src/lib/resume.ts`](src/lib/resume.ts)). A malformed date or a project without an exact repo link fails the build.
- Wording that changes with time is computed from dates, never typed: "Present", "Year 2 of 4", "Graduating 2029", "Available Jan–Sep 2028" ([`src/lib/dates.ts`](src/lib/dates.ts)).
- Anything not written yet is marked `TODO`. Draft builds show these in amber boxes; production leaves them out, and they never print. `npm run todos` lists them, and [`docs/todo-content.md`](docs/todo-content.md) explains each one.

## The CV

[`/cv/`](https://cianmccaul.vercel.app/cv/) is an ordinary page with a print stylesheet. `npm run cv` prints it to `public/Cian-McCaul-CV.pdf` with Playwright and then checks the result: exactly one A4 page, text that can be extracted (which is what applicant tracking systems do), and no TODOs.

On `main`, CI regenerates the PDF and commits it whenever the CV's text has changed, so you never have to run this by hand.

## Running it

Needs Node 22 or later.

```
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run check      # type-check
npm test           # unit tests for the date logic
npm run cv         # print /cv/ to a one-page PDF and check it (after a build)
npm run todos      # what content is still missing
```

`SHOW_TODOS=false npm run build` builds exactly what production will show.

## How it's built

| Part | Choice |
| --- | --- |
| Framework | [Astro](https://astro.build), static output |
| Styling | Tailwind CSS 4, with its defaults switched off and replaced by the tokens in [`src/styles/tokens.css`](src/styles/tokens.css) |
| Type | Inter Variable, self-hosted: one 48 KB file, subset by [`scripts/subset-font.sh`](scripts/subset-font.sh) |
| Case studies | MDX, with code excerpts highlighted by Shiki in the site's own three tones |
| Images | AVIF and WebP generated at build time; screenshots captured by [`scripts/capture-work.mjs`](scripts/capture-work.mjs) |
| Social images | One per page, drawn with Satori at build time |
| CV | The `/cv/` page, printed to PDF by Playwright and checked |
| Hosting | Vercel for now; moving to Cloudflare with the custom domain |

The design system is deliberately small: one type scale, one spacing scale, a 12-step neutral and a single teal accent, in light and dark. A gap, size or colour that is not in the token file does not exist as a class, so nothing off-system can creep in.

```
content/resume.json     every fact on the site
content/work/           the three case studies
src/lib/                schema, date-derived wording, structured data, social images
src/styles/             design tokens and base styles
src/components/         one component per page section
src/pages/              /, /work/…, /about/, /cv/, /colophon/, /links/ and the 404
docs/                   the research report, build spec and follow-up lists
```

The plan and the reasoning behind it are in [`docs/master-report.md`](docs/master-report.md) and [`docs/build-spec.md`](docs/build-spec.md).

## Parked ideas

New ideas wait here until the next yearly refresh, so the design can stay frozen in between.

- None yet.
