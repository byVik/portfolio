<script setup lang="ts">
import { content } from '@/content/locale'
import { reading } from '@/reading/reading'
import LanguageSwitch from '@/content/LanguageSwitch.vue'
</script>

<template>
  <header class="header">
    <a class="header__brand" href="#hero" :aria-label="content.ui.home">
      <svg class="header__mark" viewBox="4 5 24 24" aria-hidden="true">
        <g fill="currentColor">
          <circle cx="7.5" cy="8.5" r="2" />
          <circle cx="10.5" cy="14.5" r="2" />
          <circle cx="13.5" cy="20" r="2" />
          <circle cx="24.5" cy="8.5" r="2" />
          <circle cx="21.5" cy="14.5" r="2" />
          <circle cx="18.5" cy="20" r="2" />
        </g>
        <circle class="header__dot" cx="16" cy="25" r="2.3" />
      </svg>
      <span class="header__name label">{{ content.profile.firstName }} {{ content.profile.lastName }}</span>
    </a>
    <div class="header__tools">
      <LanguageSwitch />
      <button type="button" class="header__cv label" @click="reading = true">{{ content.ui.cv.open }}</button>
      <nav class="header__links" :aria-label="content.ui.profiles">
        <a
          v-for="link in content.profile.links"
          :key="link.label"
          class="label"
          :href="link.href"
          target="_blank"
          rel="noopener"
        >
          {{ link.label }} <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1.4rem var(--gutter) 2.2rem;
  /* Opaque behind the logo and links; it fades out below so the content does not collide as it passes. */
  background: linear-gradient(180deg, var(--ink) 0%, var(--ink) 62%, rgba(7, 8, 11, 0) 100%);
  pointer-events: none;
}

.header > * {
  pointer-events: auto;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.header__mark {
  width: 1.6rem;
  height: 1.6rem;
}

.header__dot {
  fill: var(--signal);
}

.header__name {
  color: var(--bone-dim);
}

.header__tools,
.header__links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header__tools {
  color: var(--bone-dim);
}

.header__cv {
  padding: 0.45rem 0.8rem;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--bone);
  transition:
    background 0.3s var(--ease),
    border-color 0.3s var(--ease),
    color 0.3s var(--ease);
}

.header__cv:hover {
  border-color: var(--signal);
  background: var(--signal);
  color: var(--ink);
}

.header__links a {
  transition: color 0.3s var(--ease);
}

.header__links a:hover {
  color: var(--signal);
}

@media (max-width: 760px) {
  .header {
    padding: 1.1rem 1.25rem 1.8rem;
  }

  .header__name {
    display: none;
  }

  .header__tools,
  .header__links {
    gap: 0.9rem;
  }

  .header__links span {
    display: none;
  }
}
</style>
