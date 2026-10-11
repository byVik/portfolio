import { describe, expect, it } from 'vitest'
import { buildShape, shapeNames } from './shapes'

const COUNT = 2000

describe.each(shapeNames)('SCN-01 · %s shape', (name) => {
  const points = buildShape(name, COUNT, 1)

  it('returns three finite coordinates per point', () => {
    expect(points).toHaveLength(COUNT * 3)
    expect(points.every(Number.isFinite)).toBe(true)
  })

  it('fits inside the camera frame', () => {
    expect(Math.max(...points.map(Math.abs))).toBeLessThanOrEqual(2.3)
  })

  it('is deterministic for a given seed', () => {
    expect(buildShape(name, COUNT, 1)).toEqual(points)
    expect(buildShape(name, COUNT, 2)).not.toEqual(points)
  })
})
