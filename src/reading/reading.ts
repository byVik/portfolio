import { ref, watch } from 'vue'
import { queryParam, setQueryParam } from '@/shared/url'

const PARAM = 'cv'

/** Modo lectura: el CV en plano, sin escena. `?cv=1` lo abre directamente. */
export const reading = ref(queryParam(PARAM) !== null)

watch(
  reading,
  (on) => {
    document.documentElement.classList.toggle('is-reading', on)
    setQueryParam(PARAM, on ? '1' : null)
  },
  { immediate: true },
)
