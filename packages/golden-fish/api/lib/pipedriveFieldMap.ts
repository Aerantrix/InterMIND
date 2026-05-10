/**
 * Loader and types for `api/config/pipedriveFieldMap.json` — the source of
 * truth for Pipedrive field hashes and option_id mappings used by the
 * onboarding flow. Regenerated via `pnpm pipedrive:fetch-fields` whenever
 * the Pipedrive setup changes.
 *
 * On load, validates that all expected fields are present so that a
 * misconfigured map fails fast at startup, not at submission time.
 */

import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

// Load the JSON via fs rather than a bare ESM import so this file works
// uniformly in (a) Vercel dev's strict-ESM Node runtime which requires
// `with { type: "json" }` import attributes, (b) Vite / Vitest which prefer
// bare imports, and (c) Vercel's production bundler. fs.readFileSync sidesteps
// all three by avoiding ESM's JSON import controversy entirely.
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fieldMapPath = path.join(__dirname, "..", "config", "pipedriveFieldMap.json")
const fieldMap = JSON.parse(fs.readFileSync(fieldMapPath, "utf8"))

export interface SingleOptionFieldDef {
  key: string
  options: Record<string, number>
}

export interface TextFieldDef {
  key: string
}

export type DealFieldId =
  | "applicantType"
  | "mainGoal"
  | "licenseType"
  | "businessActivity"
  | "companyStructure"
  | "wantsResidency"
  | "bankAccount"
  | "currentlyInUae"
  | "launchTimeline"
  | "utmSource"
  | "utmCampaign"
  | "message"
  | "url"

export type PersonFieldId = "countryCode"

const SINGLE_OPTION_FIELDS: DealFieldId[] = [
  "applicantType",
  "mainGoal",
  "licenseType",
  "businessActivity",
  "companyStructure",
  "wantsResidency",
  "bankAccount",
  "currentlyInUae",
  "launchTimeline",
]

const TEXT_DEAL_FIELDS: DealFieldId[] = ["utmSource", "utmCampaign", "message", "url"]
const TEXT_PERSON_FIELDS: PersonFieldId[] = ["countryCode"]

export interface PipedriveFieldMap {
  _generated: string
  _domain: string
  deal: Record<string, SingleOptionFieldDef | TextFieldDef>
  person: Record<string, TextFieldDef>
}

const map = fieldMap as unknown as PipedriveFieldMap

// Fail fast on load if the map is missing fields the backend expects. Far
// better than discovering a missing key when a real lead is being submitted.
function validateMap(): void {
  const missing: string[] = []
  for (const id of SINGLE_OPTION_FIELDS) {
    const def = map.deal[id]
    if (!def?.key) missing.push(`deal.${id}.key`)
    if (!(def as SingleOptionFieldDef)?.options) missing.push(`deal.${id}.options`)
  }
  for (const id of TEXT_DEAL_FIELDS) {
    if (!map.deal[id]?.key) missing.push(`deal.${id}.key`)
  }
  for (const id of TEXT_PERSON_FIELDS) {
    if (!map.person[id]?.key) missing.push(`person.${id}.key`)
  }
  if (missing.length > 0) {
    throw new Error(`pipedriveFieldMap.json is missing required entries: ${missing.join(", ")}. Re-run \`pnpm pipedrive:fetch-fields\`.`)
  }
}

validateMap()

/** Return the Pipedrive field hash for a given Deal field id. */
export function dealFieldKey(id: DealFieldId): string {
  return map.deal[id].key
}

/** Return the Pipedrive field hash for a given Person field id. */
export function personFieldKey(id: PersonFieldId): string {
  return map.person[id].key
}

/**
 * Resolve a single-option Deal field's option_id from the form's numeric value.
 * Returns null if the value is not in the map (caller should not include the
 * field in the Lead payload in that case).
 */
export function dealOptionId(id: DealFieldId, value: number | null): number | null {
  if (value === null) return null
  const def = map.deal[id] as SingleOptionFieldDef
  if (!def?.options) return null
  const optionId = def.options[String(value)]
  return typeof optionId === "number" ? optionId : null
}

export const fieldMapMeta = {
  generated: map._generated,
  domain: map._domain,
}
