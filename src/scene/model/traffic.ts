import type { Traffic } from './shapes'

/** Puntos que dibujan cada móvil: la cabeza y su estela. */
export const POINTS_PER_PATH = 40

/**
 * Coloca en `out` la cabeza y la estela de cada recorrido en el instante
 * `time` (segundos). Devuelve cuántos puntos ha escrito.
 */
export function fillTraffic(out: Float32Array, { paths, speed, tail }: Traffic, time: number): number {
  const head = (time * speed) % 1
  let written = 0
  for (const path of paths) {
    for (let i = 0; i < POINTS_PER_PATH; i++) {
      out.set(path((head - (i / POINTS_PER_PATH) * tail + 1) % 1), written * 3)
      written++
    }
  }
  return written
}
