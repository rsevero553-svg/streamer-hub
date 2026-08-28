<script setup lang="ts">
const links = [
  { to: '/admin', label: 'Resumen' },
  { to: '/admin/apps', label: 'Aplicaciones' },
  { to: '/admin/banners', label: 'Banners' },
  { to: '/admin/guias', label: 'Guías' },
  { to: '/admin/usuarios', label: 'Usuarios' },
  { to: '/admin/faqs', label: 'Preguntas frecuentes' },
  { to: '/admin/redes-sociales', label: 'Redes sociales' },
  { to: '/admin/politicas', label: 'Políticas' },
  { to: '/admin/ser-agente', label: 'Contenido: Ser agente' }
]
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <p class="admin-sidebar__brand">Streamer<b>Hub</b> <span>Admin</span></p>
      <nav>
        <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="admin-sidebar__link">{{ l.label }}</RouterLink>
      </nav>
      <RouterLink to="/" class="admin-sidebar__back">← Volver al sitio</RouterLink>
    </aside>
    <div class="admin-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.admin-layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
.admin-sidebar { background: var(--color-blue-900); border-right: 1px solid var(--color-border); padding: var(--space-6) var(--space-5); display: flex; flex-direction: column; gap: var(--space-6); }
.admin-sidebar__brand { font-family: var(--font-display); font-weight: 800; }
.admin-sidebar__brand b { background: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
.admin-sidebar__brand span { display: block; font-size: var(--fs-xs); color: var(--color-text-faint); font-weight: 500; }
.admin-sidebar nav { display: flex; flex-direction: column; gap: var(--space-2); }
.admin-sidebar__link { padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); color: var(--color-text-muted); font-size: var(--fs-sm); font-weight: 600; }
.admin-sidebar__link:hover, .admin-sidebar__link.router-link-active { background: var(--color-surface-strong); color: var(--color-text); }
.admin-sidebar__back { margin-top: auto; font-size: var(--fs-sm); color: var(--color-text-faint); }
.admin-content { padding: var(--space-7); overflow-x: hidden; }

@media (max-width: 768px) {
  .admin-layout { grid-template-columns: 1fr; }
  .admin-sidebar { flex-direction: row; overflow-x: auto; align-items: center; }
  .admin-sidebar nav { flex-direction: row; }
  .admin-sidebar__back { margin-top: 0; }
}
</style>
