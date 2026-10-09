<script setup lang="ts">
import { computed, ref } from 'vue'
import { content } from '@/content/locale'
import { reading } from '@/reading/reading'
import ReadingView from '@/reading/ReadingView.vue'
import type { FieldStatus } from '@/scene/engine/ParticleField'
import { scenes } from '@/scene/model/scenes'
import SceneCanvas from '@/scene/ui/SceneCanvas.vue'
import ViewportHud from '@/scene/ui/ViewportHud.vue'
import ChapterSection from '@/story/ChapterSection.vue'
import ContactSection from '@/story/ContactSection.vue'
import GamesSection from '@/story/GamesSection.vue'
import HeroSection from '@/story/HeroSection.vue'
import ProgressRail from '@/story/ProgressRail.vue'
import StackSection from '@/story/StackSection.vue'
import SiteHeader from './SiteHeader.vue'

const status = ref<FieldStatus>({ index: 0, visible: 100, custom: false, points: 0 })

const shapeLabel = computed(() =>
  status.value.custom && status.value.index === scenes.length - 1
    ? content.value.ui.yourProblem
    : content.value.shapes[scenes[status.value.index].shape],
)
</script>

<template>
  <SceneCanvas :paused="reading" @status="status = $event" />
  <div class="veil" aria-hidden="true" />
  <SiteHeader />
  <main>
    <HeroSection />
    <ChapterSection v-for="(chapter, i) in content.chapters" :key="chapter.id" :chapter="chapter" :number="i + 1" />
    <GamesSection :number="content.chapters.length + 1" />
    <StackSection :number="content.chapters.length + 2" />
    <ContactSection :number="content.chapters.length + 3" :point-count="status.points" />
  </main>
  <ProgressRail :active="status.index" />
  <ViewportHud v-if="status.points" :shape="shapeLabel" :count="status.points" :visible="status.visible" />
  <div class="grain" aria-hidden="true" />
  <ReadingView />
</template>
