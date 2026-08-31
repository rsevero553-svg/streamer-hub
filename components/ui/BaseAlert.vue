<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'info' | 'success' | 'warning' | 'danger' }>(), { tone: 'info' })
</script>
<template>
  <div class="alert" :class="`alert--${tone}`">
    <slot />
  </div>
</template>
<style scoped>
.alert { padding: var(--space-4) var(--space-5); border-radius: var(--radius-md); font-size: var(--fs-sm); line-height: 1.5; }
.alert--info { background: rgba(93,120,209,0.14); color: var(--color-blue-300); border: 1px solid rgba(93,120,209,0.3); }
.alert--success { background: rgba(51,209,122,0.14); color: var(--color-success); border: 1px solid rgba(51,209,122,0.3); }
.alert--warning { background: rgba(242,183,5,0.14); color: var(--color-warning); border: 1px solid rgba(242,183,5,0.3); }
.alert--danger { background: rgba(239,68,99,0.14); color: var(--color-danger); border: 1px solid rgba(239,68,99,0.3); }
</style>
