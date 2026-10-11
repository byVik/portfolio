import { describe, expect, it } from 'vitest'
import { FrameBudget, QUALITY_STEPS } from './quality'

/** Simulates `seconds` seconds at `fps` and counts how many times a quality drop was requested. */
function run(budget: FrameBudget, fps: number, seconds: number): number {
  let drops = 0
  for (let i = 0; i < fps * seconds; i++) if (budget.tick(1 / fps)) drops++
  return drops
}

describe('SCN-07 · adaptive quality', () => {
  it('keeps the quality when the machine runs smoothly', () => {
    const budget = new FrameBudget()
    expect(run(budget, 60, 20)).toBe(0)
    expect(budget.level).toBe(0)
  })

  it('does not judge during warm-up', () => {
    expect(run(new FrameBudget(), 20, 3)).toBe(0)
  })

  it('drops one step for each slow window', () => {
    const budget = new FrameBudget()
    run(budget, 20, 3)
    expect(run(budget, 20, 1.6)).toBe(1)
    expect(budget.level).toBe(1)
  })

  it('does not drop below the last step', () => {
    const budget = new FrameBudget()
    run(budget, 20, 60)
    expect(budget.level).toBe(QUALITY_STEPS.length - 1)
  })

  it('ignores the gaps of a background tab', () => {
    const budget = new FrameBudget()
    run(budget, 60, 4)
    expect(budget.tick(5)).toBe(false)
    expect(run(budget, 60, 5)).toBe(0)
  })
})
