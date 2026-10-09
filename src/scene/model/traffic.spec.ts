import { describe, expect, it } from 'vitest'
import { shapeNames, traffic, type Traffic } from './shapes'
import { fillTraffic, POINTS_PER_PATH } from './traffic'

describe('ESC-05 · móviles con estela', () => {
  // Un recorrido recto sobre el eje X: la posición coincide con `u`.
  const line: Traffic = { paths: [(u) => [u, 0, 0]], speed: 0.5, tail: 0.2, size: 1 }

  it('escribe la cabeza y la estela de cada recorrido', () => {
    const out = new Float32Array(POINTS_PER_PATH * 3 * 2)
    expect(fillTraffic(out, { ...line, paths: [line.paths[0], line.paths[0]] }, 0)).toBe(POINTS_PER_PATH * 2)
  })

  it('avanza la cabeza con el tiempo y deja la estela por detrás', () => {
    const out = new Float32Array(POINTS_PER_PATH * 3)
    fillTraffic(out, line, 1)

    expect(out[0]).toBeCloseTo(0.5)
    expect(out[(POINTS_PER_PATH - 1) * 3]).toBeCloseTo(0.5 - 0.2 * ((POINTS_PER_PATH - 1) / POINTS_PER_PATH))
  })

  it('vuelve a empezar al terminar el recorrido', () => {
    const out = new Float32Array(POINTS_PER_PATH * 3)
    fillTraffic(out, line, 2.2)

    expect(out[0]).toBeCloseTo(0.1)
  })
})

describe.each(shapeNames.filter((name) => traffic[name]))('ESC-05 · tráfico de «%s»', (name) => {
  it('se mantiene dentro del encuadre en todo el recorrido', () => {
    for (const path of traffic[name]!.paths) {
      for (let u = 0; u < 1; u += 0.05) {
        const point = path(u)
        expect(point.every(Number.isFinite)).toBe(true)
        expect(Math.max(...point.map(Math.abs))).toBeLessThanOrEqual(2.3)
      }
    }
  })
})
