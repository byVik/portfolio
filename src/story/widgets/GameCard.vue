<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { content } from '@/content/locale'
import type { Game } from '@/content/types'
import { useLoopPreview } from './useLoopPreview'

const props = defineProps<{ game: Game; statusLabel: string }>()

/** Vídeo y póster comparten nombre con el id del juego. */
const media = `${import.meta.env.BASE_URL}games/${props.game.id}`
const video = useTemplateRef<HTMLVideoElement>('video')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const { playing, toggle } = useLoopPreview(video, canvas, `${media}.mp4`)
</script>

<template>
  <article class="game">
    <div class="game__media">
      <img :src="`${media}.jpg`" alt="" width="480" height="270" loading="lazy" />
      <canvas ref="canvas" width="480" height="270" role="img" :aria-label="game.name" />
      <video ref="video" class="game__source" muted loop playsinline preload="none" tabindex="-1" aria-hidden="true" />
      <span class="game__status label" :class="`game__status--${game.status}`">{{ statusLabel }}</span>
      <button
        type="button"
        class="game__toggle"
        :aria-label="playing ? content.ui.pauseVideo : content.ui.playVideo"
        @click="toggle"
      >
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path v-if="playing" d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
          <path v-else d="M3 1.2 10.2 6 3 10.8z" />
        </svg>
      </button>
    </div>
    <div class="game__body">
      <h3 class="game__name">{{ game.name }}</h3>
      <p class="game__genre label">
        {{ game.genre }}
        <template v-if="game.highlight">
          · <span class="game__highlight">{{ game.highlight }}</span>
        </template>
      </p>
      <p class="game__pitch">{{ game.pitch }}</p>
      <ul class="tags">
        <li v-for="item in game.tech" :key="item" class="tag">{{ item }}</li>
      </ul>
      <p v-if="game.links.length" class="game__links">
        <a v-for="link in game.links" :key="link.href" class="label" :href="link.href" target="_blank" rel="noopener">
          {{ link.label }} <span aria-hidden="true">↗</span>
        </a>
      </p>
    </div>
  </article>
</template>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 0.9rem;
  background: rgba(7, 8, 11, 0.78);
}

.game__media {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--ink-soft);
}

.game__media img,
.game__media canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* El vídeo solo alimenta al lienzo: sigue en el DOM (iOS lo exige para reproducir) pero no se ve. */
.game__source {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.game__status {
  position: absolute;
  top: 0.65rem;
  left: 0.65rem;
  padding: 0.32rem 0.6rem;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: rgba(7, 8, 11, 0.82);
  font-size: 0.6rem;
}

.game__status--published {
  border-color: var(--signal);
  background: var(--signal);
  color: var(--ink);
}

.game__toggle {
  position: absolute;
  right: 0.65rem;
  bottom: 0.65rem;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  background: rgba(7, 8, 11, 0.82);
  transition:
    background 0.3s var(--ease),
    border-color 0.3s var(--ease),
    color 0.3s var(--ease);
}

.game__toggle:hover {
  border-color: var(--signal);
  background: var(--signal);
  color: var(--ink);
}

.game__toggle svg {
  width: 0.7rem;
  height: 0.7rem;
  fill: currentColor;
}

.game__body {
  padding: 1rem 1.05rem 1.15rem;
}

.game__name {
  font: 700 1.4rem/1 var(--font-display);
  font-stretch: 86%;
  letter-spacing: -0.02em;
}

.game__genre {
  margin-top: 0.45rem;
  color: var(--mute);
  font-size: 0.62rem;
}

.game__highlight {
  color: var(--signal);
}

.game__pitch {
  margin: 0.7rem 0 0.8rem;
  color: var(--bone-dim);
  font-size: 0.9rem;
  line-height: 1.5;
}

.game__links {
  display: flex;
  gap: 1.2rem;
  margin-top: 0.9rem;
}

.game__links a {
  color: var(--bone);
  transition: color 0.3s var(--ease);
}

.game__links a:hover {
  color: var(--signal);
}
</style>
