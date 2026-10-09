<script setup lang="ts">
import { ref } from 'vue'
import { content } from '@/content/locale'
import { useSceneControls } from '@/scene/ui/controls'
import { TEXT_LIMIT } from '@/scene/model/textMask'

const controls = useSceneControls()
const text = ref('')
const shaped = ref(false)

async function shape(value: string): Promise<void> {
  text.value = value
  shaped.value = await controls.shapeText(value)
}
</script>

<template>
  <form class="prompt" @submit.prevent="shape(text)">
    <label class="label" for="problem">{{ content.ui.promptLabel }}</label>
    <div class="prompt__field">
      <input
        id="problem"
        v-model="text"
        type="text"
        :maxlength="TEXT_LIMIT"
        :placeholder="content.ui.promptPlaceholder"
        autocomplete="off"
        spellcheck="false"
      />
      <button type="submit" class="button">{{ content.ui.promptSubmit }} <span aria-hidden="true">↵</span></button>
    </div>
    <div class="prompt__chips">
      <button v-for="problem in content.problems" :key="problem" type="button" class="chip" @click="shape(problem)">
        {{ problem }}
      </button>
      <button v-if="shaped" type="button" class="chip chip--undo" @click="shape('')">
        {{ content.ui.promptUndo }}
      </button>
    </div>
    <p class="prompt__reply" aria-live="polite">{{ shaped ? content.ui.promptReply : '' }}</p>
  </form>
</template>

<style scoped>
.prompt {
  margin-top: 2rem;
}

.prompt label {
  display: block;
  color: var(--mute);
}

.prompt__field {
  display: flex;
  gap: 0.6rem;
  margin: 0.7rem 0 0.8rem;
}

.prompt input {
  flex: 1;
  min-width: 0;
  padding: 0.85rem 1.2rem;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: rgba(7, 8, 11, 0.55);
  font: 500 0.9rem/1 var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: border-color 0.3s var(--ease);
}

.prompt input::placeholder {
  color: var(--mute);
  letter-spacing: 0.02em;
  text-transform: none;
}

.prompt input:focus {
  border-color: var(--signal);
  outline: none;
}

.prompt__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip {
  padding: 0.42rem 0.8rem;
  border: 1px dashed var(--line-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--bone-dim);
  font: 500 0.68rem/1.2 var(--font-mono);
  letter-spacing: 0.1em;
  transition:
    border-color 0.3s var(--ease),
    color 0.3s var(--ease);
}

.chip:hover {
  border-style: solid;
  border-color: var(--signal);
  color: var(--signal);
}

.chip--undo {
  border-style: solid;
  color: var(--mute);
}

.prompt__reply {
  min-height: 1.5rem;
  margin-top: 0.9rem;
  color: var(--signal);
  font: 600 1rem/1.5 var(--font-display);
}

@media (max-width: 760px) {
  .prompt__field {
    flex-direction: column;
  }

  .prompt__field .button {
    justify-content: center;
  }
}
</style>
