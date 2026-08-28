<script setup lang="ts">
defineProps<{ modelValue: string; label?: string; type?: string; placeholder?: string; required?: boolean; error?: string }>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>
<template>
  <label class="field">
    <span v-if="label" class="field__label">{{ label }}<span v-if="required" class="field__req">*</span></span>
    <input
      class="field__input"
      :type="type || 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="field__error">{{ error }}</span>
  </label>
</template>
<style scoped>
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field__label { font-size: var(--fs-sm); color: var(--color-text-muted); font-weight: 600; }
.field__req { color: var(--color-pink-400); margin-left: 2px; }
.field__input {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text);
  font-size: var(--fs-base);
  transition: border-color var(--dur-fast), box-shadow var(--dur-fast);
}
.field__input:focus { outline: none; border-color: var(--color-pink-500); box-shadow: 0 0 0 3px rgba(217,46,158,0.2); }
.field__error { color: var(--color-danger); font-size: var(--fs-xs); }
</style>
