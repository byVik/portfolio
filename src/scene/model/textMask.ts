/** Maximum length of the text the visitor can turn into a shape. */
export const TEXT_LIMIT = 14

/**
 * Spreads `count` points over the opaque pixels of an RGBA mask,
 * centred and scaled to fit in `span` × `rise` scene units.
 * Returns `null` if the mask is empty.
 */
export function pointsFromMask(
  rgba: ArrayLike<number>,
  width: number,
  height: number,
  count: number,
  rng: () => number,
  span = 3.3,
  rise = 1.5,
): Float32Array | null {
  const filled: number[] = []
  let left = width
  let right = 0
  let top = height
  let bottom = 0
  for (let i = 0; i < width * height; i++) {
    if (rgba[i * 4 + 3] < 128) continue
    filled.push(i)
    const x = i % width
    const y = Math.floor(i / width)
    left = Math.min(left, x)
    right = Math.max(right, x)
    top = Math.min(top, y)
    bottom = Math.max(bottom, y)
  }
  if (filled.length === 0) return null

  const scale = Math.min(span / (right - left + 1), rise / (bottom - top + 1))
  const centerX = (left + right + 1) / 2
  const centerY = (top + bottom + 1) / 2
  const points = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const pixel = filled[Math.floor(rng() * filled.length)]
    points[i * 3] = ((pixel % width) + rng() - centerX) * scale
    points[i * 3 + 1] = (centerY - Math.floor(pixel / width) - rng()) * scale
    points[i * 3 + 2] = (rng() - 0.5) * 0.16
  }
  return points
}
