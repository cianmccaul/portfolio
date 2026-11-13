# Design review, 13 November 2026

The whole site at 360, 768, 1280 and 1600 px wide, light theme on every page and dark on home, BodyMed Hub, Jarvis and About, plus a keyboard pass over the focus states. Reviewed as a pre-launch punch list: what a demanding product designer would stop on.

## Fixed

| # | Where | What was wrong | What changed |
| --- | --- | --- | --- |
| 1 | Home, lower half | Section titles (More projects, Experience, Education and awards, Contact) were a size smaller than the Hub page's section titles and much smaller than everything above them, so the page lost its voice after the work. | Section titles are now the same size as the Hub page's (`text-h1`), site-wide. |
| 2 | Home, Experience | Three rows in a row read "Work experience · 2022–23", "Work experience · 2022–23", "School IT team · 2022–23": repetitive, and the CV already presents them as one Transition Year entry. | One "Transition Year · 2022–23" entry with a line for each placement, the same grouping as the CV. Bullets get a little air between them. |
| 3 | Home, Contact | The last section offered the email and two profiles, but no way to the CV: the one thing a recruiter at the bottom of the page is looking for. | "View CV" and "Download the PDF" under the email. |
| 4 | Home, proof strip at 768 | "First Class" broke across two lines with "Honours" floating beside the second. | The figure never breaks; its unit drops under it when the column is narrow. |
| 5 | Home, proof strip | It repeated the clinic band's 438 / 90 a screen later. | New facts (years at BodyMed, live demos, First Class Honours), all worked out from resume.json. |
| 6 | Home, clinic band | Empty space under the Role / Client / Live since / Stack sheet, beside "Explore the Hub". | The left column is shorter (the suite note moved under the three numbers), and the space under the sheet is reserved for the owner-approved headline figure. |
| 7 | Jarvis and PulsePay screenshots | Their own strong colours (blue-violet, pink) read as part of the page's design. | Both sit on a neutral mat, so they read as product shots. |
| 8 | Focus rings | Text links and the booking stepper's rows had square focus boxes, unlike the rounded buttons; the "Read the case study" links on the Hub page's suite cards stretched to the card's full width, so their focus ring did too. | Shapeless elements get a soft 6 px corner for their ring; the suite card links size to their text. |

## Looked at and left as they are

| Where | Why |
| --- | --- |
| Email triage case study: the hero screenshot has white space to the right of the email | That is the demo's own layout. The image was re-cropped to a clean boundary on request, and the frame is full width. |
| About: the portrait is small (240 px) | It is the only portrait there is. The layout is ready for a 4:5 photo (see todo-content.md). |
| Product screenshots stay light in the dark theme | Deliberate, as on product pages: only the page around them changes. |
| BodyMed's experience entry is long (summary, four bullets) | It is the main job; the bullets are the content. It can shorten once the approval-gated line is decided. |
| Sticky "On this page" pill on a phone scrolls sideways | It keeps every section one tap away without wrapping into a block; the current section scrolls into view inside it. |
| Module map on a phone is rows, not tiles | 21 tiles in one column was most of three screens; rows keep it to one and a half. |
| Tour stops on a phone use phone captures, not shrunken desktop shots | Readable at 360 px; desktop sizes still get the desktop captures. |

## Checked and fine

Spacing rhythm (section gaps, rule above every section), type hierarchy (masthead → section titles → item titles → body), alignment to the 12-column grid at 1280 and 1600, no horizontal scroll at any width, focus rings visible in both themes and on the dark band, the sticky sub-nav marking the current section, the walkthrough's pause control.
