<script setup lang="ts">
import { useMeta } from '@/composables/useMeta'
useMeta('Apps para hombres', 'Explora aplicaciones disponibles para hombres, con guías y orientación completa.')
import { onMounted } from 'vue'
import { useAppsStore } from '@/stores/apps'
import ApplicationGrid from '@/components/apps/ApplicationGrid.vue'

const store = useAppsStore()
onMounted(() => { if (!store.men.length) store.loadAll() })
</script>
<template>
  <section class="page">
    <div class="container">
      <h1 class="page__title">Aplicaciones para hombres</h1>
      <p class="page__subtitle">Descubre las opciones disponibles y cómo funcionan.</p>
      <ApplicationGrid :apps="store.men" :state="store.state" />
    </div>
  </section>
</template>
<style scoped>
.page { padding: var(--space-8) 0 var(--space-9); }
.page__title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-2); }
.page__subtitle { color: var(--color-text-muted); margin-bottom: var(--space-6); }
</style>
