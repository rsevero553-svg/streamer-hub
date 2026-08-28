<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
const ui = useUiStore()
const auth = useAuthStore()

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/apps/mujeres', label: 'Apps para mujeres' },
  { to: '/apps/hombres', label: 'Apps para hombres' },
  { to: '/guias', label: 'Guías' },
  { to: '/ser-agente', label: 'Ser agente' }
]
</script>

<template>
  <Transition name="menu">
    <div v-if="ui.mobileMenuOpen" class="mobile-menu">
      <button class="mobile-menu__close" @click="ui.toggleMobileMenu(false)" aria-label="Cerrar menú">✕</button>
      <nav class="mobile-menu__nav">
        <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="mobile-menu__link" @click="ui.toggleMobileMenu(false)">
          {{ l.label }}
        </RouterLink>
      </nav>
      <div class="mobile-menu__actions">
        <template v-if="!auth.isAuthenticated">
          <RouterLink to="/iniciar-sesion" class="btn-outline" @click="ui.toggleMobileMenu(false)">Iniciar sesión</RouterLink>
          <RouterLink to="/registro" class="btn-fill" @click="ui.toggleMobileMenu(false)">Registrarse</RouterLink>
        </template>
        <RouterLink v-else to="/perfil" class="btn-fill" @click="ui.toggleMobileMenu(false)">Mi perfil</RouterLink>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.mobile-menu {
  position: fixed; inset: 0; z-index: var(--z-modal);
  background: linear-gradient(160deg, var(--color-pink-900) 0%, var(--color-blue-950) 70%);
  display: flex; flex-direction: column; padding: var(--space-7) var(--space-6);
}
.mobile-menu__close { align-self: flex-end; background: none; border: none; color: white; font-size: var(--fs-xl); margin-bottom: var(--space-7); }
.mobile-menu__nav { display: flex; flex-direction: column; gap: var(--space-6); }
.mobile-menu__link { font-size: var(--fs-xl); font-weight: 700; color: white; }
.mobile-menu__actions { margin-top: auto; display: flex; flex-direction: column; gap: var(--space-4); padding-top: var(--space-7); }
.btn-outline, .btn-fill { text-align: center; padding: var(--space-4); border-radius: var(--radius-full); font-weight: 700; }
.btn-outline { border: 1.5px solid white; color: white; }
.btn-fill { background: white; color: var(--color-pink-800); }
.menu-enter-active, .menu-leave-active { transition: transform var(--dur-base) var(--ease-out), opacity var(--dur-base); }
.menu-enter-from, .menu-leave-to { transform: translateX(100%); opacity: 0; }
</style>
