import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const OUT = process.env.SHOT_DIR || './.shots'
const BASE = 'http://localhost:5173'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()

async function scrollShoot(path, selector, name) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.locator(selector).scrollIntoViewIfNeeded()
  await page.waitForTimeout(1600) // let deal/reveal animations finish
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot', name)
}

await scrollShoot('/poker', '#hand', 'poker-hand')
await scrollShoot('/straight', '#work', 'straight-work')
await scrollShoot('/chess', '#endgame', 'chess-endgame')

// modal
await page.goto(BASE + '/straight', { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
// open the mate puzzle solved state on chess for resume — skip; instead capture a project modal from poker
await page.goto(BASE + '/poker', { waitUntil: 'networkidle' })
await page.locator('#hand').scrollIntoViewIfNeeded()
await page.waitForTimeout(1400)
await page.locator('#hand button').first().click()
await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}/poker-modal.png` })
console.log('shot poker-modal')

await browser.close()
console.log('done')
