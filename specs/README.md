# Especificaciones

Este proyecto se trabaja con **Spec Driven Development**: el comportamiento se escribe primero aquí, después en
tests y por último en código.

## Flujo

1. **Spec.** Se añade o se modifica un requisito numerado en la spec de su dominio (`ESC-07`, `CON-03`…).
2. **Tests.** El requisito se convierte en tests que lo citan por su id: `describe('ESC-07 · calidad adaptativa')`.
3. **Implementación.** El código mínimo que pone esos tests en verde.
4. **Cambios.** Si el comportamiento cambia, primero cambia la spec.

## Índice

| Spec                                    | Prefijo | Dominio       | Qué cubre                                             |
| --------------------------------------- | ------- | ------------- | ----------------------------------------------------- |
| [01 · Escena 3D](01-escena.md)          | `ESC`   | `src/scene`   | Formas, transformación, tráfico, gestos y rendimiento |
| [02 · Contenido](02-contenido.md)       | `CON`   | `src/content` | El CV, sus dos idiomas y lo que no se publica         |
| [03 · Recorrido](03-recorrido.md)       | `REC`   | `src/story`   | Secciones, navegación y controles interactivos        |
| [04 · Modo lectura](04-modo-lectura.md) | `LEC`   | `src/reading` | El CV en plano, imprimible y descargable              |
| [05 · Juegos](05-juegos.md)             | `JUE`   | `src/story`   | La sección de juegos: fichas, estados y vídeos        |

## Convenciones

- Un requisito describe **qué ve o qué puede hacer el visitante**, no cómo está escrito el código.
- Cada requisito dice cómo se verifica: **Test** (con su archivo) o **Manual** (se comprueba en el navegador).
  Lo visual se verifica a mano; todo lo que es lógica tiene test.
- Los ids no se reutilizan: un requisito retirado se marca como retirado.
- Para localizar los tests de un requisito basta con buscar su id en `src/`.
