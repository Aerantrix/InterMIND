<script setup lang="ts">
/**
 * Renders one sub-question of a step: small section header, the appropriate
 * input control (radio cards / scrollable cards / compact buttons / contact
 * fields / notes textarea), and any conditional "Other" follow-up.
 *
 * Talks to the form state through individual v-model bindings rather than a
 * generic state-bag prop — keeps types narrow and avoids the temptation to
 * spread state widely.
 */

import { computed } from "vue"
import type { Question, RadioQuestion } from "./setupSchema"
import type { SetupState } from "./useSetupForm"
import type { Country } from "./countries"
import SetupRadioCard from "./SetupRadioCard.vue"
import SetupCompactButtons from "./SetupCompactButtons.vue"
import SetupTextField from "./SetupTextField.vue"
import SetupTextarea from "./SetupTextarea.vue"
import SetupCountryPicker from "./SetupCountryPicker.vue"

const props = defineProps<{
  question: Question
  state: SetupState
  /** Whether to render the small uppercase sub-heading above this question.
   *  Hidden on single-question steps where the step title already names what's
   *  being asked — showing both reads as redundant noise. */
  showLabel: boolean
}>()

const emit = defineEmits<{
  (e: "update:state", patch: Partial<SetupState>): void
}>()

function setRadioValue(id: string, v: number) {
  emit("update:state", { [id]: v } as Partial<SetupState>)
}

function setText(id: keyof SetupState, v: string) {
  emit("update:state", { [id]: v } as Partial<SetupState>)
}

function setCountry(c: Country) {
  emit("update:state", { contactCountry: c })
}

const radioValue = computed<number | null>(() => {
  if (props.question.kind === "radio-cards" || props.question.kind === "radio-cards-scroll" || props.question.kind === "compact-buttons") {
    return props.state[props.question.id as keyof SetupState] as number | null
  }
  return null
})

const otherTextKey = computed<keyof SetupState | null>(() => {
  if (props.question.id === "applicantType") return "applicantTypeOther"
  if (props.question.id === "businessActivity") return "activityDescription"
  return null
})

const showOtherInput = computed(() => {
  const q = props.question as RadioQuestion
  return q.otherValue !== undefined && radioValue.value === q.otherValue
})
</script>

<template>
  <section class="gf-setup-question">
    <h3 v-if="showLabel" class="gf-setup-question-label">{{ question.label }}</h3>
    <p v-if="question.hint" class="gf-setup-question-hint">{{ question.hint }}</p>

    <!-- Radio cards (default vertical with descriptions) -->
    <template v-if="question.kind === 'radio-cards'">
      <div class="gf-setup-options">
        <SetupRadioCard
          v-for="opt in question.options"
          :key="opt.value"
          :value="opt.value"
          :model-value="radioValue"
          :label="opt.label"
          :description="opt.description"
          :name="question.id"
          @update:model-value="setRadioValue(question.id, $event)"
        />
      </div>
      <div v-if="showOtherInput && otherTextKey" class="gf-setup-other">
        <SetupTextField
          :model-value="state[otherTextKey] as string"
          :label="(question as RadioQuestion).otherLabel || 'Tell us more'"
          :placeholder="(question as RadioQuestion).otherPlaceholder"
          :maxlength="(question as RadioQuestion).otherMaxLength"
          @update:model-value="setText(otherTextKey, $event)"
        />
      </div>
    </template>

    <!-- Scrollable radio cards (for long lists like business activity) -->
    <template v-else-if="question.kind === 'radio-cards-scroll'">
      <div class="gf-setup-options gf-setup-options-scroll">
        <SetupRadioCard
          v-for="opt in question.options"
          :key="opt.value"
          :value="opt.value"
          :model-value="radioValue"
          :label="opt.label"
          :description="opt.description"
          :name="question.id"
          @update:model-value="setRadioValue(question.id, $event)"
        />
      </div>
      <div v-if="showOtherInput && otherTextKey" class="gf-setup-other">
        <SetupTextarea
          :model-value="state[otherTextKey] as string"
          :label="(question as RadioQuestion).otherLabel || 'Tell us more'"
          :placeholder="(question as RadioQuestion).otherPlaceholder"
          :maxlength="(question as RadioQuestion).otherMaxLength"
          :rows="2"
          @update:model-value="setText(otherTextKey, $event)"
        />
      </div>
    </template>

    <!-- Compact button row (for short Yes/No-style answers) -->
    <template v-else-if="question.kind === 'compact-buttons'">
      <SetupCompactButtons
        :options="question.options"
        :model-value="radioValue"
        :name="question.id"
        @update:model-value="setRadioValue(question.id, $event)"
      />
    </template>

    <!-- Contact: name, email, country+phone -->
    <template v-else-if="question.kind === 'contact'">
      <div class="gf-setup-contact">
        <SetupTextField
          :model-value="state.contactName"
          :label="question.nameLabel"
          :placeholder="question.namePlaceholder"
          autocomplete="name"
          :maxlength="120"
          @update:model-value="setText('contactName', $event)"
        />
        <SetupTextField
          :model-value="state.contactEmail"
          :label="question.emailLabel"
          :placeholder="question.emailPlaceholder"
          type="email"
          inputmode="email"
          autocomplete="email"
          :maxlength="160"
          @update:model-value="setText('contactEmail', $event)"
        />
        <div class="gf-setup-phone-row">
          <div class="gf-setup-phone-country">
            <span class="gf-setup-field-label">Country</span>
            <SetupCountryPicker :model-value="state.contactCountry" @update:model-value="setCountry($event)" />
          </div>
          <div class="gf-setup-phone-number">
            <SetupTextField
              :model-value="state.contactPhone"
              :label="question.phoneLabel"
              :placeholder="state.contactCountry.example"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              :maxlength="20"
              @update:model-value="setText('contactPhone', $event)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Notes: optional textarea -->
    <template v-else-if="question.kind === 'notes'">
      <SetupTextarea
        :model-value="state.notes"
        :placeholder="question.placeholder"
        :maxlength="question.maxLength"
        :rows="4"
        @update:model-value="setText('notes', $event)"
      />
    </template>
  </section>
</template>
