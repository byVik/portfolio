<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { content } from '@/content/locale'
import { useSceneControls } from '@/scene/ui/controls'
import { gateDelays } from '@/scene/model/pipeline'

defineProps<{ steps: string[] }>()

const controls = useSceneControls()
const root = useTemplateRef<HTMLElement>('root')
const done = ref(0)
const running = ref(false)

let observer: IntersectionObserver | undefined
let timers: number[] = []

/** Each stage is ticked when the pulse of the scene crosses its ring. */
function run(): void {
  if (running.value) return
  running.value = true
  done.value = 0
  controls.runPipeline()
  timers = gateDelays.map((delay, i) =>
    window.setTimeout(() => {
      done.value = i + 1
      if (i === gateDelays.length - 1) running.value = false
    }, delay),
  )
}

onMounted(() => {
  if (!root.value) return
  // The first run is automatic: visitors who only scroll see it too.
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer?.disconnect()
      timers.push(window.setTimeout(run, 900))
    },
    { threshold: 0.6 },
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  timers.forEach((timer) => window.clearTimeout(timer))
})
</script>

<template>
  <div ref="root" class="run">
    <ol class="run__steps">
      <li
        v-for="(step, i) in steps"
        :key="i"
        class="label"
        :class="{ 'is-done': i < done, 'is-active': running && i === done }"
      >
        <span class="run__state" aria-hidden="true">{{ i < done ? '✓' : `0${i + 1}` }}</span>
        {{ step }}
      </li>
    </ol>
    <button type="button" class="button" :disabled="running" @click="run">
      {{ running ? content.ui.running : done ? content.ui.rerun : content.ui.run }}
      <span aria-hidden="true">▶</span>
    </button>
  </div>
</template>

<style scoped>
.run {
  margin-top: 1.75rem;
}

.run__steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.4rem;
}

.run__steps li {
  position: relative;
  padding-top: 0.85rem;
  border-top: 2px solid var(--line);
  color: var(--mute);
  letter-spacing: 0.08em;
  transition: color 0.4s var(--ease);
}

.run__steps li::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--signal);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s var(--ease);
}

.run__steps li.is-active {
  color: var(--signal);
}

.run__steps li.is-done {
  color: var(--bone);
}

.run__steps li.is-done::before {
  transform: scaleX(1);
}

.run__state {
  display: block;
  margin-bottom: 0.3rem;
  color: var(--signal);
}
</style>
