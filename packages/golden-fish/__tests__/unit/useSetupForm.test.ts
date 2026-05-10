/**
 * Unit tests for the SetupWizard composable.
 * Covers per-step validation, draft persistence, currentStep restore, and the
 * honeypot bot-detection guard. Vue reactivity APIs are exercised inside an
 * effectScope so each test owns its watchers.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { effectScope, nextTick } from "vue"
import { useSetupForm } from "../../docs/.vitepress/theme/components/setup/useSetupForm"
import { COUNTRIES } from "../../docs/.vitepress/theme/components/setup/countries"

const DRAFT_KEY = "gf_setup_draft_v1"

interface FormFixture {
  form: ReturnType<typeof useSetupForm>
  scope: ReturnType<typeof effectScope>
}

function makeForm(): FormFixture {
  const scope = effectScope()
  let form!: ReturnType<typeof useSetupForm>
  scope.run(() => {
    form = useSetupForm()
  })
  return { form, scope }
}

describe("useSetupForm", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  describe("step validation — radio steps", () => {
    it("blocks Continue on a plain radio step until an option is picked", () => {
      const { form, scope } = makeForm()
      form.currentStep.value = 2
      form.next()
      expect(form.currentStep.value).toBe(2)
      expect(form.stepError.value).toMatch(/pick one option/i)
      scope.stop()
    })

    it("advances when a radio option is selected", () => {
      const { form, scope } = makeForm()
      form.currentStep.value = 2
      form.state.mainGoal = 0
      form.next()
      expect(form.currentStep.value).toBe(3)
      expect(form.stepError.value).toBe("")
      scope.stop()
    })
  })

  describe("step 1 — applicant type with 'Other'", () => {
    it("does not require other_text when a non-Other option is picked", () => {
      const { form, scope } = makeForm()
      form.state.applicantType = 0
      form.next()
      expect(form.currentStep.value).toBe(2)
      scope.stop()
    })

    it("requires other_text when 'Other' is picked", () => {
      const { form, scope } = makeForm()
      form.state.applicantType = 4
      form.state.applicantTypeOther = ""
      form.next()
      expect(form.currentStep.value).toBe(1)
      expect(form.stepError.value).toMatch(/describe/i)

      form.state.applicantTypeOther = "AI consultancy with niche focus"
      form.next()
      expect(form.currentStep.value).toBe(2)
      scope.stop()
    })
  })

  describe("step 4 — business category", () => {
    it("does not require description for a regular category", () => {
      const { form, scope } = makeForm()
      form.currentStep.value = 4
      form.state.businessCategory = 1 // Technology & IT
      form.next()
      expect(form.currentStep.value).toBe(5)
      scope.stop()
    })

    it("requires description (3+ chars) only when 'Other' is selected", () => {
      const { form, scope } = makeForm()
      form.currentStep.value = 4
      form.state.businessCategory = 8 // Other
      form.state.activityDescription = "ai"
      form.next()
      expect(form.currentStep.value).toBe(4)
      expect(form.stepError.value).toMatch(/describe/i)

      form.state.activityDescription = "AI consultancy"
      form.next()
      expect(form.currentStep.value).toBe(5)
      scope.stop()
    })
  })

  describe("step 10 — contact", () => {
    it("rejects an invalid email", () => {
      const { form, scope } = makeForm()
      form.currentStep.value = 10
      form.state.contactName = "Ivan Petrov"
      form.state.contactEmail = "not-an-email"
      form.state.contactPhone = "501234567"
      form.next()
      expect(form.currentStep.value).toBe(10)
      expect(form.stepError.value).toMatch(/email/i)
      scope.stop()
    })

    it("accepts a valid UAE phone (libphonenumber)", () => {
      const { form, scope } = makeForm()
      form.currentStep.value = 10
      form.state.contactName = "Ivan Petrov"
      form.state.contactEmail = "ivan@example.com"
      form.state.contactCountry = COUNTRIES.find((c) => c.iso === "AE")!
      form.state.contactPhone = "501234567"
      form.next()
      expect(form.currentStep.value).toBe(11)
      scope.stop()
    })

    it("rejects too-many-digits phone for the chosen country and surfaces the example", () => {
      const { form, scope } = makeForm()
      form.currentStep.value = 10
      form.state.contactName = "Ivan"
      form.state.contactEmail = "i@e.co"
      form.state.contactCountry = COUNTRIES.find((c) => c.iso === "SA")!
      form.state.contactPhone = "5757543323341"
      form.next()
      expect(form.currentStep.value).toBe(10)
      expect(form.stepError.value).toMatch(/Saudi Arabia/)
      expect(form.stepError.value).toContain("50 123 4567")
      scope.stop()
    })
  })

  describe("draft persistence", () => {
    it("saves state and currentStep after a change", async () => {
      const { form, scope } = makeForm()
      form.state.applicantType = 1
      form.currentStep.value = 3
      await nextTick()

      const raw = localStorage.getItem(DRAFT_KEY)
      expect(raw).toBeTruthy()
      const parsed = JSON.parse(raw!)
      expect(parsed.state.applicantType).toBe(1)
      expect(parsed.currentStep).toBe(3)
      expect(parsed.savedAt).toBeTypeOf("number")
      scope.stop()
    })

    it("restores state and currentStep from a fresh draft", () => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          savedAt: Date.now(),
          state: { applicantType: 2, contactName: "Restored Name" },
          currentStep: 5,
        }),
      )
      const { form, scope } = makeForm()
      expect(form.state.applicantType).toBe(2)
      expect(form.state.contactName).toBe("Restored Name")
      expect(form.currentStep.value).toBe(5)
      scope.stop()
    })

    it("discards a draft older than 7 days and clears the entry", () => {
      const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          savedAt: eightDaysAgo,
          state: { applicantType: 3 },
          currentStep: 6,
        }),
      )
      const { form, scope } = makeForm()
      expect(form.state.applicantType).toBeNull()
      expect(form.currentStep.value).toBe(1)
      expect(localStorage.getItem(DRAFT_KEY)).toBeNull()
      scope.stop()
    })

    it("survives corrupted draft JSON", () => {
      localStorage.setItem(DRAFT_KEY, "not-json{{{")
      const { form, scope } = makeForm()
      expect(form.state.applicantType).toBeNull()
      expect(form.currentStep.value).toBe(1)
      scope.stop()
    })

    it("clamps an out-of-range currentStep from a tampered draft", () => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          savedAt: Date.now(),
          state: {},
          currentStep: 99,
        }),
      )
      const { form, scope } = makeForm()
      expect(form.currentStep.value).toBe(1)
      scope.stop()
    })
  })

  describe("submit — honeypot", () => {
    it("does not call /api/onboarding when the honeypot field is filled", async () => {
      const fetchSpy = vi.fn()
      vi.stubGlobal("fetch", fetchSpy)

      const { form, scope } = makeForm()
      // Fill in everything so validation alone wouldn't block submit
      Object.assign(form.state, {
        applicantType: 0,
        mainGoal: 0,
        licenseType: 0,
        businessCategory: 1,
        partnerStructure: 0,
        wantsResidency: 0,
        bankAccount: 0,
        currentlyInUae: 0,
        launchTimeline: 0,
        contactName: "Real Person",
        contactEmail: "real@example.com",
        contactCountry: COUNTRIES.find((c) => c.iso === "AE")!,
        contactPhone: "501234567",
      })
      form.currentStep.value = 11

      await form.submit("im-a-bot")

      expect(fetchSpy).not.toHaveBeenCalled()
      scope.stop()
    })
  })
})
