export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** Fracción del camino hacia un objetivo que se recorre en `dt` segundos (suavizado exponencial). */
export const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt)

/** Avanza `value` hacia `goal` como mucho `step`, sin pasarse. */
export const approach = (value: number, goal: number, step: number) =>
  value < goal ? Math.min(goal, value + step) : Math.max(goal, value - step)
