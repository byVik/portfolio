<script setup lang="ts">
import { content } from '@/content/locale'
import { vReveal } from './reveal'
</script>

<template>
  <section id="hero" class="hero" aria-labelledby="hero-name">
    <div v-reveal class="hero__body">
      <p class="kicker" data-reveal>
        {{ content.profile.role }} · {{ content.profile.location }} · {{ content.profile.remote }}
      </p>
      <h1 id="hero-name" class="hero__name" data-reveal style="--i: 1">
        <span>{{ content.profile.firstName }}</span>
        {{ ' ' }}
        <span>{{ content.profile.lastName }}</span>
      </h1>
      <p class="hero__claim" data-reveal style="--i: 2">{{ content.profile.claim }}</p>
      <p class="hero__intro" data-reveal style="--i: 3">{{ content.profile.intro }}</p>
      <ul class="tags" data-reveal style="--i: 4">
        <li v-for="item in content.profile.focus" :key="item" class="tag">{{ item }}</li>
      </ul>
      <div class="actions" data-reveal style="--i: 5">
        <a
          v-for="(link, i) in content.profile.links"
          :key="link.label"
          class="button"
          :class="{ 'button--solid': i === 0 }"
          :href="link.href"
          target="_blank"
          rel="noopener"
        >
          {{ link.label }} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
    <a class="hero__hint label" href="#profile">{{ content.ui.scrollHint }} <span aria-hidden="true">↓</span></a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100svh;
  padding: 7rem var(--gutter) 6rem;
}

.hero__name {
  margin: 1.3rem 0 1.4rem;
  font: 800 clamp(2.9rem, 8.6vw, 7.6rem) / 0.86 var(--font-display);
  font-stretch: 80%;
  letter-spacing: -0.035em;
}

.hero__name span {
  display: block;
}

.hero__claim {
  color: var(--signal);
  font: 600 clamp(1.3rem, 2.4vw, 2rem) / 1.15 var(--font-display);
  font-stretch: 90%;
  letter-spacing: -0.015em;
}

.hero__intro {
  max-width: 31rem;
  margin: 1.1rem 0 1.5rem;
  color: var(--bone-dim);
  font-size: 1.06rem;
}

.hero__hint {
  position: absolute;
  bottom: 2rem;
  left: var(--gutter);
  color: var(--mute);
  transition: color 0.3s var(--ease);
}

.hero__hint:hover {
  color: var(--bone);
}

.hero__hint span {
  display: inline-block;
  margin-left: 0.4rem;
  animation: nudge 1.8s var(--ease) infinite;
}

@keyframes nudge {
  50% {
    transform: translateY(0.35rem);
  }
}

@media (max-width: 760px) {
  .hero {
    justify-content: flex-end;
    padding: 6rem 1.25rem 5.5rem;
  }

  .hero__hint {
    left: 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__hint span {
    animation: none;
  }
}
</style>
