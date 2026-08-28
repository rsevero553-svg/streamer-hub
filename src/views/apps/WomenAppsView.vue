<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppsStore } from '@/stores/apps'
import ApplicationGrid from '@/components/apps/ApplicationGrid.vue'

const store = useAppsStore()
onMounted(() => { if (!store.women.length) store.loadAll() })
</script>
<template>
  <section class="page">
    <div class="container">
      <h1 class="page__title">Aplicaciones para mujeres</h1>
      <p class="page__subtitle">Mensajería, videollamadas, match y más. Revisa cada ficha antes de comenzar.</p>
      <ApplicationGrid :apps="store.women" :state="store.state" />
    </div>
  </section>
</template>
<style scoped>
.page { padding: var(--space-8) 0 var(--space-9); }
.page__title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-2); }
.page__subtitle { color: var(--color-text-muted); margin-bottom: var(--space-6); }
</style>
