/**
 * SetupWizard composable: form state, validation per step, draft persistence,
 * UTM collection, and submission to /api/onboarding.
 *
 * Draft schema is versioned via DRAFT_KEY; bump the version suffix when the
 * shape of `state` changes incompatibly so old drafts get discarded instead
 * of crashing the wizard.
 */

import { reactive, computed, watch, ref } from "vue"
import { isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js"
import type { Country } from "./countries"
import { DEFAULT_COUNTRY } from "./countries"
import { STEPS, TOTAL_STEPS } from "./setupSchema"
import { track } from "./track"

const DRAFT_KEY = "gf_setup_draft_v1"
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export interface SetupState {
  applicantType: number | null
  applicantTypeOther: string
  mainGoal: number | null
  licenseType: number | null
  businessCategory: number | null
  activityDescription: string
  partnerStructure: number | null
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
    businessCategory: null,
    activityDescription: "",
    partnerStructure: null,
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

  const progressPct = computed(() => Math.round(((currentStep.value - 1) / totalSteps) * 100))

  const currentStepConfig = computed(() => STEPS[currentStep.value - 1])

  const stepError = ref("")

  function validateCurrentStep(): boolean {
    stepError.value = ""
    const step = currentStepConfig.value
    switch (step.kind) {
      case "radio": {
        const v = state[step.id as keyof SetupState] as number | null
        if (v === null) {
          stepError.value = "Please pick one option to continue."
          return false
        }
        return true
      }
      case "radio-with-other": {
        if (state.applicantType === null) {
          stepError.value = "Please pick one option to continue."
          return false
        }
        if (state.applicantType === step.otherValue && state.applicantTypeOther.trim().length < 2) {
          stepError.value = "Please describe your case briefly (2+ characters)."
          return false
        }
        return true
      }
      case "category": {
        if (state.businessCategory === null) {
          stepError.value = "Please pick one category to continue."
          return false
        }
        if (state.businessCategory === step.otherValue && state.activityDescription.trim().length < 3) {
          stepError.value = "Please briefly describe what you do (3+ characters)."
          return false
        }
        return true
      }
      case "contact": {
        if (state.contactName.trim().length < 2) {
          stepError.value = "Please enter your full name."
          return false
        }
        if (!EMAIL_RE.test(state.contactEmail.trim())) {
          stepError.value = "Please enter a valid email address."
          return false
        }
        const fullPhone = state.contactCountry.dial + state.contactPhone.replace(/[\s\-()]/g, "")
        if (!state.contactPhone.trim() || !isValidPhoneNumber(fullPhone, state.contactCountry.iso as never)) {
          stepError.value = `Please enter a valid ${state.contactCountry.name} number — e.g. ${state.contactCountry.example}`
          return false
        }
        return true
      }
      case "notes":
        return true
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
    // Only on the single-column mobile layout where the form fills the viewport
    // and the new question would otherwise stay below the fold. On desktop the
    // side-by-side layout keeps the whole card in view, so scrolling reads as a
    // jarring jump rather than a helpful nudge. matchMedia is unavailable in
    // jsdom and ancient browsers, so guard the call.
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
        label: STEPS[0].kind === "radio-with-other" ? STEPS[0].options.find((o) => o.value === state.applicantType)?.label ?? null : null,
        other_text: state.applicantType === 4 ? state.applicantTypeOther.trim() || null : null,
      },
      step2: { value: state.mainGoal, label: optionLabel("mainGoal", state.mainGoal) },
      step3: { value: state.licenseType, label: optionLabel("licenseType", state.licenseType) },
      step4: {
        category: state.businessCategory,
        category_label: optionLabel("businessCategory", state.businessCategory),
        description: state.activityDescription.trim(),
      },
      step5: { value: state.partnerStructure, label: optionLabel("partnerStructure", state.partnerStructure) },
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

  function optionLabel(stepId: string, value: number | null): string | null {
    if (value === null) return null
    const step = STEPS.find((s) => s.id === stepId)
    if (!step) return null
    if (step.kind === "radio" || step.kind === "radio-with-other" || step.kind === "category") {
      return step.options.find((o) => o.value === value)?.label ?? null
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
      const data = (await res.json()) as { success: boolean; lead_id?: string; error?: string }
      if (res.ok && data.success && data.lead_id) {
        successLeadId.value = data.lead_id
        track("setup_form_submitted", { lead_id: data.lead_id })
        clearDraft()
      } else {
        submitError.value = data.error || "Something went wrong. Please try again or email us directly."
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
    s.businessCategory !== null ||
    s.activityDescription.length > 0 ||
    s.partnerStructure !== null ||
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
