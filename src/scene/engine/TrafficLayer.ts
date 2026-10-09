import { BufferAttribute, BufferGeometry, Color, DynamicDrawUsage, NormalBlending, Points, ShaderMaterial } from 'three'
import type { Traffic } from '../model/shapes'
import { fillTraffic, POINTS_PER_PATH } from '../model/traffic'
import { trafficFragmentShader, trafficVertexShader } from './shaders'

const MAX_PATHS = 8

/** Los puntos que se mueven por una forma. Se recalculan en cada fotograma. */
export class TrafficLayer {
  readonly points: Points<BufferGeometry, ShaderMaterial>

  private readonly positions: BufferAttribute

  constructor(accent: string) {
    const count = MAX_PATHS * POINTS_PER_PATH
    this.positions = new BufferAttribute(new Float32Array(count * 3), 3)
    this.positions.setUsage(DynamicDrawUsage)
    // 0 en la cabeza de cada móvil, casi 1 al final de su estela.
    const tail = new Float32Array(count).map((_, i) => (i % POINTS_PER_PATH) / POINTS_PER_PATH)

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', this.positions)
    geometry.setAttribute('aTail', new BufferAttribute(tail, 1))

    const material = new ShaderMaterial({
      vertexShader: trafficVertexShader,
      fragmentShader: trafficFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      // Sin mezcla aditiva: el acento se queda en su color en vez de quemarse a blanco.
      blending: NormalBlending,
      uniforms: {
        uSize: { value: 1 },
        uProjection: { value: 1 },
        uAlpha: { value: 0 },
        uAccent: { value: new Color(accent) },
      },
    })

    this.points = new Points(geometry, material)
    this.points.frustumCulled = false
    this.points.visible = false
    // Siempre por encima de la forma.
    this.points.renderOrder = 1
  }

  /** `traffic` indefinido o `alpha` 0 ocultan la capa. `size` es el tamaño de los puntos de la forma. */
  update(traffic: Traffic | undefined, time: number, alpha: number, size: number, projection: number): void {
    this.points.visible = traffic !== undefined && alpha > 0
    if (!traffic || alpha <= 0) return

    const paths = traffic.paths.slice(0, MAX_PATHS)
    const written = fillTraffic(this.positions.array as Float32Array, { ...traffic, paths }, time)
    this.positions.needsUpdate = true
    this.points.geometry.setDrawRange(0, written)

    const uniforms = this.points.material.uniforms
    uniforms.uAlpha.value = alpha
    uniforms.uSize.value = size * traffic.size
    uniforms.uProjection.value = projection
  }

  dispose(): void {
    this.points.geometry.dispose()
    this.points.material.dispose()
  }
}
