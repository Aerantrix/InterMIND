<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label: string
    placeholder?: string
    type?: string
    autocomplete?: string
    inputmode?: "text" | "email" | "tel" | "search" | "numeric"
    required?: boolean
    maxlength?: number
  }>(),
  {
    type: "text",
    required: true,
  },
)

defineEmits<{
  (e: "update:modelValue", v: string): void
}>()
</script>

<template>
  <label class="gf-setup-field">
    <span class="gf-setup-field-label">{{ label }}</span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :required="required"
      :maxlength="maxlength"
      class="gf-setup-input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>
