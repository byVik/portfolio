import type { Traffic } from './shapes'

/** Points that draw each mover: the head and its trail. */
export const POINTS_PER_PATH = 40

/**
 * Writes into `out` the head and trail of each path at instant
 * `time` (seconds). Returns how many points it wrote.
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
