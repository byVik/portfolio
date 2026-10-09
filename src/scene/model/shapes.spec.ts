import { describe, expect, it } from 'vitest'
import { buildShape, shapeNames } from './shapes'

const COUNT = 2000

describe.each(shapeNames)('ESC-01 · forma «%s»', (name) => {
  const points = buildShape(name, COUNT, 1)

  it('devuelve tres coordenadas finitas por punto', () => {
    expect(points).toHaveLength(COUNT * 3)
    expect(points.every(Number.isFinite)).toBe(true)
  })

  it('cabe en el encuadre de la cámara', () => {
    expect(Math.max(...points.map(Math.abs))).toBeLessThanOrEqual(2.3)
  })

  it('es determinista para una misma semilla', () => {
    expect(buildShape(name, COUNT, 1)).toEqual(points)
    expect(buildShape(name, COUNT, 2)).not.toEqual(points)
  })
})
