// Genera, a partir del propio portfolio:
//   public/og.jpg                           imagen de vista previa para redes
//   public/cv-viktor-strohush-loyish-*.pdf  el CV en cada idioma
//   docs/readme/*.jpg                       las capturas de los README
//
// Necesita Edge o Chrome instalados; BROWSER_PATH permite indicar otro ejecutable.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import { createServer } from 'vite'

const PORT = 4320
const LOCALES = ['es', 'en']
/** Secciones cuya forma sale en los README, y el nombre de su captura. */
const SHAPES = [
  ['perfil', 'lattice'],
  ['arquimea', 'globe'],
  ['ia', 'orbit'],
  ['orderflow', 'hexagon'],
]
const BROWSERS = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]

const root = fileURLToPath(new URL('..', import.meta.url))
const inPublic = (file) => join(root, 'public', file)
const inReadme = (file) => join(root, 'docs', 'readme', file)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const executablePath = BROWSERS.find((path) => path && existsSync(path))
if (!executablePath) {
  console.error('No encuentro Edge ni Chrome. Indica la ruta con BROWSER_PATH.')
  process.exit(1)
}

mkdirSync(inReadme(''), { recursive: true })
const server = await createServer({ root, logLevel: 'error', server: { port: PORT, strictPort: true } })
await server.listen()
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})

try {
  const page = await browser.newPage()
  const origin = `http://localhost:${PORT}`
  const open = (query) => page.goto(`${origin}/?${query}`, { waitUntil: 'networkidle0' })
  const hide = (selectors) => page.addStyleTag({ content: `${selectors} { visibility: hidden !important; }` })

  // Portada a 1600 × 840 (≈1,91:1, la proporción que piden LinkedIn y compañía), en cada idioma.
  await page.setViewport({ width: 1600, height: 840 })
  for (const locale of LOCALES) {
    await open(`lang=${locale}`)
    await hide('.hud, .rail, .hero__hint')
    await sleep(6000)
    await page.screenshot({ path: inReadme(`hero-${locale}.jpg`), type: 'jpeg', quality: 88 })
    console.log(`✓ docs/readme/hero-${locale}.jpg`)
  }
  copyFileSync(inReadme('hero-es.jpg'), inPublic('og.jpg'))
  console.log('✓ og.jpg')

  // Las formas, solas: se oculta todo menos la escena y se recorta alrededor de la forma.
  await page.setViewport({ width: 1440, height: 900 })
  for (const [section, name] of SHAPES) {
    await open('lang=en')
    await page.evaluate((id) => {
      const rect = document.getElementById(id).getBoundingClientRect()
      window.scrollTo({
        top: rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2,
        behavior: 'instant',
      })
    }, section)
    await sleep(5000)
    await hide('main, .header, .rail, .bar, .hud, .veil, .grain')
    // El recorte va en coordenadas de documento y la escena es fija: hay que sumarle el scroll.
    const scrollY = await page.evaluate(() => window.scrollY)
    await page.screenshot({
      path: inReadme(`${name}.jpg`),
      type: 'jpeg',
      quality: 86,
      captureBeyondViewport: false,
      clip: { x: 672, y: scrollY + 100, width: 700, height: 700 },
    })
    console.log(`✓ docs/readme/${name}.jpg`)
  }

  for (const locale of LOCALES) {
    const file = `cv-viktor-strohush-loyish-${locale}.pdf`
    await open(`lang=${locale}&cv=1`)
    await page.evaluate(() => document.fonts.ready)
    await page.pdf({ path: inPublic(file), format: 'A4', printBackground: true, preferCSSPageSize: true })
    console.log(`✓ ${file}`)
  }
} finally {
  await browser.close()
  await server.close()
}
