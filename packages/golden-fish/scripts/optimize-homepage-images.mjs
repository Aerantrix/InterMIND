#!/usr/bin/env node
import sharp from "sharp"
import { readFileSync, statSync, writeFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMG_DIR = resolve(__dirname, "../docs/public/img")

const SERVICE_WIDTH = 1200
const CASE_WIDTH = 1200
const GOLDIE_WIDTH = 800

const jobs = [
  { src: "pexels-pixabay-210742.jpg", out: "pexels-pixabay-210742.avif", width: SERVICE_WIDTH, format: "avif", quality: 50 },
  { src: "service-company-setup.jpg", out: "service-company-setup.avif", width: SERVICE_WIDTH, format: "avif", quality: 50 },
  { src: "service-residency-visas.jpg", out: "service-residency-visas.avif", width: SERVICE_WIDTH, format: "avif", quality: 50 },
  { src: "pexels-rdne-8292883-opt.jpg", out: "pexels-rdne-8292883-opt.avif", width: SERVICE_WIDTH, format: "avif", quality: 50 },
  { src: "case-saas-startup.jpg", out: "case-saas-startup.avif", width: CASE_WIDTH, format: "avif", quality: 50 },
  { src: "pexels-alesiakozik-6777564-opt.jpg", out: "pexels-alesiakozik-6777564-opt.avif", width: CASE_WIDTH, format: "avif", quality: 50 },
  { src: "family-case.jpg", out: "family-case.avif", width: CASE_WIDTH, format: "avif", quality: 50 },
  { src: "goldie-portrait-light.png", out: "goldie-portrait-light.avif", width: GOLDIE_WIDTH, format: "avif", quality: 55 },
  { src: "goldie-icon.png", out: "goldie-icon.webp", width: 256, format: "webp", quality: 85 },
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
  let pipeline = sharp(inPath).resize({ width: job.width, withoutEnlargement: true })
  if (job.format === "avif") pipeline = pipeline.avif({ quality: job.quality, effort: 6 })
  else if (job.format === "webp") pipeline = pipeline.webp({ quality: job.quality, effort: 6 })
  await pipeline.toFile(outPath)
  const outSize = statSync(outPath).size
  const delta = inSize - outSize
  savedTotal += delta
  console.log(`${job.src} (${human(inSize)}) → ${job.out} (${human(outSize)}) saved ${human(delta)}`)
}
console.log(`\nTotal saved: ${human(savedTotal)}`)

// Hero background: re-encode webp at lower quality to save weight (LCP candidate)
{
  const inPath = resolve(IMG_DIR, "hero-bg.jpg")
  const outPath = resolve(IMG_DIR, "hero-bg.webp")
  if (existsSync(inPath)) {
    const inSize = statSync(outPath).size
    await sharp(inPath).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 72, effort: 6 }).toFile(outPath + ".tmp")
    const tmpSize = statSync(outPath + ".tmp").size
    if (tmpSize < inSize) {
      writeFileSync(outPath, readFileSync(outPath + ".tmp"))
      console.log(`hero-bg.webp re-encoded: ${human(inSize)} → ${human(tmpSize)}`)
    } else {
      console.log(`hero-bg.webp re-encode skipped (would grow: ${human(inSize)} → ${human(tmpSize)})`)
    }
    const { unlinkSync } = await import("node:fs")
    unlinkSync(outPath + ".tmp")
  }
}
