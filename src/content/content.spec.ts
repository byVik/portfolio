import { describe, expect, it } from 'vitest'
import { scenes } from '@/scene/model/scenes'
import { shapeNames } from '@/scene/model/shapes'
import { en } from './en'
import { es } from './es'
import type { Content } from './types'

describe.each(Object.entries({ es, en }))('contenido «%s»', (_, content) => {
  it('REC-01 · JUE-01 · tiene una sección por escena, con los juegos entre los capítulos y el stack', () => {
    const sections = ['hero', ...content.chapters.map((chapter) => chapter.id), 'juegos', 'stack', 'contacto']

    expect(sections).toEqual(scenes.map((scene) => scene.id))
  })

  it('CON-02 · nombra todas las secciones y todas las formas', () => {
    for (const { id } of scenes) expect(content.nav[id], id).toBeTruthy()
    for (const shape of shapeNames) expect(content.shapes[shape], shape).toBeTruthy()
  })

  it('CON-04 · no publica teléfono ni correo', () => {
    const text = JSON.stringify(content)

    expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.\w+/)
    expect(text).not.toMatch(/\+?\d[\d\s]{8,}\d/)
  })
})

describe('CON-02 · los dos idiomas cuentan lo mismo', () => {
  /** Lo que no depende del idioma: estructura, cifras y enlaces. */
  const outline = (content: Content) =>
    content.chapters.map(({ id, bullets, stat, steps, widget, link }) => ({
      id,
      bullets: bullets.length,
      stat: stat?.value,
      steps: steps?.length,
      widget,
      href: link?.href,
    }))

  it('con los mismos capítulos, cifras y enlaces', () => {
    expect(outline(en)).toEqual(outline(es))
  })

  it('con el mismo stack y los mismos datos de contacto', () => {
    expect(en.stack.map((group) => group.items)).toEqual(es.stack.map((group) => group.items))
    expect(en.profile.links).toEqual(es.profile.links)
    expect(en.extras).toHaveLength(es.extras.length)
  })
})
