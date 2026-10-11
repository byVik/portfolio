# Specifications

This project is built with **Spec Driven Development**: behaviour is written here first, then in tests, and last in
code.

## Flow

1. **Spec.** A numbered requirement is added or changed in the spec of its domain (`SCN-07`, `CNT-03`…).
2. **Tests.** The requirement becomes tests that cite its id: `describe('SCN-07 · adaptive quality')`.
3. **Implementation.** The minimum code that turns those tests green.
4. **Changes.** If the behaviour changes, the spec changes first.

## Index

| Spec                                    | Prefix | Domain        | What it covers                                        |
| --------------------------------------- | ------ | ------------- | ----------------------------------------------------- |
| [01 · 3D scene](01-scene.md)            | `SCN`  | `src/scene`   | Shapes, morphing, traffic, gestures and performance   |
| [02 · Content](02-content.md)           | `CNT`  | `src/content` | The CV, its two languages and what is never published |
| [03 · Story](03-story.md)               | `STO`  | `src/story`   | Sections, navigation and interactive controls         |
| [04 · Reading mode](04-reading-mode.md) | `REA`  | `src/reading` | The plain CV, printable and downloadable              |
| [05 · Games](05-games.md)               | `GAM`  | `src/story`   | The games section: cards, statuses and videos         |

## Conventions

- A requirement describes **what the visitor sees or can do**, not how the code is written.
- Each requirement says how it is verified: **Test** (with its file) or **Manual** (checked in the browser).
  Visual behaviour is verified by hand; everything that is logic has a test.
- Ids are never reused: a retired requirement is marked as retired.
- To find the tests of a requirement, search for its id in `src/`.
