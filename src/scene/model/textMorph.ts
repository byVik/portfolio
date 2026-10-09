import { approach } from './math'

const FORM_SECONDS = 1.4
const DISSOLVE_SECONDS = 0.85

/**
 * Transición hacia la forma que escribe el visitante. Un texto nuevo espera a
 * que el anterior se deshaga antes de formarse.
 */
export class TextMorph {
  /** De 0 (la forma de la escena) a 1 (el texto, formado). */
  amount = 0

  private goal = 0
  /** `undefined` = nada pendiente; `null` = volver a la forma de la escena. */
  private pending: Float32Array | null | undefined

  /** Hay un texto formado o formándose. */
  get active(): boolean {
    return this.goal === 1
  }

  /** Pide formar `points`; `null` deshace el texto actual. */
  request(points: Float32Array | null): void {
    this.pending = points
  }

  /**
   * Avanza la transición. Devuelve los puntos del texto nuevo en el instante
   * en que deben cargarse (cuando el anterior ya no se ve).
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
