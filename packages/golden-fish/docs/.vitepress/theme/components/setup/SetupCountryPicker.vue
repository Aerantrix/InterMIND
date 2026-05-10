<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { COUNTRIES, type Country } from "./countries"

const props = defineProps<{
  modelValue: Country
}>()

const emit = defineEmits<{
  (e: "update:modelValue", v: Country): void
}>()

const isOpen = ref(false)
const query = ref("")
const inputRef = ref<HTMLInputElement | null>(null)
const rootRef = ref<HTMLDivElement | null>(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return COUNTRIES
  return COUNTRIES.filter((c) => {
    const haystack = `${c.name} ${c.iso} ${c.dial}`.toLowerCase()
    return haystack.includes(q)
  })
})

function open(): void {
  isOpen.value = true
  query.value = ""
  // Focus the search input on next tick so the field is ready when the
  // dropdown opens
  requestAnimationFrame(() => inputRef.value?.focus())
}

function close(): void {
  isOpen.value = false
  query.value = ""
}

function pick(c: Country): void {
  emit("update:modelValue", c)
  close()
}

function handleClickOutside(e: MouseEvent): void {
  if (!rootRef.value) return
  if (!rootRef.value.contains(e.target as Node)) close()
}

function handleEscape(e: KeyboardEvent): void {
  if (e.key === "Escape" && isOpen.value) close()
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside)
  document.addEventListener("keydown", handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside)
  document.removeEventListener("keydown", handleEscape)
})
</script>

<template>
  <div ref="rootRef" class="gf-setup-country">
    <button type="button" class="gf-setup-country-trigger" :aria-expanded="isOpen" @click="isOpen ? close() : open()">
      <span class="gf-setup-country-flag" aria-hidden="true">{{ modelValue.flag }}</span>
      <span class="gf-setup-country-dial">{{ modelValue.dial }}</span>
      <span class="gf-setup-country-caret" aria-hidden="true">▾</span>
    </button>

    <div v-if="isOpen" class="gf-setup-country-pop" role="listbox">
      <input
        ref="inputRef"
        v-model="query"
        type="search"
        inputmode="search"
        autocomplete="off"
        spellcheck="false"
        placeholder="Search country or code"
        class="gf-setup-country-search"
      />
      <ul class="gf-setup-country-list">
        <li v-if="filtered.length === 0" class="gf-setup-country-empty">No matches</li>
        <li
          v-for="c in filtered"
          :key="c.iso"
          class="gf-setup-country-item"
          :class="{ 'is-selected': c.iso === modelValue.iso }"
          role="option"
          :aria-selected="c.iso === modelValue.iso"
          @click="pick(c)"
        >
          <span class="gf-setup-country-flag" aria-hidden="true">{{ c.flag }}</span>
          <span class="gf-setup-country-name">{{ c.name }}</span>
          <span class="gf-setup-country-dial">{{ c.dial }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
