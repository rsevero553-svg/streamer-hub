<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchPublicSettings } from '@/services/settings.service'

const content = ref('')
onMounted(async () => {
  try {
    const settings = await fetchPublicSettings()
    content.value = settings.policies_content || 'Contenido no disponible.'
  } catch {
    content.value = 'Contenido no disponible.'
  }
})
</script>
<template>
  <section class="page">
    <div class="container narrow">
      <h1>Políticas de la plataforma</h1>
      <p style="white-space: pre-line;">{{ content }}</p>
    </div>
  </section>
</template>
<style scoped>
.page { padding: var(--space-8) 0 var(--space-9); }
.narrow { max-width: 680px; }
h1 { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-5); }
p { color: var(--color-text-muted); line-height: 1.7; }
</style>
