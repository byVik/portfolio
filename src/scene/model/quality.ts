export interface Quality {
  /** Fracción de los puntos que se dibuja. */
  points: number
  pixelRatio: number
}

/** De más a menos calidad. Solo se baja: subir y bajar haría parpadear la escena. */
export const QUALITY_STEPS: readonly Quality[] = [
  { points: 1, pixelRatio: 2 },
  { points: 0.7, pixelRatio: 1.5 },
  { points: 0.45, pixelRatio: 1.25 },
  { points: 0.3, pixelRatio: 1 },
]

/**
 * Mide los FPS por ventanas y pide bajar un escalón de calidad cuando una
 * ventana entera va por debajo del mínimo.
 */
export class FrameBudget {
  /** Índice del escalón actual en `QUALITY_STEPS`. */
  level = 0

  private waited = 0
  private frames = 0
  private elapsed = 0

  constructor(
    private readonly minFps = 42,
    private readonly windowSeconds = 1.5,
    private readonly warmupSeconds = 3,
    private readonly lastLevel = QUALITY_STEPS.length - 1,
  ) {}

  /** `dt` en segundos desde el fotograma anterior. Devuelve `true` si hay que bajar la calidad. */
  tick(dt: number): boolean {
    // Un salto largo es una pestaña en segundo plano, no un equipo lento.
    if (dt <= 0 || dt > 0.25 || this.level >= this.lastLevel) return false
    if (this.waited < this.warmupSeconds) {
      this.waited += dt
      return false
    }

    this.frames++
    this.elapsed += dt
    if (this.elapsed < this.windowSeconds) return false

    const slow = this.frames / this.elapsed < this.minFps
    this.frames = 0
    this.elapsed = 0
    if (slow) this.level++
    return slow
  }
}
