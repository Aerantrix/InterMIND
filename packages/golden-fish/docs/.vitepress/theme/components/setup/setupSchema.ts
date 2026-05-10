/**
 * Single source of truth for the Business Set-Up Onboarding wizard.
 *
 * Architecture:
 *   - 10 steps. Steps 1-9 each ask a single question (one per concept, so the
 *     user isn't asked unrelated things at once). Step 10 is intentionally
 *     merged: contact details + the optional "anything else" note belong
 *     together as "info you give us about yourself."
 *   - Each radio-style question's option `value` (number) and `label` (English)
 *     match what's defined in Pipedrive; the script `pnpm pipedrive:fetch-fields`
 *     validates this at build time. `shortLabel` is a UI-only override for
 *     compact-button rendering — Pipedrive never sees it.
 *   - Backend code reads option `value` only (never label), so translating
 *     labels to other languages doesn't break the Pipedrive mapping.
 */

export interface RadioOption {
  /** Numeric value used in form state and as the bridge to Pipedrive option_id. */
  value: number
  /** Canonical English label — matches the option in Pipedrive. */
  label: string
  /** Optional shorter label for `compact-buttons` rendering; falls back to `label`. */
  shortLabel?: string
  /** Optional description shown below the label in `radio-cards` rendering. */
  description?: string
}

interface BaseQuestion {
  /** State property id and Pipedrive field id (e.g., "applicantType"). */
  id: string
  /** Sub-heading shown above the question's answers (only rendered when the step has >1 questions). */
  label: string
  /** Optional one-liner hint shown under the sub-heading. */
  hint?: string
}

export interface RadioQuestion extends BaseQuestion {
  kind: "radio-cards" | "radio-cards-scroll" | "compact-buttons"
  options: RadioOption[]
  /** When this option `value` is picked, show the extra text input below. */
  otherValue?: number
  otherLabel?: string
  otherPlaceholder?: string
  otherMaxLength?: number
}

export interface ContactQuestion extends BaseQuestion {
  kind: "contact"
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
}

export interface NotesQuestion extends BaseQuestion {
  kind: "notes"
  placeholder: string
  maxLength: number
}

export type Question = RadioQuestion | ContactQuestion | NotesQuestion

export interface Step {
  /** Stable id used in analytics events. */
  id: string
  number: number
  eyebrow: string
  title: string
  subtitle?: string
  questions: Question[]
}

export const STEPS: Step[] = [
  {
    id: "applicantType",
    number: 1,
    eyebrow: "Step 1 of 10",
    title: "Who are you setting up for?",
    subtitle: "We tailor the proposal to your situation.",
    questions: [
      {
        id: "applicantType",
        kind: "radio-cards",
        label: "Applicant type",
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
    ],
  },
  {
    id: "mainGoal",
    number: 2,
    eyebrow: "Step 2 of 10",
    title: "What's your main goal?",
    subtitle: "Pick the closest match — you can adjust details later.",
    questions: [
      {
        id: "mainGoal",
        kind: "radio-cards",
        label: "Main goal",
        options: [
          { value: 0, label: "License setup", description: "Trade licence + corporate registration" },
          { value: 1, label: "UAE residency", description: "Long-term residence permit through company ownership" },
          { value: 2, label: "Bank account", description: "Open a UAE corporate bank account" },
          { value: 3, label: "All-inclusive service (full package)", description: "Licence + residency + bank — handled end-to-end" },
        ],
      },
    ],
  },
  {
    id: "licenseType",
    number: 3,
    eyebrow: "Step 3 of 10",
    title: "What licence type do you have in mind?",
    subtitle: "Free Zone is faster and 100% foreign-owned. Mainland gives full UAE market access.",
    questions: [
      {
        id: "licenseType",
        kind: "radio-cards",
        label: "Licence type",
        options: [
          { value: 0, label: "Free Zone", description: "100% foreign ownership, simpler setup, ~7-14 days" },
          { value: 1, label: "Mainland", description: "Full UAE market access, can bid on government contracts" },
          { value: 2, label: "Need assistance choosing", description: "Walk me through the trade-offs" },
        ],
      },
    ],
  },
  {
    id: "businessActivity",
    number: 4,
    eyebrow: "Step 4 of 10",
    title: "Which best describes your activity?",
    subtitle: "Pick the closest category — if none of them fit, choose Other and tell us what you do.",
    questions: [
      {
        id: "businessActivity",
        kind: "radio-cards-scroll",
        label: "Activity",
        otherValue: 8,
        otherLabel: "Tell us what you do",
        otherPlaceholder: "e.g. AI consultancy, niche fashion brand, specialised manufacturing…",
        otherMaxLength: 500,
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
    ],
  },
  {
    id: "companyStructure",
    number: 5,
    eyebrow: "Step 5 of 10",
    title: "Who's involved in the company?",
    subtitle: "We need this for shareholding documents.",
    questions: [
      {
        id: "companyStructure",
        kind: "radio-cards",
        label: "Company structure",
        options: [
          { value: 0, label: "Just me", description: "Single shareholder, sole director" },
          { value: 1, label: "With a partner", description: "Two co-founders or business partners" },
          { value: 2, label: "Group / Holding structure", description: "Multiple shareholders or corporate parent" },
        ],
      },
    ],
  },
  {
    id: "wantsResidency",
    number: 6,
    eyebrow: "Step 6 of 10",
    title: "Do you want UAE residency?",
    subtitle: "Investor visa comes with most company packages but is optional.",
    questions: [
      {
        id: "wantsResidency",
        kind: "radio-cards",
        label: "UAE residency",
        options: [
          { value: 0, label: "Yes — include in the package", description: "I want a residence visa under the new entity" },
          { value: 1, label: "No, not needed", description: "I already have residency, or I'm not relocating" },
          { value: 2, label: "Maybe later", description: "Quote licence first, residency we'll decide later" },
        ],
      },
    ],
  },
  {
    id: "bankAccount",
    number: 7,
    eyebrow: "Step 7 of 10",
    title: "Do you need a UAE corporate bank account?",
    subtitle: "We work with both local UAE banks and international neobanks.",
    questions: [
      {
        id: "bankAccount",
        kind: "radio-cards",
        label: "Bank account",
        options: [
          { value: 0, label: "Yes — it's essential", description: "Can't operate without it; please prioritise" },
          { value: 1, label: "Already have one", description: "I'll bring an existing UAE bank account to the new entity" },
          { value: 2, label: "Not right now", description: "Get the company set up first; bank later" },
        ],
      },
    ],
  },
  {
    id: "currentlyInUae",
    number: 8,
    eyebrow: "Step 8 of 10",
    title: "Are you currently in the UAE?",
    subtitle: "Affects timing — visa stamping and bank KYC need you here.",
    questions: [
      {
        id: "currentlyInUae",
        kind: "radio-cards",
        label: "Currently in UAE",
        options: [
          { value: 0, label: "Yes, I'm in the UAE", description: "Available for in-person steps this week" },
          { value: 1, label: "Not yet, but I'll arrive soon", description: "I can fly in once we agree the plan" },
          { value: 2, label: "No, fully remote for now", description: "Set up everything that doesn't require my presence" },
        ],
      },
    ],
  },
  {
    id: "launchTimeline",
    number: 9,
    eyebrow: "Step 9 of 10",
    title: "What's your timeline?",
    subtitle: "Be honest — it changes which jurisdictions and packages we recommend.",
    questions: [
      {
        id: "launchTimeline",
        kind: "radio-cards",
        label: "Launch timeline",
        options: [
          { value: 0, label: "Urgent — within 7 days", description: "Need to be operating ASAP" },
          { value: 1, label: "Within a month", description: "Standard pace, 2-4 weeks" },
          { value: 2, label: "1-3 months", description: "Planning ahead, no rush" },
          { value: 3, label: "Just exploring options", description: "Researching the market, no decision yet" },
        ],
      },
    ],
  },
  {
    id: "contact",
    number: 10,
    eyebrow: "Step 10 of 10",
    title: "How can we reach you?",
    subtitle: "We'll come back within 24 hours with a tailored proposal — no spam, no auto-call.",
    questions: [
      {
        id: "contact",
        kind: "contact",
        label: "Your details",
        nameLabel: "Full name",
        namePlaceholder: "Ivan Petrov",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        phoneLabel: "Phone / WhatsApp",
        phonePlaceholder: "50 123 4567",
      },
      {
        id: "notes",
        kind: "notes",
        label: "Anything else we should know? (optional)",
        placeholder: "e.g. need help with bank account and visa simultaneously",
        maxLength: 2000,
      },
    ],
  },
]

export const TOTAL_STEPS = STEPS.length
