import { describe, expect, it } from 'vitest'
import { mulberry32 } from './shapes'
import { pointsFromMask } from './textMask'

/** RGBA mask of `width` × `height` with the given pixels opaque. */
function mask(width: number, height: number, opaque: number[]): Uint8ClampedArray {
  const rgba = new Uint8ClampedArray(width * height * 4)
  for (const pixel of opaque) rgba[pixel * 4 + 3] = 255
  return rgba
}

describe('SCN-08 · from a text mask to points', () => {
  it('returns no shape when the mask is empty', () => {
    expect(pointsFromMask(mask(4, 2, []), 4, 2, 10, mulberry32(1))).toBeNull()
  })

  it('spreads the points over opaque pixels only, centred and within the requested width', () => {
    // Full top row of a 4 × 2 mask.
    const points = pointsFromMask(mask(4, 2, [0, 1, 2, 3]), 4, 2, 500, mulberry32(1), 2, 2)

    expect(points).toHaveLength(1500)
    for (let i = 0; i < 500; i++) {
      expect(Math.abs(points![i * 3])).toBeLessThanOrEqual(1)
      expect(Math.abs(points![i * 3 + 1])).toBeLessThanOrEqual(0.25)
    }
  })
})
