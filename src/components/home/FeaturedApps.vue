<script setup lang="ts">
import { useAppsStore } from '@/stores/apps'
import ApplicationGrid from '@/components/apps/ApplicationGrid.vue'

const store = useAppsStore()
</script>

<template>
  <section class="section">
    <div class="container">
      <h2 class="section__title">Aplicaciones destacadas</h2>
      <p class="section__subtitle">Las opciones más consultadas por nuestra comunidad.</p>
      <ApplicationGrid :apps="store.featured" :state="store.state" />
    </div>
  </section>
</template>

<style scoped>
.section { padding: var(--space-9) 0; }
.section__title { font-size: var(--fs-2xl); font-family: var(--font-display); margin-bottom: var(--space-2); }
.section__subtitle { color: var(--color-text-muted); margin-bottom: var(--space-6); }
</style>
