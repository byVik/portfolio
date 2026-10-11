import { describe, expect, it } from 'vitest'
import { TextMorph } from './textMorph'

const FRAME = 1 / 60

/** Advances `seconds` seconds and returns the points requested for loading along the way. */
function advance(morph: TextMorph, seconds: number): Float32Array[] {
  const loaded: Float32Array[] = []
  for (let i = 0; i < seconds * 60; i++) {
    const points = morph.update(FRAME)
    if (points) loaded.push(points)
  }
  return loaded
}

describe('SCN-08 · shape typed by the visitor', () => {
  const first = new Float32Array([1, 1, 1])
  const second = new Float32Array([2, 2, 2])

  it('starts from the shape of the scene', () => {
    const morph = new TextMorph()
    advance(morph, 1)

    expect(morph.amount).toBe(0)
    expect(morph.active).toBe(false)
  })

  it('loads the requested text and forms it', () => {
    const morph = new TextMorph()
    morph.request(first)

    expect(advance(morph, 2)).toEqual([first])
    expect(morph.amount).toBe(1)
    expect(morph.active).toBe(true)
  })

  it('dissolves the previous text before loading the next', () => {
    const morph = new TextMorph()
    morph.request(first)
    advance(morph, 2)

    morph.request(second)
    expect(morph.update(FRAME)).toBeUndefined()
    expect(morph.amount).toBeLessThan(1)
    expect(advance(morph, 3)).toEqual([second])
    expect(morph.amount).toBe(1)
  })

  it('returns to the shape of the scene on undo', () => {
    const morph = new TextMorph()
    morph.request(first)
    advance(morph, 2)

    morph.request(null)
    expect(advance(morph, 2)).toEqual([])
    expect(morph.amount).toBe(0)
    expect(morph.active).toBe(false)
  })
})
