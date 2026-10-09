/** Posición en X de las cuatro etapas: tests, build, instalador y firma. */
export const GATES = [-1.35, -0.45, 0.45, 1.35] as const

/** Recorrido del pulso que lanza «Ejecutar pipeline». */
export const PULSE = { from: -2.2, to: 2.4, seconds: 3.4 } as const

/** Milisegundos que tarda el pulso en cruzar cada etapa. */
export const gateDelays = GATES.map((x) => ((x - PULSE.from) / (PULSE.to - PULSE.from)) * PULSE.seconds * 1000)
