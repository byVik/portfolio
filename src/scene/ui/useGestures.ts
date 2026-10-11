import { onBeforeUnmount, onMounted } from 'vue'

/** What the gestures of the visitor ask of the scene. Coordinates from −1 to 1, origin at the centre. */
export interface GestureTarget {
  movePointer(x: number, y: number): void
  releasePointer(): void
  setDragging(dragging: boolean): void
  drag(dx: number, dy: number): void
  shock(x: number, y: number): void
}

/** Areas with text or controls: dragging there selects, it does not rotate the shape. */
const NO_DRAG = 'a, button, input, label, .section__body, .hero__body, .header, .rail'
const CONTROLS = 'a, button, input, label'
/** Pixels of movement after which a click counts as a drag. */
const DRAG_THRESHOLD = 6

const inside = (target: EventTarget | null, selector: string) =>
  target instanceof Element && target.closest(selector) !== null

const normalized = (event: MouseEvent): [number, number] => [
  (event.clientX / window.innerWidth) * 2 - 1,
  1 - (event.clientY / window.innerHeight) * 2,
]

/**
 * Turns mouse and touch into scene gestures: the cursor pushes the points away,
 * dragging rotates the shape and a click fires a shockwave. `target` may not exist
 * yet (the scene is loaded lazily).
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
