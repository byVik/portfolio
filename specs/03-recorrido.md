# 03 · Recorrido

Dominio: `src/story` · Prefijo: `REC`

## Propósito

El visitante recorre la carrera con el scroll: una sección por etapa, cada una con su forma y, donde aporta, un
control que deja tocar lo que se cuenta.

## Requisitos

| Id     | Requisito                                                                                                                                                                         | Verificación            |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| REC-01 | **Una sección por escena.** Portada, un capítulo por etapa, juegos, stack y contacto, en el mismo orden y con el mismo id que las escenas.                                        | Test: `content.spec.ts` |
| REC-02 | **Aparición escalonada.** El contenido de cada sección aparece por orden la primera vez que entra en pantalla. Con `prefers-reduced-motion` está visible desde el principio.      | Manual                  |
| REC-03 | **Cifras.** Las cifras destacadas cuentan desde cero hasta su valor al verse, una sola vez. Los lectores de pantalla reciben el valor final.                                      | Manual                  |
| REC-04 | **Antes / Después.** En Volinga, un conmutador compara la escena con el código que sobraba y sin él, y explica en una línea qué se está viendo.                                   | Manual                  |
| REC-05 | **Ejecutar pipeline.** La primera ejecución arranca sola al ver la sección. Las cuatro etapas se marcan en orden, el botón se desactiva mientras corre y después permite repetir. | Manual                  |
| REC-06 | **Navegación.** En pantallas anchas, un raíl lateral lista las secciones y marca la activa; en el resto, una barra superior muestra el avance.                                    | Manual                  |
| REC-07 | **Cabecera.** La cabecera fija nunca se solapa con el contenido que pasa por debajo. Desde ella se cambia de idioma, se abre el CV y se llega a LinkedIn y GitHub.                | Manual                  |
| REC-08 | **Pantallas estrechas.** La forma queda arriba y el texto debajo, en una tarjeta legible. Ningún control exige ratón.                                                             | Manual                  |
| REC-09 | **Teclado.** Todos los controles son alcanzables con tabulador y muestran el foco.                                                                                                | Manual                  |

## Fuera de alcance

Animaciones ligadas a librerías externas y enrutado: es una sola página.
