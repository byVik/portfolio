# AGENTS.md

Reglas para agentes de IA, y para personas, que trabajen en este repositorio.

## Qué es

El portfolio de Viktor Strohush Loyish: una página con una escena 3D de puntos que cambia de forma con el scroll.
Vue 3, TypeScript, Three.js, Vite y Vitest. Sin backend.

## Comandos

```bash
npm run dev            # servidor de desarrollo
npm test               # tests unitarios
npm run lint           # ESLint
npm run format         # Prettier (escribe); format:check solo comprueba
npm run build          # comprobación de tipos + build en dist/
npm run export         # regenera public/og.jpg y los PDF del CV
```

Antes de dar un cambio por terminado: `npm run lint`, `npm run format:check`, `npm test` y `npm run build` en verde.

## Flujo de trabajo: spec → tests → código

1. Si cambia el comportamiento, **primero** se actualiza la spec de su dominio en `specs/`.
2. El requisito se convierte en tests que citan su id: `describe('ESC-07 · …')`.
3. Después se implementa.

Lo visual se verifica a mano en el navegador y se dice así en la spec. No se marca como probado lo que no se ha
probado.

## Estructura: por dominio

```
src/
  app/        Composición de la página, cabecera y tokens de la identidad visual
  content/    El CV, sus dos idiomas y el idioma activo
  scene/      La escena 3D
    model/      Lógica pura: formas, recorridos, scroll, rotación, calidad
    engine/     Three.js: renderizado y shaders
    ui/         Vue: lienzo, gestos, HUD y el puente `controls.ts`
  story/      Las secciones del recorrido y sus controles (widgets/)
  reading/    Modo lectura
  shared/     Utilidades sin dominio
specs/        Especificaciones
scripts/      Exportación de PDF e imagen de vista previa
```

### Reglas de dependencia

- `scene/model` no importa Three.js ni Vue, ni toca el DOM. Todo lo que hay ahí tiene tests.
- `scene/engine` es el único sitio que importa Three.js.
- El resto de la aplicación habla con la escena solo a través de `scene/ui/controls.ts`.
- `content` no depende de `story`, `reading` ni `app`.
- Dentro de un dominio, imports relativos; entre dominios, alias `@/`.

## Convenciones

- Identificadores en inglés; comentarios y textos en español.
- Los comentarios explican el porqué, no repiten el código.
- Componentes pequeños y de una sola responsabilidad. La lógica reutilizable va a un composable o a `model/`.
- Ningún texto visible en los componentes: va en `src/content`, siempre en los dos idiomas (CON-01, CON-02).
- Colores y tipografías, solo como tokens CSS de `src/app/styles.css`. La escena lee esos mismos tokens.
- Los tests viven junto al código (`*.spec.ts`).
- No se añaden dependencias sin una razón que quepa en una frase.

## No hacer

- No publicar teléfono ni correo. CON-04 lo comprueba con un test: no se desactiva.
- No inventar ni adornar datos del CV. Lo que no esté en el CV real no entra.
- No usar `v-html`.
- No subir el número de puntos ni la resolución por defecto sin medir el rendimiento.
