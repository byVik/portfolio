import type { ShapeName } from '@/scene/model/shapes'

export type Locale = 'es' | 'en'

export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export interface Chapter {
  /** Debe coincidir con el id de su escena en `scene/scenes.ts`. */
  id: string
  kicker: string
  title: string
  lead?: string
  bullets: string[]
  stat?: Stat
  steps?: string[]
  widget?: 'before-after' | 'pipeline'
  link?: { label: string; href: string }
}

export type GameStatus = 'published' | 'development'

export interface Game {
  /** También es el nombre de su vídeo y su póster en `public/games/`. */
  id: string
  name: string
  genre: string
  pitch: string
  tech: string[]
  status: GameStatus
  /** Cifra destacada. Solo en juegos publicados (JUE-04). */
  highlight?: string
  /** Vacío mientras el juego no esté publicado (JUE-03). */
  links: { label: string; href: string }[]
}

export interface ProfileLink {
  label: string
  href: string
  /** La dirección tal y como se lee en el CV impreso. */
  handle: string
}

/**
 * Todo el texto del portfolio en un idioma. Los fragmentos entre
 * **dobles asteriscos** se muestran en negrita.
 */
export interface Content {
  /** Etiqueta BCP 47: idioma del documento y formato de los números. */
  locale: string
  meta: { title: string; description: string }
  profile: {
    firstName: string
    lastName: string
    role: string
    focus: string[]
    claim: string
    intro: string
    location: string
    availability: string
    remote: string
    links: ProfileLink[]
  }
  chapters: Chapter[]
  games: {
    kicker: string
    title: string
    lead: string
    status: Record<GameStatus, string>
    items: Game[]
  }
  stack: { label: string; items: string[]; highlight?: boolean }[]
  extras: { label: string; lines: string[] }[]
  /** Atajos del campo «¿qué forma tiene tu problema?». */
  problems: string[]
  /** Nombre de cada sección en la navegación, por id de escena. */
  nav: Record<string, string>
  /** Nombre de cada forma en el HUD. */
  shapes: Record<ShapeName, string>
  ui: {
    home: string
    profiles: string
    sections: string
    language: string
    scrollHint: string
    stackKicker: string
    stackTitle: string
    contactKicker: string
    contactTitle: string
    contactLead: string
    promptLabel: string
    promptPlaceholder: string
    promptSubmit: string
    promptUndo: string
    promptReply: string
    yourProblem: string
    compare: string
    before: string
    after: string
    beforeNote: string
    afterNote: string
    run: string
    running: string
    rerun: string
    playVideo: string
    pauseVideo: string
    hud: { shape: string; points: string; visible: string; hint: string }
    footer: string
    footerPoints: string
    cv: { open: string; close: string; print: string; download: string; file: string }
  }
}
