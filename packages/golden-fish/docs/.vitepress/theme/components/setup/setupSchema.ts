/**
 * Single source of truth for the Business Set-Up Onboarding wizard.
 * Field IDs and option `value` numbers match the Pipedrive integration spec
 * (pipedrive_integration_spec.md §2.2 / §3.3) — keep them in sync when the
 * spec changes; the backend mapping reads these same values.
 */

export interface RadioOption {
  value: number
  label: string
  description?: string
}

interface BaseStep {
  id: string
  number: number
  eyebrow: string
  title: string
  subtitle?: string
}

export interface RadioStep extends BaseStep {
  kind: "radio"
  options: RadioOption[]
}

export interface RadioWithOtherStep extends BaseStep {
  kind: "radio-with-other"
  options: RadioOption[]
  otherValue: number
  otherLabel: string
  otherPlaceholder: string
  otherMaxLength: number
}

export interface CategoryStep extends BaseStep {
  kind: "category"
  options: RadioOption[]
  /** When this option is selected, the description textarea is shown and required. */
  otherValue: number
  descriptionLabel: string
  descriptionPlaceholder: string
  descriptionMaxLength: number
}

export interface ContactStep extends BaseStep {
  kind: "contact"
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
}

export interface NotesStep extends BaseStep {
  kind: "notes"
  placeholder: string
  maxLength: number
}

export type Step = RadioStep | RadioWithOtherStep | CategoryStep | ContactStep | NotesStep

export const STEPS: Step[] = [
  {
    id: "applicantType",
    number: 1,
    kind: "radio-with-other",
    eyebrow: "Step 1 of 11",
    title: "Who are you setting up for?",
    subtitle: "We tailor the proposal to your situation.",
    otherValue: 4,
    otherLabel: "Tell us a bit more",
    otherPlaceholder: "Briefly describe your case",
    otherMaxLength: 200,
    options: [
      { value: 0, label: "Individual entrepreneur / freelancer", description: "Solo professional, contractor, or independent operator" },
      { value: 1, label: "Consultant", description: "Advisory, recruitment, or professional services" },
      { value: 2, label: "Startup", description: "Early-stage company, may need investor-friendly structure" },
      { value: 3, label: "Residency only", description: "I just need a UAE residence permit, not a trading licence" },
      { value: 4, label: "Other", description: "None of the above — describe your case below" },
    ],
  },
  {
    id: "mainGoal",
    number: 2,
    kind: "radio",
    eyebrow: "Step 2 of 11",
    title: "What's your main goal?",
    subtitle: "Pick the closest match — you can adjust details later.",
    options: [
      { value: 0, label: "License setup", description: "Trade licence + corporate registration" },
      { value: 1, label: "UAE residency", description: "Long-term residence permit through company ownership" },
      { value: 2, label: "Bank account", description: "Open a UAE corporate bank account" },
      { value: 3, label: "All-inclusive service (full package)", description: "Licence + residency + bank — handled end-to-end" },
    ],
  },
  {
    id: "licenseType",
    number: 3,
    kind: "radio",
    eyebrow: "Step 3 of 11",
    title: "What licence type do you have in mind?",
    subtitle: "Free Zone is faster and 100% foreign-owned. Mainland gives full UAE market access.",
    options: [
      { value: 0, label: "Free Zone", description: "100% foreign ownership, simpler setup, ~7-14 days" },
      { value: 1, label: "Mainland", description: "Full UAE market access, can bid on government contracts" },
      { value: 2, label: "Need assistance choosing", description: "Walk me through the trade-offs" },
    ],
  },
  {
    id: "businessCategory",
    number: 4,
    kind: "category",
    eyebrow: "Step 4 of 11",
    title: "Which best describes your activity?",
    subtitle: "Pick the closest category — if none of them fit, choose Other and tell us what you do.",
    otherValue: 8,
    descriptionLabel: "Tell us what you do",
    descriptionPlaceholder: "e.g. AI consultancy, niche fashion brand, specialised manufacturing…",
    descriptionMaxLength: 500,
    options: [
      { value: 0, label: "Consulting & Professional Services", description: "Consulting, recruitment, business accelerator" },
      { value: 1, label: "Technology & IT", description: "Software, telecom, communications" },
      { value: 2, label: "E-Commerce & Retail", description: "Online stores, retail, apparel, electronics" },
      { value: 3, label: "Trading & Import / Export", description: "Shipping, machinery, chemicals, manufacturing" },
      { value: 4, label: "Food & Hospitality", description: "Food & beverage, hospitality, recreation" },
      { value: 5, label: "Construction & Real Estate", description: "Construction, engineering, environmental" },
      { value: 6, label: "Healthcare & Wellness", description: "Medical, dental, fitness, mental wellness" },
      { value: 7, label: "Media & Marketing", description: "Marketing, PR, content, production" },
      { value: 8, label: "Other / Not sure", description: "None of the above — describe your case below" },
    ],
  },
  {
    id: "partnerStructure",
    number: 5,
    kind: "radio",
    eyebrow: "Step 5 of 11",
    title: "Who's involved in the company?",
    subtitle: "We need this for shareholding documents.",
    options: [
      { value: 0, label: "Just me", description: "Single shareholder, sole director" },
      { value: 1, label: "With a partner", description: "Two co-founders or business partners" },
      { value: 2, label: "Group / Holding structure", description: "Multiple shareholders or corporate parent" },
    ],
  },
  {
    id: "wantsResidency",
    number: 6,
    kind: "radio",
    eyebrow: "Step 6 of 11",
    title: "Do you want UAE residency?",
    subtitle: "Investor visa comes with most company packages but is optional.",
    options: [
      { value: 0, label: "Yes — include in the package", description: "I want a residence visa under the new entity" },
      { value: 1, label: "No, not needed", description: "I already have residency, or I'm not relocating" },
      { value: 2, label: "Maybe later", description: "Quote licence first, residency we'll decide later" },
    ],
  },
  {
    id: "bankAccount",
    number: 7,
    kind: "radio",
    eyebrow: "Step 7 of 11",
    title: "Do you need a UAE corporate bank account?",
    subtitle: "We work with both local UAE banks and international neobanks.",
    options: [
      { value: 0, label: "Yes — it's essential", description: "Can't operate without it; please prioritise" },
      { value: 1, label: "Already have one", description: "I'll bring an existing UAE bank account to the new entity" },
      { value: 2, label: "Not right now", description: "Get the company set up first; bank later" },
    ],
  },
  {
    id: "currentlyInUae",
    number: 8,
    kind: "radio",
    eyebrow: "Step 8 of 11",
    title: "Are you currently in the UAE?",
    subtitle: "Affects timing — visa stamping and bank KYC need you here.",
    options: [
      { value: 0, label: "Yes, I'm in the UAE", description: "Available for in-person steps this week" },
      { value: 1, label: "Not yet, but I'll arrive soon", description: "I can fly in once we agree the plan" },
      { value: 2, label: "No, fully remote for now", description: "Set up everything that doesn't require my presence" },
    ],
  },
  {
    id: "launchTimeline",
    number: 9,
    kind: "radio",
    eyebrow: "Step 9 of 11",
    title: "What's your timeline?",
    subtitle: "Be honest — it changes which jurisdictions and packages we recommend.",
    options: [
      { value: 0, label: "Urgent — within 7 days", description: "Need to be operating ASAP" },
      { value: 1, label: "Within a month", description: "Standard pace, 2-4 weeks" },
      { value: 2, label: "1-3 months", description: "Planning ahead, no rush" },
      { value: 3, label: "Just exploring options", description: "Researching the market, no decision yet" },
    ],
  },
  {
    id: "contact",
    number: 10,
    kind: "contact",
    eyebrow: "Step 10 of 11",
    title: "How should we reach you?",
    subtitle: "We'll come back within 24 hours with a tailored proposal — no spam, no auto-call.",
    nameLabel: "Full name",
    namePlaceholder: "Ivan Petrov",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    phoneLabel: "Phone / WhatsApp",
    phonePlaceholder: "50 123 4567",
  },
  {
    id: "notes",
    number: 11,
    kind: "notes",
    eyebrow: "Step 11 of 11",
    title: "Anything else we should know?",
    subtitle: "Optional — share any constraints or context that would shape the proposal.",
    placeholder: "e.g. need help with bank account and visa simultaneously",
    maxLength: 2000,
  },
]

export const TOTAL_STEPS = STEPS.length
