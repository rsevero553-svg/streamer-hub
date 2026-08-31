<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const name = ref('')
const email = ref('')
const message = ref('')
const sent = ref(false)

function submit() {
  // Este formulario es una interfaz visual; conectar a un servicio de envío (Supabase Function / correo) según se requiera.
  sent.value = true
}
</script>
<template>
  <section class="page">
    <div class="container narrow">
      <h1>Contacto</h1>
      <BaseCard>
        <BaseAlert v-if="sent" tone="success">Mensaje enviado. Te responderemos pronto.</BaseAlert>
        <form v-else class="form" @submit.prevent="submit">
          <BaseInput v-model="name" label="Nombre" required />
          <BaseInput v-model="email" type="email" label="Correo" required />
          <BaseTextarea v-model="message" label="Mensaje" :rows="5" required />
          <BaseButton>Enviar mensaje</BaseButton>
        </form>
      </BaseCard>
    </div>
  </section>
</template>
<style scoped>
.page { padding: var(--space-8) 0 var(--space-9); }
.narrow { max-width: 560px; }
h1 { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.form { display: flex; flex-direction: column; gap: var(--space-4); }
</style>
