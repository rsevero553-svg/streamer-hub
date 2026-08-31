<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { fetchNextRaffleAvailability, drawRaffleWinner } from '@/services/raffle.service'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const auth = useAuthStore()
const nextAvailable = ref<string | null>(null)
const drawing = ref(false)
const error = ref('')
const lastWinner = ref<{ winner_entry_id: string; winner_name: string; app_name: string } | null>(null)

async function load() {
  if (!auth.userId) return
  nextAvailable.value = await fetchNextRaffleAvailability(auth.userId)
}
onMounted(load)

function canDraw() {
  if (!nextAvailable.value) return true
  return new Date(nextAvailable.value) <= new Date()
}

async function runDraw() {
  if (!auth.userId) return
  error.value = ''
  drawing.value = true
  try {
    lastWinner.value = await drawRaffleWinner(auth.userId)
    await load()
  } catch (e: any) {
    error.value = e?.message || 'No se pudo realizar el sorteo.'
  } finally {
    drawing.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="title">Sorteo semanal</h1>
    <BaseCard>
      <p class="explain">
        El sorteo elige automáticamente a un ganador entre las personas que se registraron con tu link
        y colocaron su ID en alguna de tus aplicaciones. Por privacidad, no puedes ver la lista de participantes —
        solo el resultado. El resultado se envía como notificación a todos tus referidos.
      </p>

      <BaseAlert v-if="error" tone="danger">{{ error }}</BaseAlert>

      <BaseAlert v-if="lastWinner" tone="success">
        🎉 Ganador: <strong>{{ lastWinner.winner_entry_id }} {{ lastWinner.winner_name }}</strong> en {{ lastWinner.app_name }}
      </BaseAlert>

      <div v-if="canDraw()">
        <BaseButton :disabled="drawing" @click="runDraw">{{ drawing ? 'Sorteando...' : '🎲 Realizar sorteo ahora' }}</BaseButton>
      </div>
      <div v-else>
        <BaseAlert tone="warning">
          Ya realizaste tu sorteo esta semana. Disponible de nuevo el {{ new Date(nextAvailable!).toLocaleString('es') }}.
        </BaseAlert>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.explain { color: var(--color-text-muted); font-size: var(--fs-sm); line-height: 1.6; margin-bottom: var(--space-5); }
</style>
