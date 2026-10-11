import type { ShapeName } from '@/scene/model/shapes'

export type Locale = 'es' | 'en'

export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  label: string
}

export interface Chapter {
  /** Must match the id of its scene in `scene/model/scenes.ts`. */
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
  /** Also the name of its video and poster in `public/games/`. */
  id: string
  name: string
  genre: string
  pitch: string
  tech: string[]
  status: GameStatus
  /** Headline figure. Published games only (GAM-04). */
  highlight?: string
  /** Empty until the game is published (GAM-03). */
  links: { label: string; href: string }[]
}

export interface ProfileLink {
  label: string
  href: string
  /** The address as it reads on the printed CV. */
  handle: string
}

/**
 * All the portfolio text in one language. Fragments between
 * **double asterisks** are rendered in bold.
 */
export interface Content {
  /** BCP 47 tag: document language and number formatting. */
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
    /** Where to ask for the full CV. */
    linkedin: string
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
  /** Shortcuts for the “what shape is your problem?” field. */
  problems: string[]
  /** Name of each section in the navigation, by scene id. */
  nav: Record<string, string>
  /** Name of each shape in the HUD. */
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
    /** Invitation to ask for the full CV, in the contact section. */
    fullCv: string
    cv: { open: string; close: string; print: string; download: string; file: string; summaryNote: string }
  }
}
