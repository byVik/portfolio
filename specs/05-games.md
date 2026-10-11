# 05 · Games

Domain: `src/story` (section) and `src/content` (data) · Prefix: `GAM`

## Purpose

Outside work I design, build and publish games. The section shows it for what it is, a hobby, and along the way
proves with real products technologies from the CV: Three.js, TypeScript, Capacitor and publishing to stores.

## Requirements

| Id     | Requirement                                                                                                                                                                                                                             | Verification                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| GAM-01 | **A single section.** “I also make games” sits between OrderFlow and the stack, with its own shape (a gamepad) and without outweighing the professional experience.                                                                     | Test: `content.spec.ts`        |
| GAM-02 | **One card per game.** Name, genre, one sentence, technologies, status and a short gameplay video.                                                                                                                                      | Manual                         |
| GAM-03 | **Honest status.** A game is only listed as published if it has at least one public link. Games in development carry no links and name no stores or portals where they are not yet available.                                           | Test: `games.spec.ts`          |
| GAM-04 | **Verifiable figures.** A headline figure (downloads, players) only appears on published games.                                                                                                                                         | Test: `games.spec.ts`          |
| GAM-05 | **Two languages.** The same games, statuses, technologies and links in Spanish and English.                                                                                                                                             | Test: `games.spec.ts`          |
| GAM-06 | **Lightweight videos.** Each game has a video and a poster in `public/games/`; no video exceeds 500 kB. They are silent and looped, and are only downloaded and played while the card is on screen.                                     | Test: `games.spec.ts` · Manual |
| GAM-07 | **The visitor is in charge.** Each video has a button to pause and resume it. With `prefers-reduced-motion` it does not start by itself: the poster shows until the visitor plays it.                                                   | Manual                         |
| GAM-08 | **Reading mode.** The plain CV and the PDFs include the games in a compact block, with status and links.                                                                                                                                | Manual                         |
| GAM-09 | **No holes over the scene.** Videos are painted onto a canvas and the video element is not shown: that way the browser does not composite it as a hardware video layer, which leaves black rectangles over the 3D scene when scrolling. | Manual                         |

## How to add or publish a game

- **Add:** an entry in `src/content/shared.ts` (what is not translated) and its genre and sentence in `es.ts` and
  `en.ts`; video and poster in `public/games/<id>.mp4` and `.jpg`.
- **Publish:** change its status to `published` and add the link. GAM-03 fails if either is missing.

The videos come from gameplay captures through `ffmpeg`, at 480 × 270, 8 s and without audio:

```bash
ffmpeg -ss 1 -t 8 -i capture.mp4 -an -c:v libx264 -pix_fmt yuv420p -crf 31 -preset slow -movflags +faststart \
  -vf "scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=24" public/games/<id>.mp4
ffmpeg -ss 4 -i capture.mp4 -frames:v 1 -q:v 4 \
  -vf "scale=480:270:force_original_aspect_ratio=increase,crop=480:270" public/games/<id>.jpg
```

## Out of scope

Playable builds hosted on the portfolio and per-game detail pages.
