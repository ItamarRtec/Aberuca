# Aberuca Design Card

Locked from the official wordmark field (mist → ember → rose → violet → blue, white geometric sans, film grain). Ember is atmosphere only — it fails AA as a button fill.

## Identity

- Product name: Aberuca
- One-line purpose: Connecting agents to your business.
- Voice (3 words): Quiet, atmospheric, precise
- Wordmark: Jost Light, sentence case, `--weight-light`, `--color-text-on-atmosphere`, `--tracking-wordmark`
- Field: coded in CSS — mist-to-blue wash, three blurred orbs, SVG grain, Jost Light wordmark. No PNG required.
- `--gradient-atmosphere` + `--atmosphere-blur` (6rem) + grain at `--grain-opacity` (0.48)
- Banner frame: `--atmosphere-aspect` (1.768, from the 1024×579 reference)
- Wordmark size: `--text-wordmark`
- Atmosphere min height: `--atmosphere-min-height` (16rem)
- Page measure: `--measure` (40rem), `--page-width` (72rem)
- Caps tracking: `--tracking-caps` (0.08em)

## Color

| Token | Hex | Used for |
| --- | --- | --- |
| `--color-bg` | `#efede8` | Page background (lifted mist) |
| `--color-surface` | `#ffffff` | Cards, panels |
| `--color-surface-inset` | `#e4e1db` | Recessed wells |
| `--color-text` | `#16181c` | Headlines and body |
| `--color-text-muted` | `#5c6168` | Supporting copy |
| `--color-accent` | `#2b5fa0` | Primary action (brand blue) |
| `--color-accent-text` | `#ffffff` | Text on accent |
| `--color-border` | `#d4d0c9` | Hairline borders |
| `--color-focus` | `#2b5fa0` | Focus ring |
| `--color-mist` | `#c0beb9` | Atmosphere left |
| `--color-ember` | `#ca3b35` | Atmosphere glow — not a button |
| `--color-ember-hot` | `#c41f47` | Crimson orb core |
| `--color-rose` | `#c41f47` | Atmosphere mid |
| `--color-violet` | `#8967a3` | Atmosphere mid-right |
| `--color-violet-wash` | `#9f7eae` | Atmosphere blend |
| `--color-blue` | `#2b5fa0` | Atmosphere right / accent |
| `--color-blue-deep` | `#3669ab` | Atmosphere far right |
| `--color-text-on-atmosphere` | `#ffffff` | Wordmark and type on the field |
| `--color-text-on-atmosphere-muted` | `white / 0.82` | Hero supporting line |
| `--color-flow-gray` | `#b9b6b2` | Flow field left |
| `--color-flow-coral` | `#e4444e` | Flow field center |
| `--color-flow-violet` | `#8560a0` | Flow field mid |
| `--color-flow-blue` | `#3268ab` | Flow field right |
| `--color-flow-navy` | `#285b98` | Flow depth on the blue edge |

Contrast check (AA):

- Body text on `--color-bg`: 15.2:1
- Body text on `--color-surface`: 17.8:1
- Muted text on `--color-bg`: 5.3:1
- `--color-accent-text` on `--color-accent`: 6.5:1
- White on ember: 4.0:1 — fail for body; do not use as a primary control

## Typography

- Body font: Open Sauce One (`--font-body`)
- Display font: Open Sauce One (`--font-display`)
- Wordmark: Jost Light (`--font-wordmark`), `--text-wordmark`, `--weight-light`, `--leading-wordmark`

| Token | Size | Weight | Line-height | Use |
| --- | --- | --- | --- | --- |
| `--text-xs` | 0.75rem | 500 | 1.35 | Labels, meta |
| `--text-sm` | 0.875rem | 400 | 1.6 | Secondary UI |
| `--text-md` | 1rem | 400 | 1.6 | Body |
| `--text-lg` | 1.25rem | 400 | 1.35 | Lead / supporting |
| `--text-xl` | 1.75rem | 500 | 1.15 | Section title |
| `--text-hero` | clamp(1.35rem, 2.2vw + 0.8rem, 2rem) | 500 | 1.15 | Hero headline |
| `--text-wordmark` | clamp(4.75rem, 10.5vw, 9.75rem) | 300 | 0.9 | Aberuca wordmark |

## Boxes

| Token set | Radius | Border | Shadow | Padding | Use |
| --- | --- | --- | --- | --- | --- |
| Surface | `--radius-lg` | none | `--shadow-none` | `--space-xl` | Page sheets |
| Card | `--radius-lg` | `--border-thin` | `--shadow-soft` | `--space-lg` | Raised content |
| Inset | `--radius-md` | `--border-thin` | `--shadow-none` | `--space-md` | Inputs, wells |
| Outline | `--radius-md` | `--border-thin` | none | `--space-md` | Quiet frames |
| Atmosphere | `--radius-lg` | none | `--shadow-soft` | `--space-3xl` | Brand field |

Required box tokens in `tokens.css`: `--radius-sm`, `--radius-md`, `--radius-lg`, `--border-thin`, `--shadow-soft`, `--shadow-none`.

## Space

Scale is 4-based. Do not add sizes between steps unless the card is updated first.

| Token | Value |
| --- | --- |
| `--space-2xs` | 0.25rem (4px) |
| `--space-xs` | 0.5rem (8px) |
| `--space-sm` | 0.75rem (12px) |
| `--space-md` | 1rem (16px) |
| `--space-lg` | 1.5rem (24px) |
| `--space-xl` | 2rem (32px) |
| `--space-2xl` | 3rem (48px) |
| `--space-3xl` | 4rem (64px) |
| `--space-4xl` | 6rem (96px) |

## Controls

- Primary: accent fill, accent-text label, `--radius-md`, min height `--control-min-height` (44px)
- Secondary: transparent surface, `--border-thin`, `--color-text`
- Link: underline on hover and focus; never color-only
- Focus: `--focus-ring`
- Ember / rose / violet are not control fills

## Motion

- `--duration-fast`: 120ms
- `--duration-med`: 200ms
- `--duration-nav-rise`: 1.4s and `--duration-nav-extend`: 1.25s — one dock motion: rise, then widen
- `--ease-nav-rise` / `--ease-nav-extend`: unhurried docking
- Hero flow: `--flow-fps` 24, `--flow-cycle` 32s, `--flow-grain` 0.035
- Flow is colored intelligence, not literal smoke
- No motion when `prefers-reduced-motion: reduce`
- Static CSS field fallback on reduced motion or low-power devices
- Grain on the CSS card is a static overlay

## Approval

- [x] Colors locked from wordmark
- [x] Type locked (Open Sauce One, regular wordmark)
- [x] Boxes locked
- [x] Card page matches this spec
- [x] Ready for simple hero
