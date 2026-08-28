<script setup lang="ts">
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import BaseModal from '@/components/ui/BaseModal.vue'

const ui = useUiStore()
const faqs = [
  { q: '¿Cómo empiezo?', a: 'Ve a "Apps para mujeres" o "Apps para hombres", elige una aplicación y revisa su ficha completa.' },
  { q: '¿Qué es un código de agencia?', a: 'Es un código que algunas aplicaciones requieren para asociarte a una agencia. Lo encuentras en la ficha de cada app.' },
  { q: '¿Cómo contacto a un tutor?', a: 'Cada aplicación tiene un botón de WhatsApp para hablar directamente con su tutor asignado.' },
  { q: '¿Cómo me convierto en agente?', a: 'Visita la sección "Ser agente" para ver requisitos y contacto.' }
]
const messages = ref<{ from: 'bot' | 'user'; text: string }[]>([
  { from: 'bot', text: 'Hola 👋 Soy el asistente de Streamer Hub. Elige una pregunta frecuente o navega a Guías para más ayuda.' }
])

function ask(a: string) {
  messages.value.push({ from: 'bot', text: a })
}
</script>

<template>
  <BaseModal :open="ui.helpChatOpen" title="Asistente de ayuda" @close="ui.toggleHelpChat(false)">
    <div class="chat">
      <div class="chat__messages">
        <p v-for="(m, i) in messages" :key="i" class="chat__msg" :class="`chat__msg--${m.from}`">{{ m.text }}</p>
      </div>
      <div class="chat__faqs">
        <button v-for="f in faqs" :key="f.q" class="chat__faq" @click="ask(f.a)">{{ f.q }}</button>
      </div>
      <RouterLink to="/guias" class="chat__link" @click="ui.toggleHelpChat(false)">Ver todas las guías →</RouterLink>
    </div>
  </BaseModal>
</template>

<style scoped>
.chat { display: flex; flex-direction: column; gap: var(--space-4); }
.chat__messages { display: flex; flex-direction: column; gap: var(--space-3); max-height: 220px; overflow-y: auto; }
.chat__msg { padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); font-size: var(--fs-sm); }
.chat__msg--bot { background: var(--color-surface-strong); align-self: flex-start; }
.chat__faqs { display: flex; flex-direction: column; gap: var(--space-2); }
.chat__faq { text-align: left; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); color: var(--color-text); font-size: var(--fs-sm); }
.chat__faq:hover { border-color: var(--color-pink-500); }
.chat__link { color: var(--color-pink-400); font-weight: 700; font-size: var(--fs-sm); }
</style>
