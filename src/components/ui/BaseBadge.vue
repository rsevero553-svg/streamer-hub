<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'accent' | 'success' | 'warning' | 'danger' | 'neutral' }>(), { tone: 'neutral' })
</script>
<template>
  <span class="badge" :class="`badge--${tone}`"><slot /></span>
</template>
<style scoped>
.badge {
  display: inline-flex; align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--fs-xs); font-weight: 700; letter-spacing: 0.02em;
}
.badge--neutral { background: var(--color-surface-strong); color: var(--color-text-muted); }
.badge--accent { background: rgba(217,46,158,0.18); color: var(--color-pink-300); }
.badge--success { background: rgba(51,209,122,0.18); color: var(--color-success); }
.badge--warning { background: rgba(242,183,5,0.18); color: var(--color-warning); }
.badge--danger { background: rgba(239,68,99,0.18); color: var(--color-danger); }
</style>
