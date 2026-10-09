# 02 · Contenido

Dominio: `src/content` · Prefijo: `CON`

## Propósito

El portfolio cuenta un CV real. Su texto vive en un único sitio, en dos idiomas, y nunca incluye datos de contacto
privados.

## Requisitos

| Id     | Requisito                                                                                                                                                                                                                                                      | Verificación                           |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| CON-01 | **Fuente única.** Todo el texto visible sale de `src/content`. Los componentes no contienen literales de texto, y el portfolio y el modo lectura muestran el mismo contenido.                                                                                  | Manual (revisión de código)            |
| CON-02 | **Dos idiomas, una historia.** Español e inglés tienen los mismos capítulos, cifras, enlaces y stack, y nombran todas las secciones y todas las formas.                                                                                                        | Test: `content.spec.ts`                |
| CON-03 | **Idioma inicial.** Manda `?lang=` en la URL; si no, la última elección del visitante; si no, el idioma del navegador (español, o inglés para cualquier otro). El idioma se refleja en `<html lang>`, el título y la descripción, y la URL se puede compartir. | Test: `resolveLocale.spec.ts` · Manual |
| CON-04 | **Privacidad.** No se publica teléfono ni correo en ningún idioma. El contacto es LinkedIn y GitHub.                                                                                                                                                           | Test: `content.spec.ts`                |
| CON-05 | **Énfasis sin HTML.** `**texto**` se muestra en negrita. No se interpreta HTML: no hay `v-html` en el proyecto.                                                                                                                                                | Manual (revisión de código)            |
| CON-06 | **Números en su idioma.** Cifras y porcentajes se formatean según el idioma activo (`1.000.000` / `1,000,000`).                                                                                                                                                | Manual                                 |

## Cómo se edita

- Un texto: `es.ts` y `en.ts`.
- Un enlace o una tecnología: `shared.ts` (no se traduce).
- Un idioma nuevo: un archivo que cumpla el tipo `Content` y una entrada en `locale.ts`.

## Fuera de alcance

Gestor de contenidos, traducción automática y más de dos idiomas.
