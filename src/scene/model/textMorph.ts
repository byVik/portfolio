import { approach } from './math'

const FORM_SECONDS = 1.4
const DISSOLVE_SECONDS = 0.85

/**
 * Transition towards the shape the visitor types. A new text waits for
 * the previous one to dissolve before forming.
 */
export class TextMorph {
  /** From 0 (the shape of the scene) to 1 (the text, formed). */
  amount = 0

  private goal = 0
  /** `undefined` = nothing pending; `null` = return to the shape of the scene. */
  private pending: Float32Array | null | undefined

  /** A text is formed or forming. */
  get active(): boolean {
    return this.goal === 1
  }

  /** Asks to form `points`; `null` dissolves the current text. */
  request(points: Float32Array | null): void {
    this.pending = points
  }

  /**
   * Advances the transition. Returns the points of the new text at the moment
   * they must be loaded (once the previous one is no longer visible).
   */
  update(dt: number): Float32Array | undefined {
    if (this.pending === undefined) {
      this.amount = approach(this.amount, this.goal, dt / FORM_SECONDS)
      return undefined
    }

    this.amount = approach(this.amount, 0, dt / DISSOLVE_SECONDS)
    if (this.amount > 0) return undefined

    const next = this.pending
    this.pending = undefined
    this.goal = next ? 1 : 0
    return next ?? undefined
  }
}
