import { clamp, damp } from './math'

const TAU = Math.PI * 2
/** Radianes de giro por píxel arrastrado. */
const DRAG_YAW = 0.006
const DRAG_PITCH = 0.004
const MAX_PITCH = 0.8
/** Por debajo de este giro (rad/s) la escena se considera «de frente». */
const FRONTAL_SPIN = 0.08

/**
 * Orientación de la forma: el giro propio de cada escena, el arrastre del
 * visitante (con inercia) y una leve inclinación hacia el cursor.
 */
export class ShapeRotation {
  yaw = 0
  pitch = 0
  dragging = false
  /** Inclinación suavizada hacia el cursor, de −1 a 1 en cada eje. */
  readonly lean = { x: 0, y: 0 }

  private readonly leanGoal = { x: 0, y: 0 }
  private swing = 0

  leanTowards(x: number, y: number): void {
    this.leanGoal.x = x
    this.leanGoal.y = y
  }

  /** Desplazamiento del ratón, en píxeles, mientras se arrastra. */
  drag(dx: number, dy: number): void {
    this.yaw += dx * DRAG_YAW
    this.pitch = clamp(this.pitch + dy * DRAG_PITCH, -MAX_PITCH, MAX_PITCH)
    this.swing = clamp(dx * DRAG_YAW * 60, -6, 6)
  }

  /** `spin` es el giro continuo de la escena actual, en rad/s. */
  update(dt: number, spin: number): void {
    this.lean.x += (this.leanGoal.x - this.lean.x) * damp(3, dt)
    this.lean.y += (this.leanGoal.y - this.lean.y) * damp(3, dt)
    if (this.dragging) return

    this.yaw += (spin + this.swing) * dt
    this.swing *= Math.exp(-3 * dt)
    this.pitch -= this.pitch * damp(1.6, dt)

    // Las formas que no giran solas vuelven a mirar de frente al soltarlas.
    const home = Math.round(this.yaw / TAU) * TAU
    const pull = 1 - Math.min(1, Math.abs(spin) / FRONTAL_SPIN)
    this.yaw += (home - this.yaw) * pull * damp(2.2, dt)
  }
}
