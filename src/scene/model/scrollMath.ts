import { clamp } from './math'

/**
 * Holds the shape while its section is centred and concentrates the
 * morph in the middle stretch of the way between two sections.
 */
export function hold(t: number, edge = 0.22): number {
  const x = clamp((t - edge) / (1 - 2 * edge), 0, 1)
  return x * x * (3 - 2 * x)
}

/**
 * Continuous position in the list of scenes: 0 is the first, 1.5 is halfway
 * between the second and the third. `centers` are the centres of each
 * section in document pixels and `y` is the centre of the viewport.
 */
export function scenePosition(centers: readonly number[], y: number): number {
  const last = centers.length - 1
  if (last < 1 || y <= centers[0]) return 0
  if (y >= centers[last]) return last
  let i = 0
  while (y >= centers[i + 1]) i++
  return i + hold((y - centers[i]) / (centers[i + 1] - centers[i]))
}

/** Splits the position into the starting scene and how far it has blended into the next. */
export function split(position: number, count: number): { index: number; mix: number } {
  const index = clamp(Math.floor(position), 0, count - 2)
  return { index, mix: clamp(position - index, 0, 1) }
}
