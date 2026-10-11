import { describe, expect, it } from 'vitest'
import { resolveLocale } from './resolveLocale'

describe('CNT-03 · initial language', () => {
  it('the ?lang= URL parameter wins', () => {
    expect(resolveLocale('en', 'es', 'es-ES')).toBe('en')
  })

  it('without a parameter, it remembers the last choice', () => {
    expect(resolveLocale(null, 'es', 'en-US')).toBe('es')
  })

  it('with nothing stored, it uses the browser language', () => {
    expect(resolveLocale(null, null, 'es-MX')).toBe('es')
    expect(resolveLocale(null, null, 'en-GB')).toBe('en')
  })

  it('any other language falls back to English', () => {
    expect(resolveLocale(null, null, 'de-DE')).toBe('en')
  })

  it('ignores values that are not an available language', () => {
    expect(resolveLocale('fr', 'xx', 'es-ES')).toBe('es')
  })
})
