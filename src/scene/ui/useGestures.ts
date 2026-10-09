import { onBeforeUnmount, onMounted } from 'vue'

/** Lo que los gestos del visitante le piden a la escena. Coordenadas de −1 a 1, origen en el centro. */
export interface GestureTarget {
  movePointer(x: number, y: number): void
  releasePointer(): void
  setDragging(dragging: boolean): void
  drag(dx: number, dy: number): void
  shock(x: number, y: number): void
}

/** Zonas con texto o controles: ahí arrastrar selecciona, no gira la forma. */
const NO_DRAG = 'a, button, input, label, .section__body, .hero__body, .header, .rail'
const CONTROLS = 'a, button, input, label'
/** Píxeles a partir de los cuales un clic cuenta como arrastre. */
const DRAG_THRESHOLD = 6

const inside = (target: EventTarget | null, selector: string) =>
  target instanceof Element && target.closest(selector) !== null

const normalized = (event: MouseEvent): [number, number] => [
  (event.clientX / window.innerWidth) * 2 - 1,
  1 - (event.clientY / window.innerHeight) * 2,
]

/**
 * Traduce el ratón y el tacto a gestos de escena: el cursor aparta los puntos,
 * arrastrar gira la forma y un clic lanza una onda. `target` puede no existir
 * todavía (la escena se carga en diferido).
 */
export function useGestures(target: () => GestureTarget | undefined): void {
  let dragging = false
  let travelled = 0

  function onPointerDown(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || event.button !== 0 || inside(event.target, NO_DRAG)) return
    dragging = true
    travelled = 0
    target()?.setDragging(true)
    document.documentElement.classList.add('is-grabbing')
  }

  function onPointerMove(event: PointerEvent): void {
    target()?.movePointer(...normalized(event))
    if (!dragging) return
    travelled += Math.abs(event.movementX) + Math.abs(event.movementY)
    target()?.drag(event.movementX, event.movementY)
  }

  function onPointerUp(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') target()?.releasePointer()
    if (!dragging) return
    dragging = false
    target()?.setDragging(false)
    document.documentElement.classList.remove('is-grabbing')
  }

  function onPointerLeave(): void {
    target()?.releasePointer()
  }

  function onClick(event: MouseEvent): void {
    const wasDrag = travelled > DRAG_THRESHOLD
    travelled = 0
    if (wasDrag || inside(event.target, CONTROLS)) return
    target()?.shock(...normalized(event))
  }

  onMounted(() => {
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('click', onClick)
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    window.removeEventListener('click', onClick)
    document.documentElement.removeEventListener('pointerleave', onPointerLeave)
  })
}
