# Portfolio · Viktor Strohush Loyish

Portfolio 3D interactivo. La idea que lo sostiene es **«Tomo la forma del problema»**: 36 000 puntos que, al hacer
scroll, se reorganizan en una forma distinta para cada etapa de mi carrera.

| Sección       | Forma    | Por qué                                             | Lo que se mueve              |
| ------------- | -------- | --------------------------------------------------- | ---------------------------- |
| Inicio        | Nube     | El ruido del que parte todo                         |                              |
| Perfil        | Retícula | El ruido, ordenado                                  | Señales entre nodos          |
| Volinga       | Armazón  | Cae el 80 % de los puntos: el código que sobraba    |                              |
| Volinga Suite | Plató    | Pared de paneles y cámara: la industria audiovisual |                              |
| Pipeline      | Pipeline | Tests → build → instalador → firma                  | Paquetes cruzando las etapas |
| Arquimea      | Globo    | Pedidos en casi todos los aeropuertos de España     | Vuelos desde Madrid          |
| Móvil         | Pelota   | La app del Mutua Madrid Open                        |                              |
| IA            | Órbita   | Agentes girando alrededor de un núcleo              | Los agentes                  |
| OrderFlow     | Hexágono | Arquitectura hexagonal                              | Eventos por los adaptadores  |
| Juegos        | Mando    | Fuera del trabajo también hago juegos               | Pulsaciones en los botones   |
| Stack         | Capas    | El stack, apilado                                   | Peticiones entre capas       |
| Contacto      | Tu texto | Escribes tu problema y los puntos lo dibujan        |                              |

## Qué se puede hacer

- **Scroll**: transforma una forma en la siguiente.
- **Ratón**: los puntos se apartan del cursor; arrastrar gira la forma; un clic lanza una onda.
- **Antes / Después** (Volinga): devuelve a la escena el código muerto y lo vuelve a podar.
- **Ejecutar pipeline**: un pulso recorre las cuatro etapas y las va marcando.
- **¿Qué forma tiene tu problema?**: el texto que escribas se convierte en la forma final.
- **ES / EN**: todo el contenido en dos idiomas; `?lang=en` abre directamente en inglés.
- **Juegos**: una ficha por juego con vídeo de partida, estado y enlaces cuando está publicado.
- **CV**: modo lectura en plano, imprimible y con PDF descargable; `?cv=1` lo abre directamente.

Sin WebGL el contenido sigue siendo legible, con `prefers-reduced-motion` la escena se calma, y en equipos lentos
baja sola el número de puntos.

## Stack

Vue 3 (Composition API) · TypeScript · Three.js · Vite · Vitest · ESLint · Prettier · GitHub Actions.
Sin librerías de UI ni de animación.

## Uso

```bash
npm install
npm run dev            # desarrollo
npm test               # tests unitarios
npm run lint           # ESLint
npm run format         # Prettier
npm run build          # comprobación de tipos + build estático en dist/
npm run export         # regenera los PDF del CV y la imagen de vista previa (necesita Edge o Chrome)
```

## Cómo está organizado

Por dominio, no por tipo de archivo:

```
src/
  app/        Composición de la página, cabecera y tokens de la identidad visual
  content/    El CV, sus dos idiomas y el idioma activo
  scene/      La escena 3D
    model/      Lógica pura y testeada: formas, recorridos, scroll, rotación, calidad
    engine/     Three.js: renderizado y shaders
    ui/         Vue: lienzo, gestos, HUD y el puente con el resto de la página
  story/      Las secciones del recorrido y sus controles
  reading/    Modo lectura
  shared/     Utilidades sin dominio
specs/        Especificaciones
scripts/      Exportación de PDF e imagen de vista previa
```

Las fronteras se comprueban con ESLint: Three.js solo se importa desde `scene/engine`, y entre dominios se usa el
alias `@/`.

## Spec Driven Development

El comportamiento se escribe primero en [`specs/`](specs/README.md) como requisitos numerados; los tests citan el
id del requisito que comprueban (`describe('ESC-07 · calidad adaptativa')`) y después llega el código. Las reglas
para trabajar en el repositorio, con o sin agentes de IA, están en [`AGENTS.md`](AGENTS.md).

## Editar el contenido

- Un texto: `src/content/es.ts` y `src/content/en.ts`.
- Un enlace o una tecnología: `src/content/shared.ts`.
- Un juego: ver [specs/05-juegos.md](specs/05-juegos.md).
- Una sección nueva: un capítulo en los dos idiomas y una escena con el mismo `id` en `src/scene/model/scenes.ts`.
  Un test avisa si no coinciden.

Después de cambiar el contenido, `npm run export` actualiza los PDF.

## Publicar

Está publicado en **[viktorstrohush.dev](https://viktorstrohush.dev)**, en Cloudflare Workers como sitio estático
(`wrangler.jsonc`): sin servidor ni código en el borde, solo los archivos de `dist/`.

```bash
npm run deploy         # build + wrangler deploy (pide haber hecho antes `npx wrangler login`)
```

La URL pública vive en `.env` (`VITE_SITE_URL`) y de ella salen la dirección canónica y la imagen de vista previa
que muestran las redes al compartir el enlace. `public/_headers` fija la caché de los archivos con hash y de los
vídeos.

## Identidad visual

| Token      | Valor     | Uso                                               |
| ---------- | --------- | ------------------------------------------------- |
| `--ink`    | `#07080b` | Fondo                                             |
| `--bone`   | `#edeae2` | Texto y puntos cálidos                            |
| `--cold`   | `#25a585` | Puntos fríos (profundidad)                        |
| `--signal` | `#2ccfc0` | Único acento: etiquetas, cifras y lo que se mueve |

- **Bricolage Grotesque** condensada para titulares, **Instrument Sans** para el texto y **JetBrains Mono** para
  etiquetas y datos.
- La escena lee los colores de estos mismos tokens: cambiarlos en `src/app/styles.css` cambia también los puntos.
