<script setup lang="ts">
import type { AppEntity } from '@/types/application'
import ApplicationCard from './ApplicationCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import type { LoadState } from '@/types/misc'

defineProps<{ apps: AppEntity[]; state: LoadState; basePath?: string }>()
</script>

<template>
  <BaseSpinner v-if="state === 'loading'" />
  <EmptyState v-else-if="!apps.length" message="No hay aplicaciones disponibles actualmente." />
  <div v-else class="app-grid">
    <ApplicationCard v-for="app in apps" :key="app.id" :app="app" :base-path="basePath" class="animate-fade-up" />
  </div>
</template>

<style scoped>
.app-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-5); }
@media (max-width: 480px) { .app-grid { grid-template-columns: 1fr 1fr; gap: var(--space-3); } }
</style>
