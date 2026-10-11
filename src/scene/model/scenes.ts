import type { ShapeName } from './shapes'

export interface SceneDef {
  /** Id of the DOM section that activates the scene. */
  id: string
  shape: ShapeName
  /** Continuous spin in rad/s. At 0 the shape turns back to face the viewer. */
  spin: number
  yaw: number
  tilt: number
  scale: number
  /** 1 = 80% of the points fall (the spare code). */
  prune: number
  /** Idle jitter. */
  idle: number
  alpha: number
}

const base = { spin: 0.12, yaw: 0, tilt: 0.28, scale: 1, prune: 0, idle: 0.012, alpha: 0.7 }

/** One scene per section, in the order they appear on the page. */
export const scenes: readonly SceneDef[] = [
  { ...base, id: 'hero', shape: 'cloud', spin: 0.06, tilt: 0.1, idle: 0.1, alpha: 0.45 },
  { ...base, id: 'profile', shape: 'lattice' },
  { ...base, id: 'volinga', shape: 'frame', spin: 0.16, prune: 1, alpha: 0.9 },
  { ...base, id: 'suite', shape: 'stage', spin: 0, yaw: 0.4, tilt: 0.2 },
  { ...base, id: 'pipeline', shape: 'pipeline', spin: 0, yaw: -0.7, tilt: 0.16, scale: 0.8, alpha: 0.5 },
  { ...base, id: 'arquimea', shape: 'globe', spin: 0.14 },
  { ...base, id: 'mobile', shape: 'ball', spin: 0.3, tilt: 0.2 },
  { ...base, id: 'ai', shape: 'orbit', spin: 0.1, alpha: 0.5 },
  { ...base, id: 'orderflow', shape: 'hex', spin: 0, yaw: 0.45, tilt: 0.12, alpha: 0.5 },
  { ...base, id: 'games', shape: 'gamepad', spin: 0, yaw: 0.35, tilt: 0.1, scale: 1.1, alpha: 0.5 },
  { ...base, id: 'stack', shape: 'layers', tilt: 0.42, alpha: 0.4 },
  { ...base, id: 'contact', shape: 'cloud', spin: 0, tilt: 0.05, idle: 0.09, alpha: 0.45 },
]
