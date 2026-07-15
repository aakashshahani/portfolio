// Headless screenshots for visual review.
// Usage: node scripts/shoot.mjs  (dev server must be running on :5173)
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = process.env.SHOT_DIR || './.shots'
const BASE = 'http://localhost:5173'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})
const page = await ctx.newPage()

await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1600)
await page.screenshot({ path: `${OUT}/home-hero.png` })

// Scroll through so whileInView sections render, then capture full page.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 120))
  }
})
await page.waitForTimeout(800)
await page.screenshot({ path: `${OUT}/home-full.png`, fullPage: true })
console.log('shot home')

// Mobile
const m = await browser.newContext({ viewport: { width: 390, height: 844 } })
const mp = await m.newPage()
await mp.goto(BASE + '/', { waitUntil: 'networkidle' })
await mp.waitForTimeout(1600)
await mp.screenshot({ path: `${OUT}/home-mobile.png` })
console.log('shot home-mobile')

await browser.close()
console.log('done →', OUT)
