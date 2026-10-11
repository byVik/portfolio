import { describe, expect, it } from 'vitest'
import { scenes } from '@/scene/model/scenes'
import { shapeNames } from '@/scene/model/shapes'
import { en } from './en'
import { es } from './es'
import type { Content } from './types'

describe.each(Object.entries({ es, en }))('%s content', (_, content) => {
  it('STO-01 · GAM-01 · has one section per scene, with the games between the chapters and the stack', () => {
    const sections = ['hero', ...content.chapters.map((chapter) => chapter.id), 'games', 'stack', 'contact']

    expect(sections).toEqual(scenes.map((scene) => scene.id))
  })

  it('CNT-02 · names every section and every shape', () => {
    for (const { id } of scenes) expect(content.nav[id], id).toBeTruthy()
    for (const shape of shapeNames) expect(content.shapes[shape], shape).toBeTruthy()
  })

  it('CNT-04 · publishes no phone number or email', () => {
    const text = JSON.stringify(content)

    expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.\w+/)
    expect(text).not.toMatch(/\+?\d[\d\s]{8,}\d/)
  })
})

describe('CNT-02 · both languages tell the same story', () => {
  /** What does not depend on the language: structure, figures and links. */
  const outline = (content: Content) =>
    content.chapters.map(({ id, bullets, stat, steps, widget, link }) => ({
      id,
      bullets: bullets.length,
      stat: stat?.value,
      steps: steps?.length,
      widget,
      href: link?.href,
    }))

  it('with the same chapters, figures and links', () => {
    expect(outline(en)).toEqual(outline(es))
  })

  it('with the same stack and the same contact details', () => {
    expect(en.stack.map((group) => group.items)).toEqual(es.stack.map((group) => group.items))
    expect(en.profile.links).toEqual(es.profile.links)
    expect(en.extras).toHaveLength(es.extras.length)
  })
})
