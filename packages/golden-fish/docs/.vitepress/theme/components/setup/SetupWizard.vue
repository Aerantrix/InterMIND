<script setup lang="ts">
import { computed, ref } from "vue"
import { useSetupForm, type SetupState } from "./useSetupForm"
import SetupQuestionBlock from "./SetupQuestionBlock.vue"

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

const isLastStep = computed(() => currentStep.value === totalSteps)

const progressPct = computed(() => Math.round((currentStep.value / totalSteps) * 100))

const successWhatsappLink = computed(() => {
  const text = encodeURIComponent(`Hi, I just submitted application #${successLeadId.value}`)
  return `https://wa.me/${props.whatsappNumber}?text=${text}`
})

function patchState(patch: Partial<SetupState>) {
  Object.assign(state, patch)
}

function handleSubmit(): void {
  submit(honeypot.value)
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

      <div class="gf-setup-questions">
        <SetupQuestionBlock
          v-for="q in currentStepConfig.questions"
          :key="q.id"
          :question="q"
          :state="state"
          :show-label="currentStepConfig.questions.length > 1"
          @update:state="patchState($event)"
        />
      </div>

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
