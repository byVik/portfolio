import { describe, expect, it } from 'vitest'
import { mulberry32 } from './shapes'
import { pointsFromMask } from './textMask'

/** Máscara RGBA de `width` × `height` con los píxeles indicados opacos. */
function mask(width: number, height: number, opaque: number[]): Uint8ClampedArray {
  const rgba = new Uint8ClampedArray(width * height * 4)
  for (const pixel of opaque) rgba[pixel * 4 + 3] = 255
  return rgba
}

describe('ESC-08 · de una máscara de texto a puntos', () => {
  it('no devuelve forma si la máscara está vacía', () => {
    expect(pointsFromMask(mask(4, 2, []), 4, 2, 10, mulberry32(1))).toBeNull()
  })

  it('reparte los puntos solo sobre los píxeles opacos, centrados y dentro del ancho pedido', () => {
    // Fila superior completa de una máscara de 4 × 2.
    const points = pointsFromMask(mask(4, 2, [0, 1, 2, 3]), 4, 2, 500, mulberry32(1), 2, 2)

    expect(points).toHaveLength(1500)
    for (let i = 0; i < 500; i++) {
      expect(Math.abs(points![i * 3])).toBeLessThanOrEqual(1)
      expect(Math.abs(points![i * 3 + 1])).toBeLessThanOrEqual(0.25)
    }
  })
})
