<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updateOwnProfile } from '@/services/profiles.service'
import { signOut } from '@/services/auth.service'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const auth = useAuthStore()
const router = useRouter()
const fullName = ref('')
const phone = ref('')
const saved = ref(false)

onMounted(() => {
  fullName.value = auth.profile?.full_name || ''
  phone.value = auth.profile?.phone || ''
})

async function save() {
  if (!auth.userId) return
  await updateOwnProfile(auth.userId, { full_name: fullName.value, phone: phone.value })
  await auth.refreshProfile()
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
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
            <BaseButton variant="secondary" @click="logout">Cerrar sesión</BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<style scoped>
.page { padding: var(--space-8) 0 var(--space-9); }
.narrow { max-width: 560px; }
.page__title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.readonly { color: var(--color-text-muted); font-size: var(--fs-sm); }
.actions { display: flex; gap: var(--space-4); margin-top: var(--space-3); flex-wrap: wrap; }
</style>
