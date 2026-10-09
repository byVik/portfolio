import { describe, expect, it } from 'vitest'
import { TextMorph } from './textMorph'

const FRAME = 1 / 60

/** Avanza `seconds` segundos y devuelve los puntos que se hayan pedido cargar por el camino. */
function advance(morph: TextMorph, seconds: number): Float32Array[] {
  const loaded: Float32Array[] = []
  for (let i = 0; i < seconds * 60; i++) {
    const points = morph.update(FRAME)
    if (points) loaded.push(points)
  }
  return loaded
}

describe('ESC-08 · forma escrita por el visitante', () => {
  const first = new Float32Array([1, 1, 1])
  const second = new Float32Array([2, 2, 2])

  it('parte de la forma de la escena', () => {
    const morph = new TextMorph()
    advance(morph, 1)

    expect(morph.amount).toBe(0)
    expect(morph.active).toBe(false)
  })

  it('carga el texto pedido y lo forma', () => {
    const morph = new TextMorph()
    morph.request(first)

    expect(advance(morph, 2)).toEqual([first])
    expect(morph.amount).toBe(1)
    expect(morph.active).toBe(true)
  })

  it('deshace el texto anterior antes de cargar el siguiente', () => {
    const morph = new TextMorph()
    morph.request(first)
    advance(morph, 2)

    morph.request(second)
    expect(morph.update(FRAME)).toBeUndefined()
    expect(morph.amount).toBeLessThan(1)
    expect(advance(morph, 3)).toEqual([second])
    expect(morph.amount).toBe(1)
  })

  it('vuelve a la forma de la escena al deshacer', () => {
    const morph = new TextMorph()
    morph.request(first)
    advance(morph, 2)

    morph.request(null)
    expect(advance(morph, 2)).toEqual([])
    expect(morph.amount).toBe(0)
    expect(morph.active).toBe(false)
  })
})
