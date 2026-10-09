import { describe, expect, it } from 'vitest'
import { hold, scenePosition, split } from './scrollMath'

describe('ESC-02 · del scroll a la posición de escena', () => {
  const centers = [500, 1500, 2500]

  it('se queda en la primera escena antes de llegar a su centro', () => {
    expect(scenePosition(centers, 0)).toBe(0)
  })

  it('retiene la forma mientras la sección sigue cerca del centro', () => {
    expect(scenePosition(centers, 600)).toBe(0)
    expect(scenePosition(centers, 1450)).toBe(1)
  })

  it('está a media transformación a mitad de camino entre dos secciones', () => {
    expect(scenePosition(centers, 1000)).toBeCloseTo(0.5)
    expect(scenePosition(centers, 2000)).toBeCloseTo(1.5)
  })

  it('termina en la última escena', () => {
    expect(scenePosition(centers, 9999)).toBe(2)
  })

  it('no falla con una sola sección', () => {
    expect(scenePosition([500], 800)).toBe(0)
  })
})

describe('ESC-02 · retención de la forma', () => {
  it('es simétrica y va de 0 a 1', () => {
    expect(hold(0)).toBe(0)
    expect(hold(0.5)).toBeCloseTo(0.5)
    expect(hold(1)).toBe(1)
  })
})

describe('ESC-02 · escena de partida y mezcla', () => {
  it('separa la escena de partida y la mezcla con la siguiente', () => {
    expect(split(1.25, 3)).toEqual({ index: 1, mix: 0.25 })
  })

  it('trata la última escena como la mezcla completa de la penúltima', () => {
    expect(split(2, 3)).toEqual({ index: 1, mix: 1 })
  })
})
