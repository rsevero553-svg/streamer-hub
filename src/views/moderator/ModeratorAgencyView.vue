<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updateOwnProfile } from '@/services/profiles.service'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const auth = useAuthStore()
const form = ref({ agency_name: '', agency_slug: '', agency_logo_url: '', moderator_whatsapp: '', moderator_instagram: '', moderator_telegram: '' })
const saved = ref(false)

onMounted(() => {
  const p = auth.profile
  if (p) {
    form.value = {
      agency_name: p.agency_name || '',
      agency_slug: p.agency_slug || '',
      agency_logo_url: p.agency_logo_url || '',
      moderator_whatsapp: p.moderator_whatsapp || '',
      moderator_instagram: p.moderator_instagram || '',
      moderator_telegram: p.moderator_telegram || ''
    }
  }
})

async function save() {
  if (!auth.userId) return
  await updateOwnProfile(auth.userId, form.value as any)
  await auth.refreshProfile()
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<template>
  <div>
    <h1 class="title">Mi agencia</h1>
    <BaseCard>
      <BaseAlert v-if="saved" tone="success">Guardado.</BaseAlert>
      <div class="form">
        <BaseInput v-model="form.agency_name" label="Nombre de la agencia" />
        <BaseInput v-model="form.agency_slug" label="Slug (url pública: /agencia/tu-slug)" />
        <BaseInput v-model="form.agency_logo_url" label="URL del logo" />
        <BaseInput v-model="form.moderator_whatsapp" label="WhatsApp de contacto (tu sub-marca)" />
        <BaseInput v-model="form.moderator_instagram" label="Instagram (opcional)" />
        <BaseInput v-model="form.moderator_telegram" label="Telegram (opcional)" />
        <BaseButton @click="save">Guardar cambios</BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
</style>
