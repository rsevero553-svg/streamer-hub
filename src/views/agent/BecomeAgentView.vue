<script setup lang="ts">
import { useMeta } from '@/composables/useMeta'
useMeta('Ser agente', 'Conoce los requisitos y beneficios para convertirte en agente dentro de Streamer Hub.')

import { onMounted, ref } from 'vue'
import { fetchPublicSettings } from '@/services/settings.service'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const benefits = ref<string[]>([])
const requirements = ref<string[]>([])

onMounted(async () => {
  try {
    const settings = await fetchPublicSettings()
    benefits.value = (settings.agent_benefits || '').split('\n').filter(Boolean)
    requirements.value = (settings.agent_requirements || '').split('\n').filter(Boolean)
  } catch {
    benefits.value = []
    requirements.value = []
  }
})
</script>

<template>
  <section class="page">
    <div class="container">
      <h1 class="page__title">Quiero ser agente</h1>
      <p class="page__subtitle">
        Un agente es la persona que acompaña, orienta y capacita a nuevos usuarios dentro
        de una aplicación, y puede generar beneficios adicionales por su gestión.
      </p>

      <div class="grid">
        <BaseCard>
          <h2>Beneficios</h2>
          <ul class="list">
            <li v-for="b in benefits" :key="b">✦ {{ b }}</li>
          </ul>
        </BaseCard>
        <BaseCard>
          <h2>Requisitos</h2>
          <ul class="list">
            <li v-for="r in requirements" :key="r">✓ {{ r }}</li>
          </ul>
        </BaseCard>
      </div>

      <BaseCard class="cta">
        <h2>¿Listo para comenzar?</h2>
        <p>Contáctanos y te explicamos el proceso completo para convertirte en agente.</p>
        <div class="cta__actions">
          <BaseButton tag="a" href="/contacto">Solicitar información</BaseButton>
          <BaseButton variant="secondary" tag="a" href="/guias">Ver guías</BaseButton>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<style scoped>
.page { padding: var(--space-8) 0 var(--space-9); }
.page__title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-2); }
.page__subtitle { color: var(--color-text-muted); margin-bottom: var(--space-6); max-width: 680px; line-height: 1.6; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); margin-bottom: var(--space-5); }
.list { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-4); color: var(--color-text-muted); }
.cta { text-align: center; background: var(--gradient-brand-soft); }
.cta__actions { display: flex; gap: var(--space-4); justify-content: center; margin-top: var(--space-5); flex-wrap: wrap; }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
</style>
