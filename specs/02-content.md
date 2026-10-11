# 02 · Content

Domain: `src/content` · Prefix: `CNT`

## Purpose

The portfolio tells a real CV. Its text lives in a single place, in two languages, and never includes private
contact details.

## Requirements

| Id     | Requirement                                                                                                                                                                                                                                                         | Verification                           |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| CNT-01 | **Single source.** All visible text comes from `src/content`. Components hold no text literals, and the portfolio and the reading mode show the same content.                                                                                                       | Manual (code review)                   |
| CNT-02 | **Two languages, one story.** Spanish and English have the same chapters, figures, links and stack, and name every section and every shape.                                                                                                                         | Test: `content.spec.ts`                |
| CNT-03 | **Initial language.** `?lang=` in the URL wins; otherwise the last choice of the visitor; otherwise the browser language (Spanish, or English for any other). The language is reflected in `<html lang>`, the title and the description, and the URL can be shared. | Test: `resolveLocale.spec.ts` · Manual |
| CNT-04 | **Privacy.** No phone number or email is published in any language. Contact is LinkedIn and GitHub.                                                                                                                                                                 | Test: `content.spec.ts`                |
| CNT-05 | **Emphasis without HTML.** `**text**` is rendered in bold. No HTML is interpreted: there is no `v-html` in the project.                                                                                                                                             | Manual (code review)                   |
| CNT-06 | **Numbers in their language.** Figures and percentages are formatted for the active language (`1.000.000` / `1,000,000`).                                                                                                                                           | Manual                                 |

## How to edit it

- A text: `es.ts` and `en.ts`.
- A link or a technology: `shared.ts` (not translated).
- A new language: a file that satisfies the `Content` type and an entry in `locale.ts`.

## Out of scope

A content management system, machine translation and more than two languages.
