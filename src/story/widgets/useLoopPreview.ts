import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

type Element<T> = Readonly<Ref<T | null>>

/**
 * Reproduce un vídeo en bucle pintándolo en un lienzo, y solo mientras está en
 * pantalla (JUE-06).
 *
 * El `<video>` no se muestra a propósito: un vídeo visible se compone como capa
 * de hardware y, al hacer scroll sobre la escena WebGL, deja rectángulos negros
 * donde estaba (JUE-09).
 */
export function useLoopPreview(video: Element<HTMLVideoElement>, canvas: Element<HTMLCanvasElement>, src: string) {
  /** El visitante lo quiere en marcha. Con movimiento reducido empieza en pausa (JUE-07). */
  const playing = ref(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  let visible = false
  let observer: IntersectionObserver | undefined
  let frame = 0

  function paint(): void {
    const source = video.value
    const target = canvas.value
    if (source && target) target.getContext('2d')?.drawImage(source, 0, 0, target.width, target.height)
    frame = requestAnimationFrame(paint)
  }

  function stop(): void {
    cancelAnimationFrame(frame)
    video.value?.pause()
  }

  async function sync(): Promise<void> {
    const source = video.value
    if (!source) return
    if (!visible || !playing.value) {
      stop()
      return
    }

    if (!source.src) source.src = src
    // Los navegadores solo dejan arrancar sin gesto un vídeo silenciado.
    source.muted = true
    try {
      await source.play()
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(paint)
    } catch {
      // Reproducción automática bloqueada (ahorro de batería, por ejemplo): queda el póster y el botón.
      playing.value = false
    }
  }

  function toggle(): void {
    playing.value = !playing.value
    void sync()
  }

  onMounted(() => {
    if (!canvas.value) return
    observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        void sync()
      },
      { threshold: 0.35 },
    )
    observer.observe(canvas.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    stop()
  })

  return { playing, toggle }
}
