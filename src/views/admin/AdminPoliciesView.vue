<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const content = ref('')
const adminWhatsapp = ref('')
const membershipWallet = ref('')
const saved = ref(false)
const error = ref('')

async function load() {
  const { data } = await supabase.from('platform_settings').select('*').in('setting_key', ['policies_content', 'admin_whatsapp', 'membership_wallet_usdt_bep20'])
  for (const row of data ?? []) {
    if (row.setting_key === 'policies_content') content.value = row.setting_value || ''
    if (row.setting_key === 'admin_whatsapp') adminWhatsapp.value = row.setting_value || ''
    if (row.setting_key === 'membership_wallet_usdt_bep20') membershipWallet.value = row.setting_value || ''
  }
}
onMounted(load)

async function save() {
  error.value = ''
  // upsert: crea la fila si no existe (evita error si la configuración aún no estaba en la tabla)
  const { error: err } = await supabase.from('platform_settings').upsert([
    { setting_key: 'policies_content', setting_value: content.value, is_public: true },
    { setting_key: 'admin_whatsapp', setting_value: adminWhatsapp.value, is_public: true },
    { setting_key: 'membership_wallet_usdt_bep20', setting_value: membershipWallet.value, is_public: true }
  ], { onConflict: 'setting_key' })

  if (err) {
    error.value = 'No se pudo guardar: ' + err.message
    return
  }
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<template>
  <div>
    <h1 class="title">Políticas y contacto general</h1>
    <BaseCard>
      <BaseAlert v-if="saved" tone="success">Guardado.</BaseAlert>
      <BaseAlert v-if="error" tone="danger">{{ error }}</BaseAlert>

      <BaseInput v-model="adminWhatsapp" label="Tu WhatsApp (para el botón 'Soy agente', formato internacional sin +)" />
      <div style="height: 1rem;"></div>

      <BaseInput v-model="membershipWallet" label="Wallet USDT (red BEP20) para el pago de membresía mensual de moderadores" />
      <p class="hint">Esta dirección es la que verán los moderadores en el cartel de pago cuando su membresía esté vencida.</p>
      <div style="height: 1rem;"></div>

      <BaseTextarea v-model="content" label="Contenido de la página /politicas" :rows="10" />
      <BaseButton @click="save" style="margin-top: 1rem;">Guardar cambios</BaseButton>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.hint { font-size: var(--fs-xs); color: var(--color-text-faint); margin-top: -0.5rem; }
</style>
