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
    <radialGradient id="felt" cx="50%" cy="-5%" r="90%">
      <stop offset="0%" stop-color="#123a2c"/>
      <stop offset="55%" stop-color="#0e2b22" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#0a0f0d"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f4dca6"/>
      <stop offset="55%" stop-color="#e8c37a"/>
      <stop offset="100%" stop-color="#b8862f"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#0a0f0d"/>
  <rect width="1200" height="630" fill="url(#felt)"/>
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#e8c37a" stroke-opacity="0.18"/>

  <!-- faint suits -->
  <text x="1010" y="200" font-family="Segoe UI Symbol, Arial" font-size="220" fill="#ffffff" fill-opacity="0.04">♠</text>
  <text x="120" y="560" font-family="Segoe UI Symbol, Arial" font-size="160" fill="#ffffff" fill-opacity="0.04">♟</text>

  <text x="90" y="150" font-family="Segoe UI Symbol, Arial" font-size="40" fill="#e8c37a" fill-opacity="0.8">♠ ♟ ▦</text>

  <text x="88" y="300" font-family="Segoe UI, Arial" font-weight="800" font-size="96" fill="url(#gold)">Aakash Shahani</text>

  <text x="92" y="370" font-family="Segoe UI, Arial" font-weight="600" font-size="38" fill="#e9efec">Builder of ML systems, real-time pipelines &amp; AI agents.</text>

  <text x="92" y="430" font-family="Segoe UI, Arial" font-size="30" fill="#8a978f">CS grad · Software / ML / Data Engineering · Tampa, FL</text>

  <text x="92" y="545" font-family="Segoe UI, Arial" font-weight="600" font-size="26" fill="#e8c37a">Pick your table — poker, chess, or classic.</text>
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
})
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, resvg.render().asPng())
console.log('Wrote', out)
