# Glass: where it goes and how it stays readable

The glass skin lives in `src/styles/skin.css`. It is a material for floating chrome only.

| Surface | Class | Tier when available |
| --- | --- | --- |
| Nav pill | `glass glass-lens` | Frosted; refracted rim in Chromium |
| Command palette (⌘K / Ctrl K) | `glass glass-3` | Frosted, heavy tint |
| Appearance panel (theme, Reduce glass) | `glass glass-3` | Frosted, heavy tint |
| Toast | `glass glass-1` | Frosted |
| Note on the dashboard in the night band | `glass glass-clear` | Clear, always dark |

Nothing else uses it, and it never sits behind body text.

## Three tiers

1. **Solid.** The default: opaque surface, hairline, shadow. Used when Reduce glass is on (`<html data-glass="off">`, set before first paint), when the system asks for reduced transparency or more contrast, in forced colours, and in browsers without `backdrop-filter`.
2. **Frosted.** A tinted layer over a blurred, slightly saturated backdrop, with a soft dark rim, a bright top edge, a hairline and a soft shadow. Blur and shadow grow with elevation: 12 px for toasts, 20 px for the nav, 32 px for panels.
3. **Refracted.** Chromium only, nav pill only. An SVG filter bends the backdrop along the pill's rim and frosts the middle. The displacement map is drawn in a canvas the size of the pill by `src/scripts/chrome.ts` when the browser is idle. Safari and Firefox stay on tier 2.

Over the night band the nav takes the dark half of the tokens (`data-over="night"` on the header).

## Contrast

The tint is what guarantees legibility, because anything can scroll under the nav. Worst cases, computed by compositing the tint over pure black or pure white (blur and saturation cannot make a backdrop darker than black or lighter than white):

| Surface | Text | Worst backdrop | Ratio |
| --- | --- | --- | --- |
| Light nav pill, tint 72% | Ink | Black | 9.1:1 |
| Dark nav pill, tint 76% | Ink | White | 6.5:1 |
| Light panel, tint 92% | Muted | Black | 6.2:1 |
| Dark panel, tint 94% | Muted | White | 5.8:1 |
| Clear note, tint 70%, always dark | Ink | White | 6.0:1 |

Muted text is not used on the nav pill: at a 72% tint it would drop to 3.7:1 over a dark screenshot. Accent-coloured text is not used on glass at all.

## Rules

- At most two glass surfaces are on screen at rest (the nav and, in the band, the note on the dashboard). Panels and toasts are transient.
- Motion on glass is 180 ms or less; the palette opens with no animation.
- Panels are tinted more heavily than they need to be for contrast alone. Chromium blurs a backdrop less near a panel's edge, and at a lighter tint the home page's masthead showed through as a ghost.
- New chrome gets `glass` plus an elevation class. If it needs muted text, give it the panel tint.
