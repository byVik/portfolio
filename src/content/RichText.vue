<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ text: string }>()

/** The odd segments of `a **b** c` are the bold ones. */
const parts = computed(() => props.text.split('**').map((value, i) => ({ value, strong: i % 2 === 1 })))
</script>

<template>
  <template v-for="(part, i) in parts" :key="i">
    <strong v-if="part.strong">{{ part.value }}</strong>
    <template v-else>{{ part.value }}</template>
  </template>
</template>
