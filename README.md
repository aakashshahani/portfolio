# Aakash Shahani — Portfolio ♠♟

A personal portfolio with a twist: a **"Dealer's Choice" lobby** where visitors pick
how to experience my work — a **Poker table**, a **Chess game**, or a clean **Classic**
view. Same content, three ways to play it.

Built with **React + Vite + TypeScript + Tailwind CSS + Framer Motion**.

## The three tables

| Route        | View     | Idea                                                              |
| ------------ | -------- | ---------------------------------------------------------------- |
| `/`          | Lobby    | Pick your table. ⌘K command palette everywhere.                  |
| `/poker`     | Poker    | Projects dealt as cards that flip on hover; skills as a chip stack. |
| `/chess`     | Chess    | Career as opening → midgame → endgame; a "mate in one" unlocks the resume. |
| `/straight`  | Classic  | Conventional, recruiter-friendly layout. The professional default. |

All content lives in a single file: [`src/data/content.ts`](src/data/content.ts).
Edit it once and every view updates.

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

## Accessibility & performance

- Respects `prefers-reduced-motion`.
- Keyboard-navigable (⌘K palette, focusable cards, Esc to close overlays).
- Lazy-loaded views so the lobby paints instantly.
- Semantic HTML + Open Graph / meta tags for sharing.

---

© Aakash Shahani. Built with React & Tailwind.
