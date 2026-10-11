# AGENTS.md

Rules for AI agents, and for people, working in this repository.

## What it is

The portfolio of Viktor Strohush Loyish: a page with a 3D scene of points that changes shape as you scroll.
Vue 3, TypeScript, Three.js, Vite and Vitest. No backend.

## Commands

```bash
npm run dev            # development server
npm test               # unit tests
npm run lint           # ESLint
npm run format         # Prettier (writes); format:check only checks
npm run build          # type check + build in dist/
npm run export         # regenerates public/og.jpg, the CV PDFs and the README screenshots
npm run deploy         # build + deploy to Cloudflare (viktorstrohush.dev)
```

Before calling a change done: `npm run lint`, `npm run format:check`, `npm test` and `npm run build`, all green.

## Workflow: spec → tests → code

1. If behaviour changes, the spec of its domain in `specs/` is updated **first**.
2. The requirement becomes tests that cite its id: `describe('SCN-07 · …')`.
3. Then it is implemented.

Visual behaviour is verified by hand in the browser, and the spec says so. Nothing is marked as tested unless it
has been tested.

## Structure: by domain

```
src/
  app/        Page composition, header and the visual identity tokens
  content/    The CV, its two languages and the active locale
  scene/      The 3D scene
    model/      Pure logic: shapes, paths, scroll, rotation, quality
    engine/     Three.js: rendering and shaders
    ui/         Vue: canvas, gestures, HUD and the `controls.ts` bridge
  story/      The sections of the scroll story and their controls (widgets/)
  reading/    Reading mode
  shared/     Utilities with no domain
specs/        Specifications
scripts/      PDF, preview image and README screenshot export
```

### Dependency rules

- `scene/model` imports neither Three.js nor Vue, and does not touch the DOM. Everything in it has tests.
- `scene/engine` is the only place that imports Three.js.
- The rest of the application talks to the scene only through `scene/ui/controls.ts`.
- `content` does not depend on `story`, `reading` or `app`.
- Within a domain, relative imports; across domains, the `@/` alias.

## Conventions

- Everything is in English: identifiers, comments, test names, specs and commit messages. The only Spanish in the
  repository is the Spanish site content (`src/content/es.ts`) and `README.es.md`.
- Comments explain why, they do not repeat the code.
- Small, single-responsibility components. Reusable logic goes into a composable or into `model/`.
- No visible text in components: it goes in `src/content`, always in both languages (CNT-01, CNT-02).
- Colours and typefaces only as CSS tokens in `src/app/styles.css`. The scene reads those same tokens.
- Tests live next to the code (`*.spec.ts`).
- The README exists in English (`README.md`, the one GitHub shows) and in Spanish (`README.es.md`): both are
  changed together.
- No new dependencies without a reason that fits in one sentence.

## Do not

- Do not publish a phone number or an email. CNT-04 checks it with a test: it is not to be disabled.
- Do not invent or embellish CV data. If it is not in the real CV, it does not go in.
- Do not use `v-html`.
- Do not raise the default point count or resolution without measuring performance.
