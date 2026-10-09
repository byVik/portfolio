<script setup lang="ts">
import { computed } from 'vue'
import { content } from '@/content/locale'
import { sceneReady } from '@/scene/ui/controls'
import { vReveal } from './reveal'
import ShapePrompt from './widgets/ShapePrompt.vue'

defineProps<{ number: number; pointCount: number }>()

const year = new Date().getFullYear()
const points = computed(() => new Intl.NumberFormat(content.value.locale))
</script>

<template>
  <section id="contacto" class="section contact" aria-labelledby="contacto-title">
    <div v-reveal class="section__body">
      <p class="kicker" data-reveal>
        <span class="kicker__number">{{ String(number).padStart(2, '0') }}</span
        >{{ content.ui.contactKicker }}
      </p>
      <h2 id="contacto-title" class="title" data-reveal style="--i: 1">{{ content.ui.contactTitle }}</h2>
      <p class="lead" data-reveal style="--i: 2">
        {{ content.profile.location }} · {{ content.profile.availability }}. {{ content.ui.contactLead }}
      </p>
      <ShapePrompt v-if="sceneReady" data-reveal style="--i: 3" />
      <div class="actions" data-reveal style="--i: 4">
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
      <dl class="contact__extras" data-reveal style="--i: 5">
        <div v-for="(extra, i) in content.extras" :key="i">
          <dt class="label">{{ extra.label }}</dt>
          <dd v-for="line in extra.lines" :key="line">{{ line }}</dd>
        </div>
      </dl>
    </div>
    <footer class="contact__footer label">
      © {{ year }} {{ content.profile.firstName }} {{ content.profile.lastName }} · {{ content.ui.footer }}
      <template v-if="pointCount"> · {{ points.format(pointCount) }} {{ content.ui.footerPoints }}</template>
    </footer>
  </section>
</template>

<style scoped>
.contact {
  padding-bottom: 8rem;
}

.contact__extras {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 2.6rem 0 0;
  padding-top: 1.4rem;
  border-top: 1px solid var(--line);
}

.contact__extras dt {
  margin-bottom: 0.5rem;
  color: var(--signal);
}

.contact__extras dd {
  color: var(--bone-dim);
  font-size: 0.88rem;
  line-height: 1.45;
}

.contact__footer {
  position: absolute;
  bottom: 1.8rem;
  left: var(--gutter);
  right: var(--gutter);
  color: var(--mute);
}

@media (max-width: 760px) {
  .contact__extras {
    grid-template-columns: 1fr;
    gap: 1.1rem;
  }

  .contact__footer {
    left: 1.25rem;
    right: 1.25rem;
    bottom: 1.2rem;
  }
}
</style>
