import { clamp, damp } from './math'

const TAU = Math.PI * 2
/** Radians of rotation per dragged pixel. */
const DRAG_YAW = 0.006
const DRAG_PITCH = 0.004
const MAX_PITCH = 0.8
/** Below this spin (rad/s) the scene counts as “frontal”. */
const FRONTAL_SPIN = 0.08

/**
 * Orientation of the shape: the spin of each scene, the drag of the visitor
 * (with inertia) and a slight lean towards the cursor.
 */
export class ShapeRotation {
  yaw = 0
  pitch = 0
  dragging = false
  /** Smoothed lean towards the cursor, from −1 to 1 on each axis. */
  readonly lean = { x: 0, y: 0 }

  private readonly leanGoal = { x: 0, y: 0 }
  private swing = 0

  leanTowards(x: number, y: number): void {
    this.leanGoal.x = x
    this.leanGoal.y = y
  }

  /** Mouse movement, in pixels, while dragging. */
  drag(dx: number, dy: number): void {
    this.yaw += dx * DRAG_YAW
    this.pitch = clamp(this.pitch + dy * DRAG_PITCH, -MAX_PITCH, MAX_PITCH)
    this.swing = clamp(dx * DRAG_YAW * 60, -6, 6)
  }

  /** `spin` is the continuous spin of the current scene, in rad/s. */
  update(dt: number, spin: number): void {
    this.lean.x += (this.leanGoal.x - this.lean.x) * damp(3, dt)
    this.lean.y += (this.leanGoal.y - this.lean.y) * damp(3, dt)
    if (this.dragging) return

    this.yaw += (spin + this.swing) * dt
    this.swing *= Math.exp(-3 * dt)
    this.pitch -= this.pitch * damp(1.6, dt)

    // Shapes that do not spin on their own turn back to face the viewer when released.
    const home = Math.round(this.yaw / TAU) * TAU
    const pull = 1 - Math.min(1, Math.abs(spin) / FRONTAL_SPIN)
    this.yaw += (home - this.yaw) * pull * damp(2.2, dt)
  }
}
