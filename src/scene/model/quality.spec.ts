import { describe, expect, it } from 'vitest'
import { FrameBudget, QUALITY_STEPS } from './quality'

/** Simula `seconds` segundos a `fps` y cuenta cuántas veces se pidió bajar la calidad. */
function run(budget: FrameBudget, fps: number, seconds: number): number {
  let drops = 0
  for (let i = 0; i < fps * seconds; i++) if (budget.tick(1 / fps)) drops++
  return drops
}

describe('ESC-07 · calidad adaptativa', () => {
  it('mantiene la calidad cuando el equipo va fluido', () => {
    const budget = new FrameBudget()
    expect(run(budget, 60, 20)).toBe(0)
    expect(budget.level).toBe(0)
  })

  it('no juzga durante el arranque', () => {
    expect(run(new FrameBudget(), 20, 3)).toBe(0)
  })

  it('baja un escalón por cada ventana lenta', () => {
    const budget = new FrameBudget()
    run(budget, 20, 3)
    expect(run(budget, 20, 1.6)).toBe(1)
    expect(budget.level).toBe(1)
  })

  it('no baja más allá del último escalón', () => {
    const budget = new FrameBudget()
    run(budget, 20, 60)
    expect(budget.level).toBe(QUALITY_STEPS.length - 1)
  })

  it('ignora los saltos de una pestaña en segundo plano', () => {
    const budget = new FrameBudget()
    run(budget, 60, 4)
    expect(budget.tick(5)).toBe(false)
    expect(run(budget, 60, 5)).toBe(0)
  })
})
