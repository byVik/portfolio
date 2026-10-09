<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { content } from '@/content/locale'
import type { Stat } from '@/content/types'

const DURATION = 1600

const props = defineProps<{ stat: Stat }>()

const root = useTemplateRef<HTMLElement>('root')
const shown = ref(0)
const number = computed(() => new Intl.NumberFormat(content.value.locale))
const final = computed(() => number.value.format(props.stat.value))
const full = computed(() => `${props.stat.prefix ?? ''}${final.value}${props.stat.suffix ?? ''} ${props.stat.label}`)

let observer: IntersectionObserver | undefined
let frame = 0

function count(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = props.stat.value
    return
  }
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION)
    shown.value = Math.round(props.stat.value * (1 - (1 - t) ** 4))
    if (t < 1) frame = requestAnimationFrame(step)
  }
  frame = requestAnimationFrame(step)
}

onMounted(() => {
  if (!root.value) return
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer?.disconnect()
      count()
    },
    { threshold: 0.6 },
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <p ref="root" class="stat" :class="{ 'stat--long': final.length > 5 }" :aria-label="full">
    <span class="stat__value" aria-hidden="true">
      {{ stat.prefix }}{{ number.format(shown) }}<span class="stat__unit">{{ stat.suffix }}</span>
    </span>
    <span class="stat__label label" aria-hidden="true">{{ stat.label }}</span>
  </p>
</template>

<style scoped>
.stat {
  margin: 1.2rem 0 1.6rem;
}

.stat__value {
  display: block;
  font: 800 clamp(4.4rem, 10.5vw, 8.4rem) / 0.84 var(--font-display);
  font-stretch: 80%;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.035em;
  white-space: nowrap;
}

.stat--long .stat__value {
  font-size: clamp(3rem, 7.2vw, 5.8rem);
}

.stat__unit {
  color: var(--signal);
}

.stat__label {
  display: block;
  margin-top: 0.9rem;
  color: var(--mute);
}
</style>
