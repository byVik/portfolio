// Generates, from the portfolio itself:
//   public/og.jpg                           social preview image
//   public/cv-viktor-strohush-loyish-*.pdf  the CV in each language
//   docs/readme/*.jpg                       the README screenshots
//
// Needs Edge or Chrome installed; BROWSER_PATH points to a different executable.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import { createServer } from 'vite'

const PORT = 4320
const LOCALES = ['es', 'en']
/** Sections whose shape appears in the READMEs, and the name of each screenshot. */
const SHAPES = [
  ['profile', 'lattice'],
  ['arquimea', 'globe'],
  ['ai', 'orbit'],
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
  console.error('Edge or Chrome not found. Set its path in BROWSER_PATH.')
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

  // Opening screen at 1600 × 840 (≈1.91:1, the ratio LinkedIn and others ask for), in each language.
  await page.setViewport({ width: 1600, height: 840 })
  for (const locale of LOCALES) {
    await open(`lang=${locale}`)
    await hide('.hud, .rail, .hero__hint')
    await sleep(6000)
    await page.screenshot({ path: inReadme(`hero-${locale}.jpg`), type: 'jpeg', quality: 88 })
    console.log(`✓ docs/readme/hero-${locale}.jpg`)
  }
  // The static page metadata is in English, so the social preview is too.
  copyFileSync(inReadme('hero-en.jpg'), inPublic('og.jpg'))
  console.log('✓ og.jpg')

  // The shapes on their own: everything but the scene is hidden and the shot is cropped around the shape.
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
    // The clip is in document coordinates and the scene is fixed: the scroll offset has to be added.
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
