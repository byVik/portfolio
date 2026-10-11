import { describe, expect, it } from 'vitest'
import { hold, scenePosition, split } from './scrollMath'

describe('SCN-02 · from scroll to scene position', () => {
  const centers = [500, 1500, 2500]

  it('stays on the first scene before reaching its centre', () => {
    expect(scenePosition(centers, 0)).toBe(0)
  })

  it('holds the shape while the section is still near the centre', () => {
    expect(scenePosition(centers, 600)).toBe(0)
    expect(scenePosition(centers, 1450)).toBe(1)
  })

  it('is mid-morph halfway between two sections', () => {
    expect(scenePosition(centers, 1000)).toBeCloseTo(0.5)
    expect(scenePosition(centers, 2000)).toBeCloseTo(1.5)
  })

  it('ends on the last scene', () => {
    expect(scenePosition(centers, 9999)).toBe(2)
  })

  it('does not fail with a single section', () => {
    expect(scenePosition([500], 800)).toBe(0)
  })
})

describe('SCN-02 · holding the shape', () => {
  it('is symmetric and goes from 0 to 1', () => {
    expect(hold(0)).toBe(0)
    expect(hold(0.5)).toBeCloseTo(0.5)
    expect(hold(1)).toBe(1)
  })
})

describe('SCN-02 · starting scene and blend', () => {
  it('splits the starting scene from the blend with the next one', () => {
    expect(split(1.25, 3)).toEqual({ index: 1, mix: 0.25 })
  })

  it('treats the last scene as the full blend of the one before it', () => {
    expect(split(2, 3)).toEqual({ index: 1, mix: 1 })
  })
})
