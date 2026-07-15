# Aakash Shahani — Portfolio

[![ci](https://github.com/aakashshahani/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/aakashshahani/portfolio/actions/workflows/ci.yml)

A single-page portfolio: dark, typography-first, and metric-driven. Projects are
full-width rows with headline numbers, a cursor-following screenshot preview on
desktop, and inline expandable case details.

Built with **React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lenis**.

## Structure

Everything is one page (`/`) with anchored sections: hero, selected work,
by-the-numbers, about + current research, experience, skills, and contact.
A ⌘K / Ctrl-K command palette jumps anywhere.

All content lives in a single file: [`src/data/content.ts`](src/data/content.ts).
Edit it once and the whole site updates.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & preview

```bash
npm run build      # type-checks then builds to dist/
npm run preview
```

## Deploy (Vercel)

Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).
`vercel.json` already rewrites all routes to `index.html` so client-side routing works.
Framework preset: **Vite**. Build command `npm run build`, output `dist`.

## Resumes

Downloadable PDFs live in [`public/resumes/`](public/resumes). Three role-targeted
versions: Software Engineer, Data Scientist, Data Engineer. Drop replacements in with
the same filenames to update them.

## Assets

- `npm run gen:og` — regenerates the social share image (`public/og.png`).
- `node scripts/gen-icons.mjs` — re-renders app icons from `public/favicon.svg`.

## Accessibility & performance

- Respects `prefers-reduced-motion` (animations become instant, smooth scroll disabled).
- Keyboard-navigable (⌘K palette, focusable rows, Esc to close overlays).
- WebP screenshots, self-contained assets, semantic HTML + Open Graph tags.

---

© Aakash Shahani. Built with React & Tailwind.
