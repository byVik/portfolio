export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** Fraction of the way to a target covered in `dt` seconds (exponential smoothing). */
export const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt)

/** Moves `value` towards `goal` by at most `step`, without overshooting. */
export const approach = (value: number, goal: number, step: number) =>
  value < goal ? Math.min(goal, value + step) : Math.max(goal, value - step)
