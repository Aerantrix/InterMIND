/**
 * Onboarding Form Submission API Endpoint — STUB
 *
 * Validates the 11-step Business Set-Up wizard payload (pipedrive_integration_spec.md §3.3),
 * runs the honeypot check, and returns a fake lead_id so the frontend success flow can be
 * exercised end-to-end during the frontend-first phase.
 *
 * TODO (backend phase 2):
 *   1. Replace the fake lead_id with createPersonAndLead() from api/lib/pipedriveLib.ts
 *   2. Map step values to Pipedrive option_id via dealFields config
 *   3. Send Telegram notification on success
 *   4. Send welcome email via SendGrid/Resend/Postmark
 *   5. Implement idempotency by hashing email + submitted_at minute
 *   6. Push failed submissions to a retry queue (failed_submissions table)
 */

import { z } from "zod"
import { withDomainCheck } from "./lib/domainMiddleware.js"

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
})

function fakeLeadId(): string {
  // Mimic Pipedrive's UUID-shaped lead_id so the frontend code path is realistic
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const h = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

export async function POST(request: Request): Promise<Response> {
  return withDomainCheck(request, async (req) => {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ success: false, error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const parsed = onboardingSchema.safeParse(body)
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Validation failed",
          issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    const data = parsed.data
    const leadId = fakeLeadId()

    // Stub-phase telemetry — useful for confirming traffic in Vercel logs
    // before real Pipedrive integration is wired up.
    console.info("[onboarding stub]", {
      lead_id: leadId,
      email: data.contact.email,
      timeline_value: data.step9.value,
      utm_source: data.meta.utm_source,
    })

    return new Response(JSON.stringify({ success: true, lead_id: leadId, person_id: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }) as Promise<Response>
}
