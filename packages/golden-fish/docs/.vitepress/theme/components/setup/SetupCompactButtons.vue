<script setup lang="ts">
import type { RadioOption } from "./setupSchema"

defineProps<{
  options: RadioOption[]
  modelValue: number | null
  name: string
}>()

defineEmits<{
  (e: "update:modelValue", v: number): void
}>()
</script>

<template>
  <div class="gf-setup-buttons-row" role="radiogroup">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="radio"
      :aria-checked="modelValue === opt.value"
      class="gf-setup-button-chip"
      :class="{ 'is-selected': modelValue === opt.value }"
      :name="name"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.shortLabel || opt.label }}
    </button>
  </div>
</template>
