import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

type Element<T> = Readonly<Ref<T | null>>

/**
 * Plays a video in a loop by painting it onto a canvas, and only while it is on
 * screen (GAM-06).
 *
 * The `<video>` is hidden on purpose: a visible video is composited as a hardware
 * layer and, when scrolling over the WebGL scene, leaves black rectangles
 * where it used to be (GAM-09).
 */
export function useLoopPreview(video: Element<HTMLVideoElement>, canvas: Element<HTMLCanvasElement>, src: string) {
  /** The visitor wants it playing. With reduced motion it starts paused (GAM-07). */
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
    // Browsers only let a muted video start without a user gesture.
    source.muted = true
    try {
      await source.play()
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(paint)
    } catch {
      // Autoplay blocked (battery saver, for instance): the poster and the button remain.
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
