<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
</script>
<template>
  <section class="quick">
    <div class="container quick__grid">
      <RouterLink to="/apps/mujeres" class="quick__card tilt-card animate-fade-up">
        <h3>Aplicaciones para mujeres</h3>
        <p>Mensajería, videollamadas, match y más.</p>
        <span class="quick__arrow">→</span>
      </RouterLink>
      <RouterLink to="/apps/hombres" class="quick__card tilt-card animate-fade-up">
        <h3>Aplicaciones para hombres</h3>
        <p>Conoce las opciones disponibles para ti.</p>
        <span class="quick__arrow">→</span>
      </RouterLink>
      <RouterLink to="/ser-agente" class="quick__card quick__card--accent tilt-card animate-fade-up">
        <h3>¿Quieres ser agente?</h3>
        <p>Conoce los requisitos y beneficios.</p>
        <span class="quick__arrow">→</span>
      </RouterLink>
    </div>
  </section>
</template>
<style scoped>
.quick { padding: var(--space-8) 0; }
.quick__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.quick__card {
  display: block; padding: var(--space-6); border-radius: var(--radius-lg);
  background: var(--color-surface); border: 1px solid var(--color-border); position: relative; overflow: hidden;
}
.quick__card--accent { background: var(--gradient-brand-soft); }
.quick__card h3 { font-size: var(--fs-lg); margin-bottom: var(--space-2); }
.quick__card p { color: var(--color-text-muted); font-size: var(--fs-sm); }
.quick__arrow { position: absolute; right: var(--space-6); bottom: var(--space-6); font-size: var(--fs-xl); color: var(--color-pink-400); }
@media (max-width: 768px) { .quick__grid { grid-template-columns: 1fr; } }
</style>
