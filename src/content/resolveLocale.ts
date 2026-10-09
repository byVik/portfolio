import type { Locale } from './types'

export const isLocale = (value: string | null): value is Locale => value === 'es' || value === 'en'

/**
 * Idioma con el que arranca el portfolio: manda `?lang=`; si no, la última
 * elección del visitante; si no, el idioma del navegador (español o inglés).
 */
export function resolveLocale(asked: string | null, saved: string | null, browser: string): Locale {
  if (isLocale(asked)) return asked
  if (isLocale(saved)) return saved
  return browser.toLowerCase().startsWith('es') ? 'es' : 'en'
}
