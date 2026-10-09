# 01 · Escena 3D

Dominio: `src/scene` · Prefijo: `ESC`

## Propósito

Una nube de puntos acompaña al contenido: cada sección tiene una forma y, al hacer scroll, los mismos puntos pasan
de una a la siguiente. Es la idea del portfolio, «tomo la forma del problema», hecha visible.

## Requisitos

| Id     | Requisito                                                                                                                                                                                                                                                          | Verificación                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| ESC-01 | **Formas deterministas.** Cada forma se genera a partir de una semilla: la misma semilla da los mismos puntos y ninguna coordenada supera 2,3 unidades, el encuadre de la cámara.                                                                                  | Test: `model/shapes.spec.ts`                        |
| ESC-02 | **Del scroll a la escena.** La posición de escena es continua (1,5 = a medio camino entre la segunda y la tercera). La forma se mantiene mientras su sección está centrada y se transforma en el tramo central del recorrido. Fuera de los extremos no hay cambio. | Test: `model/scrollMath.spec.ts`                    |
| ESC-03 | **Transformación por oleadas.** Cada punto empieza su viaje con un retraso propio y se agita a mitad de camino; al terminar, todos están en su sitio.                                                                                                              | Manual                                              |
| ESC-04 | **Poda.** En la escena de Volinga cae el 80 % de los puntos y el HUD marca «20 %». «Antes» los devuelve como ruido alrededor de la forma y el HUD vuelve a «100 %».                                                                                                | Manual                                              |
| ESC-05 | **Tráfico.** Algunas formas tienen móviles con estela (señales, paquetes, vuelos, agentes, eventos, peticiones) que recorren un camino y vuelven a empezar sin salirse del encuadre. Se apagan al cambiar de escena.                                               | Test: `model/traffic.spec.ts`                       |
| ESC-06 | **Orientación.** Cada escena gira a su velocidad. Arrastrar gira la forma con inercia; las que no giran solas vuelven a mirar de frente al soltarlas; la inclinación vertical tiene límite; la forma se inclina levemente hacia el cursor.                         | Test: `model/rotation.spec.ts`                      |
| ESC-07 | **Calidad adaptativa.** Tras 3 s de arranque se miden los FPS en ventanas de 1,5 s; una ventana por debajo de 42 FPS baja un escalón (menos puntos y menos resolución). La calidad no vuelve a subir y las pausas de una pestaña en segundo plano no cuentan.      | Test: `model/quality.spec.ts`                       |
| ESC-08 | **Forma escrita.** En la última escena, un texto de hasta 14 caracteres se convierte en forma: los puntos se reparten sobre sus letras. Un texto nuevo espera a que el anterior se deshaga; un texto vacío devuelve la nube.                                       | Test: `model/textMask.spec.ts`, `textMorph.spec.ts` |
| ESC-09 | **Gestos.** El cursor aparta los puntos cercanos; un clic fuera de los controles lanza una onda; arrastrar sobre el texto selecciona en vez de girar. En pantallas táctiles el scroll nunca se bloquea.                                                            | Manual                                              |
| ESC-10 | **Pulso de la pipeline.** «Ejecutar pipeline» lanza un pulso que recorre la forma en 3,4 s; cada etapa se marca cuando el pulso cruza su anillo.                                                                                                                   | Manual                                              |
| ESC-11 | **Degradación.** Sin WebGL el contenido sigue completo y legible. Con `prefers-reduced-motion` no hay agitación, giro ni tráfico. Three.js se descarga aparte y no retrasa el texto.                                                                               | Manual                                              |

## Arquitectura

| Capa      | Qué contiene                                         | Regla                                           |
| --------- | ---------------------------------------------------- | ----------------------------------------------- |
| `model/`  | Formas, recorridos, scroll, rotación, calidad, texto | Puro: sin Three.js, sin Vue, sin DOM. Con tests |
| `engine/` | `ParticleField`, `TrafficLayer` y los shaders        | El único sitio que importa Three.js             |
| `ui/`     | `SceneCanvas`, gestos, HUD y `controls.ts`           | El único puente entre Vue y el motor            |

## Fuera de alcance

Modelos 3D externos, postprocesado y sonido.
