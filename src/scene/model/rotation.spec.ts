import { describe, expect, it } from 'vitest'
import { ShapeRotation } from './rotation'

const FRAME = 1 / 60

function settle(rotation: ShapeRotation, spin: number, seconds: number): void {
  for (let i = 0; i < seconds * 60; i++) rotation.update(FRAME, spin)
}

describe('SCN-06 · shape orientation', () => {
  it('spins at the speed of the scene', () => {
    const rotation = new ShapeRotation()
    settle(rotation, 0.5, 2)

    expect(rotation.yaw).toBeCloseTo(1)
  })

  it('a shape that does not spin on its own turns back to face the viewer after a drag', () => {
    const rotation = new ShapeRotation()
    rotation.drag(100, 40)
    settle(rotation, 0, 12)

    expect(Math.cos(rotation.yaw)).toBeCloseTo(1)
    expect(rotation.pitch).toBeCloseTo(0)
  })

  it('a shape that spins on its own keeps the turn the visitor gives it', () => {
    const rotation = new ShapeRotation()
    rotation.dragging = true
    rotation.drag(100, 0)
    rotation.dragging = false
    settle(rotation, 0.5, 0.5)

    expect(rotation.yaw).toBeGreaterThan(0.6)
  })

  it('stays still while being dragged', () => {
    const rotation = new ShapeRotation()
    rotation.dragging = true
    settle(rotation, 0.5, 1)

    expect(rotation.yaw).toBe(0)
  })

  it('limits the vertical tilt', () => {
    const rotation = new ShapeRotation()
    rotation.drag(0, 10_000)

    expect(rotation.pitch).toBe(0.8)
  })

  it('leans gradually towards the cursor', () => {
    const rotation = new ShapeRotation()
    rotation.leanTowards(1, -1)
    rotation.update(FRAME, 0)

    expect(rotation.lean.x).toBeGreaterThan(0)
    expect(rotation.lean.x).toBeLessThan(0.2)

    settle(rotation, 0, 5)
    expect(rotation.lean.x).toBeCloseTo(1)
    expect(rotation.lean.y).toBeCloseTo(-1)
  })
})
