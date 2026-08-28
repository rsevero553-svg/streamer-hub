<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchSocialLinks } from '@/services/social.service'
import type { SocialLink } from '@/types/misc'

const socials = ref<SocialLink[]>([])
onMounted(async () => {
  try { socials.value = await fetchSocialLinks() } catch { socials.value = [] }
})
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <p class="footer__logo">Streamer<b>Hub</b></p>
        <p class="footer__tagline">
          Centro de orientación para conocer, aprender y decidir cómo trabajar
          en aplicaciones de mensajería, videollamadas y entretenimiento en línea.
        </p>
        <div class="footer__socials">
          <a v-for="s in socials" :key="s.id" :href="s.url" target="_blank" rel="noopener" class="footer__social">
            {{ s.platform }}
          </a>
        </div>
      </div>

      <div class="footer__col">
        <h4>Navegación</h4>
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/apps/mujeres">Apps para mujeres</RouterLink>
        <RouterLink to="/apps/hombres">Apps para hombres</RouterLink>
        <RouterLink to="/guias">Guías</RouterLink>
      </div>

      <div class="footer__col">
        <h4>Comunidad</h4>
        <RouterLink to="/ser-agente">Ser agente</RouterLink>
        <RouterLink to="/contacto">Contacto</RouterLink>
        <RouterLink to="/politicas">Políticas</RouterLink>
      </div>

      <div class="footer__col">
        <h4>Cuenta</h4>
        <RouterLink to="/iniciar-sesion">Iniciar sesión</RouterLink>
        <RouterLink to="/registro">Registrarse</RouterLink>
        <RouterLink to="/perfil">Mi perfil</RouterLink>
      </div>
    </div>

    <div class="container footer__bottom">
      <p>© {{ new Date().getFullYear() }} Streamer Hub. Plataforma educativa e informativa. Las aplicaciones mostradas son independientes y externas.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--color-blue-900); border-top: 1px solid var(--color-border); padding: var(--space-8) 0 var(--space-5); margin-top: var(--space-9); }
.footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: var(--space-7); }
.footer__logo { font-family: var(--font-display); font-size: var(--fs-lg); font-weight: 800; margin-bottom: var(--space-3); }
.footer__logo b { background: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
.footer__tagline { color: var(--color-text-muted); font-size: var(--fs-sm); line-height: 1.6; max-width: 340px; }
.footer__socials { display: flex; gap: var(--space-3); margin-top: var(--space-5); flex-wrap: wrap; }
.footer__social { background: var(--color-surface-strong); padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); font-size: var(--fs-xs); font-weight: 600; }
.footer__col { display: flex; flex-direction: column; gap: var(--space-3); }
.footer__col h4 { font-size: var(--fs-sm); color: var(--color-text-faint); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-2); }
.footer__col a { font-size: var(--fs-sm); color: var(--color-text-muted); }
.footer__col a:hover { color: var(--color-text); }
.footer__bottom { border-top: 1px solid var(--color-border); margin-top: var(--space-7); padding-top: var(--space-5); }
.footer__bottom p { font-size: var(--fs-xs); color: var(--color-text-faint); text-align: center; }

@media (max-width: 768px) {
  .footer__grid { grid-template-columns: 1fr 1fr; }
  .footer__brand { grid-column: span 2; }
}
@media (max-width: 480px) {
  .footer__grid { grid-template-columns: 1fr; }
  .footer__brand { grid-column: span 1; }
}
</style>
