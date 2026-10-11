<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { content } from '@/content/locale'
import { reading } from './reading'
import type { Game, Stat } from '@/content/types'
import LanguageSwitch from '@/content/LanguageSwitch.vue'
import RichText from '@/content/RichText.vue'

const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')
const number = computed(() => new Intl.NumberFormat(content.value.locale))

const statText = (stat: Stat) =>
  `${stat.prefix ?? ''}${number.value.format(stat.value)}${stat.suffix ?? ''} ${stat.label}`
const gameSummary = (game: Game) =>
  [game.genre, content.value.games.status[game.status], game.highlight].filter(Boolean).join(' · ') +
  `. ${game.tech.join(', ')}.`
const bare = (href: string) => href.replace(/^https?:\/\/(www\.)?/, '')
const print = () => window.print()

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') reading.value = false
}

watch(reading, async (on) => {
  if (!on) return
  await nextTick()
  closeButton.value?.focus()
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Always in the DOM: it is also what gets printed (see @media print in styles.css). -->
  <article v-show="reading" class="cv">
    <div class="cv__bar">
      <button ref="closeButton" type="button" class="cv__action label" @click="reading = false">
        <span aria-hidden="true">←</span> {{ content.ui.cv.close }}
      </button>
      <div class="cv__tools">
        <LanguageSwitch />
        <button type="button" class="cv__action label" @click="print">{{ content.ui.cv.print }}</button>
        <a class="cv__action cv__action--solid label" :href="content.ui.cv.file" download>
          {{ content.ui.cv.download }} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>

    <div class="cv__sheet">
      <header class="cv__head">
        <h1>{{ content.profile.firstName }} {{ content.profile.lastName }}</h1>
        <p class="cv__role">{{ content.profile.role }} · {{ content.profile.focus.join(' · ') }}</p>
        <p class="cv__contact">
          {{ content.profile.location }} · {{ content.profile.availability }}
          <template v-for="link in content.profile.links" :key="link.label">
            · <a :href="link.href">{{ link.handle }}</a>
          </template>
        </p>
        <p class="cv__note">
          <a :href="content.profile.linkedin">{{ content.ui.cv.summaryNote }} <span aria-hidden="true">↗</span></a>
        </p>
      </header>

      <section v-for="chapter in content.chapters" :key="chapter.id" class="cv__block">
        <p class="cv__kicker">{{ chapter.kicker }}</p>
        <h2>{{ chapter.title }}</h2>
        <p v-if="chapter.stat" class="cv__stat">{{ statText(chapter.stat) }}</p>
        <p v-if="chapter.lead"><RichText :text="chapter.lead" /></p>
        <ul>
          <li v-for="(bullet, i) in chapter.bullets" :key="i"><RichText :text="bullet" /></li>
        </ul>
        <p v-if="chapter.link" class="cv__link">
          <a :href="chapter.link.href">{{ bare(chapter.link.href) }}</a>
        </p>
      </section>

      <section class="cv__block">
        <p class="cv__kicker">{{ content.games.kicker }}</p>
        <h2>{{ content.games.title }}</h2>
        <p>{{ content.games.lead }}</p>
        <ul>
          <li v-for="game in content.games.items" :key="game.id">
            <strong>{{ game.name }}</strong> · {{ gameSummary(game) }}
            <template v-for="link in game.links" :key="link.href">
              · <a :href="link.href">{{ link.label }}</a>
            </template>
          </li>
        </ul>
      </section>

      <section class="cv__block">
        <p class="cv__kicker">{{ content.ui.stackKicker }}</p>
        <dl class="cv__stack">
          <div v-for="(group, i) in content.stack" :key="i">
            <dt>{{ group.label }}</dt>
            <dd>{{ group.items.join(' · ') }}</dd>
          </div>
        </dl>
      </section>

      <section class="cv__block cv__extras">
        <div v-for="(extra, i) in content.extras" :key="i">
          <p class="cv__kicker">{{ extra.label }}</p>
          <p v-for="line in extra.lines" :key="line">{{ line }}</p>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.cv {
  --paper: #f3f1eb;
  --paper-ink: #14151a;
  --paper-dim: rgba(20, 21, 26, 0.78);
  --paper-line: rgba(20, 21, 26, 0.16);
  /* The accent, darkened so it reads on a light background. */
  --paper-signal: #0b6e68;

  position: fixed;
  inset: 0;
  z-index: 10;
  overflow-y: auto;
  background: var(--paper);
  color: var(--paper-ink);
}

.cv__bar {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 0.9rem clamp(1rem, 4vw, 2.5rem);
  border-bottom: 1px solid var(--paper-line);
  background: var(--paper);
}

.cv__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.cv__action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: 1px solid var(--paper-line);
  border-radius: 999px;
  background: transparent;
  color: var(--paper-ink);
  transition:
    background 0.3s var(--ease),
    border-color 0.3s var(--ease),
    color 0.3s var(--ease);
}

.cv__action:hover {
  border-color: var(--paper-signal);
  color: var(--paper-signal);
}

.cv__action--solid {
  border-color: var(--paper-ink);
  background: var(--paper-ink);
  color: var(--paper);
}

.cv__action--solid:hover {
  border-color: var(--paper-signal);
  background: var(--paper-signal);
  color: var(--paper);
}

.cv__sheet {
  max-width: 46rem;
  margin: 0 auto;
  padding: 3.5rem clamp(1.25rem, 5vw, 3rem) 5rem;
}

.cv h1 {
  font: 800 clamp(2.4rem, 6vw, 3.6rem) / 0.92 var(--font-display);
  font-stretch: 80%;
  letter-spacing: -0.03em;
}

.cv__role {
  margin-top: 0.8rem;
  color: var(--paper-signal);
  font: 600 1.08rem/1.3 var(--font-display);
}

.cv__contact {
  margin-top: 0.6rem;
  font: 400 0.76rem/1.6 var(--font-mono);
}

.cv p.cv__note {
  margin-top: 0.8rem;
  font: 500 0.74rem/1.5 var(--font-mono);
}

.cv__note a {
  color: var(--paper-signal);
}

.cv a {
  text-decoration: underline;
  text-decoration-color: var(--paper-line);
  text-underline-offset: 0.2em;
}

.cv a.cv__action {
  text-decoration: none;
}

.cv__block {
  margin-top: 2rem;
  padding-top: 1.3rem;
  border-top: 1px solid var(--paper-line);
  break-inside: avoid;
}

.cv__kicker {
  color: var(--paper-signal);
  font: 500 0.66rem/1.4 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cv h2 {
  margin: 0.35rem 0 0.6rem;
  font: 700 1.5rem/1.05 var(--font-display);
  font-stretch: 86%;
  letter-spacing: -0.02em;
}

.cv p,
.cv li,
.cv dd {
  color: var(--paper-dim);
  font-size: 0.95rem;
  line-height: 1.5;
}

.cv :deep(strong) {
  color: var(--paper-ink);
}

.cv p.cv__kicker {
  color: var(--paper-signal);
  font-size: 0.66rem;
}

.cv p.cv__stat {
  margin-bottom: 0.4rem;
  color: var(--paper-ink);
  font: 700 1.05rem/1.3 var(--font-display);
}

.cv ul {
  margin-top: 0.6rem;
  padding-left: 1.1rem;
  list-style: square;
}

.cv li + li {
  margin-top: 0.3rem;
}

.cv li::marker {
  color: var(--paper-signal);
}

.cv p.cv__link {
  margin-top: 0.6rem;
  font: 400 0.76rem/1.6 var(--font-mono);
}

.cv__stack {
  margin: 0.6rem 0 0;
}

.cv__stack div {
  display: grid;
  grid-template-columns: 11.5rem 1fr;
  gap: 1rem;
  padding: 0.3rem 0;
}

.cv__stack dt {
  padding-top: 0.2rem;
  font: 500 0.66rem/1.4 var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cv__extras {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.cv__extras p:not(.cv__kicker) {
  margin-top: 0.3rem;
  font-size: 0.88rem;
}

@media (max-width: 640px) {
  .cv__stack div,
  .cv__extras {
    grid-template-columns: 1fr;
    gap: 0.2rem;
  }

  .cv__extras {
    gap: 1.2rem;
  }
}

@media print {
  .cv {
    --paper: #fff;

    position: static;
    overflow: visible;
  }

  .cv__bar {
    display: none;
  }

  .cv__sheet {
    max-width: none;
    padding: 0;
  }

  /* Sizes in points so the CV fits on two A4 pages. */

  .cv h1 {
    font-size: 26pt;
  }

  .cv h2 {
    margin: 2pt 0 4pt;
    font-size: 12pt;
  }

  .cv p,
  .cv li,
  .cv dd,
  .cv__extras p:not(.cv__kicker) {
    font-size: 8.5pt;
    line-height: 1.36;
  }

  .cv p.cv__role {
    margin-top: 5pt;
    font-size: 10pt;
  }

  .cv p.cv__stat {
    font-size: 9.5pt;
  }

  .cv p.cv__kicker,
  .cv__stack dt {
    font-size: 6.4pt;
  }

  .cv p.cv__note {
    margin-top: 4pt;
    font-size: 7.2pt;
  }

  .cv ul {
    margin-top: 3pt;
  }

  .cv li + li {
    margin-top: 1.5pt;
  }

  .cv__block {
    margin-top: 8pt;
    padding-top: 7pt;
  }

  .cv__stack div {
    padding: 1pt 0;
  }
}
</style>
