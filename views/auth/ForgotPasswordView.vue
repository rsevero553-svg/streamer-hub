<script setup lang="ts">
import { ref } from 'vue'
import { requestPasswordReset } from '@/services/auth.service'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const email = ref('')
const sent = ref(false)
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await requestPasswordReset(email.value)
    sent.value = true
  } catch (e: any) {
    error.value = 'No se pudo enviar el correo. Verifica la dirección.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="container auth-container">
      <BaseCard class="auth-card animate-fade-up">
        <h1>Recuperar contraseña</h1>
        <BaseAlert v-if="sent" tone="success">
          Si el correo existe en nuestro sistema, te enviamos un enlace para restablecer tu contraseña.
        </BaseAlert>
        <BaseAlert v-if="error" tone="danger">{{ error }}</BaseAlert>
        <form v-if="!sent" @submit.prevent="submit" class="form">
          <BaseInput v-model="email" type="email" label="Correo electrónico" required />
          <BaseButton :disabled="loading" size="lg">{{ loading ? 'Enviando...' : 'Enviar enlace' }}</BaseButton>
        </form>
        <p class="auth-switch"><RouterLink to="/iniciar-sesion">← Volver a iniciar sesión</RouterLink></p>
      </BaseCard>
    </div>
  </section>
</template>

<style scoped>
.auth-page { padding: var(--space-9) 0; min-height: 60vh; display: flex; align-items: center; }
.auth-container { display: flex; justify-content: center; }
.auth-card { width: 100%; max-width: 420px; }
.auth-card h1 { font-family: var(--font-display); font-size: var(--fs-xl); margin-bottom: var(--space-5); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.auth-switch { text-align: center; margin-top: var(--space-5); color: var(--color-text-muted); font-size: var(--fs-sm); }
.auth-switch a { color: var(--color-pink-400); font-weight: 700; }
</style>
