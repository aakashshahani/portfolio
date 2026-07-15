// Generates public/og.png (1200x630) — the social share image.
// Run: node scripts/gen-og.mjs
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = resolve(__dirname, '../public/og.png')

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="-10%" r="90%">
      <stop offset="0%" stop-color="#e8c37a" stop-opacity="0.12"/>
      <stop offset="60%" stop-color="#0a0a0b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f4dca6"/>
      <stop offset="55%" stop-color="#e8c37a"/>
      <stop offset="100%" stop-color="#b8862f"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#0a0a0b"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#e8c37a" stroke-opacity="0.18"/>

  <circle cx="98" cy="118" r="6" fill="#e8c37a"/>
  <text x="118" y="126" font-family="Segoe UI, Arial" font-size="24" letter-spacing="6" fill="#8f9094">OPEN TO SOFTWARE, ML &amp; DATA ROLES</text>

  <text x="88" y="280" font-family="Segoe UI, Arial" font-weight="800" font-size="100" letter-spacing="-2" fill="#ececec">AAKASH</text>
  <text x="88" y="382" font-family="Segoe UI, Arial" font-weight="800" font-size="100" letter-spacing="-2" fill="url(#gold)">SHAHANI</text>

  <text x="92" y="455" font-family="Segoe UI, Arial" font-weight="600" font-size="33" fill="#ececec">Software &amp; ML Engineer — pipelines, agents, recommenders.</text>

  <text x="92" y="525" font-family="Segoe UI, Arial" font-size="24" letter-spacing="2" fill="#e8c37a">HONG KONG → HYDERABAD → TAMPA · 6 LANGUAGES</text>
  <text x="92" y="565" font-family="Segoe UI, Arial" font-size="22" fill="#8f9094">aakashshahani.vercel.app</text>
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
})
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, resvg.render().asPng())
console.log('Wrote', out)
