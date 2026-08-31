<script setup lang="ts">
import MembershipGate from '@/components/moderator/MembershipGate.vue'
const links = [
  { to: '/moderador', label: 'Resumen' },
  { to: '/moderador/apps', label: 'Mis apps' },
  { to: '/moderador/guias', label: 'Mis guías' },
  { to: '/moderador/agencia', label: 'Mi agencia' },
  { to: '/moderador/membresia', label: 'Membresía' },
  { to: '/moderador/sorteo', label: 'Sorteo semanal' },
  { to: '/moderador/notificaciones', label: 'Notificar a referidos' },
  { to: '/moderador/nomina', label: 'Nómina de mi agencia' }
]
</script>

<template>
  <div class="mod-layout">
    <aside class="mod-sidebar">
      <p class="mod-sidebar__brand">Streamer<b>Hub</b> <span>Panel de Agencia</span></p>
      <nav>
        <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="mod-sidebar__link">{{ l.label }}</RouterLink>
      </nav>
      <RouterLink to="/" class="mod-sidebar__back">← Volver al sitio</RouterLink>
    </aside>
    <div class="mod-content">
      <RouterView />
    </div>
    <MembershipGate />
  </div>
</template>

<style scoped>
.mod-layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
.mod-sidebar { background: var(--color-blue-900); border-right: 1px solid var(--color-border); padding: var(--space-6) var(--space-5); display: flex; flex-direction: column; gap: var(--space-6); }
.mod-sidebar__brand { font-family: var(--font-display); font-weight: 800; }
.mod-sidebar__brand b { background: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
.mod-sidebar__brand span { display: block; font-size: var(--fs-xs); color: var(--color-text-faint); font-weight: 500; }
.mod-sidebar nav { display: flex; flex-direction: column; gap: var(--space-2); }
.mod-sidebar__link { padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); color: var(--color-text-muted); font-size: var(--fs-sm); font-weight: 600; }
.mod-sidebar__link:hover, .mod-sidebar__link.router-link-active { background: var(--color-surface-strong); color: var(--color-text); }
.mod-sidebar__back { margin-top: auto; font-size: var(--fs-sm); color: var(--color-text-faint); }
.mod-content { padding: var(--space-7); overflow-x: hidden; }
@media (max-width: 768px) {
  .mod-layout { grid-template-columns: 1fr; }
  .mod-sidebar { flex-direction: column; align-items: stretch; gap: var(--space-4); }
  .mod-sidebar nav { flex-direction: row; flex-wrap: wrap; gap: var(--space-2); }
  .mod-sidebar__link { flex: 1 1 auto; text-align: center; white-space: nowrap; }
  .mod-sidebar__back { margin-top: 0; }
}
</style>
