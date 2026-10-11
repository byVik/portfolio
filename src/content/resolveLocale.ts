import type { Locale } from './types'

export const isLocale = (value: string | null): value is Locale => value === 'es' || value === 'en'

/**
 * Language the portfolio starts in: `?lang=` wins; otherwise the last choice
 * of the visitor; otherwise the browser language (Spanish or English).
 */
export function resolveLocale(asked: string | null, saved: string | null, browser: string): Locale {
  if (isLocale(asked)) return asked
  if (isLocale(saved)) return saved
  return browser.toLowerCase().startsWith('es') ? 'es' : 'en'
}
