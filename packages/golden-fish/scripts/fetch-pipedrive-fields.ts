/**
 * One-time fetcher: pulls Pipedrive Deal & Person field definitions, validates
 * them against setupSchema.ts (catches typos in Pipedrive option labels before
 * they break production), and writes the field/option_id map to
 * api/config/pipedriveFieldMap.json.
 *
 * Usage:
 *   1. Ensure PIPEDRIVE_API_TOKEN is in .env.local (run `vercel env pull .env.local`)
 *   2. From packages/golden-fish: `pnpm tsx scripts/fetch-pipedrive-fields.ts`
 *   3. Commit the resulting api/config/pipedriveFieldMap.json
 *
 * Re-run this script whenever:
 *   - A new custom field is added to Pipedrive
 *   - An option label is renamed in Pipedrive (option_id stays the same, but
 *     we still want the JSON to reflect the current label for sanity checks)
 *   - You bump the schema (new step, new option)
 */

import { config as loadEnv } from "dotenv"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"
import { STEPS, type RadioStep, type RadioWithOtherStep, type CategoryStep } from "../docs/.vitepress/theme/components/setup/setupSchema"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// .env.local can live in either the package root (single-package setup) or the
// monorepo root (canonical Vercel monorepo setup with .vercel/project.json at
// repo root). Try both — first hit wins.
const envCandidates = [path.join(__dirname, "..", ".env.local"), path.join(__dirname, "..", "..", "..", ".env.local")]
let envLoaded = false
for (const p of envCandidates) {
  const result = loadEnv({ path: p })
  if (result.parsed && Object.keys(result.parsed).length > 0) {
    envLoaded = true
    break
  }
}
if (!envLoaded) {
  console.warn(`[fetch-pipedrive-fields] No .env.local found in any of: ${envCandidates.join(", ")}`)
}

const API_TOKEN = process.env.PIPEDRIVE_API_TOKEN
if (!API_TOKEN) {
  console.error("✗ PIPEDRIVE_API_TOKEN is not set. Run `vercel env pull .env.local` from packages/golden-fish first.")
  process.exit(1)
}

const API_BASE = "https://api.pipedrive.com/v1"
const OUTPUT_PATH = path.join(__dirname, "..", "api", "config", "pipedriveFieldMap.json")

/* ============================================================
 * What we're looking for in Pipedrive
 * ============================================================ */

interface ExpectedFieldSpec {
  /** Pipedrive UI label (exact match) */
  pipedriveName: string
  /** Schema id (key in pipedriveFieldMap.json output) */
  schemaId: string
  /** Where to look it up: deal or person */
  entity: "deal" | "person"
  /** Type — single-option fields get option_id mapping built */
  kind: "single_option" | "text" | "phone"
  /** Optional: validate options against setupSchema by linking to a step id */
  validateAgainstStepId?: string
}

const EXPECTED_FIELDS: ExpectedFieldSpec[] = [
  // 9 single-option fields on Deal
  { pipedriveName: "Applicant Type", schemaId: "applicantType", entity: "deal", kind: "single_option", validateAgainstStepId: "applicantType" },
  { pipedriveName: "Main Goal", schemaId: "mainGoal", entity: "deal", kind: "single_option", validateAgainstStepId: "mainGoal" },
  { pipedriveName: "License Type", schemaId: "licenseType", entity: "deal", kind: "single_option", validateAgainstStepId: "licenseType" },
  { pipedriveName: "Business Activity", schemaId: "businessActivity", entity: "deal", kind: "single_option", validateAgainstStepId: "businessActivity" },
  { pipedriveName: "Company Structure", schemaId: "companyStructure", entity: "deal", kind: "single_option", validateAgainstStepId: "companyStructure" },
  { pipedriveName: "Wants UAE Residency", schemaId: "wantsResidency", entity: "deal", kind: "single_option", validateAgainstStepId: "wantsResidency" },
  { pipedriveName: "Bank Account Need", schemaId: "bankAccount", entity: "deal", kind: "single_option", validateAgainstStepId: "bankAccount" },
  { pipedriveName: "Currently in UAE", schemaId: "currentlyInUae", entity: "deal", kind: "single_option", validateAgainstStepId: "currentlyInUae" },
  { pipedriveName: "Launch Timeline", schemaId: "launchTimeline", entity: "deal", kind: "single_option", validateAgainstStepId: "launchTimeline" },

  // 2 UTM text fields on Deal
  { pipedriveName: "UTM Source", schemaId: "utmSource", entity: "deal", kind: "text" },
  { pipedriveName: "UTM Campaign", schemaId: "utmCampaign", entity: "deal", kind: "text" },

  // Pre-existing Deal/Lead fields we'll reuse for this flow.
  // The "⚙" prefix is your in-Pipedrive naming convention for service fields
  // shared across multiple onboarding-style forms; it is part of the field
  // name string, not a UI icon.
  { pipedriveName: "⚙Message", schemaId: "message", entity: "deal", kind: "text" },
  { pipedriveName: "⚙URL", schemaId: "url", entity: "deal", kind: "text" },

  // Person fields — already exist, we just need their hashes
  { pipedriveName: "⚙Country code", schemaId: "countryCode", entity: "person", kind: "text" },
]

/* ============================================================
 * Pipedrive API plumbing
 * ============================================================ */

interface PipedriveField {
  key: string
  name: string
  field_type?: string
  options?: Array<{ id: number; label: string }>
}

interface PipedriveListResponse {
  success: boolean
  data: PipedriveField[]
  error?: string
}

/**
 * Normalize a field name for matching: strip leading/trailing decorative
 * symbols (gears, emoji variation selectors, dashes) so that, for example,
 * "⚙Message", "⚙️Message", and "Message" all reduce to the same string.
 * The user uses "⚙" as an in-Pipedrive marker for service fields; that
 * marker is not stable across unicode variants (text vs emoji presentation),
 * so we ignore it when matching by name.
 */
function normalizeFieldName(s: string): string {
  return s.replace(/^[^\p{L}\p{N}]+/u, "").replace(/[^\p{L}\p{N}]+$/u, "").trim()
}

async function fetchFields(endpoint: "dealFields" | "personFields"): Promise<PipedriveField[]> {
  const url = `${API_BASE}/${endpoint}?api_token=${API_TOKEN}&limit=500`
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${endpoint} HTTP ${res.status}: ${text}`)
  }
  const json = (await res.json()) as PipedriveListResponse
  if (!json.success) throw new Error(`${endpoint} error: ${json.error}`)
  return json.data
}

/* ============================================================
 * Validation against setupSchema
 * ============================================================ */

function getSchemaOptions(stepId: string): { value: number; label: string }[] {
  const step = STEPS.find((s) => s.id === stepId)
  if (!step) return []
  if (step.kind === "radio" || step.kind === "radio-with-other" || step.kind === "category") {
    return (step as RadioStep | RadioWithOtherStep | CategoryStep).options.map((o) => ({ value: o.value, label: o.label }))
  }
  return []
}

interface ValidationResult {
  schemaId: string
  pipedriveName: string
  pass: boolean
  issues: string[]
  optionMap: Record<number, number>
}

function validateOptions(spec: ExpectedFieldSpec, field: PipedriveField): ValidationResult {
  const result: ValidationResult = { schemaId: spec.schemaId, pipedriveName: spec.pipedriveName, pass: true, issues: [], optionMap: {} }
  if (!spec.validateAgainstStepId) return result

  const schemaOptions = getSchemaOptions(spec.validateAgainstStepId)
  const pipedriveOptions = field.options ?? []

  if (schemaOptions.length === 0) {
    result.issues.push(`No schema options found for stepId="${spec.validateAgainstStepId}"`)
    result.pass = false
    return result
  }

  for (const schemaOpt of schemaOptions) {
    const match = pipedriveOptions.find((p) => p.label === schemaOpt.label)
    if (!match) {
      const closest = pipedriveOptions.map((p) => p.label).join(" | ")
      result.issues.push(`Missing option in Pipedrive: "${schemaOpt.label}". Available: ${closest || "(none)"}`)
      result.pass = false
    } else {
      result.optionMap[schemaOpt.value] = match.id
    }
  }

  // Warn (don't fail) about extra options in Pipedrive that schema doesn't know about
  for (const pdOpt of pipedriveOptions) {
    const inSchema = schemaOptions.find((s) => s.label === pdOpt.label)
    if (!inSchema) {
      result.issues.push(`(warn) Extra Pipedrive option not in schema: "${pdOpt.label}" (id=${pdOpt.id})`)
    }
  }

  return result
}

/* ============================================================
 * Main
 * ============================================================ */

async function main() {
  console.info("→ Fetching Pipedrive Deal fields…")
  const dealFields = await fetchFields("dealFields")
  console.info("→ Fetching Pipedrive Person fields…")
  const personFields = await fetchFields("personFields")

  const output: {
    _generated: string
    _domain: string
    deal: Record<string, { key: string; options?: Record<number, number> }>
    person: Record<string, { key: string }>
  } = {
    _generated: new Date().toISOString(),
    _domain: process.env.PIPEDRIVE_DOMAIN ?? "",
    deal: {},
    person: {},
  }

  let hasFailures = false
  const warnings: string[] = []

  for (const spec of EXPECTED_FIELDS) {
    const pool = spec.entity === "deal" ? dealFields : personFields
    const targetCore = normalizeFieldName(spec.pipedriveName)
    const field = pool.find((f) => normalizeFieldName(f.name) === targetCore)

    if (!field) {
      console.error(`✗ ${spec.entity} field "${spec.pipedriveName}" NOT FOUND in Pipedrive.`)
      // Dump candidate names with similar prefix so user can spot a typo or case
      // mismatch without diving into Pipedrive UI.
      const needle = spec.pipedriveName.toLowerCase().split(/\s+/)[0]
      const candidates = pool.filter((f) => f.name.toLowerCase().includes(needle)).map((f) => `"${f.name}"`)
      if (candidates.length > 0) {
        console.error(`    Did you mean one of: ${candidates.join(", ")}`)
      } else {
        console.error(`    All ${spec.entity} field names: ${pool.map((f) => `"${f.name}"`).join(", ")}`)
      }
      hasFailures = true
      continue
    }

    if (spec.kind === "single_option") {
      const validation = validateOptions(spec, field)
      const errorIssues = validation.issues.filter((i) => !i.startsWith("(warn)"))
      const warnIssues = validation.issues.filter((i) => i.startsWith("(warn)"))
      if (errorIssues.length > 0) {
        console.error(`✗ ${spec.pipedriveName}: ${errorIssues.length} option mismatch(es)`)
        for (const issue of errorIssues) console.error(`    ${issue}`)
        hasFailures = true
        continue
      }
      for (const w of warnIssues) warnings.push(`${spec.pipedriveName}: ${w}`)
      output.deal[spec.schemaId] = { key: field.key, options: validation.optionMap }
      console.info(`✓ ${spec.pipedriveName} → ${spec.schemaId} (${Object.keys(validation.optionMap).length} options)`)
    } else if (spec.entity === "deal") {
      output.deal[spec.schemaId] = { key: field.key }
      console.info(`✓ ${spec.pipedriveName} → ${spec.schemaId} (text)`)
    } else {
      output.person[spec.schemaId] = { key: field.key }
      console.info(`✓ ${spec.pipedriveName} → ${spec.schemaId} (person/text)`)
    }
  }

  if (warnings.length > 0) {
    console.warn("\nWarnings:")
    for (const w of warnings) console.warn(`  ${w}`)
  }

  if (hasFailures) {
    console.error("\n✗ One or more fields failed validation. Fix the Pipedrive setup and re-run.")
    process.exit(1)
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf8")

  const relPath = path.relative(path.join(__dirname, ".."), OUTPUT_PATH)
  console.info(`\n✓ Wrote ${relPath}`)
  console.info("  Commit this file to the repo so the backend can read it at runtime.")
}

main().catch((err) => {
  console.error("\n✗ Script failed:", err instanceof Error ? err.message : err)
  process.exit(1)
})
