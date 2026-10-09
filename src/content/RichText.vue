<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ text: string }>()

/** Los tramos impares de `a **b** c` son los que van en negrita. */
const parts = computed(() => props.text.split('**').map((value, i) => ({ value, strong: i % 2 === 1 })))
</script>

<template>
  <template v-for="(part, i) in parts" :key="i">
    <strong v-if="part.strong">{{ part.value }}</strong>
    <template v-else>{{ part.value }}</template>
  </template>
</template>
