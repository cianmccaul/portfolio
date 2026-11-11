# The $20k-Looking Portfolio: Master Report and Build Outline (November 2026)

A portfolio looks expensive when it shows restraint, consistency and finished edge states. Effects and budget have little to do with it. Award juries, credibility research and the design engineers recruiters admire all reward the same things: one deliberate type system, a strict spacing scale, a tight palette, real photography and real numbers, motion under 300 ms that serves the content, and polish on states most people never design (focus, 404, print, reduced motion, slow networks). For a Dublin student aiming at Apple, Google and Microsoft internships, this report keeps the agreed plan: a timeless static core plus a swappable "Liquid Glass" skin, hosted free. Two things change as of November 2026. Host on Cloudflare rather than Vercel Hobby. And keep glass on controls only, because "glass everywhere" is now one of the recognised tells of a cheap, AI-generated site.

## TL;DR

- **"Expensive" is a stack of craft signals you can copy for free.** Visual appeal is judged in about 50 ms (Lindgaard et al., 2006). In Stanford's study of 2,684 people judging credibility, "design look" came up in 46.1% of comments (Fogg et al., 2002). Awwwards weights Design 40%, Usability 30%, Creativity 20% and Content 10%. So win on typography, spacing, palette, imagery, motion quality and edge states, not on WebGL or gimmicks.
- **Build the agreed architecture with 2026 updates.**
  - Static Next.js export (or Astro) driven by one `resume.json`, with six routes.
  - Glass only on nav, ⌘K, buttons and dialogs, falling back solid → frosted → refraction.
  - Same-document View Transitions are Baseline. Firefox still lacks the cross-document kind.
  - Safari still doesn't support `prefers-reduced-transparency`, so keep the in-site "Reduce glass" toggle.
  - Host on Cloudflare: free, unlimited static requests and no non-commercial clause.
- **Recruiters reward evidence before effects.**
  - Lead with logistics: role, season, graduation, start date, location, work authorisation.
  - State results in Google's XYZ form ("Accomplished [X] as measured by [Y] by doing [Z]").
  - Offer 3–4 deep case studies and a one-click, ATS-friendly PDF CV.
  - Make every project link "valid and… reasonably polished" (Selena Ma, ex-Meta/Google recruiter).

---

## 1. Executive Summary and Vision

### 1.1 What someone should feel in the first five seconds
1. **0–0.05 s, "this is well made":** a calm, high-contrast composition with confident type, generous space, one accent colour and no noise. Lindgaard's team found that visual-appeal ratings after 50 ms closely matched ratings after 500 ms.\[1\]\[2\]
2. **0.05–2 s, "I know who this is and what they want":** your name, "Software engineer, Dublin", one precise positioning line, and logistics chips ("SWE Intern · Summer 2027 · Penultimate year · Dublin / open to relocate · EU work authorisation").
3. **2–5 s, "this person ships real things":** a static proof strip of 3–4 named, measured outcomes, then the first case-study card. The nav already shows **CV**, **Work** and **⌘K**.
4. **First interaction, "whoever built this sweats details":** the glass nav catches a highlight, hover responds instantly with a spring, the focus ring is designed, and a View Transition morphs a card into its case-study hero.

### 1.2 One-sentence brief
*"A quiet, Apple-calibre résumé-as-website where every pixel is deliberate, every claim is measured and every interaction feels physically right, built so the content can change for years while the design never needs to."*

### 1.3 Core thesis
The earlier agency-cost breakdown (~$24k) put most of the value in content, copywriting, photography and identity, not code. What reads as expensive is judgment, and judgment is free. What reads as cheap is unmade decisions: default fonts, default colours, default components, placeholder copy, unhandled states.

---

## 2. The Psychology of "Expensive"

### 2.1 The 50 ms verdict
- Lindgaard, Fernandes, Dudek and Brown, *Behaviour & Information Technology* 25(2), 115–126 (2006). Across three studies, homepage ratings after 50 ms matched ratings after 500 ms. Visual appeal correlated with most of the seven design dimensions tested.\[1\]\[3\]\[4\]
- **Limit:** the study measured visual appeal only, not trust or conversion. "Visitors decide whether to trust you in 50 ms" is a misquote.\[2\]
- **Implication:** the first viewport must be finished before anything else. A preloader means the first frame being judged is a spinner.

### 2.2 Credibility rides on "design look"
- Fogg et al., "How Do People Evaluate a Web Site's Credibility?" (Stanford/Consumer WebWatch, 2002). 2,684 people evaluated live sites, and **"design look" featured in 46.1% of comments**, more than any other factor.\[5\]\[6\]
- The Stanford Guidelines (Fogg, 2002) include:
  - "Design your site so it looks professional."\[7\]
  - Make claims easy to verify.
  - Show there is a real person behind the site.
  - Be useful and easy to use.
  - Keep content updated.
  - Avoid errors of all types.
- **Counter-signal:** the same study recorded backlash against sites that looked *too* "slick". Design should match purpose.\[7\]\[8\] For an engineer, the credible look is precise and calm.
- **Fogg's Maxim:** find "what elements your target audience interprets most favorably and make those elements most prominent."\[9\] For big-tech recruiters, those are employers, measured outcomes, shipped products and code.

### 2.3 The aesthetic-usability effect, and its limits
- Kurosu and Kashimura (Hitachi, 1995) tested 26 ATM layouts with 252 participants. Perceived ease of use tracked aesthetic appeal more closely than actual usability.\[10\]
- NN/g (Kate Moran, 2017): "A pretty design can make users forgiving of minor usability problems, but not of large ones."\[11\]\[12\]
- Later experiments are less supportive. John Grishin and Douglas J. Gillan, "Exploring the Boundary Conditions of the Effect of Aesthetics on Perceived Usability", *Journal of Usability Studies* 14(2), 76–104 (February 2019), concluded: "if aesthetics influences perceptions of usability in early interactions with a system, the effect is not a strong one, and repeated experience with a system reduces it further."
- **Implication:** beauty buys the first visit, and substance decides the second. If the CV is more than one click away, the glass is forgotten.

### 2.4 How award juries define "premium"
- **Awwwards** scores Design 40%, Usability 30%, Creativity 20%, Content 10%, with at least 18 jurors and outlier scores discarded. Site of the Day winners go to a developer jury. A score above 7 earns the **Developer Award**, created with Microsoft, which judges code quality, performance, accessibility, SEO and interoperability.\[13\]\[14\]\[15\]
- 70% of the score is design plus usability, and the developer jury grades engineering hygiene, which is how big-tech engineers think.
- Webby judges content, structure, visual design, functionality, interactivity and overall experience.\[16\] FWA and Godly lean experimental: borrow their polish, not their scroll-jacking.

### 2.5 Five levers
| Lever | Basis | Build |
|---|---|---|
| Instant visual verdict | Lindgaard 2006 | Finished first viewport; no preloader; LCP ≤ 1.8 s |
| Professional look = credibility | Fogg 2002 (46.1%) | Deliberate type, spacing, palette; zero typos or broken links |
| Not "too slick" | Fogg 2002 | Restraint; personality in copy, not effects |
| Beauty buys patience, not forgiveness | Kurosu & Kashimura; NN/g | One-click CV, obvious nav, fast, accessible |
| Prominence of what the audience values | Fogg's Maxim | Employers, metrics, shipped work above the fold |

---

## 3. Expensive vs Cheap: The Master Matrix

Studio writing from 2025–2026 converges on one claim: premium comes from consistency and restraint.\[17\]\[18\] Evoke (madebyevoke.com, "What Makes a Website Look Expensive") puts it this way: "A website with generous white space, one strong typeface, two well-chosen colours, and no stock photography will look more premium than a site with elaborate design elements, multiple graphic treatments, and a stock photo library." Treat agency blogs as marketing. Here they agree with the research and with the design engineers below.

### 3.1 Typography (highest leverage)
| Cheap tell | Expensive tell / spec |
|---|---|
| A default font nobody chose, at one weight | Two families max, chosen weights 400/500/600 (Rauno Freiberg: avoid weights below 400; mid-size headings look best at 500–600)\[19\] |
| Arbitrary sizes | Modular ~1.25 scale with fluid `clamp()` |
| Same line-height everywhere | Body 1.5–1.6; headings 1.05–1.15; display 1.0 |
| Default tracking on large type | Display −0.02 to −0.035em; caps +0.04em |
| 120-character lines | Prose `max-width: 65ch` |
| Widows in headings | `text-wrap: balance` (h1–h3), `text-wrap: pretty` (p) |
| Straight quotes, "--", "..." | ’ “ ” – — …, plus non-breaking spaces in "10 ms" and "Summer 2027" |
| Jumping numerals | `font-variant-numeric: tabular-nums`\[20\] |
| Weight changes on hover | Change colour or opacity instead (Rauno: weight shifts cause layout shift)\[19\] |
| Font-load layout shift | Self-hosted, subset variable font with metric-matched fallback (`next/font` or Fontsource, `size-adjust`) |
| Rough rendering | `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`, `-webkit-text-size-adjust: 100%`\[20\]\[21\] |
| Gradient headline text | Solid headlines |

**Font choice (free, licence-safe):**
- `system-ui, -apple-system` first, so Apple visitors see SF Pro natively. Apple's licence doesn't allow self-hosting SF Pro on the web.
- Configured **Inter Variable** (optical sizing, `cv11`/`ss01`, tabular numerals) as the cross-platform face, *or* **Geist Sans + Geist Mono** (OFL), with mono used only for code, metrics and `<kbd>`.
- The DEV Community article "Is your website AI slop? How to tell, and how to fix it" (by laurilllll) makes the key point: "The font isn't the problem. Nobody choosing it is." Unconfigured Inter 700 in a centred hero is the tell.
- Add one owned accent: a monogram, or a serif used only for testimonial quotes.

### 3.2 Layout, whitespace and grid
| Cheap | Expensive |
|---|---|
| Inconsistent gaps | Every gap from a 4/8 px scale; visible vertical rhythm |
| Centred hero + pill badge + three feature cards | Left-aligned editorial composition; asymmetric grid shaped by content |
| Everything boxed in identical cards | Cards only where something is clickable |
| Crammed sections | 96–160 px section spacing on desktop; a few things given lots of room |
| Misaligned edges | 12-column grid, shared left edges, optically aligned icons and quotes |
| Breaks at 360 px or 1,920 px | Designed at 360/768/1,280/1,600+; max content width ~1,200 px |

### 3.3 Colour
| Cheap | Expensive |
|---|---|
| Purple→indigo gradient hero, glow orb (the #1 AI-slop tell of 2026) | Near-neutral base plus **one** accent used to mean something |
| Untouched Tailwind blue / shadcn grey | Custom 12-step neutral scale in OKLCH |
| Rainbow tags | Accent reserved for the primary action, focus, links and selection |
| Grey-on-grey below AA | Off-black on off-white, all text ≥ 4.5:1 |
| Dark mode as a reflex, or an inversion | Light and dark tuned separately; dark uses elevated surfaces, not shadows |
| Tokens named `gradient-start` | Tokens named by role (`--accent`, `--surface-2`) |

### 3.4 Imagery
| Cheap | Expensive |
|---|---|
| Stock photos, 3D blobs, AI illustrations with incoherent light | Real screenshots, real product shots, one consistent portrait |
| Mixed crops and ratios | Fixed ratios (16:10 work, 4:5 portrait), one consistent treatment |
| Oversized images (pkodes requested `w=3840` thumbnails) | AVIF/WebP, correct `sizes`, explicit dimensions |
| Raw screenshot dumps | Cropped detail shots; 4–8 s muted MP4/WebM loops with a poster frame |
| Mixed icon packs | One icon set at one stroke weight |

### 3.5 Motion
| Cheap | Expensive |
|---|---|
| Everything fades up on scroll | Motion only for spatial continuity, feedback and state change |
| `transition: all 300ms ease-in` | Named properties (`transform`, `opacity`) and custom curves |
| 500–1,000 ms UI animations | **UI motion under 300 ms** (Emil Kowalski): micro 100–150, dropdowns 150–250, modals 200–300 ms; exits ~20% faster\[22\] |
| `ease-in` on UI | ease-out to enter/exit; ease-in-out for on-screen moves; ease for hover; linear for constant motion\[22\]\[23\] |
| Animating width/top/left | Transform and opacity only; compositor-friendly |
| Scroll-jacking | Native scroll; scroll-*driven* reveals behind `@supports` |
| An animated ⌘K open | "Actions that are frequent and low in novelty should avoid extraneous animations" (Rauno)\[24\] |
| Reduced motion ignored | `prefers-reduced-motion` → cross-fades only |

Kowalski's curves: `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out), `cubic-bezier(0.77, 0, 0.175, 1)` (ease-in-out), `cubic-bezier(0.32, 0.72, 0, 1)` (drawer). Keep spring bounce between 0.1 and 0.3.\[25\]

### 3.6 Micro-interactions (Rauno's and Vercel's Web Interface Guidelines)
- No dead zones between list items (use padding, not gaps).\[21\]
- `pointer-events: none` on decorative glows.\[21\]
- Delay the first tooltip in a group; show its siblings instantly.\[26\]
- Loading states: ~150–300 ms show-delay and ~300–500 ms minimum visible time, so nothing flickers.\[26\]
- `touch-action: manipulation` on controls.\[26\]
- Real `<a>` elements for navigation.
- `aria-label` on icon-only buttons.\[19\]
- Hover styles gated behind `@media (hover: hover)`.
- `:active` scale(0.97) at 100–160 ms.

### 3.7 Copywriting
| Cheap | Expensive |
|---|---|
| "Passionate full-stack developer who loves to code" | "I build fast, accessible interfaces. Last summer I cut checkout latency 38% at [company]." |
| Lorem ipsum, "Coming soon", "Project 3" | Every page is finished or not linked |
| AI-averaged headlines | Specific nouns, numbers, names, dates |
| Skill bars ("React 90%") | Skills shown through case studies |
| Three audiences (pkodes: job-seeker/creator/freelancer) | One audience: big-tech engineering hiring |
| A dense hero paragraph | One H1, one sentence, one row of chips |

### 3.8 Performance and loading
| Cheap | Expensive |
|---|---|
| Preloader or spinner | Static HTML painted on the first frame |
| Layout shift | CLS ≤ 0.02 (explicit dimensions, metric-matched fonts) |
| Skeletons for static content | None needed: content ships in the HTML |
| 400 KB of JS | ≤ 90 KB JS on the home page |
| YouTube iframe in the hero (pkodes) | Lite-YouTube facade or poster + link |
| Lighthouse warnings | 95–100 in all four categories, enforced in CI |

### 3.9 Edge states (where "expensive" is decided)
| State | Expensive treatment |
|---|---|
| Focus | 2 px accent ring, 2 px offset, `:focus-visible`, matching the radius |
| Hover / press | 120–150 ms ease; subtle scale and darker fill on press |
| Empty / error | Human copy plus a way out |
| 404 | Designed page with ⌘K, three links and a small joke |
| Print | Black on white, URLs expanded, one-page CV layout |
| Dark mode | Tuned surfaces, desaturated accent, images dimmed ~8% |
| Reduced motion / transparency | Cross-fades; solid surfaces (media query + in-site toggle) |
| Forced colours | `@media (forced-colors: active)` tested |
| No JS / slow 3G | Full static content; text visible in the first 14 KB |

### 3.10 Detail polish
- SVG favicon with an internal dark-mode query, 180 px apple-touch-icon and manifest.
- Per-page dynamic OG images (Satori/`ImageResponse` at build, 1200×630).
- Descriptive tab titles ("Case study: Realtime Sync — Name").
- `::selection` in the accent colour at ~25% alpha.
- `scrollbar-gutter: stable`, `color-scheme: light dark`, and `theme-color` for both schemes.
- 0.5 px hairlines on 2× displays; concentric radii (outer = inner + padding).
- A console greeting with a repo link; `<kbd>` shortcut hints.
- ↗ on external links; copy-to-clipboard email with a toast instead of a raw `mailto:`.

### 3.11 Sound and haptics
Sound off by default (cut for v1). The Vibration API doesn't work in iOS Safari. On the web, "haptic feel" comes from instant press feedback and springs.

### 3.12 The 2026 AI-slop tell list
Critics converge on one cluster of defaults:
- purple/indigo gradients and glow orbs;
- Inter at a single weight;
- a centred hero with a "✨ New" pill badge;
- three identical rounded feature cards;
- untouched shadcn (`rounded-2xl shadow-lg backdrop-blur` on everything);
- gradient headline text;
- a mono uppercase "eyebrow" above every heading;
- left-border accent cards;
- permanent dark mode;
- glass everywhere.

Two warnings follow. First, your planned skin overlaps this list. Glass and Geist/Inter are fine only if glass stays on controls and the type is deliberately configured. The pkodes `// label` device is the mono-eyebrow tell, so use it once at most. Second, you can't escape slop by dodging a list. The same DEV Community article (laurilllll) warns: "Ban Inter and purple, and you get Instrument Serif and mono captions instead… The list keeps growing." The cure is decisions only you can make: your words, photos, numbers and one signature element.\[27\]

---

## 4. Premium Sites: What to Borrow

| Site | Craft signal | Borrow (free, solo) | Avoid |
|---|---|---|---|
| apple.com | Huge confident type, extreme whitespace, sticky sub-nav, scroll-linked canvas sequences with a fallback image | Sticky local nav on case studies; one scroll moment per study | Full frame-sequence heroes |
| Linear | Near-monochrome precision, hairlines, keyboard-first | Hairline borders, ⌘K-first nav | Purple glow (now a slop tell) |
| Stripe | Editorial layouts, docs-grade typography | Docs-quality case-study typography | Animated gradient hero |
| Vercel | Geist, black/white plus one blue, published guidelines | Geist; the guidelines as a checklist | Wholesale grid aesthetic |
| Raycast | Product-as-hero shots, `<kbd>` hints everywhere | Shortcut hints, product-shot art direction | Heavy 3D renders |
| Arc / The Browser Company | Personality in copy, disciplined playfulness | Microcopy voice | Novelty that blocks navigation |
| Family wallet | Fluid springs, morphing shapes | One springy morph (⌘K → result) | A bespoke gesture system |
| rauno.me | "Fine, detailed polish"; craft log; "Invisible Details of Interaction Design"\[28\]\[29\] | A small dated lab of prototypes (later) | Experimental nav |
| emilkowal.ski | Writing as proof (Sonner, Vaul)\[30\] | One deep technical essay | A course you won't maintain |
| paco.me | Typographic minimalism; co-author of cmdk\[29\] | cmdk palette | Minimalism without proof |
| brittanychiang.com | Résumé-as-index, sticky column, hover-dim rows | Hover-dim experience rows | Cloning the layout (recruiters recognise it) |
| joshwcomeau.com / leerob.com | Content as portfolio | One interactive explainer | A blog you won't update |
| bruno-simon.com | Immersive WebGL | Nothing for v1 | WebGL hero |

**The pattern:** each has *one* signature executed perfectly, and everything else is quiet. Your recommended signature is the ⌘K palette (Section 10).

---

## 5. Apple Craft and Liquid Glass Done Premium

### 5.1 What apple.com does
- Very large headlines with tight tracking.
- One point per section, separated by large vertical gaps.
- A translucent, *frosted* sticky sub-nav under the global nav.
- Colour used to identify products, never as decoration.
- Pinned sections that draw pre-rendered frames onto `<canvas>` by scroll progress (AirPods Pro; documented by CSS-Tricks), with a single-image fallback.
- Animation that always serves the content.\[18\]

### 5.2 Evoking Apple without copying it
- **Do:** borrow the principles (one idea per section, confident type, sticky case-study sub-nav, product-shot-quality screenshots, the system font stack).
- **Don't:** copy Apple phrasing, the "Buy" pill, Apple greys and blues, Apple device art, SF Pro as a web font, or a 150-frame canvas hero, which reads as an agency template.
- **The portfolio version:** in each case study, pin a 16:10 screenshot while three "decision" captions scroll past and the image crops to the relevant region. Build it with `animation-timeline: view()` inside `@supports`, with a static stacked layout as the fallback and under reduced motion.

### 5.3 Liquid Glass status, November 2026
- **Introduced at WWDC on June 9, 2025** with iOS 26: a material that "combines the optical qualities of glass with a sense of fluidity."\[31\]\[32\]
- **NN/g criticism** (Raluca Budiu, "Liquid Glass Is Cracked, and Usability Suffers in iOS 26", Oct 2025): "restless, needy, less predictable, less legible… like a fogged‑up window: pretty from a distance, but frustrating when you try to see beyond it." iOS 26.1 (released November 3, 2025) added a Clear/Tinted choice under Settings → Display & Brightness → Liquid Glass, alongside the existing Accessibility "Reduce Transparency" toggle. Apple's release notes describe it as "a new tinted look which increases opacity of the material in apps and notifications on the Lock Screen" (as quoted by MacRumors and PhoneArena).
- **WWDC 2026 / iOS 27:** reduced default transparency, a changed glass effect, toned-down sidebar corners, and icons where only some elements catch the light. A system slider now runs from fully clear to fully tinted, and tinted mode is much stronger.\[31\]\[33\]\[34\] The earlier research also noted darker edges and brighter speculars. iOS 27.0.1 shipped September 28, 2026; 27.2 was in RC in October.\[31\]
- **HIG rules still apply:** no glass in the content layer, sparing use on controls and navigation, Regular vs Clear variants, and a dimming layer (~35%) for Clear over bright content.
- **Takeaway:** Apple has moved toward more opacity and more user control. A premium 2026 web interpretation is a *tinted, legible control layer*, not rainbow refraction everywhere.

### 5.4 Premium vs cheap glass
| Cheap | Premium |
|---|---|
| Glass on content cards and the hero | Glass only on floating chrome: nav, ⌘K, buttons, dialogs, toasts |
| Blur over a flat background (a grey box) | Glass over real content or photography |
| White 20% fill + 1 px white border | Layered tint + inner rim + outer hairline + soft shadow + specular |
| Text fails contrast over busy areas | Tint/dim layer guarantees ≥ 4.5:1 over the worst background |
| One blur radius everywhere | Blur scaled to elevation (8/16/24 px) |
| No fallback; library dependency | Solid → frosted → refraction; hand-rolled CSS |

### 5.5 Glass tokens (`skin.css`)
```css
:root{
  --glass-blur-sm:8px; --glass-blur-md:16px; --glass-blur-lg:24px; --glass-saturate:180%;
  --glass-fill:oklch(1 0 0/.55); --glass-fill-strong:oklch(1 0 0/.72);
  --glass-dim:oklch(0 0 0/.35);
  --glass-rim:inset 0 0 0 .5px oklch(1 0 0/.6);
  --glass-hairline:0 0 0 .5px oklch(0 0 0/.08);
  --glass-specular:inset 0 1px 0 oklch(1 0 0/.75);
  --glass-shadow:0 8px 32px -8px oklch(0 0 0/.18),0 2px 6px oklch(0 0 0/.06);
  --radius-sm:12px; --radius-md:20px; --radius-lg:28px; --radius-pill:999px;
}
[data-theme="dark"]{
  --glass-fill:oklch(.22 0 0/.55); --glass-rim:inset 0 0 0 .5px oklch(1 0 0/.14);
  --glass-specular:inset 0 1px 0 oklch(1 0 0/.18);
}
```

### 5.6 Implementation tiers
0. **Solid:** used when `[data-glass="off"]`, when `@supports not (backdrop-filter: blur(1px))`, or under `prefers-reduced-transparency: reduce`.
1. **Frosted:** `backdrop-filter: blur(16px) saturate(180%)` with the `-webkit-` prefix, plus fill, rim, hairline, specular and shadow.
2. **Refraction (Chromium only, optional):** an SVG `feDisplacementMap` via `backdrop-filter: url(#lens)` on the nav pill only, behind feature detection.
3. **Cross-browser refraction / WebGL:** cut for v1. liquid-glass-react, liquid-glass-js and fflun/liquid-glass-template exist, but the spec stands: hand-rolled CSS, no glass libraries.

### 5.7 Accessibility
- `prefers-reduced-transparency` works in Chrome/Edge 118+ and Samsung Internet 25+. **Safari (including 27.x) and Firefox still don't support it**, and WebKit cites privacy concerns.\[35\]\[36\]\[37\] Some 2026 blogs claim Safari support; caniuse says otherwise.\[38\]
- Keep the in-site **Reduce glass** toggle (in ⌘K and the footer). Persist it in `localStorage` and apply it before first paint with an inline `<head>` script.
- Test nav contrast over the busiest content it can sit on.
- Limit `backdrop-filter` to 1–2 on-screen elements, because of the GPU cost on low-end phones.

---

## 6. pkodes.com Teardown

**Patrick Anyanwu, DCU student; Next.js + Tailwind + Framer Motion.**

- **Strengths:** a front-loaded proof marquee (Stripe, Google, HubSpot, 135k+ YouTube views); production metadata (canonical, OG/Twitter images, JSON-LD `sameAs`); a skip link; clear nav; personality ("Beyond the code", `//` labels); tech tags on cards.
- **Weaknesses:**
  - Thin proof: only a "projected ~25%" result.
  - No visible CV.
  - Three competing audiences.
  - Contact via a raw Gmail `mailto:` and Linktree.
  - Freelance services hosted on non-commercial Vercel Hobby.
  - `w=3840` thumbnails and a YouTube iframe in the hero.
  - Duplicated marquee DOM without `aria-hidden`.
  - Dense hero copy.
  - No ⌘K, theme toggle or case-study depth.
  - New in this report: the `//` labels match the "mono eyebrow" slop tell, and the marquee is a motion cliché.

| pkodes issue | Your fix |
|---|---|
| Marquee | Static proof strip, each item linked to evidence |
| Projected metric | Measured, baselined XYZ metrics (relative where confidential) |
| No CV | CV in the nav + `/cv` + generated `/cv.pdf` |
| Three audiences | One audience |
| Gmail / Linktree | Custom-domain email via Cloudflare Email Routing + copy button + LinkedIn |
| Vercel Hobby + freelance | Cloudflare hosting |
| Heavy media | Build-time AVIF/WebP with `sizes`; YouTube facade |

---

## 7. The Recruiter and Employer Lens

### 7.1 Three tests
1. **7 seconds:** Ladders' 2018 eye-tracking update put the average initial résumé screen at **7.4 s** (up from ~6 s in 2012). Recruiters skim "layout, job titles, text flow, keywords", and the worst performers had "cluttered layouts… multiple columns, and very little white space."\[39\] The method is unpublished, so treat the number as directional.\[40\]\[41\]
2. **60 seconds:** can a reviewer find your best project's problem, your role, the result, the code and the PDF?
3. **Craft:** an engineer tabs through, resizes to 360 px, toggles dark mode, runs Lighthouse, and reads a case study and a README. Nothing breaks.

### 7.2 What named sources say
- **Laszlo Bock** (then Google SVP People Operations, LinkedIn, Sept 29, 2014): "Accomplished [X] as measured by [Y] by doing [Z]… start with an active verb, numerically measure what you accomplished, provide a baseline for comparison." Also: "The sole purpose of a resume is to get you past that first screen and into an interview."\[42\]\[43\]\[44\] Write every bullet and result this way.
- **Selena Ma** (10 years recruiting at Meta and Google; Formation blog, 2022, updated May 2024):\[45\]
  - "a recruiter is not going to look at your Github, but they will definitely find you on LinkedIn."\[45\]
  - "Ensure each project link is valid and directs to a page that is reasonably polished. Include a link to the source code repository."\[45\]
  - "One look at a resume and I am either fast-tracking you through to an interview loop or tossing out your application."\[45\]
  - "Anything you can't talk about for a few minutes should not be included."\[45\]
  - She also flags poor formatting, typos and outdated email providers.\[45\]
- **Gayle Laakmann McDowell** (former Google engineer and hiring-committee member, 2014): students can boost résumés with projects: "Build a website / portfolio."\[46\]\[47\]
- **Google Summer 2027 intern postings** ask for an "updated CV or resume and a current unofficial or official transcript in English". Some require the "penultimate academic year", and some prioritise applicants who already have the right to work.\[48\]\[49\] **So eligibility logistics belong in the first viewport.**
- **Implication:** the PDF CV gets you screened and the site confirms you. Every CV link must land on a polished page, and LinkedIn must match exactly.
- **Gap:** I found no 2025–2026 named current recruiter at Apple, Google, Microsoft, Meta or Amazon on intern portfolio *websites*. Popular stats ("93% of hiring managers look at portfolios", "83% trust GitHub over resumes") trace back to résumé-tool marketing and can't be verified.\[50\]\[51\]

### 7.3 What impresses
- Baselined metrics ("p95 820 → 210 ms").
- Real users and constraints.
- Visible judgment: alternatives, trade-offs, reflection.
- Pinned repos with READMEs, tests, CI and live demos.
- Collaboration and ownership stories.
- A site that is itself evidence: fast, accessible, typed, tested, with a public repo and a /colophon.

### 7.4 What backfires
- Preloaders, custom cursors, scroll-jacking, WebGL heroes.
- Broken or "coming soon" links, and sleeping demos.
- Skill bars and buzzwords.
- Confidential internship details.
- Mismatches with LinkedIn or GitHub.
- A poor mobile experience (links are often opened from LinkedIn on a phone).
- Unprofessional email.

### 7.5 Employer essentials checklist
- [ ] Logistics: target role and season, graduation, year of study, available-from date, Dublin, relocation, work authorisation (state it honestly).
- [ ] 3–6 XYZ metrics site-wide.
- [ ] 2–3 named testimonials, used with permission.
- [ ] Pinned repos with READMEs, tests, CI and demos that don't sleep.
- [ ] At least one team story and one solo-ownership story.
- [ ] Confidentiality: relative metrics and manager sign-off.
- [ ] Mobile check in LinkedIn's in-app browser.
- [ ] CV, LinkedIn and GitHub consistent.

---

## 8. Final Architecture

### 8.1 Timeless core + swappable skin
- `/core` never changes after the freeze: `resume.json`, MDX case studies, routes, layout, type, spacing, accessibility, SEO.
- `/skin` is swapped once a year after WWDC: `skin.css` (glass tokens, accent, radii, shadows), a `<Backdrop/>` component and an optional refraction filter.
- **Rule:** the site must look complete and premium with `skin.css` deleted.

### 8.2 Stack (all free)
| Layer | Choice |
|---|---|
| Framework | Next.js static export (`output: 'export'`) or Astro |
| Styling | Tailwind CSS v4 with CSS-variable tokens |
| Motion | Motion for springs and layout; GSAP (now 100% free, including plugins) only if a timeline needs it; CSS and View Transitions first |
| Content | MDX + Velite or Content Collections (zod schemas) |
| Command menu | cmdk |
| Fonts | Self-hosted variable fonts (`next/font`/Fontsource), Latin subset |
| Images | Build-time `sharp` (AVIF + WebP) |
| OG images | Satori at build |
| CV PDF | Playwright prints `/cv` in GitHub Actions |
| Hosting | Cloudflare Workers Static Assets (or Pages) |
| Domain / email | Cloudflare Registrar (.com ~$11.17/yr, .dev ~$12.20/yr, at cost); Cloudflare Email Routing |
| Analytics | Cloudflare Web Analytics (cookieless) |
| CI | Lighthouse CI, axe + Playwright, lychee, cspell, size-limit, visual regression |

**Hosting (verified November 2026):**
- **Vercel Hobby:** 100 GB Fast Data Transfer, 10 GB Fast Origin Transfer, 1M CDN requests, 1M invocations, 4 CPU-hours, 5,000 image transformations and 50,000 analytics events per month. It is "restricted to non-commercial personal use only", and exceeding a limit usually pauses the feature for 30 days.\[52\]\[53\]\[54\]
- **Cloudflare:** "Requests to static assets are free and unlimited." Pages Free allows 500 builds/month, 20,000 files and 25 MiB per file. Dynamic functions share 100,000 requests/day (10 ms CPU each).\[55\]\[56\] There is no non-commercial clause.\[57\]
- Cloudflare now recommends **Workers Static Assets** for new projects and puts new features there; Pages still works fine for a static export.\[58\]\[59\]
- **Decision:** deploy to Cloudflare.

### 8.3 `resume.json` (single source of truth)
```jsonc
{
  "basics": { "name": "…", "label": "Software Engineer", "email": "hello@yourname.dev",
    "location": { "city": "Dublin", "country": "IE" }, "profiles": [ /* GitHub, LinkedIn */ ],
    "summary": "One specific sentence." },
  "logistics": { "targetRole": "Software Engineering Intern", "targetSeason": "Summer 2027",
    "yearOfStudy": "Penultimate", "graduation": "2028-05", "availableFrom": "2027-05-15",
    "relocate": { "open": true, "regions": ["EU","UK","US"] },
    "workAuthorization": [{ "region": "EU/EEA", "status": "Citizen" }] },
  "metrics": [{ "label": "p95 latency", "value": "−74%", "context": "820 → 210 ms", "source": "/work/x#results" }],
  "work": [{ "company": "…", "position": "…", "startDate": "2026-06", "endDate": "2026-09",
    "highlights": ["Accomplished X as measured by Y by doing Z"], "approvedForPublic": true }],
  "projects": [{ "slug": "…", "role": "…", "stack": [], "repo": "…", "demo": "…", "featured": true }],
  "education": [], "awards": [], "testimonials": [{ "quote": "…", "name": "…", "role": "…", "permission": true }]
}
```
- Wording is date-driven: "Incoming", "Currently" and "Previously" are computed at build time.
- A weekly scheduled rebuild flips tense automatically.
- The same JSON drives home, `/cv`, `/cv.pdf`, JSON-LD and OG images.

### 8.4 Sitemap
`/` (index) · `/work/[slug]` (3–4 case studies) · `/about` · `/cv` + `/cv.pdf` · `/colophon` · `/404`.

### 8.5 Page specs

**Global chrome**
- **Glass nav pill**, top-centre and sticky: monogram, then Work, About, CV, ⌘K.
  - It turns slightly more opaque after 8 px of scroll.
  - The active link is a sliding pill (Motion `layoutId`, bounce 0.15).
- A styled skip link.
- System/light/dark theme with no flash.
- **Footer:** copy-email, LinkedIn, GitHub, CV, colophon, the theme and Reduce-glass toggles, and a "Last updated" build date.

**Home**
1. **Hero:**
   - H1 name; a 20–24 px positioning line.
   - Hairline logistics chips.
   - "View CV" as the primary action, "Selected work ↓" as secondary.
   - A 200 ms entrance on the first visit only.
2. **Proof strip:** 3–4 static, linked metrics with tabular numerals.
3. **Selected work:** 3–4 cards with 16:10 media, a one-line outcome, role and ≤ 3 tags.
   - Hover: media scales 1.02 over 250 ms.
   - Click: shared-element View Transition into the case-study hero.
4. **Experience rows:** company, role, tabular dates and one XYZ highlight. Hovering a row dims its siblings to 60%.
5. **Testimonials:** the serif accent appears here.
6. **Education and awards.**
7. **Footer.**

**Case study**
- Apple-style sticky sub-nav: TL;DR · Context · Decisions · Hardest problem · Results · Reflection, with repo and demo buttons.
- Template:
  1. TL;DR: 3 bullets plus role, team, duration, stack.
  2. Context.
  3. Decisions, each with the alternatives rejected (a table works well).
  4. Hardest problem: an SVG diagram and a Shiki-highlighted code excerpt.
  5. Results: baselined metrics.
  6. Reflection.
- One scroll moment per study; a "Next case study" card; reading time.

**About**
- One portrait.
- A 150–250-word first-person bio.
- Three "Beyond the code" items.
- No freelance pitch.

**CV**
- The HTML page's print stylesheet produces the PDF exactly.
- Single column, real text, standard headings, one page.
- Links shown without `https://`; file named `Firstname-Lastname-CV.pdf`.
- Download and Print buttons.

**Colophon**
- Stack, font licences, colour swatches, motion tokens, live Lighthouse scores and bundle size from CI, an accessibility statement, credits and a repo link. This page is a craft signal in itself.

**404**
- A large display "404", one line, three links and a ⌘K prompt.

### 8.6 CV/PDF pipeline
1. Validate `resume.json` with zod.
2. Render `/cv` statically.
3. A GitHub Action builds, serves `out/` and runs Playwright `page.pdf({format:'A4'})`.
4. CI asserts the PDF is one page (pdf-lib), its text is extractable (`pdftotext`) and its links are valid (lychee).
5. Optionally generate a US Letter variant for US roles.

---

## 9. Design System Spec

### 9.1 Type scale (~1.25, fluid)
| Token | Size | LH | Tracking | Weight |
|---|---|---|---|---|
| display | 40→72 px | 1.0 | −0.035em | 600 |
| h1 | 32→48 | 1.08 | −0.025em | 600 |
| h2 | 24→32 | 1.15 | −0.015em | 600 |
| h3 | 19→22 | 1.3 | −0.01em | 500 |
| body-lg | 18→20 | 1.55 | −0.005em | 400 |
| body | 16→17 | 1.6 | 0 | 400 |
| small | 14 | 1.5 | 0 | 400/500 |
| caption | 12–13 | 1.4 | +0.02em | 500 |

### 9.2 Spacing, grid and breakpoints
- **Spacing:** 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160.
  - Component padding 12–24; card gaps 24–32; sections 64 (mobile) to 160 (desktop).
- **Grid:** 12 columns with 24/16 px gutters; content max 1,200 px; prose 65ch; margins `clamp(16px,5vw,48px)`.
- **Breakpoints:** 640/768/1024/1280/1536.

### 9.3 Colour (OKLCH, one accent)
- A 12-step cool neutral scale.
- Light: background `oklch(0.99 0.002 250)`, text `oklch(0.2 0.01 250)`, muted `oklch(0.45 0.01 250)`.
- Dark: background `oklch(0.16 0.005 250)`, surface `oklch(0.2 0.006 250)`, text `oklch(0.96 0.003 250)`.
- Accent: not purple-indigo. Deep teal `oklch(0.6 0.12 200)` or green `oklch(0.62 0.14 155)`, used for focus, links, the primary button and selection.

### 9.4 Radii and elevation
- **Radii:** 6 (kbd/inputs), 12 (buttons/chips), 20 (cards), 28 (dialogs/nav), 999 (pills), nested concentrically.
- **Shadows:**
  - e1 `0 1px 2px oklch(0 0 0/.06)`
  - e2 `0 4px 16px -4px oklch(0 0 0/.12)`
  - e3 `0 16px 48px -12px oklch(0 0 0/.2)`
  - In dark mode, use hairlines and lighter surfaces instead of shadows.

### 9.5 Motion tokens
```css
:root{
  --dur-micro:120ms; --dur-fast:180ms; --dur-base:240ms; --dur-slow:300ms; /* UI ceiling */
  --ease-out:cubic-bezier(.23,1,.32,1); --ease-in-out:cubic-bezier(.77,0,.175,1);
  --ease-drawer:cubic-bezier(.32,.72,0,1);
}
@media (prefers-reduced-motion:reduce){:root{--dur-micro:0ms;--dur-fast:0ms;--dur-base:120ms;--dur-slow:120ms}}
```
- Motion springs: `{type:"spring", visualDuration:0.3, bounce:0.15}`; bounce ≤ 0.25 for playful elements.
- For CSS-only hover springs, generate a `linear()` easing (spring-easing generators).
- View Transitions: 250 ms with ease-out on shared elements and a 150 ms root cross-fade.

---

## 10. Signature Moments: Build vs Cut

### 10.1 Build
1. **⌘K palette (cmdk), the signature.** Navigate, open case studies, copy email, download the CV, toggle theme and glass, view source. Fuzzy search over `resume.json`. It opens instantly: keyboard-first and engineer-coded.
2. **Shared-element View Transitions** from work card to case-study hero.
   - Same-document transitions have been **Baseline Newly Available since October 14, 2025** (Chrome 111+, Safari 18+, Firefox 144+).\[60\]\[61\]
   - Cross-document transitions work in Chrome/Edge 126+ and Safari 18.2+ but **not yet in stable Firefox**. They are an Interop 2026 focus area.\[62\]\[63\]
   - Next.js client navigation uses `startViewTransition`. Astro MPA uses `@view-transition { navigation: auto; }` as progressive enhancement.\[62\]
3. **Themes**, with a 300 ms circular reveal from the toggle (instant under reduced motion).
4. **Designed 404.**
5. **Console greeting.**
6. **One scroll-driven moment per case study** (`animation-timeline: view()`).
   - Supported in Chrome/Edge 115+ and Safari 26+.\[64\]\[65\]\[66\]\[67\]
   - Firefox 159 (released October 27, 2026) enabled it by default. MDN's Firefox 159 release notes state: "Scroll-driven animations are now enabled by default." web.dev's October 2026 roundup adds: "With support in Chrome, Safari, and now Firefox 159, scroll-driven animations are Baseline Newly available." Some guides from August–October 2026 still say "flag only".
   - Keep `@supports` guards, set the timeline *after* the `animation` shorthand, and give it a non-zero duration (`1ms`).\[65\]\[66\]\[68\]\[69\]
7. **Print stylesheet.**
8. **Dynamic OG images.**

### 10.2 Cut list
- **Reconfirmed from the spec:** live Spotify/GitHub widgets, AI chatbot, blog (unless you post quarterly), /now and /uses, contact form, view counters, Giscus, WebGL playground, glass libraries, marquee, sounds, custom cursor, preloader, a separate /experience page.
- **New:** gradient headline text, purple glows, mono eyebrows on every section, three-identical-card rows, skill bars, frame-sequence hero, scroll-hijacking smooth-scroll libraries, typewriter text, particle backgrounds, freelance pitch.

### 10.3 Later (post-freeze)
A rauno.me-style `/lab` with 3–6 dated micro-prototypes, each a short loop linked to code. Add it only if you'll keep it alive.

---

## 11. Performance, Accessibility and SEO

| Metric | Target | Google "good" |
|---|---|---|
| LCP | ≤ 1.8 s (p75 mobile) | ≤ 2.5 s |
| INP | ≤ 100 ms | ≤ 200 ms |
| CLS | ≤ 0.02 | ≤ 0.1 |
| Lighthouse | 95+ in all four categories | — |
| JS (home) | ≤ 90 KB gzip | — |
| First load | ≤ 500 KB; above-the-fold content in the first 14 KB | — |

- **Enforcement:**
  - Lighthouse CI assertions.
  - size-limit.
  - Playwright + axe on every route across themes, reduced motion and glass-off.
  - Weekly lychee link check.
  - cspell.
  - Screenshot regression at 360/768/1280.
- **WCAG 2.2 AA:**
  - Contrast 4.5:1 for text and 3:1 for UI and focus.
  - `scroll-padding-top` so the sticky nav never hides focus.
  - Targets ≥ 24×24 px (44 on touch).
  - ⌘K also opens with Ctrl+K and `/`; Esc closes; focus is trapped and then returned.
  - Forced colours tested; `lang="en-IE"`; ordered headings; landmarks.
- **SEO:**
  - JSON-LD `ProfilePage` → `Person` (jobTitle, alumniOf, address, `sameAs` GitHub/LinkedIn).
  - Canonical URLs, sitemap, robots, per-page OG, `rel="me"`.
  - Link the site from GitHub, LinkedIn and the CV so it ranks for your name.

---

## 12. Content and Asset Production

### 12.1 Copy
- First person, plain and specific, with no adjectives you can't prove.
- **Hero formula:** *Name. Software engineer in Dublin building [specific thing]. Previously [named achievement].*
- Bullets in XYZ form with baselines; never present projections as results.
- Buttons are verbs ("Download CV"), and toasts confirm ("Email copied").
- Write case studies like design docs. Recruiters skim the TL;DR; engineers read Decisions and Hardest problem.
- Proofread aloud, run CI spellcheck, then have a friend read it on a phone.

### 12.2 Case studies
- Pick 3–4 that cover a team/industry project, a deep solo technical one, one shipped to real users, and optionally a frontend craft piece.
- Each must have a measured result. Instrument it before publishing if you have to.
- 800–1,500 words, with one diagram, 2–4 visuals and one code excerpt.
- Internship work uses relative metrics and needs written approval.

### 12.3 Photography on a budget
- **Portrait:**
  - A recent iPhone in Portrait mode at 2×.
  - Window light at 45°, a plain wall 1–2 m behind, eye level, one solid mid-tone top.
  - Shoot 100 frames and pick one, or trade a website build with a Dublin university photography-society member for a shoot.
  - Keep white balance and crops (4:5, 1:1) consistent.
- **Screenshots:**
  - 2× captures at 1440×900 from a clean browser profile.
  - Real but anonymised data.
  - The same framing treatment in every study.
- **Loops:**
  - Record at 60 fps and trim to 4–8 s.
  - Export MP4 + WebM with `muted playsinline loop` and a poster frame.
  - Pause off-screen and show only the poster under reduced motion.

### 12.4 Identity
- A monogram on a 24×24 grid, used for the favicon (with a dark variant), the nav, the OG corner mark and the print header.
- One accent, one type system, one icon set, one radius family, all documented on /colophon, which serves as your brand book.

---

## 13. Roadmap, Freeze and Maintenance

| Weekend | Deliverables | Exit criteria |
|---|---|---|
| 1 Content | `resume.json`; 3–4 case-study drafts (TL;DR and results first); testimonials requested; portrait; monogram; domain; email routing | Every metric baselined and sourced; LinkedIn matches |
| 2 Core | Static export; tokens; six routes; home order; CV + PDF pipeline; JSON-LD; Cloudflare deploy | Premium with no skin; Lighthouse ≥ 95; one-page PDF |
| 3 Skin + studies | Glass on chrome; Backdrop; Reduce-glass toggle; cmdk; View Transitions; themes; case-study template; OG images | Contrast passes over the worst background; glass-off still premium |
| 4 Quality + launch | CI gates; 404; colophon; print; LinkedIn in-app check; 5-person 7 s / 60 s / craft tests | All gates green; testers find the CV in < 5 s |

- **Design freeze** for 12 months after launch: content changes only.
- **Weekly (automated):** rebuild (tense), link check, Lighthouse.
- **Per milestone:** edit `resume.json` or one case study; CI regenerates the PDF and OG images.
- **Yearly after WWDC:** update `skin.css` tokens only, re-test contrast, re-check browser support. For 2026, iOS 27's shift toward tint means raising the default `--glass-fill` and keeping the toggle prominent.
- **Each application season (Aug–Oct):** update the logistics chips and metrics, and re-run the employer checklist.

---

## 14. What $20k+ Buys vs Free Replication

| Agency line item (~$24k total) | Free replication |
|---|---|
| Discovery and positioning | One audience; logistics first; Fogg's Maxim |
| Copywriting | XYZ formula; design-doc case studies; read-aloud review |
| Brand identity | Monogram, one type system, one accent, /colophon |
| Photography and art direction | Window-light phone portrait; strict screenshot treatment |
| UX/UI and design system | This report's tokens and page specs |
| Motion design | Kowalski/Freiberg rules, Motion springs, View Transitions |
| Front-end build | You (static export) |
| QA, accessibility, performance | CI gates |
| Hosting and retainer | Cloudflare free + cron; ~€11–13/yr domain |

If you spend money at all, spend it in this order: a professional portrait (a few hundred euro), an outside copy edit, then a commercial display typeface.

---

## 15. Risks and Pitfalls

| Risk | Mitigation |
|---|---|
| Glass reads as AI slop or a 2025 trend | Chrome only; tint by default; core premium without the skin |
| Legibility over glass (NN/g's core critique) | Tint/dim layer; worst-case contrast tests; toggle |
| Safari lacks reduced-transparency support | Persisted in-site toggle applied before paint |
| Firefox lacks cross-document View Transitions; scroll-driven animations only just shipped | Progressive enhancement; `@supports`; never gate content |
| Vercel Hobby non-commercial clause and 30-day lockout | Host on Cloudflare |
| Sleeping demos and broken links | Static demos or recorded loops; weekly lychee |
| Confidential internship details | Relative metrics; written approval |
| Over-engineering delays launch | Four-weekend plan, cut list, freeze |
| CV, LinkedIn and site disagree | Single `resume.json`; seasonal checklist |
| Cloned look (Brittany layout, shadcn defaults) | Borrow patterns, not layouts; own type, colour, monogram, copy |
| Marketing-grade sources | Rely on Lindgaard, Fogg, NN/g, Awwwards, Ladders (with caveats), Bock, Ma |

---

## 16. The Last 10%: Polish Checklist

- **Type:** ≤ 2 configured families; balance/pretty wrapping; real punctuation; tabular numerals; no weight change on hover; antialiasing.
- **Layout and colour:** every value from the scale (stylelint); shared edges checked at 200% zoom; one accent; ≥ 4.5:1 in both themes; dark mode tuned separately; concentric radii.
- **Motion:** ≤ 300 ms with a custom ease-out; no `ease-in` and no `transition: all`; instant ⌘K; hover gated to `(hover: hover)`; press feedback; `:focus-visible` rings; reduced motion → cross-fades; glass toggle applied pre-paint.
- **States:** 404, print, no-JS, forced colours, copy-email toast, ↗ on external links, PDF tested on iOS.
- **Meta:** SVG favicon + dark variant, apple-touch-icon, manifest; per-page OG; descriptive titles; `::selection`; `scrollbar-gutter: stable`; `theme-color` for both schemes; valid JSON-LD; sitemap; canonical; console greeting.
- **Proof:** logistics chips visible at 360 px; baselined metrics linked to evidence; CV in the nav; one-page ATS PDF; named testimonials; LinkedIn/GitHub/CV identical; zero typos, broken links or placeholders.
- **Verification:**
  - Lighthouse 95–100 ×4; LCP ≤ 1.8 s; INP ≤ 100 ms; CLS ≤ 0.02; JS ≤ 90 KB.
  - Tested in iOS Safari, Chrome Android, Firefox desktop and LinkedIn's in-app browser.
  - Five fresh testers pass the 7-second, 60-second and craft tests.

---

## 17. Caveats

- **Evidence quality varies.**
  - Strongest: Lindgaard 2006, Fogg 2002, NN/g, Awwwards' published criteria, Vercel and Cloudflare docs, caniuse and WebKit notes, Bock 2014 and Ma 2022/2024.
  - Weaker: "looks expensive" articles are mostly agency marketing (used here only as corroboration), and recruiter percentages from résumé-tool vendors (excluded).
- **Big-tech-specific portfolio evidence is thin.** The guidance is inferred from résumé guidance, ex-recruiter commentary and engineering norms. The CV screens you; the site confirms you.
- **Browser support is moving.** Firefox scroll-driven animations are weeks old, and cross-document View Transitions are still pending in Firefox.\[66\]\[70\] Re-check caniuse at every yearly refresh.
- **Liquid Glass may change again at WWDC 2027.** The skin architecture makes that a one-weekend token change.
- **Prices and free-tier limits** were checked for October–November 2026 and can change. Re-check at purchase.

## Sources

1. [50 milliseconds: how fast visitors form a first impression of your website](https://1a8agency.ie/blog/first-impression-50-milliseconds)
2. [The Psychology of First Impressions: What Your Homepage Says in 50 Milliseconds](https://boostbery.com/insights/the-psychology-of-first-impressions-what-your-homepage-says-in-50-milliseconds/)
3. [First Impressions Count in Website Design - visual appeal, beauty and aesthetics, halo effect, cognitive perception, webpage judgments of credibility - WebSiteOptimization.com](https://www.websiteoptimization.com/speed/tweak/blink/)
4. [Website first impression in 50 ms](https://www.404media.at/en/insights/website-first-impression-50ms)
5. [\[PDF\] How Do People Evaluate a Web Site's Credibility?](https://www.semanticscholar.org/paper/How-Do-People-Evaluate-a-Web-Site's-Credibility-Fogg-Soohoo/1d2e317e8d1a25f20020ddaace1231ecd9484daf)
6. [How Do People Evaluate a Web Site's Credibility](https://dejanmarketing.com/media/pdf/credibility-online.pdf)
7. [#1 Persuasive Technology Lab captology.stanford.edu](https://static.lukew.com/web_credibility_lecture.pdf)
8. [Web credibility - Making Good](https://www.makinggood.ac.nz/methods/web-credibility/)
9. [Web Credibility - BJ Fogg - Stanford University](https://www.slideshare.net/bjfogg/web-credibility-bj-fogg-stanford-university)
10. [Aesthetic Usability: How Beauty Improves User Experience — Design4Users](https://design4users.com/aesthetic-usability/)
11. [The Aesthetic-Usability Effect - NN/G](https://www.nngroup.com/articles/aesthetic-usability-effect/)
12. [The aesthetic-usability effect · roo.se](https://roo.se/en/feed/aesthetic-usability-effect/)
13. [Awwwards - Evaluation System](https://www.awwwards.com/about-evaluation/)
14. [Why submit your website to Awwwards, tips and how-tos for 2024](https://www.sommo.io/blog/why-submit-your-website-to-awwwards-tips-and-how-tos-for-2024)
15. [Awwwards — Grokipedia](https://grokipedia.com/page/Awwwards)
16. [Award-Winning Web Design: Judging Criteria Decoded](https://www.utsubo.com/blog/award-winning-website-design-guide)
17. [High-end web design: what makes it premium](https://webwavers.de/en/blog/website-design-elemente-premium)
18. [What Makes a Website Look Premium? 6 Craft Signals](https://xvscreations.com/blog/what-makes-a-website-look-premium)
19. [Web Interface Guidelines](https://web-interfaces.vercel.app/)
20. [Web Interface Guidelines](https://interfaces.rauno.me/)
21. [GitHub - raunofreiberg/interfaces: A non-exhaustive list of details that make a good web interface. · GitHub](https://github.com/raunofreiberg/interfaces)
22. [Agents with Taste](https://emilkowal.ski/ui/agents-with-taste)
23. [Animate — AI Agent Skill by Emil Kowalski](https://agenticskills.io/skills/animate)
24. [Rauno's web interface guidelines](https://information-overload.net/rauno-web-interface-guidelines/)
25. [Emil Kowalski Animate Skill: Build UI Animation Right](https://uichemy.com/design-skills/emil-animate/)
26. [Web Interface Guidelines](https://vercel.com/design/guidelines)
27. [Is your website AI slop? How to tell, and how to fix it - DEV Community](https://dev.to/laurilllll/is-your-website-ai-slop-how-to-tell-and-how-to-fix-it-1fn5)
28. [Rauno Freiberg](https://2022.rauno.me/)
29. [People · Learn UI](https://learn-ui.com/chapters/people)
30. [emilkowal-animations](https://lobehub.com/skills/pproenca-dot-skills-emilkowal-animations)
31. [Liquid Glass](https://en.wikipedia.org/wiki/Liquid_Glass)
32. [New on Yahoo](https://tech.yahoo.com/articles/wwdc-2025-apple-confirms-ios-175503604.html)
33. [iOS 27 has a bunch of changes, including a refined Liquid Glass design — but how much has changed from iOS 26?](https://www.tomsguide.com/phones/iphones/ios-27-has-a-bunch-of-changes-including-a-refined-liquid-glass-design-but-how-much-has-changed-from-ios-26)
34. [WWDC 2026 recap: iOS 27, all-new Siri, Liquid Glass fixed, and more - TapSmart](https://www.tapsmart.com/news/wwdc26-recap/)
35. [prefers-reduced-transparency media query - Web platform features explorer](https://web-platform-dx.github.io/web-features-explorer/features/prefers-reduced-transparency/)
36. [prefers-reduced-transparency media query](https://caniuse.com/wf-prefers-reduced-transparency)
37. [CSS at-rule: \`@media\`: \`prefers-reduced-transparency\` media feature](https://caniuse.com/mdn-css_at-rules_media_prefers-reduced-transparency)
38. [Prefers Reduced Transparency — cssShowcase](https://www.cssshowcase.com/snippets/a11y/prefers-reduced-transparency)
39. [Ladders Updates Popular Recruiter Eye-Tracking Study With New Key Insights on How Job Seekers Can Improve Their Resumes](https://www.prnewswire.com/news-releases/ladders-updates-popular-recruiter-eye-tracking-study-with-new-key-insights-on-how-job-seekers-can-improve-their-resumes-300744217.html)
40. [How long recruiters spend looking at your resume in 2026](https://standout-cv.com/usa/stats-usa/how-long-recruiters-spend-looking-at-resume)
41. [Is the 6-Second Resume Scan a Myth? - Spectacle Talent Partners](https://spectacletalentpartners.com/is-the-6-second-resume-scan-a-myth/)
42. [My Personal Formula for a Winning Resume](https://mln84.wordpress.com/2018/01/27/my-personal-formula-for-a-winning-resume-laszlo-bock/)
43. [Laszlo Bock on X: "My Personal Formula for a Winning Resume https://t.co/GN33Yy82nb" / X](https://x.com/LaszloBock/status/516381662351859712)
44. [My Personal Formula for a Winning Resume](https://www.linkedin.com/pulse/20140929001534-24454816-my-personal-formula-for-a-better-resume/?trk=pulse-det-nav_art&amp=&trk=pulse-det-nav_art&amp=&irgwc=1)
45. [An Ex-Meta Recruiter's Inside Guide to Creating a Stand Out SWE Resume](https://formation.dev/blog/software-engineer-resume-guide-examples)
46. [how can i get my resume shortlisted by google for a software engineer job](https://fortune.com/2014/10/02/how-can-i-get-my-resume-shortlisted-by-google-for-a-software-engineer-job)
47. [Jump to ratings and reviews](https://www.goodreads.com/book/show/27991761-google-r-sum-the)
48. [Software Engineering Intern, Summer 2027 — Google Careers](https://www.google.com/about/careers/applications/jobs/results/109864326646375110-software-engineering-intern-summer-2027)
49. [Software Engineering Intern, 2027 (English) — Google Careers](https://www.google.com/about/careers/applications/jobs/results/104489346874122950-software-engineering-intern/)
50. [How to Find and Recruit Developers on GitHub: The Complete Sourcing Guide](https://recruiter.daily.dev/resources/recruit-developers-on-github-sourcing-guide/)
51. [Do Hiring Managers Look at Personal Websites? (2026 Data)](https://myseera.com/blog/personal-website-for-job-seekers)
52. [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
53. [Vercel Hobby Plan](https://vercel.com/docs/plans/hobby)
54. [Vercel Pricing in 2026 Explained: Hobby Limits, the \$20 Pro Seat and Credit, Flat Rate CDN, Overages and What the Same Money Buys on Your Own Server](https://massivegrid.com/blog/vercel-pricing-explained-2026/)
55. [Cloudflare Pages vs Workers in 2026: which to use for a site](https://convika.com/compare/cloudflare-pages-vs-workers/)
56. [Cloudflare Pages Free Plan Limits in 2026 (and Pages vs Workers)](https://formsubmit.app/blog/cloudflare-pages-free-plan-limits)
57. [Cloudflare Pages Pricing & Bandwidth Limits 2026: Free vs](https://www.devtoolreviews.com/reviews/cloudflare-pages-pricing-bandwidth-limits-2026)
58. [Cloudflare Pages vs Workers: which should you choose?](https://flaviocopes.com/cloudflare-pages-vs-workers/)
59. [Cloudflare Pages vs Workers: which should you choose?](https://daily.dev/posts/cloudflare-pages-vs-workers-which-should-you-choose--js6qztt4f)
60. [The View Transitions API in 2026: :active-view-transition and Building Native Page Transitions](https://brainstormsandraves.com/css/view-transitions-2026/)
61. [CSS View Transitions: The Complete Developer Tutorial - onlyWebPro](https://www.onlywebpro.com/tutorials/html-css/css-view-transitions-the-complete-developer-tutorial)
62. [What Is the View Transitions API and Should You Use It in 2026?](https://phoenix.studio/blog/view-transitions-api-2026)
63. [Cross-Document View Transitions: Browser Support, MPA](https://www.testmuai.com/learning-hub/cross-document-view-transitions-browser-support/)
64. [Scroll-Driven Storytelling: A Developer's Guide (2026)](https://scrollytelling.ai/scroll-driven-storytelling/)
65. [Scroll-Driven Animations in CSS: view(), scroll() and Ranges](https://refracttools.com/blog/css-techniques/scroll-driven-animations-css/)
66. [Scroll-driven animations are Baseline at last - DEV Community](https://dev.to/richicodes/scroll-driven-animations-are-baseline-at-last-3c8g)
67. [WebKit Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)
68. [Scroll-driven animations with animation-timeline — 10LOC](https://10loc.dev/posts/animation-timeline-scroll-driven-css)
69. [Scroll-Driven Animation: When Scroll Becomes the Timeline](https://www.codeslog.com/en/posts/scroll-driven-animation/)
70. [View Transitions MPA Guide (2026)](https://webperfclinic.com/article/cross-document-view-transitions-mpa-2026)
