#!/usr/bin/env node
/**
 * Hero background optimizer — one-shot per-page CSS background-image heroes.
 *
 * Hero-фоны офер-страниц весили 2-8 MB (residency/dark = 7.8 MB PNG было
 * худшим случаем). Каждый страничный hero подключается через CSS
 * `background-image:url(...)` в style.css, поэтому браузер начинает их
 * качать только после парсинга CSS — отсюда заметный gap между текстом
 * и появлением фоновой картинки на проде.
 *
 * Качество q60 при width=1920 даёт ~50-80 KB на AVIF — визуально неотличимо
 * под градиентным overlay'ем, но даёт ~10-100× экономии на каждом hero.
 */
import sharp from "sharp"
import { statSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMG_DIR = resolve(__dirname, "../docs/public/img")

const HERO_WIDTH = 1920
const HERO_QUALITY = 60

const jobs = [
  // company-registration — two themes
  { src: "pexels-atulm0han-17914739.jpg", out: "hero-companyreg-dark.avif" },
  { src: "pexels-nelemson-29470840.jpg", out: "hero-companyreg-light.avif" },
  // banking
  { src: "bank_hero2_dark.jpg", out: "hero-banking-dark.avif" },
  { src: "bank_hero2_light.jpg", out: "hero-banking-light.avif" },
  // tax
  { src: "tax_hero_dark.jpg", out: "hero-tax-dark.avif" },
  { src: "tax_hero_light.jpg", out: "hero-tax-light.avif" },
  // intellectual-property (same for both themes)
  { src: "brand_from_eu.jpg", out: "hero-ip.avif" },
  // residency — dark is the catastrophic 7.8 MB PNG, light already AVIF
  { src: "residency dark.png", out: "hero-residency-dark.avif" },
  // homepage light-mode hero (the dark one is already hero-bg.webp)
  { src: "hero-bg-light.jpg", out: "hero-bg-light.avif" },
]

const human = (n) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(2)} MB`)

let savedTotal = 0
for (const job of jobs) {
  const inPath = resolve(IMG_DIR, job.src)
  const outPath = resolve(IMG_DIR, job.out)
  if (!existsSync(inPath)) {
    console.warn(`SKIP ${job.src} — not found`)
    continue
  }
  const inSize = statSync(inPath).size
  await sharp(inPath).resize({ width: HERO_WIDTH, withoutEnlargement: true }).avif({ quality: HERO_QUALITY, effort: 6 }).toFile(outPath)
  const outSize = statSync(outPath).size
  const delta = inSize - outSize
  savedTotal += delta
  console.log(`${job.src} (${human(inSize)}) → ${job.out} (${human(outSize)}) saved ${human(delta)}`)
}
console.log(`\nTotal saved: ${human(savedTotal)}`)
