import { describe, expect, it } from 'vitest'
import { resolveLocale } from './resolveLocale'

describe('CON-03 · idioma inicial', () => {
  it('manda el parámetro ?lang= de la URL', () => {
    expect(resolveLocale('en', 'es', 'es-ES')).toBe('en')
  })

  it('si no hay parámetro, recuerda la última elección', () => {
    expect(resolveLocale(null, 'es', 'en-US')).toBe('es')
  })

  it('si no hay nada guardado, usa el idioma del navegador', () => {
    expect(resolveLocale(null, null, 'es-MX')).toBe('es')
    expect(resolveLocale(null, null, 'en-GB')).toBe('en')
  })

  it('cualquier otro idioma cae en inglés', () => {
    expect(resolveLocale(null, null, 'de-DE')).toBe('en')
  })

  it('ignora valores que no son un idioma disponible', () => {
    expect(resolveLocale('fr', 'xx', 'es-ES')).toBe('es')
  })
})
