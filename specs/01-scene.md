# 01 · 3D scene

Domain: `src/scene` · Prefix: `SCN`

## Purpose

A cloud of points accompanies the content: each section has a shape and, as the visitor scrolls, the same points
move from one to the next. It is the idea behind the portfolio, “I take the shape of the problem”, made visible.

## Requirements

| Id     | Requirement                                                                                                                                                                                                                                              | Verification                                        |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| SCN-01 | **Deterministic shapes.** Each shape is generated from a seed: the same seed gives the same points, and no coordinate exceeds 2.3 units, the camera frame.                                                                                               | Test: `model/shapes.spec.ts`                        |
| SCN-02 | **From scroll to scene.** The scene position is continuous (1.5 = halfway between the second and the third). The shape holds while its section is centred and morphs in the middle stretch of the way. Beyond the ends nothing changes.                  | Test: `model/scrollMath.spec.ts`                    |
| SCN-03 | **Morphing in waves.** Each point starts its journey with its own delay and jitters halfway; at the end, every point is in place.                                                                                                                        | Manual                                              |
| SCN-04 | **Pruning.** In the Volinga scene 80% of the points fall and the HUD reads “20%”. “Before” brings them back as noise around the shape and the HUD returns to “100%”.                                                                                     | Manual                                              |
| SCN-05 | **Traffic.** Some shapes have movers with a trail (signals, packets, flights, agents, events, requests) that follow a path and start over without leaving the frame. They fade out when the scene changes.                                               | Test: `model/traffic.spec.ts`                       |
| SCN-06 | **Orientation.** Each scene spins at its own speed. Dragging rotates the shape with inertia; shapes that do not spin on their own turn back to face the viewer when released; the vertical tilt is limited; the shape leans slightly towards the cursor. | Test: `model/rotation.spec.ts`                      |
| SCN-07 | **Adaptive quality.** After 3 s of warm-up, FPS is measured in 1.5 s windows; a window below 42 FPS drops one step (fewer points and lower resolution). Quality never goes back up, and the gaps of a background tab do not count.                       | Test: `model/quality.spec.ts`                       |
| SCN-08 | **Typed shape.** In the last scene, a text of up to 14 characters becomes a shape: the points spread over its letters. A new text waits for the previous one to dissolve; an empty text brings the cloud back.                                           | Test: `model/textMask.spec.ts`, `textMorph.spec.ts` |
| SCN-09 | **Gestures.** The cursor pushes nearby points away; a click outside the controls fires a shockwave; dragging over text selects instead of rotating. On touch screens scrolling is never blocked.                                                         | Manual                                              |
| SCN-10 | **Pipeline pulse.** “Run pipeline” fires a pulse that crosses the shape in 3.4 s; each stage is ticked when the pulse crosses its ring.                                                                                                                  | Manual                                              |
| SCN-11 | **Degradation.** Without WebGL the content is still complete and readable. With `prefers-reduced-motion` there is no jitter, spin or traffic. Three.js is downloaded separately and does not delay the text.                                             | Manual                                              |

## Architecture

| Layer     | What it holds                                   | Rule                                       |
| --------- | ----------------------------------------------- | ------------------------------------------ |
| `model/`  | Shapes, paths, scroll, rotation, quality, text  | Pure: no Three.js, no Vue, no DOM. Tested  |
| `engine/` | `ParticleField`, `TrafficLayer` and the shaders | The only place that imports Three.js       |
| `ui/`     | `SceneCanvas`, gestures, HUD and `controls.ts`  | The only bridge between Vue and the engine |

## Out of scope

External 3D models, post-processing and sound.
