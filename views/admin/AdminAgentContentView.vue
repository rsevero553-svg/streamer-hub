<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const benefits = ref('')
const requirements = ref('')
const saved = ref(false)

async function load() {
  const { data } = await supabase.from('platform_settings').select('*').in('setting_key', ['agent_benefits', 'agent_requirements'])
  for (const row of data ?? []) {
    if (row.setting_key === 'agent_benefits') benefits.value = row.setting_value || ''
    if (row.setting_key === 'agent_requirements') requirements.value = row.setting_value || ''
  }
}
onMounted(load)

async function save() {
  await supabase.from('platform_settings').update({ setting_value: benefits.value }).eq('setting_key', 'agent_benefits')
  await supabase.from('platform_settings').update({ setting_value: requirements.value }).eq('setting_key', 'agent_requirements')
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<template>
  <div>
    <h1 class="title">Contenido: Ser agente</h1>
    <BaseCard>
      <BaseAlert v-if="saved" tone="success">Guardado.</BaseAlert>
      <BaseTextarea v-model="benefits" label="Beneficios (uno por línea)" :rows="5" />
      <div style="height: 1rem;"></div>
      <BaseTextarea v-model="requirements" label="Requisitos (uno por línea)" :rows="5" />
      <BaseButton @click="save" style="margin-top: 1rem;">Guardar cambios</BaseButton>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
</style>
