<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import type { FieldStatus, ParticleField } from '../engine/ParticleField'
import { FrameBudget, QUALITY_STEPS } from '../model/quality'
import { scenes } from '../model/scenes'
import { scenePosition } from '../model/scrollMath'
import { registerSceneControls } from './controls'
import { textToPoints } from './rasterizeText'
import { useGestures } from './useGestures'

const props = defineProps<{ paused: boolean }>()
const emit = defineEmits<{ status: [status: FieldStatus] }>()

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const available = ref(true)
const budget = new FrameBudget()

let field: ParticleField | undefined
let unregister: (() => void) | undefined
let observer: ResizeObserver | undefined
let unmounted = false
let frame = 0
let previous = 0
/** Centre of each section in document pixels, in the order of `scenes`. */
let centers: number[] = []
let shown: FieldStatus | undefined

useGestures(() => field)

const same = (a: FieldStatus | undefined, b: FieldStatus) =>
  a?.index === b.index && a.visible === b.visible && a.custom === b.custom && a.points === b.points

function measure(): void {
  if (!canvas.value || !field) return
  field.resize(canvas.value.clientWidth, canvas.value.clientHeight)
  centers = scenes.map(({ id }) => {
    const rect = document.getElementById(id)?.getBoundingClientRect()
    return rect ? rect.top + window.scrollY + rect.height / 2 : 0
  })
}

function tick(now: number): void {
  frame = requestAnimationFrame(tick)
  const elapsed = (now - previous) / 1000
  previous = now
  if (!field || props.paused) return

  if (budget.tick(elapsed)) field.setQuality(QUALITY_STEPS[budget.level])
  const status = field.update(Math.min(elapsed, 0.05), scenePosition(centers, window.scrollY + window.innerHeight / 2))
  if (same(shown, status)) return
  shown = status
  emit('status', status)
}

/** Three.js is downloaded separately: the text paints without waiting for the scene. */
async function createField(target: HTMLCanvasElement): Promise<ParticleField | undefined> {
  const tokens = getComputedStyle(document.documentElement)
  const token = (name: string) => tokens.getPropertyValue(name).trim()
  try {
    const { ParticleField } = await import('../engine/ParticleField')
    return new ParticleField({
      canvas: target,
      scenes,
      count: window.innerWidth < 760 ? 16_000 : 36_000,
      colors: { background: token('--ink'), cold: token('--cold'), warm: token('--bone'), accent: token('--signal') },
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    })
  } catch {
    // Without WebGL (or without network for the module) the portfolio is still readable.
    return undefined
  }
}

onMounted(async () => {
  if (!canvas.value) return
  const created = await createField(canvas.value)
  if (unmounted) {
    created?.dispose()
    return
  }
  if (!created) {
    available.value = false
    return
  }
  field = created

  unregister = registerSceneControls({
    runPipeline: () => created.runPulse(),
    showBefore: (on) => created.showBefore(on),
    async shapeText(text) {
      const points = await textToPoints(text, created.capacity)
      created.setText(points)
      return points !== null
    },
  })

  measure()
  observer = new ResizeObserver(measure)
  observer.observe(document.body)
  window.addEventListener('resize', measure)
  previous = performance.now()
  frame = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  unmounted = true
  cancelAnimationFrame(frame)
  observer?.disconnect()
  window.removeEventListener('resize', measure)
  unregister?.()
  field?.dispose()
})
</script>

<template>
  <canvas v-show="available" ref="canvas" class="scene" aria-hidden="true" />
</template>

<style scoped>
.scene {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  display: block;
  width: 100vw;
  height: 100vh;
  /* Largest mobile viewport height: the scene does not resize when the browser bar hides. */
  height: 100lvh;
}
</style>
