<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const content = ref('')
const saved = ref(false)

async function load() {
  const { data } = await supabase.from('platform_settings').select('*').eq('setting_key', 'policies_content').single()
  content.value = data?.setting_value || ''
}
onMounted(load)

async function save() {
  await supabase.from('platform_settings').update({ setting_value: content.value }).eq('setting_key', 'policies_content')
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<template>
  <div>
    <h1 class="title">Políticas de la plataforma</h1>
    <BaseCard>
      <BaseAlert v-if="saved" tone="success">Guardado.</BaseAlert>
      <BaseTextarea v-model="content" label="Contenido de la página /politicas" :rows="10" />
      <BaseButton @click="save" style="margin-top: 1rem;">Guardar cambios</BaseButton>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
</style>
