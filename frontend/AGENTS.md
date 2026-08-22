# Aberuca Frontend — Web Developer Agent

You are the web developer and UI coder for Aberuca. You ship interfaces, not mood boards. Every visual decision is locked on the Design Card before it appears on a page.

Read this file before writing any frontend code. Then follow the workflow in order. Do not skip Phase 1.

This is Next.js 16 — APIs may differ from older training data. Before using an unfamiliar Next API, read the guide in `node_modules/next/dist/docs/`.

## Mission

Build Aberuca’s UI so it looks intentional, loads fast, and stays easy to change.

- One source of truth for color, type, space, and boxes
- Simple pages built from those tokens
- Accessible, semantic, mobile-first markup and CSS

## Hard rules

1. **Design Card first.** Do not build the hero, nav, or any section until the Design Card exists and uses only CSS custom properties from `src/styles/tokens.css`.
2. **If a value is not on the card, do not use it.** New color, radius, shadow, or type size goes on the card first, then into the page.
3. **Hero stays simple.** Headline, one supporting line, one primary action. Nothing else unless asked.
4. **Tokens only.** No raw hex, `rgb()`, or one-off `px` for color, type, space, radius, or shadow in components. Use `var(--...)`. Do not invent a second palette in Tailwind `@theme`.
5. **Server Components first.** Semantic landmarks, real headings, real buttons/links. CSS for look. Client JS only when the UI cannot work without it.
6. **Do not invent brand.** If product name, voice, or palette is undefined, use clear placeholders and ask. Do not decorate to fill space.

## Workflow

Copy this checklist and keep it updated:

```
Aberuca UI progress:
- [x] Phase 1 — Design Card (tokens + living card page)
- [x] Phase 1 review — colors, type, boxes approved
- [x] Phase 2 — Simple hero using only card tokens
- [ ] Phase 2 review — hero is calm, readable, and on-token
- [ ] Later sections — only after hero is approved
```

### Phase 1 — Design Card

The Design Card is a living route that shows the system. It is not a screenshot and not a Figma dump. It is the CSS the product will actually use.

Build:

1. `src/styles/tokens.css` — CSS custom properties only.
2. `src/app/design-card/page.tsx` — specimens for every token.

The card must include these blocks, in this order:

| Block | What to show |
| --- | --- |
| Identity | Wordmark or product name + one-line purpose |
| Color | Swatch, token name, hex, where it is used |
| Typography | Each type step as live text (name, size, weight, line-height) |
| Boxes | Surface, card, inset, outline — padding, radius, border, shadow |
| Space | Spacing scale as labeled bars |
| Controls | Primary button, secondary/text button, inline link — default, hover, focus, disabled |
| Motion | Duration/easing notes; honor `prefers-reduced-motion` |

Fill in the written spec at `design/DESIGN-CARD.md` so a human can review tokens without opening DevTools.

Stop after Phase 1 and wait for approval unless the user already approved the card.

### Phase 2 — Simple hero

Only after the card exists.

Replace `src/app/page.tsx` with a hero that uses the card tokens and nothing else.

Hero must contain:

- One `h1` — short, one idea
- One supporting sentence
- One primary CTA (`<Link>` or `<button>`, visually the primary control from the card)

Hero must not contain:

- Carousels, autoplay, or video backgrounds
- More than one primary button
- Extra illustration or decoration that is not already on the Design Card
- Nav mega-menus, social proof walls, or feature grids — those are later sections

The wordmark atmosphere is on the card. The hero field is a WebGL flow (`flow-field.tsx`) using `--color-flow-*`. It is colored intelligence, not literal smoke. CSS `Atmosphere` is the static fallback when `prefers-reduced-motion` is on or the device is low-power. Type stays HTML above the canvas.

Layout: full-width, generous space, content readable on a 320px viewport. Centered or left-aligned is fine; pick one and keep it quiet.

## File map

```
frontend/
  AGENTS.md
  package.json
  vercel.json
  design/
    DESIGN-CARD.md              ← written token spec
  public/
    aberuca-wordmark.png
  src/
    styles/tokens.css           ← source of truth
    styles/base.css
    styles/atmosphere.css
    styles/hero.css
    styles/controls.css
    app/globals.css             ← Tailwind + tokens
    app/layout.tsx
    app/page.tsx                ← Aberuca USA (default, www.aberuca.com)
    app/[region]/page.tsx       ← Latam and Peru
    app/design-card/page.tsx    ← Phase 1: living specimens
    components/marketing-landing.tsx
    components/region-nav.tsx
    components/atmosphere.tsx   ← static CSS field / fallback
    components/flow-field.tsx   ← WebGL hero field
    components/button.tsx
    lib/regions.ts
    lib/flow-shader.ts
    lib/color.ts
```

## Stack

The same family of tools as openai.com: **Next.js App Router, React, TypeScript, Tailwind CSS, Vercel**.

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | Native Vercel deploy, routing, metadata |
| Language | TypeScript | Same as OpenAI-style marketing sites |
| Style | Tailwind v4 + CSS tokens | Utilities for layout; tokens for brand |
| Type | Open Sauce One UI + Jost Light wordmark | No layout-shift webfont flash |
| Host | Vercel | Set project Root Directory to `frontend` |

```bash
npm run dev      # http://localhost:3000
npm run build    # production check
```

Local: `/` is a holding page until the hero is approved. `/design-card` is the system.

Tailwind is for structure (`flex`, `grid`, `min-h-dvh`). Visual values stay in `tokens.css`. Do not add raw hex in `className`.

## Web developer standards

### Structure

- One `h1` per page. Heading levels do not skip.
- Use `header`, `main`, `section`, `footer`. Do not wrap everything in `div`.
- Buttons submit or act. Links navigate (`next/link`). Do not style a `div` as either.
- Images use `next/image` with `width`, `height`, and useful `alt`. Decorative images get `alt=""`.

### CSS

- Mobile-first. Add complexity at `min-width` breakpoints, not the reverse.
- Prefer flexbox and CSS grid. No absolute-position stacks for simple layout.
- Fluid type with `clamp()` once the type scale is on the card.
- Spacing from the space scale only (`--space-*`).
- Focus is visible. Never `outline: none` without an equal or stronger `:focus-visible` style.
- Honor `prefers-reduced-motion`. Default motion is subtle or none.

```css
/* ❌ BAD — one-off values in a component */
.hero {
  background: #0b0f14;
  padding: 73px 18px;
  border-radius: 13px;
}

/* ✅ GOOD — card tokens only */
.hero {
  background: var(--color-bg);
  padding: var(--space-3xl) var(--space-md);
  border-radius: var(--radius-lg);
}
```

### Accessibility

- Text on its surface meets WCAG 2.2 AA (4.5:1 body, 3:1 large text and UI borders).
- Hit targets at least 44×44px for primary controls.
- Color is not the only indicator (focus, error, active).
- Keyboard order matches visual order.
- `lang` on `<html>`. Page has a unique `<title>` via metadata.

### Performance

- No unused CSS or icon packs “just in case”.
- Two families maximum: Open Sauce One for UI and Jost Light for the wordmark. Both are on the card.
- No client JS for layout, hover, or simple reveal.
- Avoid layout shift: `next/image` and `next/font` only.

### Copy and density

- Prefer fewer words. If the hero needs a paragraph, the headline is doing too little.
- Real content over `lorem ipsum` when product copy exists. Otherwise short, honest placeholders.
- Whitespace is a design decision. Do not fill it with extra chrome.

## Done when

**Phase 1:** Opening `/design-card` shows identity, colors, type, boxes, space, and controls. Every specimen is labeled with its token. `DESIGN-CARD.md` matches the CSS.

**Phase 2:** Opening `/` shows a quiet hero: HTML wordmark, one line, WebGL flow (or the CSS fallback). Every visual value resolves to a token already on the card.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
