<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/ui/BaseCard.vue'

const auth = useAuthStore()
const counts = ref({ apps: 0, guides: 0, referrals: 0 })
const origin = ref('')

onMounted(async () => {
  origin.value = typeof window !== 'undefined' ? window.location.origin : ''

  if (!auth.userId) return
  const [apps, guides, referrals] = await Promise.all([
    supabase.from('apps').select('id', { count: 'exact', head: true }).eq('owner_id', auth.userId),
    supabase.from('app_guides').select('id, apps!inner(owner_id)', { count: 'exact', head: true }).eq('apps.owner_id', auth.userId),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('referred_by', auth.userId)
  ])
  counts.value = { apps: apps.count ?? 0, guides: guides.count ?? 0, referrals: referrals.count ?? 0 }
})
</script>

<template>
  <div>
    <h1 class="title">Hola, {{ auth.profile?.agency_name || auth.profile?.full_name }}</h1>
    <div class="stats">
      <BaseCard class="stat"><span>{{ counts.apps }}</span><p>Tus apps</p></BaseCard>
      <BaseCard class="stat"><span>{{ counts.guides }}</span><p>Tus guías</p></BaseCard>
      <BaseCard class="stat"><span>{{ counts.referrals }}</span><p>Usuarios referidos</p></BaseCard>
    </div>
    <BaseCard style="margin-top: 1.5rem;">
      <p>Tu link de referido para compartir con nuevos usuarios (los lleva directo al registro, o a tu zona si ya tienen cuenta):</p>
      <code>{{ origin }}/r/{{ auth.profile?.agency_slug }}</code>
    </BaseCard>
  </div>
</template>

<style scoped>
.title { font-family: var(--font-display); font-size: var(--fs-2xl); margin-bottom: var(--space-6); }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.stat { text-align: center; }
.stat span { display: block; font-size: var(--fs-3xl); font-weight: 800; background: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
.stat p { color: var(--color-text-muted); margin-top: var(--space-2); }
code { display: block; margin-top: var(--space-2); background: var(--color-surface-strong); padding: var(--space-3); border-radius: var(--radius-md); word-break: break-all; }
@media (max-width: 768px) { .stats { grid-template-columns: 1fr; } }
</style>
