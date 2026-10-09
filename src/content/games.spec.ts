/// <reference types="node" />
import { existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { en } from './en'
import { es } from './es'
import type { Content } from './types'

const MAX_VIDEO_BYTES = 500 * 1000

const asset = (file: string) => fileURLToPath(new URL(`../../public/games/${file}`, import.meta.url))

describe.each(Object.entries({ es, en }))('juegos en «%s»', (_, content) => {
  const { items, status } = content.games

  it('JUE-03 · un juego publicado tiene enlace y uno en desarrollo, ninguno', () => {
    for (const game of items) {
      if (game.status === 'published') expect(game.links.length, game.name).toBeGreaterThan(0)
      else expect(game.links, game.name).toEqual([])
    }
  })

  it('JUE-03 · todos los estados tienen nombre', () => {
    for (const game of items) expect(status[game.status], game.name).toBeTruthy()
  })

  it('JUE-04 · solo los juegos publicados destacan una cifra', () => {
    for (const game of items) {
      if (game.status !== 'published') expect(game.highlight, game.name).toBeUndefined()
    }
  })
})

describe('JUE-05 · los dos idiomas enseñan los mismos juegos', () => {
  /** Lo que no depende del idioma. */
  const outline = (content: Content) =>
    content.games.items.map(({ id, name, tech, status, links, highlight }) => ({
      id,
      name,
      tech,
      status,
      links,
      highlighted: highlight !== undefined,
    }))

  it('con el mismo estado, tecnologías y enlaces', () => {
    expect(outline(en)).toEqual(outline(es))
  })
})

describe('JUE-06 · vídeos de los juegos', () => {
  it.each(es.games.items.map((game) => game.id))('«%s» tiene póster y un vídeo ligero', (id) => {
    expect(existsSync(asset(`${id}.jpg`)), 'póster').toBe(true)
    expect(statSync(asset(`${id}.mp4`)).size).toBeLessThanOrEqual(MAX_VIDEO_BYTES)
  })
})
