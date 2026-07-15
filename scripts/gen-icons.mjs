// Renders public/favicon.svg into the PNG app icons.
// Run: node scripts/gen-icons.mjs
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pub = resolve(__dirname, '../public')
const svg = readFileSync(resolve(pub, 'favicon.svg'), 'utf8')

const targets = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

for (const { file, size } of targets) {
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    font: { loadSystemFonts: true },
  })
    .render()
    .asPng()
  writeFileSync(resolve(pub, file), png)
  console.log('Wrote', file, `${size}x${size}`)
}
