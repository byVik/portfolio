<script setup lang="ts">
import { content } from '@/content/locale'
import { scenes } from '@/scene/model/scenes'

defineProps<{ active: number }>()
</script>

<template>
  <div class="bar" aria-hidden="true" :style="{ '--progress': active / (scenes.length - 1) }" />
  <nav class="rail" :aria-label="content.ui.sections">
    <ol>
      <li v-for="(scene, i) in scenes" :key="scene.id">
        <a :href="`#${scene.id}`" :class="{ 'is-active': i === active }" :aria-current="i === active || undefined">
          <span class="rail__label">{{ content.nav[scene.id] }}</span>
          <span class="rail__tick" />
        </a>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 2px;
  background: var(--signal);
  transform: scaleX(var(--progress));
  transform-origin: left;
  transition: transform 0.6s var(--ease);
}

.rail {
  position: fixed;
  top: 50%;
  right: 1.6rem;
  z-index: 5;
  display: none;
  transform: translateY(-50%);
}

.rail a {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.7rem;
  padding: 0.34rem 0;
  color: var(--mute);
}

.rail__label {
  font: 500 0.62rem/1 var(--font-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateX(0.4rem);
  transition:
    opacity 0.3s var(--ease),
    transform 0.3s var(--ease);
}

.rail__tick {
  width: 0.9rem;
  height: 1px;
  background: currentColor;
  transition:
    width 0.45s var(--ease),
    background 0.3s var(--ease);
}

.rail a:hover .rail__label,
.rail a.is-active .rail__label {
  opacity: 1;
  transform: none;
}

.rail a.is-active {
  color: var(--bone);
}

.rail a.is-active .rail__tick {
  width: 2.2rem;
  background: var(--signal);
}

@media (min-width: 1100px) {
  .rail {
    display: block;
  }

  .bar {
    display: none;
  }
}
</style>
