# 04 · Modo lectura

Dominio: `src/reading` · Prefijo: `LEC`

## Propósito

Quien tiene prisa, o quiere guardar el CV, lo lee en plano: sin escena, en una hoja, imprimible y descargable.

## Requisitos

| Id     | Requisito                                                                                                                                                    | Verificación             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| LEC-01 | **Mismo contenido.** El modo lectura muestra el contenido del portfolio en una sola columna, sin duplicar ningún texto (CON-01).                             | Manual                   |
| LEC-02 | **Abrir y cerrar.** Se abre desde la cabecera o con `?cv=1` en la URL; se cierra con su botón o con Escape. Mientras está abierto, la escena no consume GPU. | Manual                   |
| LEC-03 | **Imprimir.** Imprimir desde cualquier vista saca el CV en A4, sin barra de herramientas ni fondo oscuro, y sin partir un bloque entre dos páginas.          | Manual                   |
| LEC-04 | **PDF.** Hay un PDF descargable por idioma. `npm run export` los regenera a partir de la propia página, junto con la imagen de vista previa para redes.      | Manual: `npm run export` |
| LEC-05 | **Privacidad.** Ni la vista ni los PDF incluyen teléfono o correo (CON-04).                                                                                  | Test: `content.spec.ts`  |
| LEC-06 | **Idioma.** El modo lectura sigue el idioma activo y permite cambiarlo.                                                                                      | Manual                   |

## Fuera de alcance

Plantillas de CV alternativas y exportación a otros formatos.
