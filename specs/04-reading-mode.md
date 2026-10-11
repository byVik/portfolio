# 04 · Reading mode

Domain: `src/reading` · Prefix: `REA`

## Purpose

Whoever is in a hurry, or wants to keep the CV, reads it plain: no scene, on one sheet, printable and downloadable.

## Requirements

| Id     | Requirement                                                                                                                                                                                   | Verification             |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| REA-01 | **Same content.** Reading mode shows the portfolio content in a single column, without duplicating any text (CNT-01).                                                                         | Manual                   |
| REA-02 | **Open and close.** It opens from the header or with `?cv=1` in the URL; it closes with its button or with Escape. While it is open, the scene uses no GPU.                                   | Manual                   |
| REA-03 | **Print.** Printing from any view outputs the CV on A4, with no toolbar and no dark background, and without splitting a block across two pages.                                               | Manual                   |
| REA-04 | **PDF.** There is a downloadable PDF per language. `npm run export` regenerates them from the page itself, along with the social preview image and the README screenshots.                    | Manual: `npm run export` |
| REA-05 | **Privacy.** Neither the view nor the PDFs include a phone number or an email (CNT-04).                                                                                                       | Test: `content.spec.ts`  |
| REA-06 | **Language.** Reading mode follows the active language and lets the visitor change it.                                                                                                        | Manual                   |
| REA-07 | **It is a summary.** Reading mode and the PDFs say they are a summary and that the full CV, with contact details, is requested on LinkedIn. The contact section of the story offers the same. | Manual                   |

## Out of scope

Alternative CV templates and export to other formats.
