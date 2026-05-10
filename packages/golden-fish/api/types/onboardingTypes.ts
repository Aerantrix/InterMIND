/**
 * Shape of the JSON payload submitted from the SetupWizard form to /api/onboarding.
 * Mirrors the structure built by useSetupForm.buildPayload(); types here are the
 * runtime-validated shape after Zod parsing (so all fields are present).
 */

export interface RadioStepPayload {
  value: number | null
  label: string | null
}

export interface RadioWithOtherPayload extends RadioStepPayload {
  other_text: string | null
}

export interface CategoryStepPayload {
  category: number | null
  category_label: string | null
  description: string
}

export interface ContactPayload {
  name: string
  email: string
  country_iso: string
  country_code: string
  phone_raw: string
  phone_e164: string
}

export interface OnboardingMeta {
  submitted_at: string
  source_url: string
  user_agent: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

export interface OnboardingPayload {
  step1: RadioWithOtherPayload
  step2: RadioStepPayload
  step3: RadioStepPayload
  step4: CategoryStepPayload
  step5: RadioStepPayload
  step6: RadioStepPayload
  step7: RadioStepPayload
  step8: RadioStepPayload
  step9: RadioStepPayload
  contact: ContactPayload
  notes: string
  meta: OnboardingMeta
}
