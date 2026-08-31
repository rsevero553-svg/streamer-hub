<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAgencyBySlug } from '@/services/agency.service'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import type { Profile } from '@/types/user'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const agency = ref<Profile | null>(null)

onMounted(async () => {
  agency.value = await fetchAgencyBySlug(route.params.slug as string)
})
</script>

<template>
  <section class="page container" v-if="agency">
    <h1>Quiero ser agente con {{ agency.agency_name }}</h1>
    <p class="subtitle">
      Únete al equipo de {{ agency.agency_name }} y recibe acompañamiento directo de su parte.
    </p>
    <BaseCard class="cta">
      <BaseButton v-if="agency.moderator_whatsapp" tag="a" :href="buildWhatsAppUrl(agency.moderator_whatsapp, `Hola, quiero ser agente dentro de ${agency.agency_name}.`)" target="_blank" size="lg">
        Contactar por WhatsApp
      </BaseButton>
      <p v-else class="muted">Esta agencia aún no configuró un WhatsApp de contacto.</p>
    </BaseCard>
    <p class="register-hint">
      ¿Aún no tienes cuenta? <RouterLink :to="`/registro?ref=${agency.agency_slug}`">Regístrate aquí</RouterLink>
      y quedarás asociado a esta agencia.
    </p>
  </section>
</template>

<style scoped>
.page { padding: var(--space-8) 0; max-width: 560px; }
h1 { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-3); }
.subtitle { color: var(--color-text-muted); margin-bottom: var(--space-6); }
.cta { text-align: center; }
.muted { color: var(--color-text-faint); }
.register-hint { margin-top: var(--space-5); font-size: var(--fs-sm); color: var(--color-text-muted); text-align: center; }
.register-hint a { color: var(--color-pink-400); font-weight: 700; }
</style>
