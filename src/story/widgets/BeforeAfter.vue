<script setup lang="ts">
import { ref, watch } from 'vue'
import { content } from '@/content/locale'
import { useSceneControls } from '@/scene/ui/controls'

const controls = useSceneControls()
const before = ref(false)

watch(before, (on) => controls.showBefore(on))
</script>

<template>
  <div class="compare">
    <div class="compare__switch" role="group" :aria-label="content.ui.compare">
      <button type="button" class="label" :aria-pressed="before" @click="before = true">{{ content.ui.before }}</button>
      <button type="button" class="label" :aria-pressed="!before" @click="before = false">
        {{ content.ui.after }}
      </button>
    </div>
    <p class="compare__note label" aria-live="polite">
      {{ before ? content.ui.beforeNote : content.ui.afterNote }}
    </p>
  </div>
</template>

<style scoped>
.compare {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem 1.1rem;
  margin-top: 1.6rem;
}

.compare__switch {
  display: inline-flex;
  padding: 0.22rem;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: rgba(7, 8, 11, 0.5);
}

.compare__switch button {
  padding: 0.6rem 1.05rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--mute);
  transition:
    background 0.35s var(--ease),
    color 0.35s var(--ease);
}

.compare__switch button:hover {
  color: var(--bone);
}

.compare__switch button[aria-pressed='true'] {
  background: var(--bone);
  color: var(--ink);
}

.compare__note {
  color: var(--mute);
}
</style>
