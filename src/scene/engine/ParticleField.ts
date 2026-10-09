import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three'
import { clamp, damp, approach } from '../model/math'
import { PULSE } from '../model/pipeline'
import type { Quality } from '../model/quality'
import { ShapeRotation } from '../model/rotation'
import type { SceneDef } from '../model/scenes'
import { split } from '../model/scrollMath'
import { buildShape, mulberry32, traffic } from '../model/shapes'
import { TextMorph } from '../model/textMorph'
import { fragmentShader, vertexShader } from './shaders'
import { TrafficLayer } from './TrafficLayer'

const FOV = 38
const CAMERA_Z = 7
const HALF_FOV_TAN = Math.tan((FOV * Math.PI) / 360)
const HALF_HEIGHT = HALF_FOV_TAN * CAMERA_Z
/** Radio aproximado de cualquier forma, para encajarla en pantallas estrechas. */
const SHAPE_RADIUS = 1.9
/** Fracción de puntos que cae en las escenas con `prune`: el «−80 % de código». */
const PRUNE_FRACTION = 0.8
const POINT_SIZE = 0.034
const INTRO_SECONDS = 2.6
const BEFORE_SECONDS = 0.9
const SHOCK_SECONDS = 1.4

type Tweened = 'spin' | 'yaw' | 'tilt' | 'scale' | 'prune' | 'idle' | 'alpha'

export interface FieldColors {
  background: string
  cold: string
  warm: string
  accent: string
}

export interface FieldOptions {
  canvas: HTMLCanvasElement
  scenes: readonly SceneDef[]
  count: number
  colors: FieldColors
  reducedMotion: boolean
}

export interface FieldStatus {
  /** Escena más cercana a la posición actual. */
  index: number
  /** Porcentaje de puntos que siguen a la vista. */
  visible: number
  /** La última escena muestra un texto escrito por el visitante. */
  custom: boolean
  /** Puntos que se están dibujando con la calidad actual. */
  points: number
}

/**
 * Nube de puntos que se transforma de una forma a otra. No sabe nada de Vue
 * ni del scroll: recibe la posición de escena y los gestos, y dibuja.
 */
export class ParticleField {
  private readonly renderer: WebGLRenderer
  private readonly scene = new Scene()
  private readonly camera = new PerspectiveCamera(FOV, 1, 0.1, 40)
  private readonly group = new Group()
  private readonly geometry = new BufferGeometry()
  private readonly material: ShaderMaterial
  private readonly trafficLayer: TrafficLayer
  private readonly from: BufferAttribute
  private readonly to: BufferAttribute
  private readonly written: BufferAttribute
  private readonly scenes: readonly SceneDef[]
  private readonly shapes: Float32Array[]
  private readonly count: number
  private readonly calm: boolean

  private readonly rotation = new ShapeRotation()
  private readonly text = new TextMorph()
  private readonly pointer = new Vector3(0, 0, 0)
  private readonly pointerGoal = new Vector3(0, 0, 0)
  private readonly shockOrigin = new Vector3(0, 0, 0)
  private readonly ray = new Vector3()
  private force = 0
  private forceGoal = 0

  private layout = { x: 0, y: 0, fit: 1, alpha: 1 }
  private size = { width: 0, height: 0 }
  private projection = 1
  /** Fracción de los puntos que se dibuja (calidad). */
  private density = 1
  private position = 0
  private loaded = -1
  private time = 0
  private intro: number
  private before = 0
  private beforeGoal = 0
  private pulse = -1
  private shockAge = SHOCK_SECONDS

  constructor({ canvas, scenes, count, colors, reducedMotion }: FieldOptions) {
    this.scenes = scenes
    this.count = count
    this.calm = reducedMotion
    this.intro = reducedMotion ? 1 : 0

    this.renderer = new WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(new Color(colors.background), 1)
    this.camera.position.z = CAMERA_Z
    this.camera.updateMatrixWorld()

    this.shapes = scenes.map((scene, i) => buildShape(scene.shape, count, 7919 + i))

    const rng = mulberry32(42)
    const random = new Float32Array(count * 4).map(() => rng())
    this.from = new BufferAttribute(new Float32Array(count * 3), 3)
    this.to = new BufferAttribute(new Float32Array(count * 3), 3)
    this.written = new BufferAttribute(new Float32Array(count * 3), 3)
    this.geometry.setAttribute('position', this.from)
    this.geometry.setAttribute('aTo', this.to)
    this.geometry.setAttribute('aText', this.written)
    this.geometry.setAttribute('aRand', new BufferAttribute(random, 4))

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
      defines: { PRUNE_FRACTION: PRUNE_FRACTION.toFixed(2), SHOCK_SECONDS: SHOCK_SECONDS.toFixed(2) },
      uniforms: {
        uTime: { value: 0 },
        uMix: { value: 0 },
        uText: { value: 0 },
        uPrune: { value: 0 },
        uClutter: { value: 0 },
        uTurbulence: { value: reducedMotion ? 0 : 0.3 },
        uIdle: { value: 0 },
        uIntro: { value: this.intro },
        uSize: { value: POINT_SIZE },
        uProjection: { value: 1 },
        uAlpha: { value: 1 },
        uPulse: { value: 0 },
        uPulseOn: { value: 0 },
        uPointer: { value: this.pointer },
        uPointerForce: { value: 0 },
        uShock: { value: this.shockOrigin },
        uShockAge: { value: SHOCK_SECONDS },
        uCold: { value: new Color(colors.cold) },
        uWarm: { value: new Color(colors.warm) },
        uAccent: { value: new Color(colors.accent) },
      },
    })

    const points = new Points(this.geometry, this.material)
    points.frustumCulled = false
    this.trafficLayer = new TrafficLayer(colors.accent)
    this.group.add(points, this.trafficLayer.points)
    this.scene.add(this.group)
  }

  /** Cuántos puntos debe tener una forma personalizada. */
  get capacity(): number {
    return this.count
  }

  resize(width: number, height: number): void {
    if (width === this.size.width && height === this.size.height) return
    this.size = { width, height }
    this.applyViewport()
  }

  /** Menos puntos y menos resolución para equipos que no llegan. */
  setQuality({ points, pixelRatio }: Quality): void {
    this.density = points
    this.geometry.setDrawRange(0, Math.round(this.count * points))
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatio))
    this.applyViewport()
  }

  /** Coordenadas normalizadas: de −1 a 1, con el origen en el centro de la pantalla. */
  movePointer(x: number, y: number): void {
    this.rotation.leanTowards(x, y)
    this.toWorld(x, y, this.pointerGoal)
    this.forceGoal = 1
  }

  releasePointer(): void {
    this.rotation.leanTowards(0, 0)
    this.forceGoal = 0
  }

  setDragging(dragging: boolean): void {
    this.rotation.dragging = dragging
  }

  drag(dx: number, dy: number): void {
    this.rotation.drag(dx, dy)
  }

  /** Onda expansiva desde el punto en el que se ha hecho clic. */
  shock(x: number, y: number): void {
    this.toWorld(x, y, this.shockOrigin)
    this.shockAge = 0
  }

  /** Lanza un pulso que recorre la pipeline de principio a fin. */
  runPulse(): void {
    this.pulse = 0
  }

  /** Devuelve a su sitio el código podado para comparar el antes y el después. */
  showBefore(on: boolean): void {
    this.beforeGoal = on ? 1 : 0
  }

  /** Forma personalizada para la última escena; `null` vuelve a la nube. */
  setText(points: Float32Array | null): void {
    this.text.request(points)
  }

  /** Avanza `dt` segundos hacia la posición de escena `target` y dibuja un fotograma. */
  update(dt: number, target: number): FieldStatus {
    const uniforms = this.material.uniforms
    const last = this.scenes.length - 1

    this.position += (target - this.position) * damp(5, dt)
    const { index, mix } = split(this.position, this.scenes.length)
    if (index !== this.loaded) this.load(index)
    const a = this.scenes[index]
    const b = this.scenes[index + 1]
    const tween = (key: Tweened) => a[key] + (b[key] - a[key]) * mix

    this.time += dt * (this.calm ? 0.25 : 1)
    this.intro = Math.min(1, this.intro + dt / INTRO_SECONDS)
    const intro = 1 - (1 - this.intro) ** 3

    const nextText = this.text.update(dt)
    if (nextText) {
      this.written.array.set(nextText)
      this.written.needsUpdate = true
    }
    // El texto solo existe en la última escena: al subir, se deshace con el scroll.
    const text = this.text.amount * clamp(this.position - (last - 1), 0, 1)

    this.before = approach(this.before, this.beforeGoal, dt / BEFORE_SECONDS)
    const prune = tween('prune') * (1 - this.before)

    if (this.pulse >= 0) {
      this.pulse += dt
      if (this.pulse > PULSE.seconds) this.pulse = -1
    }
    this.shockAge = Math.min(SHOCK_SECONDS, this.shockAge + dt)

    const { rotation } = this
    rotation.update(dt, this.calm ? 0 : tween('spin'))
    this.group.rotation.set(
      tween('tilt') + rotation.pitch + Math.sin(this.time * 0.23) * 0.05 - rotation.lean.y * 0.1,
      tween('yaw') + rotation.yaw + Math.sin(this.time * 0.3) * 0.12 + rotation.lean.x * 0.18,
      0,
    )
    this.group.position.set(this.layout.x, this.layout.y, 0)
    this.group.scale.setScalar(tween('scale') * this.layout.fit)

    this.pointer.lerp(this.pointerGoal, damp(12, dt))
    this.force += (this.forceGoal - this.force) * damp(4, dt)

    // Con menos puntos, cada uno brilla un poco más para que la forma no se apague.
    const size = POINT_SIZE * (0.5 + 0.5 * this.layout.fit) * this.density ** -0.2
    uniforms.uTime.value = this.time
    uniforms.uMix.value = mix
    uniforms.uText.value = text
    uniforms.uPrune.value = prune
    uniforms.uClutter.value = tween('prune') * this.before
    uniforms.uIdle.value = (this.calm ? 0 : tween('idle')) * (1 - 0.9 * text)
    uniforms.uIntro.value = intro
    uniforms.uSize.value = size
    uniforms.uAlpha.value = tween('alpha') * this.layout.alpha * Math.min(1.7, this.density ** -0.6)
    uniforms.uPulseOn.value = this.pulse >= 0 ? 1 : 0
    uniforms.uPulse.value = PULSE.from + ((PULSE.to - PULSE.from) * Math.max(0, this.pulse)) / PULSE.seconds
    uniforms.uPointerForce.value = this.force
    uniforms.uShockAge.value = this.shockAge

    // El tráfico es el de la escena más cercana y se apaga a medio camino de la siguiente.
    const nearest = clamp(Math.round(this.position), 0, last)
    const presence = clamp(1 - Math.abs(this.position - nearest) * 2.4, 0, 1)
    this.trafficLayer.update(
      this.calm ? undefined : traffic[this.scenes[nearest].shape],
      this.time,
      presence * intro * (1 - text),
      size,
      this.projection,
    )

    this.renderer.render(this.scene, this.camera)

    return {
      index: nearest,
      visible: Math.round((1 - PRUNE_FRACTION * prune) * 100),
      custom: this.text.active,
      points: Math.round(this.count * this.density),
    }
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
    this.trafficLayer.dispose()
    this.renderer.dispose()
  }

  private applyViewport(): void {
    const { width, height } = this.size
    if (!width || !height) return
    this.renderer.setSize(width, height, false)

    const aspect = width / height
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()

    // En horizontal la forma vive a la derecha del texto; en vertical, encima.
    const halfWidth = HALF_HEIGHT * aspect
    this.layout =
      aspect < 1
        ? { x: 0, y: HALF_HEIGHT * 0.38, fit: Math.min(1, (halfWidth * 0.92) / SHAPE_RADIUS), alpha: 0.75 }
        : { x: halfWidth * 0.42, y: 0, fit: Math.min(1, (halfWidth * 0.5) / SHAPE_RADIUS), alpha: 1 }

    this.projection = (height * this.renderer.getPixelRatio()) / (2 * HALF_FOV_TAN)
    this.material.uniforms.uProjection.value = this.projection
  }

  /** Carga en los buffers la escena `index` y la siguiente. */
  private load(index: number): void {
    this.from.array.set(this.shapes[index])
    this.to.array.set(this.shapes[index + 1])
    this.from.needsUpdate = true
    this.to.needsUpdate = true
    this.loaded = index
  }

  /** Proyecta un punto de pantalla sobre el plano z = 0 de la escena. */
  private toWorld(x: number, y: number, out: Vector3): Vector3 {
    this.ray.set(x, y, 0.5).unproject(this.camera).sub(this.camera.position).normalize()
    return out.copy(this.camera.position).addScaledVector(this.ray, -this.camera.position.z / this.ray.z)
  }
}
