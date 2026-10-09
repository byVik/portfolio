// Genera, a partir del propio portfolio:
//   public/og.jpg                          imagen de vista previa para redes
//   public/cv-viktor-strohush-loyish-*.pdf el CV en cada idioma
//
// Necesita Edge o Chrome instalados; BROWSER_PATH permite indicar otro ejecutable.
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import { createServer } from 'vite'

const PORT = 4320
const LOCALES = ['es', 'en']
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
const output = (file) => join(root, 'public', file)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const executablePath = BROWSERS.find((path) => path && existsSync(path))
if (!executablePath) {
  console.error('No encuentro Edge ni Chrome. Indica la ruta con BROWSER_PATH.')
  process.exit(1)
}

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

  // Portada a 1600 × 840 (≈1,91:1, la proporción que piden LinkedIn y compañía).
  await page.setViewport({ width: 1600, height: 840 })
  await page.goto(`${origin}/?lang=es`, { waitUntil: 'networkidle0' })
  await page.addStyleTag({ content: '.hud, .rail, .hero__hint { display: none !important; }' })
  await sleep(6000)
  await page.screenshot({ path: output('og.jpg'), type: 'jpeg', quality: 88 })
  console.log('✓ og.jpg')

  for (const locale of LOCALES) {
    const file = `cv-viktor-strohush-loyish-${locale}.pdf`
    await page.goto(`${origin}/?lang=${locale}&cv=1`, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.fonts.ready)
    await page.pdf({ path: output(file), format: 'A4', printBackground: true, preferCSSPageSize: true })
    console.log(`✓ ${file}`)
  }
} finally {
  await browser.close()
  await server.close()
}
