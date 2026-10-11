import { computed, ref, watchEffect } from 'vue'
import { queryParam, setQueryParam } from '@/shared/url'
import { en } from './en'
import { es } from './es'
import { resolveLocale } from './resolveLocale'
import type { Content, Locale } from './types'

const STORAGE_KEY = 'locale'
const contents: Record<Locale, Content> = { es, en }

function remembered(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export const locale = ref<Locale>(resolveLocale(queryParam('lang'), remembered(), window.navigator.language))

/** The content in the active language. */
export const content = computed(() => contents[locale.value])

export function setLocale(next: Locale): void {
  locale.value = next
  setQueryParam('lang', next)
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // No storage (private mode): the choice lasts as long as the visit.
  }
}

watchEffect(() => {
  document.documentElement.lang = locale.value
  document.title = content.value.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', content.value.meta.description)
})
