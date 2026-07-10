// Headless screenshots of every view for visual review.
// Usage: node scripts/shoot.mjs  (dev server must be running on :5173)
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = process.env.SHOT_DIR || './.shots'
const BASE = 'http://localhost:5173'
mkdirSync(OUT, { recursive: true })

const shots = [
  { path: '/', name: 'lobby' },
  { path: '/straight', name: 'straight' },
  { path: '/poker', name: 'poker' },
  { path: '/chess', name: 'chess' },
]

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})
const page = await ctx.newPage()

for (const s of shots) {
  await page.goto(BASE + s.path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1400) // let entrance animations settle
  await page.screenshot({ path: `${OUT}/${s.name}-top.png` })
  await page.screenshot({ path: `${OUT}/${s.name}-full.png`, fullPage: true })
  console.log('shot', s.name)
}

// Mobile lobby to check touch layout
const m = await browser.newContext({ viewport: { width: 390, height: 844 } })
const mp = await m.newPage()
await mp.goto(BASE + '/poker', { waitUntil: 'networkidle' })
await mp.waitForTimeout(1400)
await mp.screenshot({ path: `${OUT}/poker-mobile.png`, fullPage: true })
console.log('shot poker-mobile')

await browser.close()
console.log('done →', OUT)
