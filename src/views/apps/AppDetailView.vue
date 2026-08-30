<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchAppBySlug } from '@/services/applications.service'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import { copyToClipboard } from '@/utils/clipboard'
import type { AppDetail } from '@/types/application'
import { useMeta } from '@/composables/useMeta'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route = useRoute()
const app = ref<AppDetail | null>(null)
const loading = ref(true)
const copied = ref<string | null>(null)

const pageTitle = ref('Cargando...')
const pageDescription = ref('')
useMeta(pageTitle, pageDescription)

onMounted(async () => {
  loading.value = true
  const slugParam = (route.params.appSlug as string) || (route.params.slug as string)
  app.value = await fetchAppBySlug(slugParam)
  loading.value = false
  if (app.value) {
    pageTitle.value = app.value.name
    pageDescription.value = app.value.description || `Conoce cómo funciona ${app.value.name}: actividades, retiros, agencia y guías.`
  } else {
    pageTitle.value = 'Aplicación no encontrada'
  }
})

async function copyCode(code: string) {
  if (await copyToClipboard(code)) {
    copied.value = code
    setTimeout(() => (copied.value = null), 1500)
  }
}

const whatsappContacts = computed(() => app.value?.contacts.filter(c => c.type === 'whatsapp') ?? [])
const telegramContacts = computed(() => app.value?.contacts.filter(c => c.type === 'telegram') ?? [])
</script>

<template>
  <BaseSpinner v-if="loading" />
  <EmptyState v-else-if="!app" message="No encontramos esta aplicación." />

  <div v-else class="detail">
    <header class="detail__hero" :style="app.banner_url ? { backgroundImage: `url(${app.banner_url})` } : {}">
      <div class="container detail__hero-inner">
        <div class="detail__logo">
          <img v-if="app.logo_url" :src="app.logo_url" :alt="app.name" />
          <span v-else>{{ app.name.slice(0,2).toUpperCase() }}</span>
        </div>
        <div>
          <h1>{{ app.name }}</h1>
          <div class="detail__badges">
            <BaseBadge tone="neutral">{{ app.gender === 'women' ? 'Mujeres' : 'Hombres' }}</BaseBadge>
            <BaseBadge v-if="app.agency_required" tone="accent">Requiere agencia</BaseBadge>
          </div>
        </div>
      </div>
    </header>

    <div class="container detail__body">
      <BaseCard class="detail__section">
        <h2>Descripción</h2>
        <p>{{ app.description }}</p>
        <div class="detail__meta" v-if="app.target_audience || app.minimum_age || (app.available_countries && app.available_countries.length) || app.points_system">
          <p v-if="app.target_audience"><strong>Público objetivo:</strong> {{ app.target_audience }}</p>
          <p v-if="app.minimum_age"><strong>Edad mínima:</strong> {{ app.minimum_age }} años</p>
          <p v-if="app.available_countries && app.available_countries.length"><strong>Países disponibles:</strong> {{ app.available_countries.join(', ') }}</p>
          <p v-if="app.points_system"><strong>Sistema de puntos:</strong> {{ app.points_system }}</p>
        </div>
        <p v-if="app.last_verified_at" class="detail__verified">
          ✓ Información verificada el {{ new Date(app.last_verified_at).toLocaleDateString('es') }} — proporcionada por la plataforma, no por la aplicación externa.
        </p>
      </BaseCard>

      <BaseCard v-if="app.activities.length" class="detail__section">
        <h2>Actividades y recompensas</h2>
        <ul class="detail__list">
          <li v-for="a in app.activities" :key="a.id" class="detail__row">
            <span>{{ a.name }}</span>
            <strong>{{ a.reward_value }} {{ a.reward_unit }}</strong>
          </li>
        </ul>
      </BaseCard>

      <BaseCard v-if="app.withdrawal_methods.length" class="detail__section">
        <h2>Retiros</h2>
        <div v-for="w in app.withdrawal_methods" :key="w.id" class="detail__withdrawal">
          <h4>{{ w.name }}</h4>
          <p v-if="w.frequency">Frecuencia: {{ w.frequency }}</p>
          <p v-if="w.minimum_amount">Mínimo: {{ w.minimum_amount }}</p>
          <p v-if="w.requirements">{{ w.requirements }}</p>
        </div>
      </BaseCard>

      <BaseCard v-if="app.agency_required && app.agency_codes.length" class="detail__section">
        <h2>Código de agencia</h2>
        <div v-for="c in app.agency_codes" :key="c.id" class="detail__code">
          <code>{{ c.code }}</code>
          <BaseButton size="sm" variant="secondary" @click="copyCode(c.code)">
            {{ copied === c.code ? 'Copiado ✓' : 'Copiar' }}
          </BaseButton>
        </div>
      </BaseCard>

      <BaseCard v-if="app.currency_conversions.length" class="detail__section">
        <h2>Conversión a USD</h2>
        <ul class="detail__list">
          <li v-for="c in app.currency_conversions" :key="c.id" class="detail__row">
            <span>{{ c.units_per_usd }} {{ c.unit_name }}</span>
            <strong>= 1 USD</strong>
          </li>
        </ul>
      </BaseCard>

      <BaseCard v-if="app.income_sources.length" class="detail__section">
        <h2>Otros métodos de ingreso</h2>
        <div class="income-table">
          <div class="income-table__head">
            <span>Método</span><span>Duración</span><span>Valor</span>
          </div>
          <div v-for="s in app.income_sources" :key="s.id" class="income-table__row">
            <span>{{ s.name }}</span>
            <span>{{ s.duration_label || '—' }}</span>
            <span>
              {{ s.value }} {{ s.unit }}
              <template v-if="s.usd_per_min"> · ${{ s.usd_per_min }}/min</template>
              <template v-if="s.points_per_min"> · {{ s.points_per_min }} pts/min</template>
            </span>
          </div>
        </div>
      </BaseCard>

      <BaseAlert v-if="app.requires_verification" tone="warning" class="detail__section">
        ⚠️ Esta aplicación requiere verificación: al contactar a tu tutor deberás enviar una
        captura de pantalla de tu ID y una foto del momento.
      </BaseAlert>

      <div class="detail__grid">
        <BaseCard v-if="whatsappContacts.length" class="detail__section">
          <h2>Tutor de WhatsApp</h2>
          <BaseButton
            v-for="c in whatsappContacts"
            :key="c.id"
            tag="a"
            :href="buildWhatsAppUrl(c.url, `Hola, estoy interesado/a en trabajar con la aplicación ${app.name} y necesito orientación.${app.requires_verification ? ' Entiendo que debo enviar captura de mi ID y una foto del momento.' : ''}`)"
            target="_blank"
          >
            Hablar con mi tutor
          </BaseButton>
        </BaseCard>

        <BaseCard v-if="telegramContacts.length" class="detail__section">
          <h2>Telegram</h2>
          <BaseButton v-for="c in telegramContacts" :key="c.id" tag="a" :href="c.url" target="_blank" variant="secondary">
            {{ c.title }}
          </BaseButton>
        </BaseCard>
      </div>

      <BaseCard v-if="app.links.length" class="detail__section">
        <h2>Enlaces oficiales</h2>
        <div class="detail__links">
          <BaseButton v-for="l in app.links" :key="l.id" tag="a" :href="l.url" target="_blank" variant="outline">
            {{ l.title }}
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.detail__hero {
  background: var(--gradient-brand-soft); background-size: cover; background-position: center;
  padding: var(--space-9) 0 var(--space-7);
}
.detail__hero-inner { display: flex; align-items: center; gap: var(--space-5); }
.detail__logo {
  width: 84px; height: 84px; border-radius: var(--radius-lg); background: var(--color-surface-strong);
  display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: var(--fs-xl); overflow: hidden; flex-shrink: 0;
}
.detail__logo img { width: 100%; height: 100%; object-fit: cover; }
.detail__hero-inner h1 { font-family: var(--font-display); font-size: var(--fs-2xl); }
.detail__badges { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
.detail__body { display: flex; flex-direction: column; gap: var(--space-5); padding: var(--space-7) 0; }
.detail__section h2 { font-size: var(--fs-lg); margin-bottom: var(--space-3); }
.detail__section p { color: var(--color-text-muted); line-height: 1.6; }
.detail__meta { margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-2); }
.detail__meta strong { color: var(--color-text); }
.detail__verified { margin-top: var(--space-4); font-size: var(--fs-xs); color: var(--color-success); }
.detail__list { display: flex; flex-direction: column; gap: var(--space-2); }
.detail__row { display: flex; justify-content: space-between; padding: var(--space-3); background: var(--color-surface-strong); border-radius: var(--radius-md); }
.detail__withdrawal { padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border); }
.detail__withdrawal:last-child { border-bottom: none; }
.detail__code { display: flex; align-items: center; gap: var(--space-4); }
.detail__code code { font-size: var(--fs-lg); font-weight: 800; letter-spacing: 0.1em; background: var(--color-surface-strong); padding: var(--space-3) var(--space-5); border-radius: var(--radius-md); }
.detail__grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }
.detail__links { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.income-table { display: flex; flex-direction: column; gap: var(--space-2); font-size: var(--fs-sm); }
.income-table__head { display: grid; grid-template-columns: 1.5fr 1fr 1.5fr; gap: var(--space-3); color: var(--color-text-faint); font-size: var(--fs-xs); text-transform: uppercase; padding: 0 var(--space-3); }
.income-table__row { display: grid; grid-template-columns: 1.5fr 1fr 1.5fr; gap: var(--space-3); background: var(--color-surface-strong); padding: var(--space-3); border-radius: var(--radius-md); align-items: center; }
@media (max-width: 768px) { .detail__grid { grid-template-columns: 1fr; } .detail__hero-inner { flex-direction: column; text-align: center; } }
</style>
