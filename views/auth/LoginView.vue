<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signIn } from '@/services/auth.service'
import { fetchModeratorSlugById } from '@/services/agency.service'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await signIn(email.value, password.value)
    await auth.init()

    // Si hay un destino explícito pedido (ej. quería entrar a /perfil), respétalo.
    if (route.query.redirect) {
      router.push(route.query.redirect as string)
      return
    }

    // Si el usuario está ligado a un moderador, siempre cae en SU zona (regla permanente de referido).
    if (auth.profile?.referred_by) {
      const slug = await fetchModeratorSlugById(auth.profile.referred_by)
      router.push(slug ? `/agencia/${slug}` : '/')
      return
    }

    router.push('/')
  } catch (e: any) {
    error.value = 'Credenciales incorrectas o cuenta inexistente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="container auth-container">
      <BaseCard class="auth-card animate-fade-up">
        <h1>Iniciar sesión</h1>
        <BaseAlert v-if="error" tone="danger">{{ error }}</BaseAlert>
        <form @submit.prevent="submit" class="form">
          <BaseInput v-model="email" type="email" label="Correo electrónico" required />
          <BaseInput v-model="password" type="password" label="Contraseña" required />
          <BaseButton :disabled="loading" size="lg">{{ loading ? 'Ingresando...' : 'Iniciar sesión' }}</BaseButton>
        </form>
        <p class="auth-switch">¿No tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink></p>
        <p class="auth-switch"><RouterLink to="/recuperar-contrasena">¿Olvidaste tu contraseña?</RouterLink></p>
      </BaseCard>
    </div>
  </section>
</template>

<style scoped>
.auth-page { padding: var(--space-9) 0; min-height: 70vh; display: flex; align-items: center; }
.auth-container { display: flex; justify-content: center; }
.auth-card { width: 100%; max-width: 420px; }
.auth-card h1 { font-family: var(--font-display); font-size: var(--fs-xl); margin-bottom: var(--space-5); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.auth-switch { text-align: center; margin-top: var(--space-5); color: var(--color-text-muted); font-size: var(--fs-sm); }
.auth-switch a { color: var(--color-pink-400); font-weight: 700; }
</style>
