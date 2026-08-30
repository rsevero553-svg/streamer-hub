<script setup lang="ts">
withDefaults(defineProps<{ modelValue: string | null | undefined; label?: string; options: { value: string; label: string }[] }>(), { modelValue: '' })
defineEmits<{ 'update:modelValue': [string] }>()
</script>
<template>
  <label class="field">
    <span v-if="label" class="field__label">{{ label }}</span>
    <select class="field__input" :value="modelValue ?? ''" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </label>
</template>
<style scoped>
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field__label { font-size: var(--fs-sm); color: var(--color-text-muted); font-weight: 600; }
.field__input {
  background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4); color: var(--color-text); font-size: var(--fs-base);
}
</style>
