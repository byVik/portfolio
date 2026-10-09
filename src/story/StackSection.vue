<script setup lang="ts">
import { content } from '@/content/locale'
import { vReveal } from './reveal'

defineProps<{ number: number }>()
</script>

<template>
  <section id="stack" class="section" aria-labelledby="stack-title">
    <div v-reveal class="section__body section__body--wide">
      <p class="kicker" data-reveal>
        <span class="kicker__number">{{ String(number).padStart(2, '0') }}</span
        >{{ content.ui.stackKicker }}
      </p>
      <h2 id="stack-title" class="title" data-reveal style="--i: 1">{{ content.ui.stackTitle }}</h2>
      <dl class="stack">
        <div v-for="(group, i) in content.stack" :key="i" class="stack__group" data-reveal :style="{ '--i': i + 2 }">
          <dt class="label">{{ group.label }}</dt>
          <dd>
            <ul class="tags">
              <li v-for="item in group.items" :key="item" class="tag" :class="{ 'tag--hot': group.highlight }">
                {{ item }}
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.stack {
  margin: 0;
  border-top: 1px solid var(--line);
}

.stack__group {
  display: grid;
  grid-template-columns: 11.5rem 1fr;
  gap: 1rem;
  align-items: baseline;
  padding: 0.95rem 0;
  border-bottom: 1px solid var(--line);
}

.stack__group dt {
  color: var(--signal);
}

@media (max-width: 760px) {
  .stack__group {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
}
</style>
