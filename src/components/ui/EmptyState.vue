<script setup lang="ts">
defineProps<{ message: string }>()
</script>
<template>
  <div class="empty">
    <div class="empty__icon">🌙</div>
    <p>{{ message }}</p>
  </div>
</template>
<style scoped>
.empty { text-align: center; padding: var(--space-9) var(--space-5); color: var(--color-text-faint); }
.empty__icon { font-size: 2.5rem; margin-bottom: var(--space-3); }
</style>
