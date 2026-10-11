export interface Quality {
  /** Fraction of the points being drawn. */
  points: number
  pixelRatio: number
}

/** From highest to lowest quality. It only goes down: going up and down would make the scene flicker. */
export const QUALITY_STEPS: readonly Quality[] = [
  { points: 1, pixelRatio: 2 },
  { points: 0.7, pixelRatio: 1.5 },
  { points: 0.45, pixelRatio: 1.25 },
  { points: 0.3, pixelRatio: 1 },
]

/**
 * Measures FPS in windows and asks to drop one quality step when a whole
 * window runs below the minimum.
 */
export class FrameBudget {
  /** Index of the current step in `QUALITY_STEPS`. */
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

  /** `dt` in seconds since the previous frame. Returns `true` when quality must drop. */
  tick(dt: number): boolean {
    // A long gap is a background tab, not a slow machine.
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
