import { describe, expect, it } from 'vitest'
import { shapeNames, traffic, type Traffic } from './shapes'
import { fillTraffic, POINTS_PER_PATH } from './traffic'

describe('SCN-05 · movers with a trail', () => {
  // A straight path along the X axis: the position equals `u`.
  const line: Traffic = { paths: [(u) => [u, 0, 0]], speed: 0.5, tail: 0.2, size: 1 }

  it('writes the head and trail of each path', () => {
    const out = new Float32Array(POINTS_PER_PATH * 3 * 2)
    expect(fillTraffic(out, { ...line, paths: [line.paths[0], line.paths[0]] }, 0)).toBe(POINTS_PER_PATH * 2)
  })

  it('advances the head over time and leaves the trail behind', () => {
    const out = new Float32Array(POINTS_PER_PATH * 3)
    fillTraffic(out, line, 1)

    expect(out[0]).toBeCloseTo(0.5)
    expect(out[(POINTS_PER_PATH - 1) * 3]).toBeCloseTo(0.5 - 0.2 * ((POINTS_PER_PATH - 1) / POINTS_PER_PATH))
  })

  it('starts over at the end of the path', () => {
    const out = new Float32Array(POINTS_PER_PATH * 3)
    fillTraffic(out, line, 2.2)

    expect(out[0]).toBeCloseTo(0.1)
  })
})

describe.each(shapeNames.filter((name) => traffic[name]))('SCN-05 · %s traffic', (name) => {
  it('stays inside the frame along the whole path', () => {
    for (const path of traffic[name]!.paths) {
      for (let u = 0; u < 1; u += 0.05) {
        const point = path(u)
        expect(point.every(Number.isFinite)).toBe(true)
        expect(Math.max(...point.map(Math.abs))).toBeLessThanOrEqual(2.3)
      }
    }
  })
})
