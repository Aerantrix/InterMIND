/**
 * SetupWizard composable: form state, per-step validation across multiple
 * sub-questions, draft persistence, UTM collection, and submission to
 * /api/onboarding.
 *
 * State shape stays flat (each radio question owns its own property), even
 * though the UI groups questions into 5 logical steps. That separation keeps
 * the backend payload format stable: payload.step1.value matches what
 * Pipedrive expects regardless of how the UI groups questions visually.
 *
 * Draft schema is versioned via DRAFT_KEY; bump the version suffix when the
 * shape changes incompatibly so old drafts get discarded instead of crashing
 * the wizard.
 */

import { reactive, computed, watch, ref } from "vue"
import { isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js"
import type { Country } from "./countries"
import { DEFAULT_COUNTRY } from "./countries"
import { STEPS, TOTAL_STEPS, type Question, type RadioQuestion } from "./setupSchema"
import { track } from "./track"

// v4 = 10 steps (9 single-question + 1 merged contact+notes); v3 was the brief
// 5-step grouping which we reverted because the groupings weren't logical.
const DRAFT_KEY = "gf_setup_draft_v4"
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export interface SetupState {
  applicantType: number | null
  applicantTypeOther: string
  mainGoal: number | null
  licenseType: number | null
  businessActivity: number | null
  activityDescription: string
  companyStructure: number | null
  wantsResidency: number | null
  bankAccount: number | null
  currentlyInUae: number | null
  launchTimeline: number | null
  contactName: string
  contactEmail: string
  contactPhone: string
  contactCountry: Country
  notes: string
}

function emptyState(): SetupState {
  return {
    applicantType: null,
    applicantTypeOther: "",
    mainGoal: null,
    licenseType: null,
    businessActivity: null,
    activityDescription: "",
    companyStructure: null,
    wantsResidency: null,
    bankAccount: null,
    currentlyInUae: null,
    launchTimeline: null,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactCountry: DEFAULT_COUNTRY,
    notes: "",
  }
}

function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = params.get(k)
    if (v) out[k] = v
  }
  return out
}

interface Draft {
  savedAt: number
  state: Partial<SetupState>
  currentStep: number
}

function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Draft
    if (!parsed.savedAt || Date.now() - parsed.savedAt > DRAFT_TTL_MS) {
      window.localStorage.removeItem(DRAFT_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function saveDraft(state: SetupState, currentStep: number): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt: Date.now(), state, currentStep }))
  } catch {
    // Storage quota or private mode — silently skip
  }
}

function clearDraft(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(DRAFT_KEY)
  } catch {
    // ignore
  }
}

export function useSetupForm() {
  const state = reactive<SetupState>(emptyState())
  const currentStep = ref(1)
  const isSubmitting = ref(false)
  const submitError = ref("")
  const successLeadId = ref("")

  const draft = loadDraft()
  if (draft) {
    Object.assign(state, draft.state)
    if (Number.isInteger(draft.currentStep) && draft.currentStep >= 1 && draft.currentStep <= TOTAL_STEPS) {
      currentStep.value = draft.currentStep
    }
  }

  let formStartedFired = false

  watch(
    () => [{ ...state }, currentStep.value] as const,
    ([nextState, nextStep]) => {
      saveDraft(nextState as SetupState, nextStep as number)
      if (!formStartedFired && hasAnyInput(nextState as SetupState)) {
        formStartedFired = true
        track("setup_form_started", {})
      }
    },
    { deep: true },
  )

  const totalSteps = TOTAL_STEPS

  const progressPct = computed(() => Math.round((currentStep.value / totalSteps) * 100))

  const currentStepConfig = computed(() => STEPS[currentStep.value - 1])

  const stepError = ref("")

  /**
   * Walk through every question in the current step in declaration order;
   * stop at the first invalid one and surface its error. Returning early on
   * the first failure means error messages always reference what the user
   * needs to fix next, top-to-bottom on the screen.
   */
  function validateCurrentStep(): boolean {
    stepError.value = ""
    const step = currentStepConfig.value
    for (const q of step.questions) {
      const err = validateQuestion(q)
      if (err) {
        stepError.value = err
        return false
      }
    }
    return true
  }

  function validateQuestion(q: Question): string | null {
    switch (q.kind) {
      case "radio-cards":
      case "radio-cards-scroll":
      case "compact-buttons": {
        const value = state[q.id as keyof SetupState] as number | null
        if (value === null || value === undefined) {
          return `Please pick an option for "${q.label}".`
        }
        if (q.otherValue !== undefined && value === q.otherValue) {
          // Other-text lives in a sibling state property by convention:
          // applicantType → applicantTypeOther, businessActivity → activityDescription
          const otherKey: keyof SetupState | null =
            q.id === "applicantType" ? "applicantTypeOther" : q.id === "businessActivity" ? "activityDescription" : null
          if (otherKey) {
            const text = (state[otherKey] as string).trim()
            if (text.length < 3) return `Please briefly describe your case (3+ characters).`
          }
        }
        return null
      }
      case "contact": {
        if (state.contactName.trim().length < 2) return "Please enter your full name."
        if (!EMAIL_RE.test(state.contactEmail.trim())) return "Please enter a valid email address."
        const fullPhone = state.contactCountry.dial + state.contactPhone.replace(/[\s\-()]/g, "")
        if (!state.contactPhone.trim() || !isValidPhoneNumber(fullPhone, state.contactCountry.iso as never)) {
          return `Please enter a valid ${state.contactCountry.name} number — e.g. ${state.contactCountry.example}`
        }
        return null
      }
      case "notes":
        return null
    }
  }

  function next(): void {
    if (!validateCurrentStep()) {
      track("setup_form_validation_error", { step_number: currentStep.value, step_id: currentStepConfig.value.id })
      return
    }
    track("setup_step_completed", { step_number: currentStep.value, step_id: currentStepConfig.value.id })
    if (currentStep.value < totalSteps) {
      currentStep.value += 1
      stepError.value = ""
      scrollToTop()
    }
  }

  function back(): void {
    if (currentStep.value > 1) {
      track("setup_step_back", { step_number: currentStep.value, step_id: currentStepConfig.value.id })
      currentStep.value -= 1
      stepError.value = ""
      scrollToTop()
    }
  }

  function jumpTo(step: number): void {
    if (step >= 1 && step <= totalSteps && step <= currentStep.value) {
      currentStep.value = step
      stepError.value = ""
    }
  }

  function scrollToTop(): void {
    if (typeof window === "undefined") return
    if (typeof window.matchMedia === "function" && window.matchMedia("(min-width: 961px)").matches) return
    const wizard = typeof document !== "undefined" ? document.querySelector(".gf-setup-card") : null
    if (wizard) wizard.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function buildPayload() {
    const phoneFull = state.contactCountry.dial + state.contactPhone.replace(/[\s\-()]/g, "")
    const e164 = parsePhoneNumberFromString(phoneFull, state.contactCountry.iso as never)?.format("E.164") ?? phoneFull

    return {
      step1: {
        value: state.applicantType,
        label: optionLabel("applicantType", state.applicantType),
        other_text: state.applicantType === 4 ? state.applicantTypeOther.trim() || null : null,
      },
      step2: { value: state.mainGoal, label: optionLabel("mainGoal", state.mainGoal) },
      step3: { value: state.licenseType, label: optionLabel("licenseType", state.licenseType) },
      step4: {
        category: state.businessActivity,
        category_label: optionLabel("businessActivity", state.businessActivity),
        description: state.activityDescription.trim(),
      },
      step5: { value: state.companyStructure, label: optionLabel("companyStructure", state.companyStructure) },
      step6: { value: state.wantsResidency, label: optionLabel("wantsResidency", state.wantsResidency) },
      step7: { value: state.bankAccount, label: optionLabel("bankAccount", state.bankAccount) },
      step8: { value: state.currentlyInUae, label: optionLabel("currentlyInUae", state.currentlyInUae) },
      step9: { value: state.launchTimeline, label: optionLabel("launchTimeline", state.launchTimeline) },
      contact: {
        name: state.contactName.trim(),
        email: state.contactEmail.trim().toLowerCase(),
        country_iso: state.contactCountry.iso,
        country_code: state.contactCountry.dial,
        phone_raw: state.contactPhone.trim(),
        phone_e164: e164,
      },
      notes: state.notes.trim(),
      meta: {
        submitted_at: new Date().toISOString(),
        source_url: typeof window !== "undefined" ? window.location.href : "",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        ...readUtm(),
      },
    }
  }

  /**
   * Look up an option's canonical label by its question id and value.
   * Walks every step's questions array because a radio question can live
   * in any step now.
   */
  function optionLabel(questionId: string, value: number | null): string | null {
    if (value === null) return null
    for (const step of STEPS) {
      for (const q of step.questions) {
        if (q.id === questionId && (q.kind === "radio-cards" || q.kind === "radio-cards-scroll" || q.kind === "compact-buttons")) {
          return (q as RadioQuestion).options.find((o) => o.value === value)?.label ?? null
        }
      }
    }
    return null
  }

  async function submit(honeypot: string): Promise<void> {
    if (!validateCurrentStep()) return
    if (honeypot) return
    if (isSubmitting.value) return

    isSubmitting.value = true
    submitError.value = ""

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      })
      const data = (await res.json()) as { success: boolean; lead_id?: string; error?: string; message?: string }
      if (res.ok && data.success && data.lead_id) {
        successLeadId.value = data.lead_id
        track("setup_form_submitted", { lead_id: data.lead_id })
        clearDraft()
      } else {
        // Some upstream middlewares (domainMiddleware) return `message` instead
        // of `error` — fall through both before the generic catch-all.
        submitError.value = data.error || data.message || "Something went wrong. Please try again or email us directly."
        track("setup_form_failed", { reason: submitError.value })
      }
    } catch (err) {
      submitError.value = "Network error. Please check your connection and try again."
      track("setup_form_failed", { reason: "network" })
    } finally {
      isSubmitting.value = false
    }
  }

  function reset(): void {
    Object.assign(state, emptyState())
    currentStep.value = 1
    stepError.value = ""
    submitError.value = ""
    successLeadId.value = ""
    clearDraft()
  }

  return {
    state,
    currentStep,
    totalSteps,
    progressPct,
    currentStepConfig,
    stepError,
    isSubmitting,
    submitError,
    successLeadId,
    next,
    back,
    jumpTo,
    submit,
    reset,
  }
}

function hasAnyInput(s: SetupState): boolean {
  return (
    s.applicantType !== null ||
    s.applicantTypeOther.length > 0 ||
    s.mainGoal !== null ||
    s.licenseType !== null ||
    s.businessActivity !== null ||
    s.activityDescription.length > 0 ||
    s.companyStructure !== null ||
    s.wantsResidency !== null ||
    s.bankAccount !== null ||
    s.currentlyInUae !== null ||
    s.launchTimeline !== null ||
    s.contactName.length > 0 ||
    s.contactEmail.length > 0 ||
    s.contactPhone.length > 0 ||
    s.notes.length > 0
  )
}
