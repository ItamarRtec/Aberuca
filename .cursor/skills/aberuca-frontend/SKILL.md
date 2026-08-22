---
name: aberuca-frontend
description: Builds Aberuca frontend UI with Next.js on Vercel. Design Card first (colors, type, boxes), then a simple hero. Use when working on Aberuca frontend, Next.js, Vercel, web UI, design tokens, design card, hero, landing page, or any page section.
---

# Aberuca Frontend

Read and follow [frontend/AGENTS.md](../../../frontend/AGENTS.md) before writing UI code.

This is Next.js 16. Read `frontend/node_modules/next/dist/docs/` before using an unfamiliar Next API.

## Stack

Next.js App Router · React · TypeScript · Tailwind v4 · Vercel. Tokens in CSS custom properties stay the source of truth.

## Order of work

1. **Design Card** — lock tokens in `frontend/src/styles/tokens.css`, document them in `frontend/design/DESIGN-CARD.md`, render specimens at `/design-card`.
2. **Stop for approval** unless the user already approved the card.
3. **Simple hero** — replace `frontend/src/app/page.tsx` with one headline, one line, one primary CTA. Tokens only.

Do not build later sections before the hero is approved.

## Non-negotiables

- No raw hex / one-off spacing in components — `var(--token)` only
- Tailwind for layout only; do not invent a second palette in `@theme`
- Server Components by default; client JS only if required
- Visible `:focus-visible`; WCAG 2.2 AA contrast
- Mobile-first; honor `prefers-reduced-motion`
- Hero stays simple

## Additional resources

- Agent brief: [frontend/AGENTS.md](../../../frontend/AGENTS.md)
- Token spec: [frontend/design/DESIGN-CARD.md](../../../frontend/design/DESIGN-CARD.md)
- Token file: [frontend/src/styles/tokens.css](../../../frontend/src/styles/tokens.css)
