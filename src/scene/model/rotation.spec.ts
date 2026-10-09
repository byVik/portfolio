import { describe, expect, it } from 'vitest'
import { ShapeRotation } from './rotation'

const FRAME = 1 / 60

function settle(rotation: ShapeRotation, spin: number, seconds: number): void {
  for (let i = 0; i < seconds * 60; i++) rotation.update(FRAME, spin)
}

describe('ESC-06 · orientación de la forma', () => {
  it('gira a la velocidad de la escena', () => {
    const rotation = new ShapeRotation()
    settle(rotation, 0.5, 2)

    expect(rotation.yaw).toBeCloseTo(1)
  })

  it('una forma que no gira sola vuelve a mirar de frente tras arrastrarla', () => {
    const rotation = new ShapeRotation()
    rotation.drag(100, 40)
    settle(rotation, 0, 12)

    expect(Math.cos(rotation.yaw)).toBeCloseTo(1)
    expect(rotation.pitch).toBeCloseTo(0)
  })

  it('una forma que gira sola conserva el giro que le da el visitante', () => {
    const rotation = new ShapeRotation()
    rotation.dragging = true
    rotation.drag(100, 0)
    rotation.dragging = false
    settle(rotation, 0.5, 0.5)

    expect(rotation.yaw).toBeGreaterThan(0.6)
  })

  it('se queda quieta mientras se arrastra', () => {
    const rotation = new ShapeRotation()
    rotation.dragging = true
    settle(rotation, 0.5, 1)

    expect(rotation.yaw).toBe(0)
  })

  it('limita la inclinación vertical', () => {
    const rotation = new ShapeRotation()
    rotation.drag(0, 10_000)

    expect(rotation.pitch).toBe(0.8)
  })

  it('se inclina poco a poco hacia el cursor', () => {
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
