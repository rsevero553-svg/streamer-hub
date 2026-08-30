<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/services/supabase'
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const auth = useAuthStore()
const claiming = ref(false)
const claimed = ref(false)

const WALLET = 'TU-DIRECCION-USDT-BEP20-AQUI'

const isOverdue = () => {
  const p = auth.profile
  if (!p || p.role !== 'moderator') return false
  if (p.membership_status === 'paid' && p.membership_expires_at) {
    return new Date(p.membership_expires_at) < new Date()
  }
  return p.membership_status !== 'paid'
}

async function claimPayment() {
  if (!auth.userId) return
  claiming.value = true
  await supabase.from('membership_payments').insert({ moderator_id: auth.userId, amount: 12.5, currency: 'USDT-BEP20' })
  await supabase.from('profiles').update({ membership_status: 'pending_review' }).eq('id', auth.userId)
  await auth.refreshProfile()
  claimed.value = true
  claiming.value = false
}
</script>

<template>
  <div v-if="isOverdue()" class="gate">
    <div class="gate__card">
      <h2>⚠️ No has pagado la membresía</h2>
      <p>Tu agencia necesita estar al día para operar todos los servicios de tu panel.</p>
      <div class="gate__price">12.50 USDT <span>(red BEP20)</span></div>
      <div class="gate__wallet">
        <code>{{ WALLET }}</code>
      </div>
      <p class="gate__note">Realiza el pago a esa dirección y presiona el botón. Un administrador confirmará tu pago manualmente.</p>
      <BaseButton v-if="!claimed && auth.profile?.membership_status !== 'pending_review'" :disabled="claiming" @click="claimPayment">
        {{ claiming ? 'Enviando...' : 'Ya pagué' }}
      </BaseButton>
      <p v-else class="gate__pending">✓ Tu pago está pendiente de confirmación por un administrador.</p>
    </div>
  </div>
</template>

<style scoped>
.gate {
  position: fixed; inset: 0; z-index: 900;
  background: rgba(6,8,20,0.92); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: var(--space-5);
}
.gate__card {
  background: var(--color-blue-900); border: 1px solid var(--color-border); border-radius: var(--radius-lg);
  padding: var(--space-7); max-width: 420px; width: 100%; text-align: center;
}
.gate__card h2 { font-size: var(--fs-lg); margin-bottom: var(--space-3); }
.gate__card p { color: var(--color-text-muted); font-size: var(--fs-sm); margin-bottom: var(--space-4); }
.gate__price { font-family: var(--font-display); font-size: var(--fs-2xl); font-weight: 800; margin-bottom: var(--space-4); }
.gate__price span { font-size: var(--fs-sm); color: var(--color-text-faint); font-weight: 400; }
.gate__wallet { background: var(--color-surface-strong); border-radius: var(--radius-md); padding: var(--space-3); margin-bottom: var(--space-4); word-break: break-all; }
.gate__wallet code { font-size: var(--fs-xs); }
.gate__note { font-size: var(--fs-xs); }
.gate__pending { color: var(--color-warning); font-weight: 600; }
</style>
