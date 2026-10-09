<script setup lang="ts">
import { sceneReady } from '@/scene/ui/controls'
import type { Chapter } from '@/content/types'
import { vReveal } from './reveal'
import BeforeAfter from './widgets/BeforeAfter.vue'
import PipelineRun from './widgets/PipelineRun.vue'
import RichText from '@/content/RichText.vue'
import StatCounter from './widgets/StatCounter.vue'

defineProps<{ chapter: Chapter; number: number }>()
</script>

<template>
  <section :id="chapter.id" class="section" :aria-labelledby="`${chapter.id}-title`">
    <div v-reveal class="section__body">
      <p class="kicker" data-reveal>
        <span class="kicker__number">{{ String(number).padStart(2, '0') }}</span
        >{{ chapter.kicker }}
      </p>
      <StatCounter v-if="chapter.stat" :stat="chapter.stat" data-reveal style="--i: 1" />
      <h2
        :id="`${chapter.id}-title`"
        class="title"
        :class="{ 'title--small': chapter.stat }"
        data-reveal
        style="--i: 2"
      >
        {{ chapter.title }}
      </h2>
      <p v-if="chapter.lead" class="lead" data-reveal style="--i: 3"><RichText :text="chapter.lead" /></p>
      <BeforeAfter v-if="chapter.widget === 'before-after' && sceneReady" data-reveal style="--i: 4" />
      <PipelineRun
        v-if="chapter.widget === 'pipeline' && chapter.steps"
        :steps="chapter.steps"
        data-reveal
        style="--i: 4"
      />
      <ul class="bullets">
        <li v-for="(bullet, i) in chapter.bullets" :key="i" data-reveal :style="{ '--i': i + 5 }">
          <RichText :text="bullet" />
        </li>
      </ul>
      <div v-if="chapter.link" class="actions" data-reveal style="--i: 8">
        <a class="button" :href="chapter.link.href" target="_blank" rel="noopener">
          {{ chapter.link.label }} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </section>
</template>
