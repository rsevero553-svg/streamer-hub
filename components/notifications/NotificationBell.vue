<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { fetchMyNotifications, type AppNotification } from '@/services/notifications.service'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const auth = useAuthStore()
const open = ref(false)
const items = ref<AppNotification[]>([])

const TYPE_LABELS: Record<string, string> = {
  general: 'General', raffle_result: '🎉 Sorteo', membership_warning: '⚠️ Membresía',
  new_app: '📱 Nueva app', new_guide: '📘 Nueva guía', policy_update: '📋 Política', platform_error: '🛠 Aviso técnico'
}

async function load() {
  if (!auth.isAuthenticated) return
  try { items.value = await fetchMyNotifications() } catch { items.value = [] }
}

onMounted(load)

function toggle() {
  open.value = !open.value
  if (open.value) load()
}
</script>

<template>
  <div v-if="auth.isAuthenticated" class="bell-wrap">
    <button class="bell" @click="toggle" aria-label="Notificaciones">🔔</button>
    <BaseModal :open="open" title="Notificaciones" @close="open = false">
      <div class="list">
        <div v-for="n in items" :key="n.id" class="item">
          <div class="item__head">
            <strong>{{ n.title }}</strong>
            <BaseBadge tone="neutral">{{ TYPE_LABELS[n.type] || n.type }}</BaseBadge>
          </div>
          <p>{{ n.body }}</p>
          <span class="item__date">{{ new Date(n.created_at).toLocaleString('es') }}</span>
        </div>
        <p v-if="!items.length" class="empty">No tienes notificaciones todavía.</p>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.bell-wrap { display: inline-flex; }
.bell { background: none; border: none; font-size: var(--fs-lg); color: var(--color-text-muted); position: relative; }
.list { display: flex; flex-direction: column; gap: var(--space-4); max-height: 60vh; overflow-y: auto; }
.item { padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); }
.item:last-child { border-bottom: none; }
.item__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2); gap: var(--space-2); }
.item p { color: var(--color-text-muted); font-size: var(--fs-sm); margin-bottom: var(--space-2); }
.item__date { font-size: var(--fs-xs); color: var(--color-text-faint); }
.empty { color: var(--color-text-faint); text-align: center; padding: var(--space-6) 0; }
</style>
