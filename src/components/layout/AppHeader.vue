<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import NotificationBell from '@/components/notifications/NotificationBell.vue'
const ui = useUiStore()
const auth = useAuthStore()
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="header__logo">
        <span class="header__logo-dot"></span>
        Streamer<b>Hub</b>
      </RouterLink>

      <nav class="header__nav">
        <RouterLink to="/" class="header__link">Inicio</RouterLink>
        <RouterLink to="/apps/mujeres" class="header__link">Apps para mujeres</RouterLink>
        <RouterLink to="/apps/hombres" class="header__link">Apps para hombres</RouterLink>
        <RouterLink to="/guias" class="header__link">Guías</RouterLink>
        <RouterLink to="/ser-agente" class="header__link">Ser agente</RouterLink>
      </nav>

      <div class="header__actions">
        <NotificationBell />
        <template v-if="!auth.isAuthenticated">
          <RouterLink to="/iniciar-sesion" class="header__link header__link--muted">Iniciar sesión</RouterLink>
          <RouterLink to="/registro" class="btn-mini">Registrarse</RouterLink>
        </template>
        <RouterLink v-else to="/perfil" class="btn-mini">Mi perfil</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="header__link header__link--muted">Admin</RouterLink>

        <button class="header__burger" @click="ui.toggleMobileMenu()" aria-label="Abrir menú">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky; top: 0; z-index: var(--z-header);
  height: var(--header-h);
  background: rgba(6,8,20,0.72);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border);
}
.header__inner { height: 100%; display: flex; align-items: center; justify-content: space-between; gap: var(--space-5); }
.header__logo {
  font-family: var(--font-display); font-size: var(--fs-lg); font-weight: 800;
  display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0;
}
.header__logo b { background: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
.header__logo-dot {
  width: 10px; height: 10px; border-radius: 50%; background: var(--gradient-brand);
  box-shadow: var(--shadow-glow-pink); animation: pulse-glow 3s var(--ease-in-out) infinite;
}
.header__nav { display: flex; gap: var(--space-6); }
.header__link {
  font-size: var(--fs-sm); font-weight: 600; color: var(--color-text-muted);
  transition: color var(--dur-fast);
  position: relative;
}
.header__link:hover, .header__link.router-link-active { color: var(--color-text); }
.header__link.router-link-active::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -10px; height: 2px;
  background: var(--gradient-brand); border-radius: var(--radius-full);
}
.header__link--muted { display: none; }
.header__actions { display: flex; align-items: center; gap: var(--space-4); }
.btn-mini {
  background: var(--gradient-brand); color: white; font-size: var(--fs-sm); font-weight: 700;
  padding: var(--space-2) var(--space-5); border-radius: var(--radius-full);
  box-shadow: var(--shadow-glow-pink); transition: transform var(--dur-fast);
}
.btn-mini:hover { transform: translateY(-2px); }
.header__burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; padding: var(--space-2); }
.header__burger span { width: 22px; height: 2px; background: var(--color-text); border-radius: 2px; }

@media (min-width: 769px) { .header__link--muted { display: inline; } }

@media (max-width: 768px) {
  .header__nav { display: none; }
  .header__burger { display: flex; }
  .btn-mini { display: none; }
}
</style>
