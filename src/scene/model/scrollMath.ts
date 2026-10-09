import { clamp } from './math'

/**
 * Retiene la forma mientras su sección está centrada y concentra la
 * transformación en el tramo central del recorrido entre dos secciones.
 */
export function hold(t: number, edge = 0.22): number {
  const x = clamp((t - edge) / (1 - 2 * edge), 0, 1)
  return x * x * (3 - 2 * x)
}

/**
 * Posición continua en la lista de escenas: 0 es la primera, 1.5 es a medio
 * camino entre la segunda y la tercera. `centers` son los centros de cada
 * sección en píxeles de documento e `y` el centro de la ventana.
 */
export function scenePosition(centers: readonly number[], y: number): number {
  const last = centers.length - 1
  if (last < 1 || y <= centers[0]) return 0
  if (y >= centers[last]) return last
  let i = 0
  while (y >= centers[i + 1]) i++
  return i + hold((y - centers[i]) / (centers[i + 1] - centers[i]))
}

/** Separa la posición en la escena de partida y cuánto se ha mezclado con la siguiente. */
export function split(position: number, count: number): { index: number; mix: number } {
  const index = clamp(Math.floor(position), 0, count - 2)
  return { index, mix: clamp(position - index, 0, 1) }
}
