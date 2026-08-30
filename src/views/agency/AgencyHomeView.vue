<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAgencyBySlug, fetchAgencyApps } from '@/services/agency.service'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import type { Profile } from '@/types/user'
import type { AppEntity } from '@/types/application'
import ApplicationGrid from '@/components/apps/ApplicationGrid.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useMeta } from '@/composables/useMeta'

const route = useRoute()
const agency = ref<Profile | null>(null)
const women = ref<AppEntity[]>([])
const men = ref<AppEntity[]>([])
const state = ref<'loading' | 'success' | 'empty'>('loading')

useMeta(computed(() => agency.value?.agency_name || 'Agencia'), computed(() => `Conoce las aplicaciones disponibles de ${agency.value?.agency_name || 'esta agencia'}.`))

onMounted(async () => {
  agency.value = await fetchAgencyBySlug(route.params.slug as string)
  if (agency.value) {
    const [w, m] = await Promise.all([
      fetchAgencyApps(agency.value.id, 'women'),
      fetchAgencyApps(agency.value.id, 'men')
    ])
    women.value = w
    men.value = m
    state.value = (w.length + m.length) ? 'success' : 'empty'
  }
})
</script>

<template>
  <div v-if="agency">
    <section class="hero">
      <div class="container">
        <h1>{{ agency.agency_name }}</h1>
        <p>Conoce las aplicaciones disponibles con esta agencia y contacta directamente a su equipo.</p>
        <div class="hero__contacts">
          <BaseButton v-if="agency.moderator_whatsapp" tag="a" :href="buildWhatsAppUrl(agency.moderator_whatsapp, `Hola, vengo desde la página de ${agency.agency_name} y quiero más información.`)" target="_blank">
            WhatsApp
          </BaseButton>
          <BaseButton v-if="agency.moderator_instagram" tag="a" :href="agency.moderator_instagram" target="_blank" variant="secondary">Instagram</BaseButton>
          <BaseButton v-if="agency.moderator_telegram" tag="a" :href="agency.moderator_telegram" target="_blank" variant="secondary">Telegram</BaseButton>
        </div>
      </div>
    </section>

    <section class="section container">
      <h2>Aplicaciones para mujeres</h2>
      <ApplicationGrid :apps="women" :state="state" :base-path="`/agencia/${agency.agency_slug}/apps`" />
    </section>
    <section class="section container">
      <h2>Aplicaciones para hombres</h2>
      <ApplicationGrid :apps="men" :state="state" :base-path="`/agencia/${agency.agency_slug}/apps`" />
    </section>
  </div>
</template>

<style scoped>
.hero { padding: var(--space-8) 0; background: var(--gradient-brand-soft); }
.hero h1 { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-3); }
.hero p { color: var(--color-text-muted); margin-bottom: var(--space-5); max-width: 560px; }
.hero__contacts { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.section { padding: var(--space-7) 0; }
.section h2 { font-size: var(--fs-lg); margin-bottom: var(--space-4); }
</style>
