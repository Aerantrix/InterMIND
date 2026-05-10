<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    maxlength?: number
    rows?: number
    showCounter?: boolean
  }>(),
  {
    rows: 4,
    showCounter: true,
  },
)

defineEmits<{
  (e: "update:modelValue", v: string): void
}>()

const charsLeft = computed(() => (props.maxlength ? props.maxlength - props.modelValue.length : null))
</script>

<template>
  <label class="gf-setup-field">
    <span v-if="label" class="gf-setup-field-label">{{ label }}</span>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :rows="rows"
      class="gf-setup-input gf-setup-textarea"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
    <span v-if="showCounter && maxlength" class="gf-setup-field-counter">{{ charsLeft }} characters left</span>
  </label>
</template>
