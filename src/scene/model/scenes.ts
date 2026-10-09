import type { ShapeName } from './shapes'

export interface SceneDef {
  /** Id de la sección del DOM que activa la escena. */
  id: string
  shape: ShapeName
  /** Giro continuo en rad/s. Con 0 la forma vuelve a mirar de frente. */
  spin: number
  yaw: number
  tilt: number
  scale: number
  /** 1 = cae el 80 % de los puntos (el código que sobra). */
  prune: number
  /** Agitación en reposo. */
  idle: number
  alpha: number
}

const base = { spin: 0.12, yaw: 0, tilt: 0.28, scale: 1, prune: 0, idle: 0.012, alpha: 0.7 }

/** Una escena por sección, en el orden en que aparecen en la página. */
export const scenes: readonly SceneDef[] = [
  { ...base, id: 'hero', shape: 'cloud', spin: 0.06, tilt: 0.1, idle: 0.1, alpha: 0.45 },
  { ...base, id: 'perfil', shape: 'lattice' },
  { ...base, id: 'volinga', shape: 'frame', spin: 0.16, prune: 1, alpha: 0.9 },
  { ...base, id: 'suite', shape: 'stage', spin: 0, yaw: 0.4, tilt: 0.2 },
  { ...base, id: 'pipeline', shape: 'pipeline', spin: 0, yaw: -0.7, tilt: 0.16, scale: 0.8, alpha: 0.5 },
  { ...base, id: 'arquimea', shape: 'globe', spin: 0.14 },
  { ...base, id: 'movil', shape: 'ball', spin: 0.3, tilt: 0.2 },
  { ...base, id: 'ia', shape: 'orbit', spin: 0.1, alpha: 0.5 },
  { ...base, id: 'orderflow', shape: 'hex', spin: 0, yaw: 0.45, tilt: 0.12, alpha: 0.5 },
  { ...base, id: 'juegos', shape: 'gamepad', spin: 0, yaw: 0.35, tilt: 0.1, scale: 1.1, alpha: 0.5 },
  { ...base, id: 'stack', shape: 'layers', tilt: 0.42, alpha: 0.4 },
  { ...base, id: 'contacto', shape: 'cloud', spin: 0, tilt: 0.05, idle: 0.09, alpha: 0.45 },
]
