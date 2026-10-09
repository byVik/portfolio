<script setup lang="ts">
import { content, locale, setLocale } from './locale'
import type { Locale } from './types'

const locales: Locale[] = ['es', 'en']
</script>

<template>
  <div class="switch" role="group" :aria-label="content.ui.language">
    <button
      v-for="option in locales"
      :key="option"
      type="button"
      class="label"
      :lang="option"
      :aria-pressed="option === locale"
      @click="setLocale(option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped>
.switch {
  display: inline-flex;
  align-items: center;
  gap: 0.1rem;
}

.switch button {
  padding: 0.35rem 0.4rem;
  border: 0;
  background: transparent;
  color: inherit;
  opacity: 0.5;
  transition: opacity 0.3s var(--ease);
}

.switch button:hover {
  opacity: 0.85;
}

.switch button[aria-pressed='true'] {
  opacity: 1;
  box-shadow: inset 0 -1px currentColor;
}
</style>
