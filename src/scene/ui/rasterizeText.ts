import { mulberry32 } from '../model/shapes'
import { pointsFromMask, TEXT_LIMIT } from '../model/textMask'

const WIDTH = 1024
const HEIGHT = 320
const FONT = '"Bricolage Grotesque Variable", system-ui, sans-serif'

/** Draws the text on a hidden canvas and turns it into points. Empty = no shape. */
export async function textToPoints(text: string, count: number): Promise<Float32Array | null> {
  const label = text.trim().toUpperCase().slice(0, TEXT_LIMIT)
  if (!label) return null

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return null

  const font = (size: number) => `800 ${size}px ${FONT}`
  await document.fonts.load(font(200), label).catch(() => undefined)

  let size = 220
  context.font = font(size)
  const measured = context.measureText(label).width
  if (measured > WIDTH * 0.94) size = Math.floor((size * WIDTH * 0.94) / measured)

  context.font = font(size)
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = '#fff'
  context.fillText(label, WIDTH / 2, HEIGHT / 2)

  const { data } = context.getImageData(0, 0, WIDTH, HEIGHT)
  return pointsFromMask(data, WIDTH, HEIGHT, count, mulberry32(label.length * 7717 + 13))
}
