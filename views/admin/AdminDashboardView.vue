<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import BaseCard from '@/components/ui/BaseCard.vue'

const counts = ref({ apps: 0, guides: 0, banners: 0, users: 0 })

onMounted(async () => {
  const [apps, guides, banners, users] = await Promise.all([
    supabase.from('apps').select('id', { count: 'exact', head: true }),
    supabase.from('app_guides').select('id', { count: 'exact', head: true }),
    supabase.from('banners').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true })
  ])
  counts.value = {
    apps: apps.count ?? 0,
    guides: guides.count ?? 0,
    banners: banners.count ?? 0,
    users: users.count ?? 0
  }
})
</script>

<template>
  <div>
    <h1 class="title">Resumen</h1>
    <div class="stats">
      <BaseCard class="stat"><span>{{ counts.apps }}</span><p>Aplicaciones</p></BaseCard>
      <BaseCard class="stat"><span>{{ counts.guides }}</span><p>Guías</p></BaseCard>
      <BaseCard class="stat"><span>{{ counts.banners }}</span><p>Banners</p></BaseCard>
      <BaseCard class="stat"><span>{{ counts.users }}</span><p>Usuarios</p></BaseCard>
    </div>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-5); }
.stat { text-align: center; }
.stat span { display: block; font-size: var(--fs-3xl); font-weight: 800; background: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
.stat p { color: var(--color-text-muted); margin-top: var(--space-2); }
@media (max-width: 768px) { .stats { grid-template-columns: 1fr 1fr; } }
</style>
