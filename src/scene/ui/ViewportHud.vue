<script setup lang="ts">
import { computed } from 'vue'
import { content } from '@/content/locale'

defineProps<{ shape: string; count: number; visible: number }>()

const number = computed(() => new Intl.NumberFormat(content.value.locale))
const percent = computed(() => new Intl.NumberFormat(content.value.locale, { style: 'percent' }))
</script>

<template>
  <aside class="hud label" aria-hidden="true">
    <dl>
      <div>
        <dt>{{ content.ui.hud.shape }}</dt>
        <dd>{{ shape }}</dd>
      </div>
      <div>
        <dt>{{ content.ui.hud.points }}</dt>
        <dd>{{ number.format(count) }}</dd>
      </div>
      <div>
        <dt>{{ content.ui.hud.visible }}</dt>
        <dd :class="{ 'is-cut': visible < 100 }">{{ percent.format(visible / 100) }}</dd>
      </div>
    </dl>
    <p>{{ content.ui.hud.hint }}</p>
  </aside>
</template>

<style scoped>
.hud {
  position: fixed;
  right: 1.6rem;
  bottom: 1.6rem;
  z-index: 5;
  display: none;
  color: var(--mute);
  font-size: 0.64rem;
  pointer-events: none;
}

.hud dl {
  display: flex;
  gap: 1.6rem;
  justify-content: flex-end;
  margin: 0 0 0.6rem;
}

.hud dd {
  margin-top: 0.2rem;
  color: var(--bone);
  transition: color 0.4s var(--ease);
}

.hud dd.is-cut {
  color: var(--signal);
}

.hud p {
  text-align: right;
}

@media (min-width: 900px) and (hover: hover) {
  .hud {
    display: block;
  }
}
</style>
