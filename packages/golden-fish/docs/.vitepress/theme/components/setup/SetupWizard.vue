<script setup lang="ts">
import { computed, ref } from "vue"
import { useSetupForm } from "./useSetupForm"
import { STEPS } from "./setupSchema"
import SetupRadioCard from "./SetupRadioCard.vue"
import SetupTextField from "./SetupTextField.vue"
import SetupTextarea from "./SetupTextarea.vue"
import SetupCountryPicker from "./SetupCountryPicker.vue"

const props = withDefaults(
  defineProps<{
    whatsappNumber?: string
  }>(),
  {
    whatsappNumber: "971500000000",
  },
)

const { state, currentStep, totalSteps, currentStepConfig, stepError, isSubmitting, submitError, successLeadId, next, back, submit } = useSetupForm()

const honeypot = ref("")

const step1Config = STEPS[0].kind === "radio-with-other" ? STEPS[0] : null
const step4Config = STEPS[3].kind === "category" ? STEPS[3] : null
const step10Config = STEPS[9].kind === "contact" ? STEPS[9] : null
const step11Config = STEPS[10].kind === "notes" ? STEPS[10] : null

const showOtherInput = computed(() => step1Config !== null && state.applicantType === step1Config.otherValue)

const isLastStep = computed(() => currentStep.value === totalSteps)

const progressPct = computed(() => Math.round((currentStep.value / totalSteps) * 100))

const successWhatsappLink = computed(() => {
  const text = encodeURIComponent(`Hi, I just submitted application #${successLeadId.value}`)
  return `https://wa.me/${props.whatsappNumber}?text=${text}`
})

function handleSubmit(): void {
  submit(honeypot.value)
}

// Strongly-typed accessor for radio-step current value (steps 2,3,5,6,7,8,9)
const radioStepValue = computed<number | null>(() => {
  const cfg = currentStepConfig.value
  if (cfg.kind !== "radio") return null
  return state[cfg.id as keyof typeof state] as number | null
})

function setRadioStepValue(v: number): void {
  const cfg = currentStepConfig.value
  if (cfg.kind !== "radio") return
  ;(state[cfg.id as keyof typeof state] as unknown as number) = v
}
</script>

<template>
  <div v-if="successLeadId" class="gf-setup-success">
    <div class="gf-setup-success-icon" aria-hidden="true">✓</div>
    <h2 class="gf-setup-success-title">Application received</h2>
    <p class="gf-setup-success-sub">
      Thanks, {{ state.contactName.split(" ")[0] || "there" }}. Your reference is
      <strong>#{{ successLeadId }}</strong
      >. A dedicated manager will reach out within 24 hours with a tailored proposal.
    </p>

    <div class="gf-setup-success-actions">
      <a class="gf-btn gf-btn-gold" :href="successWhatsappLink" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
      <a class="gf-btn gf-btn-outline" href="/">Back to home</a>
    </div>

    <p class="gf-setup-success-trust">No spam. Real specialists, transparent pricing.</p>
  </div>

  <form v-else class="gf-setup-card" novalidate @submit.prevent="handleSubmit">
    <input v-model="honeypot" type="text" name="website" tabindex="-1" autocomplete="off" class="gf-setup-honeypot" aria-hidden="true" />

    <header class="gf-setup-header">
      <div class="gf-setup-progress">
        <div class="gf-setup-progress-bar" :style="{ width: progressPct + '%' }"></div>
      </div>
      <div class="gf-setup-meta">
        <span class="gf-setup-eyebrow">{{ currentStepConfig.eyebrow }}</span>
        <span class="gf-setup-step-counter">{{ currentStep }} / {{ totalSteps }}</span>
      </div>
    </header>

    <div class="gf-setup-body">
      <h2 class="gf-setup-title">{{ currentStepConfig.title }}</h2>
      <p v-if="currentStepConfig.subtitle" class="gf-setup-subtitle">{{ currentStepConfig.subtitle }}</p>

      <!-- Step 1 — applicant type with optional "other" text -->
      <template v-if="currentStepConfig.kind === 'radio-with-other' && step1Config">
        <div class="gf-setup-options">
          <SetupRadioCard
            v-for="opt in step1Config.options"
            :key="opt.value"
            :value="opt.value"
            :model-value="state.applicantType"
            :label="opt.label"
            :description="opt.description"
            name="applicantType"
            @update:model-value="state.applicantType = $event"
          />
        </div>
        <div v-if="showOtherInput" class="gf-setup-other">
          <SetupTextField
            v-model="state.applicantTypeOther"
            :label="step1Config.otherLabel"
            :placeholder="step1Config.otherPlaceholder"
            :maxlength="step1Config.otherMaxLength"
          />
        </div>
      </template>

      <!-- Steps 2 / 3 / 5 / 6 / 7 / 8 / 9 — plain radio -->
      <template v-else-if="currentStepConfig.kind === 'radio'">
        <div class="gf-setup-options">
          <SetupRadioCard
            v-for="opt in currentStepConfig.options"
            :key="opt.value"
            :value="opt.value"
            :model-value="radioStepValue"
            :label="opt.label"
            :description="opt.description"
            :name="currentStepConfig.id"
            @update:model-value="setRadioStepValue($event)"
          />
        </div>
      </template>

      <!-- Step 4 — business category; description only when "Other" is picked -->
      <template v-else-if="currentStepConfig.kind === 'category' && step4Config">
        <div class="gf-setup-options gf-setup-options-scroll">
          <SetupRadioCard
            v-for="opt in step4Config.options"
            :key="opt.value"
            :value="opt.value"
            :model-value="state.businessActivity"
            :label="opt.label"
            :description="opt.description"
            name="businessActivity"
            @update:model-value="state.businessActivity = $event"
          />
        </div>
        <div v-if="state.businessActivity === step4Config.otherValue" class="gf-setup-other">
          <SetupTextarea
            v-model="state.activityDescription"
            :label="step4Config.descriptionLabel"
            :placeholder="step4Config.descriptionPlaceholder"
            :maxlength="step4Config.descriptionMaxLength"
            :rows="3"
          />
        </div>
      </template>

      <!-- Step 10 — contact -->
      <template v-else-if="currentStepConfig.kind === 'contact' && step10Config">
        <div class="gf-setup-contact">
          <SetupTextField
            v-model="state.contactName"
            :label="step10Config.nameLabel"
            :placeholder="step10Config.namePlaceholder"
            autocomplete="name"
            :maxlength="120"
          />
          <SetupTextField
            v-model="state.contactEmail"
            :label="step10Config.emailLabel"
            :placeholder="step10Config.emailPlaceholder"
            type="email"
            inputmode="email"
            autocomplete="email"
            :maxlength="160"
          />
          <div class="gf-setup-phone-row">
            <div class="gf-setup-phone-country">
              <span class="gf-setup-field-label">Country</span>
              <SetupCountryPicker v-model="state.contactCountry" />
            </div>
            <div class="gf-setup-phone-number">
              <SetupTextField
                v-model="state.contactPhone"
                :label="step10Config.phoneLabel"
                :placeholder="state.contactCountry.example"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                :maxlength="20"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Step 11 — notes -->
      <template v-else-if="currentStepConfig.kind === 'notes' && step11Config">
        <SetupTextarea v-model="state.notes" :placeholder="step11Config.placeholder" :maxlength="step11Config.maxLength" :rows="6" />
      </template>

      <p v-if="stepError" class="gf-setup-error" role="alert">{{ stepError }}</p>
      <p v-if="submitError && isLastStep" class="gf-setup-error" role="alert">{{ submitError }}</p>
    </div>

    <footer class="gf-setup-footer">
      <button v-if="currentStep > 1" type="button" class="gf-setup-btn gf-setup-btn-back" @click="back()" :disabled="isSubmitting">← Back</button>
      <span v-else></span>

      <button v-if="!isLastStep" type="button" class="gf-setup-btn gf-setup-btn-next" @click="next()">Continue →</button>
      <button v-else type="submit" class="gf-setup-btn gf-setup-btn-submit" :disabled="isSubmitting">
        <span v-if="!isSubmitting">Get my proposal →</span>
        <span v-else class="gf-setup-spinner-row">
          <span class="gf-setup-spinner" aria-hidden="true"></span>
          Sending…
        </span>
      </button>
    </footer>
  </form>
</template>
