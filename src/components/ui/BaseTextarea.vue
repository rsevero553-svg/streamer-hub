<script setup lang="ts">
defineProps<{ modelValue: string; label?: string; rows?: number; placeholder?: string }>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>
<template>
  <label class="field">
    <span v-if="label" class="field__label">{{ label }}</span>
    <textarea
      class="field__input"
      :rows="rows || 4"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </label>
</template>
<style scoped>
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field__label { font-size: var(--fs-sm); color: var(--color-text-muted); font-weight: 600; }
.field__input {
  background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4); color: var(--color-text); font-size: var(--fs-base); resize: vertical;
  font-family: inherit;
}
</style>
