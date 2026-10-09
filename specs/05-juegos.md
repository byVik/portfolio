# 05 · Juegos

Dominio: `src/story` (sección) y `src/content` (datos) · Prefijo: `JUE`

## Propósito

Fuera del trabajo diseño, programo y publico juegos. La sección lo enseña como lo que es, una afición, y de paso
demuestra con producto real tecnologías del CV: Three.js, TypeScript, Capacitor y publicación en tiendas.

## Requisitos

| Id     | Requisito                                                                                                                                                                                                                               | Verificación                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| JUE-01 | **Una sola sección.** «También hago juegos» va entre OrderFlow y el stack, con su propia forma (un mando) y sin ocupar más peso que la experiencia profesional.                                                                         | Test: `content.spec.ts`        |
| JUE-02 | **Una ficha por juego.** Nombre, género, una frase, tecnologías, estado y un vídeo corto de partida.                                                                                                                                    | Manual                         |
| JUE-03 | **Estado honesto.** Un juego solo figura como publicado si tiene al menos un enlace público. Los que están en desarrollo no llevan enlaces ni nombran tiendas o portales donde aún no están.                                            | Test: `games.spec.ts`          |
| JUE-04 | **Cifras comprobables.** Una cifra destacada (descargas, jugadores) solo aparece en juegos publicados.                                                                                                                                  | Test: `games.spec.ts`          |
| JUE-05 | **Dos idiomas.** Los mismos juegos, estados, tecnologías y enlaces en español e inglés.                                                                                                                                                 | Test: `games.spec.ts`          |
| JUE-06 | **Vídeos ligeros.** Cada juego tiene vídeo y póster en `public/games/`; ningún vídeo pasa de 500 kB. Van sin sonido y en bucle, y solo se descargan y se reproducen con la ficha en pantalla.                                           | Test: `games.spec.ts` · Manual |
| JUE-07 | **El visitante manda.** Cada vídeo tiene un botón para pausarlo y reanudarlo. Con `prefers-reduced-motion` no arranca solo: se ve el póster hasta que el visitante lo pone en marcha.                                                   | Manual                         |
| JUE-08 | **Modo lectura.** El CV en plano y los PDF incluyen los juegos en un bloque compacto, con estado y enlaces.                                                                                                                             | Manual                         |
| JUE-09 | **Sin huecos sobre la escena.** Los vídeos se pintan en un lienzo y el elemento de vídeo no se muestra: así el navegador no lo compone como capa de vídeo por hardware, que deja rectángulos negros sobre la escena 3D al hacer scroll. | Manual                         |

## Cómo se añade o se publica un juego

- **Añadir:** una entrada en `src/content/shared.ts` (lo que no se traduce) y su género y frase en `es.ts` y `en.ts`;
  vídeo y póster en `public/games/<id>.mp4` y `.jpg`.
- **Publicar:** cambiar su estado a `published` y añadir el enlace. JUE-03 falla si falta uno de los dos.

Los vídeos salen de las capturas de partida con `ffmpeg`, a 480 × 270, 8 s y sin audio:

```bash
ffmpeg -ss 1 -t 8 -i captura.mp4 -an -c:v libx264 -pix_fmt yuv420p -crf 31 -preset slow -movflags +faststart \
  -vf "scale=480:270:force_original_aspect_ratio=increase,crop=480:270,fps=24" public/games/<id>.mp4
ffmpeg -ss 4 -i captura.mp4 -frames:v 1 -q:v 4 \
  -vf "scale=480:270:force_original_aspect_ratio=increase,crop=480:270" public/games/<id>.jpg
```

## Fuera de alcance

Versiones jugables alojadas en el portfolio y fichas de detalle por juego.
