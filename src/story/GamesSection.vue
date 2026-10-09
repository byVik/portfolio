<script setup lang="ts">
import { content } from '@/content/locale'
import { vReveal } from './reveal'
import GameCard from './widgets/GameCard.vue'

defineProps<{ number: number }>()
</script>

<template>
  <section id="juegos" class="section" aria-labelledby="juegos-title">
    <div v-reveal class="section__body section__body--wide">
      <p class="kicker" data-reveal>
        <span class="kicker__number">{{ String(number).padStart(2, '0') }}</span
        >{{ content.games.kicker }}
      </p>
      <h2 id="juegos-title" class="title" data-reveal style="--i: 1">{{ content.games.title }}</h2>
      <p class="lead games__lead" data-reveal style="--i: 2">{{ content.games.lead }}</p>
      <div class="games">
        <GameCard
          v-for="(game, i) in content.games.items"
          :key="game.id"
          :game="game"
          :status-label="content.games.status[game.status]"
          data-reveal
          :style="{ '--i': i + 3 }"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.games__lead {
  max-width: 34rem;
}

.games {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.1rem;
  margin-top: 1.9rem;
}

@media (max-width: 760px) {
  .games {
    grid-template-columns: 1fr;
  }
}
</style>
