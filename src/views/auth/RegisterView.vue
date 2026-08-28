<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signUp } from '@/services/auth.service'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const fullName = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const gender = ref('women')
const accepted = ref(false)
const error = ref('')
const success = ref(false)
const loading = ref(false)
const router = useRouter()

async function submit() {
  error.value = ''
  if (!phone.value.trim()) { error.value = 'El teléfono es obligatorio.'; return }
  if (!accepted.value) { error.value = 'Debes aceptar las políticas para continuar.'; return }
  loading.value = true
  try {
    await signUp({ fullName: fullName.value, phone: phone.value, email: email.value, password: password.value, gender: gender.value as any })
    success.value = true
    setTimeout(() => router.push('/iniciar-sesion'), 1500)
  } catch (e: any) {
    error.value = e?.message || 'No se pudo completar el registro.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="container auth-container">
      <BaseCard class="auth-card animate-fade-up">
        <h1>Crear cuenta</h1>
        <BaseAlert v-if="error" tone="danger">{{ error }}</BaseAlert>
        <BaseAlert v-if="success" tone="success">Cuenta creada. Redirigiendo a inicio de sesión...</BaseAlert>
        <form @submit.prevent="submit" class="form">
          <BaseInput v-model="fullName" label="Nombre completo" required />
          <BaseInput v-model="phone" label="Teléfono (obligatorio)" required />
          <BaseInput v-model="email" type="email" label="Correo electrónico" required />
          <BaseInput v-model="password" type="password" label="Contraseña" required />
          <BaseSelect v-model="gender" label="Público objetivo" :options="[{ value: 'women', label: 'Mujeres' }, { value: 'men', label: 'Hombres' }]" />
          <label class="checkbox">
            <input type="checkbox" v-model="accepted" />
            <span>Acepto las <RouterLink to="/politicas">políticas de la plataforma</RouterLink></span>
          </label>
          <BaseButton :disabled="loading" size="lg">{{ loading ? 'Creando cuenta...' : 'Registrarme' }}</BaseButton>
        </form>
        <p class="auth-switch">¿Ya tienes cuenta? <RouterLink to="/iniciar-sesion">Inicia sesión</RouterLink></p>
      </BaseCard>
    </div>
  </section>
</template>

<style scoped>
.auth-page { padding: var(--space-9) 0; }
.auth-container { display: flex; justify-content: center; }
.auth-card { width: 100%; max-width: 460px; }
.auth-card h1 { font-family: var(--font-display); font-size: var(--fs-xl); margin-bottom: var(--space-5); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.checkbox { display: flex; align-items: center; gap: var(--space-2); font-size: var(--fs-sm); color: var(--color-text-muted); }
.checkbox a { color: var(--color-pink-400); }
.auth-switch { text-align: center; margin-top: var(--space-5); color: var(--color-text-muted); font-size: var(--fs-sm); }
.auth-switch a { color: var(--color-pink-400); font-weight: 700; }
</style>
