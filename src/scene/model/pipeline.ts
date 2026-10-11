/** X position of the four stages: tests, build, installer and signing. */
export const GATES = [-1.35, -0.45, 0.45, 1.35] as const

/** Path of the pulse fired by “Run pipeline”. */
export const PULSE = { from: -2.2, to: 2.4, seconds: 3.4 } as const

/** Milliseconds the pulse takes to cross each stage. */
export const gateDelays = GATES.map((x) => ((x - PULSE.from) / (PULSE.to - PULSE.from)) * PULSE.seconds * 1000)
