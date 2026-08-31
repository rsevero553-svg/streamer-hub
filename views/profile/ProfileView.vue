<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updateOwnProfile } from '@/services/profiles.service'
import { fetchModeratorAppsForRaffle } from '@/services/raffle.service'
import { signOut } from '@/services/auth.service'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const auth = useAuthStore()
const router = useRouter()
const fullName = ref('')
const phone = ref('')
const saved = ref(false)

const raffleApps = ref<{ id: string; name: string }[]>([])
const raffleEntryId = ref('')
const raffleEntryAppId = ref('')
const raffleSaved = ref(false)
const raffleError = ref('')

onMounted(async () => {
  fullName.value = auth.profile?.full_name || ''
  phone.value = auth.profile?.phone || ''
  raffleEntryId.value = (auth.profile as any)?.raffle_entry_id || ''
  raffleEntryAppId.value = (auth.profile as any)?.raffle_entry_app_id || ''

  if (auth.profile?.referred_by) {
    try { raffleApps.value = await fetchModeratorAppsForRaffle(auth.profile.referred_by) } catch { raffleApps.value = [] }
  }
})

async function save() {
  if (!auth.userId) return
  await updateOwnProfile(auth.userId, { full_name: fullName.value, phone: phone.value })
  await auth.refreshProfile()
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

async function saveRaffleEntry() {
  if (!auth.userId) return
  raffleError.value = ''
  try {
    await updateOwnProfile(auth.userId, { raffle_entry_id: raffleEntryId.value, raffle_entry_app_id: raffleEntryAppId.value || null } as any)
    await auth.refreshProfile()
    raffleSaved.value = true
    setTimeout(() => (raffleSaved.value = false), 2000)
  } catch (e: any) {
    raffleError.value = e?.message || 'No se pudo guardar tu participación.'
  }
}

async function logout() {
  await signOut()
  auth.clear()
  router.push('/')
}
</script>

<template>
  <section class="page">
    <div class="container narrow">
      <h1 class="page__title">Mi perfil</h1>
      <BaseCard>
        <BaseAlert v-if="saved" tone="success">Perfil actualizado.</BaseAlert>
        <div class="form">
          <BaseInput v-model="fullName" label="Nombre completo" />
          <BaseInput v-model="phone" label="Teléfono" />
          <p class="readonly">Correo: {{ auth.profile?.email }}</p>
          <p class="readonly">Rol: {{ auth.profile?.role }}</p>
          <div class="actions">
            <BaseButton @click="save">Guardar cambios</BaseButton>
            <BaseButton v-if="auth.isAdmin" tag="a" href="/admin" variant="secondary">Ir al panel admin</BaseButton>
            <BaseButton v-if="auth.profile?.role === 'moderator'" tag="a" href="/moderador" variant="secondary">Ir a mi panel de agencia</BaseButton>
            <BaseButton variant="secondary" @click="logout">Cerrar sesión</BaseButton>
          </div>
        </div>
      </BaseCard>

      <BaseCard v-if="auth.profile?.referred_by" style="margin-top: 1.5rem;">
        <h2 class="section-title">Participación en sorteos</h2>
        <p class="hint">Coloca tu ID de una sola app para entrar en los sorteos semanales de tu agencia. Solo puedes tener una app activa a la vez.</p>
        <BaseAlert v-if="raffleError" tone="danger">{{ raffleError }}</BaseAlert>
        <BaseAlert v-if="raffleSaved" tone="success">Guardado.</BaseAlert>
        <div class="form">
          <BaseSelect v-model="raffleEntryAppId" label="Aplicación" :options="[{ value: '', label: 'Selecciona una app' }, ...raffleApps.map(a => ({ value: a.id, label: a.name }))]" />
          <BaseInput v-model="raffleEntryId" label="Tu ID en esa aplicación" />
          <BaseButton @click="saveRaffleEntry">Guardar participación</BaseButton>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<style scoped>
.page { padding: var(--space-8) 0 var(--space-9); }
.narrow { max-width: 560px; }
.page__title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.section-title { font-size: var(--fs-lg); margin-bottom: var(--space-2); }
.hint { color: var(--color-text-faint); font-size: var(--fs-xs); margin-bottom: var(--space-4); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.readonly { color: var(--color-text-muted); font-size: var(--fs-sm); }
.actions { display: flex; gap: var(--space-4); margin-top: var(--space-3); flex-wrap: wrap; }
</style>
