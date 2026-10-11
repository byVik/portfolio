/// <reference types="node" />
import { existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { en } from './en'
import { es } from './es'
import type { Content } from './types'

const MAX_VIDEO_BYTES = 500 * 1000

const asset = (file: string) => fileURLToPath(new URL(`../../public/games/${file}`, import.meta.url))

describe.each(Object.entries({ es, en }))('%s games', (_, content) => {
  const { items, status } = content.games

  it('GAM-03 · a published game has a link and one in development has none', () => {
    for (const game of items) {
      if (game.status === 'published') expect(game.links.length, game.name).toBeGreaterThan(0)
      else expect(game.links, game.name).toEqual([])
    }
  })

  it('GAM-03 · every status has a name', () => {
    for (const game of items) expect(status[game.status], game.name).toBeTruthy()
  })

  it('GAM-04 · only published games show a headline figure', () => {
    for (const game of items) {
      if (game.status !== 'published') expect(game.highlight, game.name).toBeUndefined()
    }
  })
})

describe('GAM-05 · both languages show the same games', () => {
  /** What does not depend on the language. */
  const outline = (content: Content) =>
    content.games.items.map(({ id, name, tech, status, links, highlight }) => ({
      id,
      name,
      tech,
      status,
      links,
      highlighted: highlight !== undefined,
    }))

  it('with the same status, technologies and links', () => {
    expect(outline(en)).toEqual(outline(es))
  })
})

describe('GAM-06 · game videos', () => {
  it.each(es.games.items.map((game) => game.id))('%s has a poster and a lightweight video', (id) => {
    expect(existsSync(asset(`${id}.jpg`)), 'poster').toBe(true)
    expect(statSync(asset(`${id}.mp4`)).size).toBeLessThanOrEqual(MAX_VIDEO_BYTES)
  })
})
