/**
 * Unit tests for /api/onboarding orchestration logic. Mocks the Pipedrive,
 * Telegram, and Email libs so we can verify the request validation, honeypot
 * handling, critical-path error surfacing, and best-effort fan-out without
 * touching real services.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../../api/lib/domainMiddleware.js", () => ({
  withDomainCheck: vi.fn((request, handler) => handler(request)),
}))

vi.mock("../../api/lib/onboardingPipedriveLib.js", () => ({
  findOrCreatePerson: vi.fn(),
  createOnboardingLead: vi.fn(),
  attachOnboardingNote: vi.fn(),
  createFollowUpActivity: vi.fn(),
}))

vi.mock("../../api/lib/onboardingTelegram.js", () => ({
  notifyTelegram: vi.fn(),
}))

vi.mock("../../api/lib/onboardingEmail.js", () => ({
  sendWelcomeEmail: vi.fn(),
}))

import { POST } from "../../api/onboarding"
import { findOrCreatePerson, createOnboardingLead, attachOnboardingNote, createFollowUpActivity } from "../../api/lib/onboardingPipedriveLib.js"
import { notifyTelegram } from "../../api/lib/onboardingTelegram.js"
import { sendWelcomeEmail } from "../../api/lib/onboardingEmail.js"

const mFindOrCreatePerson = vi.mocked(findOrCreatePerson)
const mCreateOnboardingLead = vi.mocked(createOnboardingLead)
const mAttachOnboardingNote = vi.mocked(attachOnboardingNote)
const mCreateFollowUpActivity = vi.mocked(createFollowUpActivity)
const mNotifyTelegram = vi.mocked(notifyTelegram)
const mSendWelcomeEmail = vi.mocked(sendWelcomeEmail)

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  })
}

function validPayload() {
  return {
    step1: { value: 0, label: "Individual entrepreneur / freelancer", other_text: null },
    step2: { value: 3, label: "All-inclusive service (full package)" },
    step3: { value: 0, label: "Free Zone" },
    step4: { category: 1, category_label: "Technology & IT", description: "" },
    step5: { value: 0, label: "Just me" },
    step6: { value: 0, label: "Yes — include in the package" },
    step7: { value: 0, label: "Yes — it's essential" },
    step8: { value: 1, label: "Not yet, but I'll arrive soon" },
    step9: { value: 1, label: "Within a month" },
    contact: {
      name: "Ivan Petrov",
      email: "ivan@example.com",
      country_iso: "AE",
      country_code: "+971",
      phone_raw: "501234567",
      phone_e164: "+971501234567",
    },
    notes: "",
    meta: { submitted_at: "2026-05-10T14:00:00Z", source_url: "", user_agent: "" },
  }
}

describe("/api/onboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 400 on invalid JSON body", async () => {
    const res = await POST(makeRequest("not-json{{{"))
    expect(res.status).toBe(400)
    const json = (await res.json()) as { success: boolean; error: string }
    expect(json.success).toBe(false)
    expect(json.error).toMatch(/JSON/i)
  })

  it("returns 400 with issues array on schema validation failure", async () => {
    const res = await POST(makeRequest({ step1: { value: 0 } })) // missing many fields
    expect(res.status).toBe(400)
    const json = (await res.json()) as { success: boolean; error: string; issues?: unknown[] }
    expect(json.success).toBe(false)
    expect(json.issues).toBeInstanceOf(Array)
    expect((json.issues as unknown[]).length).toBeGreaterThan(0)
  })

  it("silently noops on honeypot fill (returns success but does NOT call Pipedrive)", async () => {
    const payload = { ...validPayload(), website: "im-a-bot" }
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(200)
    const json = (await res.json()) as { success: boolean; lead_id: string }
    expect(json.success).toBe(true)
    expect(json.lead_id).toBe("honeypot-noop")
    expect(mFindOrCreatePerson).not.toHaveBeenCalled()
    expect(mCreateOnboardingLead).not.toHaveBeenCalled()
  })

  it("returns 500 if findOrCreatePerson throws (critical path)", async () => {
    mFindOrCreatePerson.mockRejectedValue(new Error("Pipedrive 503"))
    const res = await POST(makeRequest(validPayload()))
    expect(res.status).toBe(500)
    const json = (await res.json()) as { success: boolean; error: string }
    expect(json.success).toBe(false)
    expect(mCreateOnboardingLead).not.toHaveBeenCalled()
  })

  it("returns 500 if createOnboardingLead throws (critical path)", async () => {
    mFindOrCreatePerson.mockResolvedValue({ id: 6789, created: true })
    mCreateOnboardingLead.mockRejectedValue(new Error("Pipedrive 500"))
    const res = await POST(makeRequest(validPayload()))
    expect(res.status).toBe(500)
    const json = (await res.json()) as { success: boolean }
    expect(json.success).toBe(false)
  })

  it("happy path: creates Person + Lead, fan-outs Note + Activity + Telegram + Email, returns 200", async () => {
    mFindOrCreatePerson.mockResolvedValue({ id: 6789, created: true })
    mCreateOnboardingLead.mockResolvedValue({ id: "abc-123-def-456" })
    mAttachOnboardingNote.mockResolvedValue(undefined)
    mCreateFollowUpActivity.mockResolvedValue(undefined)
    mNotifyTelegram.mockResolvedValue(undefined)
    mSendWelcomeEmail.mockResolvedValue(undefined)

    const res = await POST(makeRequest(validPayload()))
    expect(res.status).toBe(200)
    const json = (await res.json()) as { success: boolean; lead_id: string; person_id: number }
    expect(json.success).toBe(true)
    expect(json.lead_id).toBe("abc-123-def-456")
    expect(json.person_id).toBe(6789)

    expect(mFindOrCreatePerson).toHaveBeenCalledTimes(1)
    expect(mCreateOnboardingLead).toHaveBeenCalledTimes(1)
    expect(mAttachOnboardingNote).toHaveBeenCalledWith("abc-123-def-456", expect.stringContaining("Onboarding form summary"))
    expect(mCreateFollowUpActivity).toHaveBeenCalledWith("abc-123-def-456", 6789, expect.any(Object))
    expect(mNotifyTelegram).toHaveBeenCalledTimes(1)
    expect(mSendWelcomeEmail).toHaveBeenCalledTimes(1)
  })

  it("succeeds even when best-effort side effects throw (Note/Activity/Telegram/Email)", async () => {
    mFindOrCreatePerson.mockResolvedValue({ id: 6789, created: true })
    mCreateOnboardingLead.mockResolvedValue({ id: "abc-123-def-456" })
    mAttachOnboardingNote.mockRejectedValue(new Error("Notes API 500"))
    mCreateFollowUpActivity.mockRejectedValue(new Error("Activities API 500"))
    mNotifyTelegram.mockRejectedValue(new Error("Telegram down"))
    mSendWelcomeEmail.mockRejectedValue(new Error("Resend down"))

    // Suppress console.error noise from caught best-effort failures
    vi.spyOn(console, "error").mockImplementation(() => {})

    const res = await POST(makeRequest(validPayload()))
    expect(res.status).toBe(200)
    const json = (await res.json()) as { success: boolean; lead_id: string }
    expect(json.success).toBe(true)
    expect(json.lead_id).toBe("abc-123-def-456")
  })
})
