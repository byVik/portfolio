import { ref, watch } from 'vue'
import { queryParam, setQueryParam } from '@/shared/url'

const PARAM = 'cv'

/** Reading mode: the plain CV, without the scene. `?cv=1` opens it directly. */
export const reading = ref(queryParam(PARAM) !== null)

watch(
  reading,
  (on) => {
    document.documentElement.classList.toggle('is-reading', on)
    setQueryParam(PARAM, on ? '1' : null)
  },
  { immediate: true },
)
