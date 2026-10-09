import { GATES } from './pipeline'

export type Vec3 = [number, number, number]
type Segment = [Vec3, Vec3]
type Rng = () => number
type Sampler = (rng: Rng) => Vec3

/** Recorrido de un punto en movimiento: `u` va de 0 a 1 y vuelve a empezar. */
export type Path = (u: number) => Vec3

/** Lo que se mueve por una forma: agentes, paquetes, vuelos… */
export interface Traffic {
  paths: Path[]
  /** Recorridos completos por segundo. */
  speed: number
  /** Fracción del recorrido que ocupa la estela. */
  tail: number
  /** Tamaño de sus puntos respecto a los de la forma. */
  size: number
}

const TAU = Math.PI * 2
const DEG = Math.PI / 180

/** Generador determinista: la misma semilla dibuja siempre la misma forma. */
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (v: Vec3, k: number): Vec3 => [v[0] * k, v[1] * k, v[2] * k]
const normalize = (v: Vec3): Vec3 => scale(v, 1 / (Math.hypot(v[0], v[1], v[2]) || 1))
const pick = <T>(items: readonly T[], rng: Rng): T => items[Math.floor(rng() * items.length)]

function onSphere(rng: Rng): Vec3 {
  const y = rng() * 2 - 1
  const angle = rng() * TAU
  const radius = Math.sqrt(1 - y * y)
  return [radius * Math.cos(angle), y, radius * Math.sin(angle)]
}

function inBall(center: Vec3, radius: number, rng: Rng): Vec3 {
  return add(center, scale(onSphere(rng), radius * Math.cbrt(rng())))
}

function latLon(lat: number, lon: number): Vec3 {
  const a = lat * DEG
  const b = lon * DEG
  return [Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b)]
}

function rotateX([x, y, z]: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [x, y * c - z * s, y * s + z * c]
}

function rotateZ([x, y, z]: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [x * c - y * s, x * s + y * c, z]
}

/** Reparte los puntos sobre las aristas en proporción a su longitud. */
function alongSegments(segments: Segment[], jitter = 0.03): Sampler {
  const lengths = segments.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]))
  const total = lengths.reduce((sum, length) => sum + length, 0)
  return (rng) => {
    let cursor = rng() * total
    let k = 0
    while (k < segments.length - 1 && cursor > lengths[k]) cursor -= lengths[k++]
    const [a, b] = segments[k]
    const t = rng()
    return [
      a[0] + (b[0] - a[0]) * t + (rng() - 0.5) * jitter,
      a[1] + (b[1] - a[1]) * t + (rng() - 0.5) * jitter,
      a[2] + (b[2] - a[2]) * t + (rng() - 0.5) * jitter,
    ]
  }
}

function cubeEdges(half: number, center: Vec3 = [0, 0, 0]): Segment[] {
  const edges: Segment[] = []
  for (const a of [-half, half]) {
    for (const b of [-half, half]) {
      edges.push(
        [
          [-half, a, b],
          [half, a, b],
        ],
        [
          [a, -half, b],
          [a, half, b],
        ],
        [
          [a, b, -half],
          [a, b, half],
        ],
      )
    }
  }
  return edges.map(([from, to]): Segment => [add(from, center), add(to, center)])
}

/** Combina varias partes de una forma; el peso es la fracción de puntos de cada una. */
function oneOf(parts: [weight: number, sampler: Sampler][]): Sampler {
  const total = parts.reduce((sum, [weight]) => sum + weight, 0)
  return (rng) => {
    let cursor = rng() * total
    for (const [weight, sampler] of parts) {
      if (cursor < weight) return sampler(rng)
      cursor -= weight
    }
    return parts[parts.length - 1][1](rng)
  }
}

// Nube: el ruido del que parte (y al que vuelve) todo.
const cloud: Sampler = (rng) => {
  const [x, y, z] = onSphere(rng)
  const radius = (0.2 + 1.2 * rng() ** 0.55) * (1 + 0.3 * Math.sin(x * 5 + y * 3) * Math.cos(z * 4))
  return [x * radius * 1.2, y * radius * 0.85, z * radius]
}

// Retícula: nodos y aristas de una malla cúbica; el ruido, ordenado.
const LATTICE_NODES = 6
const LATTICE_STEP = 2 / (LATTICE_NODES - 1)
const lattice: Sampler = (rng) => {
  const node = [0, 1, 2].map(() => Math.floor(rng() * LATTICE_NODES))
  if (rng() > 0.3) {
    const axis = Math.floor(rng() * 3)
    if (node[axis] < LATTICE_NODES - 1) node[axis] += rng()
  }
  return [node[0] * LATTICE_STEP - 1, node[1] * LATTICE_STEP - 1, node[2] * LATTICE_STEP - 1]
}
/** Una señal que recorre de lado a lado una fila de nodos. */
const latticeRun =
  (axis: number, a: number, b: number, phase: number): Path =>
  (u) => {
    const point: Vec3 = [0, 0, 0]
    point[axis] = ((u + phase) % 1) * 2 - 1
    point[(axis + 1) % 3] = a * LATTICE_STEP - 1
    point[(axis + 2) % 3] = b * LATTICE_STEP - 1
    return point
  }

// Armazón: lo que queda al quitar el código que sobra.
const CORNERS: Vec3[] = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z): Vec3 => [x, y, z])))
const frame = alongSegments([
  ...cubeEdges(0.95),
  ...cubeEdges(0.42),
  ...CORNERS.map((corner): Segment => [scale(corner, 0.95), scale(corner, 0.42)]),
])

// Plató: pared curva de paneles, suelo y una cámara apuntando a la pared.
const STAGE = { radius: 1.7, span: 150 * DEG, floor: -0.6, top: 0.75, depth: 0.85 }
const onStage = (radius: number, angle: number, y: number): Vec3 => [
  radius * Math.sin(angle),
  y,
  STAGE.depth - radius * Math.cos(angle),
]
const CAMERA: Vec3 = [0, 0.1, STAGE.depth]
const FRUSTUM: Vec3[] = [
  [-0.8, 0.55, -0.55],
  [0.8, 0.55, -0.55],
  [0.8, -0.35, -0.55],
  [-0.8, -0.35, -0.55],
]
const stage = oneOf([
  [
    0.55,
    (rng) => {
      let u = rng()
      let v = rng()
      const seam = rng()
      if (seam < 0.35) u = Math.round(u * 14) / 14
      else if (seam < 0.6) v = Math.round(v * 5) / 5
      return onStage(STAGE.radius, (u - 0.5) * STAGE.span, STAGE.floor + v * (STAGE.top - STAGE.floor))
    },
  ],
  [
    0.22,
    (rng) => {
      const ring = rng() < 0.5 ? Math.round(rng() * 6) / 6 : Math.sqrt(rng())
      return onStage(STAGE.radius * ring, (rng() - 0.5) * STAGE.span, STAGE.floor)
    },
  ],
  [
    0.23,
    alongSegments([
      ...FRUSTUM.map((corner): Segment => [CAMERA, corner]),
      ...FRUSTUM.map((corner, i): Segment => [corner, FRUSTUM[(i + 1) % FRUSTUM.length]]),
      ...cubeEdges(0.1, [0, 0.1, STAGE.depth + 0.1]),
    ]),
  ],
])

// Pipeline: un flujo que se estrecha en cada etapa y acaba en un artefacto.
const STREAM = { from: -1.9, artifact: 1.92 }
const streamRadius = (x: number) => 0.05 + 0.2 * Math.abs(Math.sin((Math.PI * (x - GATES[0])) / (GATES[1] - GATES[0])))
/** Un paquete que cruza las cuatro etapas hasta el artefacto. */
const packet =
  (angle: number, phase: number): Path =>
  (u) => {
    const x = STREAM.from + (STREAM.artifact - STREAM.from) * ((u + phase) % 1)
    const radius = streamRadius(x) * 0.45
    return [x, radius * Math.cos(angle), radius * Math.sin(angle)]
  }
const pipeline = oneOf([
  [
    0.5,
    (rng) => {
      const angle = rng() * TAU
      const radius = rng() < 0.7 ? 0.55 : 0.63
      return [pick(GATES, rng) + (rng() - 0.5) * 0.04, radius * Math.cos(angle), radius * Math.sin(angle)]
    },
  ],
  [
    0.38,
    (rng) => {
      const x = STREAM.from + 3.6 * rng()
      const radius = streamRadius(x) * Math.sqrt(rng())
      const angle = rng() * TAU
      return [x, radius * Math.cos(angle), radius * Math.sin(angle)]
    },
  ],
  [0.12, alongSegments(cubeEdges(0.17, [STREAM.artifact, 0, 0]))],
])

// Globo: retícula de meridianos y paralelos con rutas que salen de Madrid.
const GLOBE = 1.25
const HUB = latLon(40, -4)
const ROUTES = [latLon(41, -74), latLon(-23, -43), latLon(35, 139), latLon(55, 37), latLon(-34, 18), latLon(19, -99)]
/** Punto `t` (0 a 1) del vuelo entre Madrid y `to`: sube y vuelve a bajar a la superficie. */
const flight = (to: Vec3, t: number): Vec3 =>
  scale(normalize(add(scale(HUB, 1 - t), scale(to, t))), GLOBE * (1 + 0.3 * Math.sin(Math.PI * t)))
const globe = oneOf([
  [0.42, (rng) => scale(onSphere(rng), GLOBE)],
  [
    0.36,
    (rng) =>
      rng() < 0.5
        ? scale(latLon((rng() - 0.5) * 180, Math.floor(rng() * 12) * 30), GLOBE)
        : scale(latLon((Math.floor(rng() * 7) - 3) * 22.5, rng() * 360), GLOBE),
  ],
  [0.22, (rng) => flight(pick(ROUTES, rng), rng())],
])

// Pelota de tenis: esfera con su costura.
const BALL = 1.15
const ball = oneOf([
  [0.66, (rng) => scale(onSphere(rng), BALL * (1 + (rng() - 0.5) * 0.03))],
  [
    0.34,
    (rng) => {
      const t = rng() * TAU
      const seam: Vec3 = [
        0.75 * Math.cos(t) + 0.25 * Math.cos(3 * t),
        0.75 * Math.sin(t) - 0.25 * Math.sin(3 * t),
        0.866 * Math.sin(2 * t),
      ]
      return inBall(scale(seam, BALL * 1.02), 0.02, rng)
    },
  ],
])

// Órbita: un núcleo y las órbitas por las que giran los agentes (que son tráfico).
const RINGS = [
  { radius: 0.85, tiltX: 0.5, tiltZ: 0.2 },
  { radius: 1.15, tiltX: -0.9, tiltZ: 0.6 },
  { radius: 1.45, tiltX: 1.25, tiltZ: -0.4 },
]
const onRing = (ring: (typeof RINGS)[number], angle: number): Vec3 =>
  rotateZ(rotateX([ring.radius * Math.cos(angle), 0, ring.radius * Math.sin(angle)], ring.tiltX), ring.tiltZ)
const orbit = oneOf([
  [0.2, (rng) => inBall([0, 0, 0], 0.34, rng)],
  [0.8, (rng) => inBall(onRing(pick(RINGS, rng), rng() * TAU), 0.03, rng)],
])

// Hexágono: las tres capas de la arquitectura hexagonal y sus adaptadores.
const HEX_DEPTH = 0.22
const SIDES = [0, 1, 2, 3, 4, 5]
const hexCorner = (radius: number, side: number, z: number): Vec3 => [
  radius * Math.cos(side * 60 * DEG),
  radius * Math.sin(side * 60 * DEG),
  z,
]
const hex = oneOf([
  [0.1, (rng) => inBall([0, 0, 0], 0.2, rng)],
  [
    0.9,
    alongSegments([
      ...[0.5, 0.95, 1.4].flatMap((radius) =>
        SIDES.flatMap((side): Segment[] => [
          [hexCorner(radius, side, -HEX_DEPTH), hexCorner(radius, side + 1, -HEX_DEPTH)],
          [hexCorner(radius, side, HEX_DEPTH), hexCorner(radius, side + 1, HEX_DEPTH)],
          [hexCorner(radius, side, -HEX_DEPTH), hexCorner(radius, side, HEX_DEPTH)],
        ]),
      ),
      ...SIDES.map((side): Segment => {
        const angle = (side * 60 + 30) * DEG
        return [
          [1.21 * Math.cos(angle), 1.21 * Math.sin(angle), 0],
          [1.62 * Math.cos(angle), 1.62 * Math.sin(angle), 0],
        ]
      }),
    ]),
  ],
])

// Mando: la afición. Silueta, cruceta, cuatro botones y dos palancas.
const PAD = { half: 0.75, radius: 0.55, y: 0.15, depth: 0.14 }
const PAD_FRONT = PAD.depth + 0.03
const GRIP_RADIUS = 0.45
const GRIPS: [x: number, y: number][] = [
  [-0.95, -0.42],
  [0.95, -0.42],
]
const BUTTON_RADIUS = 0.085
const BUTTONS: [x: number, y: number][] = [
  [0.62, 0.36],
  [0.84, 0.14],
  [0.62, -0.08],
  [0.4, 0.14],
]
const STICK_RADIUS = 0.15
const STICKS: [x: number, y: number][] = [
  [-0.3, -0.3],
  [0.3, -0.3],
]
const onPad = (x: number, y: number, radius: number, angle: number): Vec3 => [
  x + radius * Math.cos(angle),
  y + radius * Math.sin(angle),
  PAD_FRONT,
]
const padDisc = (x: number, y: number, radius: number, rng: Rng): Vec3 =>
  onPad(x, y, radius * Math.sqrt(rng()), rng() * TAU)

const inPadBody = (x: number, y: number) =>
  Math.hypot(x - Math.max(-PAD.half, Math.min(PAD.half, x)), y - PAD.y) < PAD.radius - 0.01
const inPadGrip = (x: number, y: number) =>
  GRIPS.some(([gripX, gripY]) => Math.hypot(x - gripX, y - gripY) < GRIP_RADIUS - 0.01)

/** Un punto del borde del cuerpo: dos rectas unidas por dos semicírculos. */
function padBodyEdge(rng: Rng): [x: number, y: number] {
  const part = rng()
  if (part < 0.46) return [(rng() * 2 - 1) * PAD.half, PAD.y + (part < 0.23 ? PAD.radius : -PAD.radius)]
  const side = part < 0.73 ? 1 : -1
  const angle = (rng() - 0.5) * Math.PI
  return [side * (PAD.half + PAD.radius * Math.cos(angle)), PAD.y + PAD.radius * Math.sin(angle)]
}

function padGripEdge(rng: Rng): [x: number, y: number] {
  const [gripX, gripY] = pick(GRIPS, rng)
  const angle = rng() * TAU
  return [gripX + GRIP_RADIUS * Math.cos(angle), gripY + GRIP_RADIUS * Math.sin(angle)]
}

/** La silueta es el contorno de la unión: se descarta lo que cae dentro de la otra pieza. */
const padOutline: Sampler = (rng) => {
  const z = rng() < 0.5 ? PAD.depth : -PAD.depth
  for (let tries = 0; tries < 24; tries++) {
    const fromBody = rng() < 0.62
    const [x, y] = fromBody ? padBodyEdge(rng) : padGripEdge(rng)
    if (fromBody ? !inPadGrip(x, y) : !inPadBody(x, y)) return [x, y, z]
  }
  return [0, PAD.y + PAD.radius, z]
}

const DPAD = { x: -0.62, y: 0.14, arm: 0.2, width: 0.065 }
const DPAD_CORNERS: [x: number, y: number][] = [
  [-DPAD.width, DPAD.arm],
  [DPAD.width, DPAD.arm],
  [DPAD.width, DPAD.width],
  [DPAD.arm, DPAD.width],
  [DPAD.arm, -DPAD.width],
  [DPAD.width, -DPAD.width],
  [DPAD.width, -DPAD.arm],
  [-DPAD.width, -DPAD.arm],
  [-DPAD.width, -DPAD.width],
  [-DPAD.arm, -DPAD.width],
  [-DPAD.arm, DPAD.width],
  [-DPAD.width, DPAD.width],
]
const dpadCorner = (i: number): Vec3 => {
  const [x, y] = DPAD_CORNERS[i % DPAD_CORNERS.length]
  return [DPAD.x + x, DPAD.y + y, PAD_FRONT]
}

const gamepad = oneOf([
  [0.5, padOutline],
  [
    0.12,
    alongSegments(
      DPAD_CORNERS.map((_, i): Segment => [dpadCorner(i), dpadCorner(i + 1)]),
      0.015,
    ),
  ],
  [
    0.2,
    (rng) => {
      const [x, y] = pick(BUTTONS, rng)
      return rng() < 0.6 ? onPad(x, y, BUTTON_RADIUS, rng() * TAU) : padDisc(x, y, BUTTON_RADIUS, rng)
    },
  ],
  [
    0.18,
    (rng) => {
      const [x, y] = pick(STICKS, rng)
      return rng() < 0.6 ? onPad(x, y, STICK_RADIUS, rng() * TAU) : padDisc(x, y, 0.07, rng)
    },
  ],
])

// Capas: el stack, literalmente apilado.
const layers: Sampler = (rng) => {
  const y = -0.9 + Math.floor(rng() * 5) * 0.45
  let u = rng()
  let v = rng()
  const kind = rng()
  if (kind < 0.15) u = Math.round(u)
  else if (kind < 0.3) v = Math.round(v)
  else if (kind < 0.65) u = Math.round(u * 6) / 6
  else v = Math.round(v * 4) / 4
  return [(u * 2 - 1) * 1.15, y, (v * 2 - 1) * 0.75]
}

const samplers = { cloud, lattice, frame, stage, pipeline, globe, ball, orbit, hex, gamepad, layers }

export type ShapeName = keyof typeof samplers

export const shapeNames = Object.keys(samplers) as ShapeName[]

/** Puntos de las capas por los que suben y bajan las peticiones (cruces de la rejilla). */
const PORTS: [x: number, z: number][] = [
  [-0.767, -0.375],
  [0, 0.375],
  [0.767, -0.375],
  [-0.383, 0],
  [0.383, 0.375],
  [0.767, 0.375],
]

/** El tráfico de cada forma. Las que no aparecen aquí son estáticas. */
export const traffic: Partial<Record<ShapeName, Traffic>> = {
  // Señales entre nodos.
  lattice: {
    paths: [
      latticeRun(0, 1, 4, 0),
      latticeRun(1, 3, 2, 0.3),
      latticeRun(2, 5, 0, 0.6),
      latticeRun(0, 4, 1, 0.5),
      latticeRun(1, 0, 5, 0.8),
      latticeRun(2, 2, 3, 0.15),
    ],
    speed: 0.22,
    tail: 0.14,
    size: 2,
  },
  // Paquetes que cruzan tests, build, instalador y firma.
  pipeline: { paths: [0, 1, 2, 3, 4].map((k) => packet(k * 2.4, k / 5)), speed: 0.2, tail: 0.1, size: 2.2 },
  // Vuelos de ida y vuelta entre Madrid y cada destino.
  globe: {
    paths: ROUTES.map((to, k): Path => (u) => {
      const t = (u + k / ROUTES.length) % 1
      return flight(to, k % 2 ? 1 - t : t)
    }),
    speed: 0.14,
    tail: 0.16,
    size: 2.2,
  },
  // Dos agentes por órbita, siempre en lados opuestos.
  orbit: {
    paths: [0, 1, 2, 3, 4, 5].map(
      (k): Path =>
        (u) =>
          onRing(RINGS[k % 3], ((u + k / 6 + (k % 3) * 0.11) % 1) * TAU),
    ),
    speed: 0.06,
    tail: 0.014,
    size: 3.4,
  },
  // Eventos que entran y salen del dominio por los adaptadores.
  hex: {
    paths: SIDES.map((side): Path => (u) => {
      const t = (u + side * 0.28) % 1
      const angle = (side * 60 + 30) * DEG
      const radius = 1.62 * (side % 2 ? t : 1 - t)
      return [radius * Math.cos(angle), radius * Math.sin(angle), 0]
    }),
    speed: 0.28,
    tail: 0.22,
    size: 2.2,
  },
  // Pulsaciones: un destello que da vueltas a cada botón y a cada palanca.
  gamepad: {
    paths: [
      ...BUTTONS.map(
        ([x, y], k): Path =>
          (u) =>
            onPad(x, y, BUTTON_RADIUS * 1.5, ((u + k / 4) % 1) * TAU),
      ),
      ...STICKS.map(
        ([x, y], k): Path =>
          (u) =>
            onPad(x, y, STICK_RADIUS * 1.25, ((1 - u + k / 2) % 1) * TAU),
      ),
    ],
    speed: 0.5,
    tail: 0.55,
    size: 1.5,
  },
  // Peticiones que atraviesan el stack en los dos sentidos.
  layers: {
    paths: PORTS.map(([x, z], k): Path => (u) => {
      const t = (u + k * 0.37) % 1
      return [x, -0.9 + 1.8 * (k % 2 ? 1 - t : t), z]
    }),
    speed: 0.3,
    tail: 0.2,
    size: 2,
  },
}

/** Devuelve `count` puntos (x, y, z consecutivos) repartidos sobre la forma. */
export function buildShape(name: ShapeName, count: number, seed: number): Float32Array {
  const rng = mulberry32(seed)
  const sample = samplers[name]
  const points = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) points.set(sample(rng), i * 3)
  return points
}
