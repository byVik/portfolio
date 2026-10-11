# 03 · Story

Domain: `src/story` · Prefix: `STO`

## Purpose

The visitor goes through the career by scrolling: one section per stage, each with its shape and, where it adds
something, a control that lets them touch what is being told.

## Requirements

| Id     | Requirement                                                                                                                                                                    | Verification            |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| STO-01 | **One section per scene.** Opening screen, one chapter per stage, games, stack and contact, in the same order and with the same id as the scenes.                              | Test: `content.spec.ts` |
| STO-02 | **Staggered reveal.** The content of each section appears in order the first time it enters the viewport. With `prefers-reduced-motion` it is visible from the start.          | Manual                  |
| STO-03 | **Figures.** Headline figures count up from zero to their value when seen, once. Screen readers get the final value.                                                           | Manual                  |
| STO-04 | **Before / After.** In Volinga, a switch compares the scene with and without the spare code, and explains in one line what is being shown.                                     | Manual                  |
| STO-05 | **Run pipeline.** The first run starts by itself when the section is seen. The four stages are ticked in order, the button is disabled while it runs and then allows a repeat. | Manual                  |
| STO-06 | **Navigation.** On wide screens, a side rail lists the sections and marks the active one; elsewhere, a top bar shows progress.                                                 | Manual                  |
| STO-07 | **Header.** The fixed header never overlaps the content passing underneath. From it the visitor changes language, opens the CV and reaches LinkedIn and GitHub.                | Manual                  |
| STO-08 | **Narrow screens.** The shape sits on top and the text below, in a readable card. No control requires a mouse.                                                                 | Manual                  |
| STO-09 | **Keyboard.** Every control is reachable with the tab key and shows focus.                                                                                                     | Manual                  |

## Out of scope

Animations tied to external libraries, and routing: it is a single page.
