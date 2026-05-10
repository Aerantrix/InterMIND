/**
 * Onboarding Form Submission API Endpoint
 *
 * Receives the SetupWizard 11-step payload, validates it, and orchestrates
 * the Pipedrive Lead creation + manager notification flow per
 * pipedrive_integration_spec.md §4.
 *
 * Critical path (must succeed for the user to see success):
 *   1. Validate payload (Zod) and honeypot
 *   2. findOrCreatePerson — by email, exact match
 *   3. createOnboardingLead — Lead with all custom field option_ids
 *
 * Best-effort (logged on failure, don't block response):
 *   - Note attached to Lead (HTML summary)
 *   - Activity (next-business-day call follow-up)
 *   - Telegram alert to manager group
 *   - Welcome email to applicant
 *
 * If Pipedrive itself fails, we surface a 500 to the client so they retry —
 * losing the data with no persistence layer is worse than a transient error.
 * This is a deviation from the spec's `failed_submissions` queue idea, but
 * acceptable until we add a persistence backend (see Phase 2 roadmap).
 */

import { z } from "zod"
import { withDomainCheck } from "./lib/domainMiddleware.js"
import type { OnboardingPayload } from "./types/onboardingTypes.js"
import { findOrCreatePerson, createOnboardingLead, attachOnboardingNote, createFollowUpActivity } from "./lib/onboardingPipedriveLib.js"
import { buildOnboardingNote } from "./lib/onboardingHtmlSummary.js"
import { notifyTelegram } from "./lib/onboardingTelegram.js"
import { sendWelcomeEmail } from "./lib/onboardingEmail.js"

const radioStep = z.object({
  value: z.number().int().nullable(),
  label: z.string().nullable(),
})

const radioStepWithOther = radioStep.extend({
  other_text: z.string().max(200).nullable().optional(),
})

const onboardingSchema = z.object({
  step1: radioStepWithOther,
  step2: radioStep,
  step3: radioStep,
  step4: z.object({
    category: z.number().int().nullable(),
    category_label: z.string().nullable(),
    description: z.string().max(500).optional().default(""),
  }),
  step5: radioStep,
  step6: radioStep,
  step7: radioStep,
  step8: radioStep,
  step9: radioStep,
  contact: z.object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(160),
    country_iso: z.string().length(2),
    country_code: z.string().regex(/^\+\d{1,4}$/),
    phone_raw: z.string().min(4).max(20),
    phone_e164: z.string().regex(/^\+\d{6,15}$/),
  }),
  notes: z.string().max(2000).optional().default(""),
  meta: z
    .object({
      submitted_at: z.string(),
      source_url: z.string().optional().default(""),
      user_agent: z.string().optional().default(""),
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_content: z.string().optional(),
      utm_term: z.string().optional(),
    })
    .optional()
    .default({ submitted_at: "" }),
  // Honeypot — empty for real users, filled by bots
  website: z.string().optional(),
})

export async function POST(request: Request): Promise<Response> {
  return withDomainCheck(request, async (req) => {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return jsonResponse(400, { success: false, error: "Invalid JSON" })
    }

    const parsed = onboardingSchema.safeParse(body)
    if (!parsed.success) {
      return jsonResponse(400, {
        success: false,
        error: "Validation failed",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      })
    }

    const payload = parsed.data as OnboardingPayload & { website?: string }

    // Honeypot — silently accept (so bots don't learn) but don't actually create anything
    if (payload.website && payload.website.length > 0) {
      console.info("[onboarding] Honeypot triggered — silently dropping submission")
      return jsonResponse(200, { success: true, lead_id: "honeypot-noop", person_id: null })
    }

    let personId: number
    let leadId: string

    try {
      const person = await findOrCreatePerson(payload)
      personId = person.id
      const lead = await createOnboardingLead(payload, personId)
      leadId = lead.id
    } catch (err) {
      // The Pipedrive SDK throws plain objects, not Error instances; pass the
      // raw value to console.error so Node's util.inspect prints fields like
      // status, response.data.error, and the originating request URL.
      console.error("[onboarding] Pipedrive critical-path failure:", err)
      return jsonResponse(500, { success: false, error: "We couldn't save your submission. Please try again or email us directly." })
    }

    // Best-effort side effects in parallel. Failures are logged inside each
    // function — we never await rejections that would surface to the user.
    await Promise.allSettled([
      attachOnboardingNote(leadId, buildOnboardingNote(payload)).catch((err) => {
        console.error("[onboarding] attachOnboardingNote failed:", err instanceof Error ? err.message : err)
      }),
      createFollowUpActivity(leadId, personId, payload).catch((err) => {
        console.error("[onboarding] createFollowUpActivity failed:", err instanceof Error ? err.message : err)
      }),
      notifyTelegram({ leadId, personId, payload }),
      sendWelcomeEmail({ leadId, payload }),
    ])

    return jsonResponse(200, { success: true, lead_id: leadId, person_id: personId })
  }) as Promise<Response>
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
