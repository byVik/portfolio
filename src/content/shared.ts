import type { Game, ProfileLink } from './types'

/** Lo que no se traduce: nombres propios, enlaces y tecnologías. */

export const name = { firstName: 'Viktor', lastName: 'Strohush Loyish' }

export const links: ProfileLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/viktor-strohush-loyish',
    handle: 'linkedin.com/in/viktor-strohush-loyish',
  },
  { label: 'GitHub', href: 'https://github.com/byVik', handle: 'github.com/byVik' },
]

export const orderflowUrl = 'https://github.com/byVik/orderflow'

export const tech = {
  frontend: [
    'Vue 3',
    'Composition API',
    'Vue 2',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'Tailwind',
    'Pinia',
    'Quasar',
  ],
  backend: ['Java 8 · 11 · 21', 'Micronaut', 'Spring Boot', 'Kotlin', 'Groovy', 'Python'],
  data: ['PostgreSQL', 'Kafka', 'Flyway', 'Firebase'],
  desktop: ['Qt', 'C++20', 'Qt Widgets', 'QML', 'Android', 'Capacitor'],
  ai: [
    'Claude Code',
    'OpenAI Codex',
    'GitHub Copilot',
    'MCP',
    'Skills',
    'AGENTS.md',
    'Spec Driven Development',
    'Context engineering',
  ],
  devops: ['Azure DevOps (CI/CD, PRs)', 'GitHub Actions', 'Docker', 'Code signing', 'Git', 'Jira'],
  testing: ['JUnit', 'Mockito', 'Testcontainers', 'Vitest', 'TDD', 'Clean Code', 'SOLID', 'DDD', 'Scrum'],
}

/** Los juegos, sin su texto: cada idioma añade género, frase y cifra destacada. */
export const games = {
  gravityFlip: {
    id: 'gravity-flip',
    name: 'Gravity Flip',
    tech: ['JavaScript', 'Canvas 2D', 'Capacitor', 'AdMob', 'Supabase'],
    status: 'published',
    links: [
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.byVik.gravityflip.game' },
      { label: 'Web', href: 'https://playgravityflip.com/' },
    ],
  },
  zoomieDash: {
    id: 'zoomie-dash',
    name: 'Zoomie Dash',
    tech: ['Three.js', 'TypeScript', 'Vite', 'Blender', 'Capacitor'],
    status: 'development',
    links: [],
  },
  forgefall: {
    id: 'forgefall',
    name: 'Forgefall',
    tech: ['Unity 6', 'C#', 'URP', 'Photon Fusion', 'WebGL'],
    status: 'development',
    links: [],
  },
  drawDash: {
    id: 'draw-dash',
    name: 'Draw Dash',
    tech: ['TypeScript', 'Canvas 2D', 'WebAudio', 'Vite'],
    status: 'development',
    links: [],
  },
} satisfies Record<string, Omit<Game, 'genre' | 'pitch' | 'highlight'>>

export const problems = ['LEGACY', 'DEADLINE', 'CI/CD', 'BUGS', 'QT + C++']
