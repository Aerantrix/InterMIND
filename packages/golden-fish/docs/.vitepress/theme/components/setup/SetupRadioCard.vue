<script setup lang="ts">
defineProps<{
  value: number
  modelValue: number | null
  label: string
  description?: string
  name: string
}>()

defineEmits<{
  (e: "update:modelValue", v: number): void
}>()
</script>

<template>
  <label class="gf-setup-radio" :class="{ 'is-selected': modelValue === value }">
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      class="gf-setup-radio-input"
      @change="$emit('update:modelValue', value)"
    />
    <span class="gf-setup-radio-mark" aria-hidden="true">
      <span class="gf-setup-radio-dot"></span>
    </span>
    <span class="gf-setup-radio-body">
      <span class="gf-setup-radio-label">{{ label }}</span>
      <span v-if="description" class="gf-setup-radio-desc">{{ description }}</span>
    </span>
  </label>
</template>
