<script setup lang="ts">
import DynamicBackground from './DynamicBackground.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>
<template>
  <section class="hero">
    <DynamicBackground />
    <div class="container hero__content">
      <span class="hero__eyebrow animate-fade-up">Plataforma educativa e informativa</span>
      <h1 class="hero__title animate-fade-up">
        Aprende a trabajar en <span>aplicaciones online</span> con orientación real
      </h1>
      <p class="hero__subtitle animate-fade-up">
        Conoce cómo funciona cada aplicación, sus recompensas, reglas de retiro,
        agencias y guías — todo en un solo lugar, antes de comenzar.
      </p>
      <div class="hero__cta animate-fade-up">
        <BaseButton tag="a" href="#featured-apps" size="lg">Explorar aplicaciones</BaseButton>
        <BaseButton tag="a" href="/guias" variant="secondary" size="lg">Ver guías</BaseButton>
      </div>
    </div>
  </section>
</template>
<style scoped>
.hero { position: relative; min-height: 88vh; display: flex; align-items: center; overflow: hidden; }
.hero__content { position: relative; z-index: 1; max-width: 720px; }
.hero__eyebrow {
  display: inline-block; padding: var(--space-2) var(--space-4); border-radius: var(--radius-full);
  background: var(--color-surface-strong); border: 1px solid var(--color-border);
  font-size: var(--fs-xs); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: var(--space-5);
}
.hero__title { font-family: var(--font-display); font-size: var(--fs-4xl); line-height: 1.1; font-weight: 800; margin-bottom: var(--space-5); }
.hero__title span { background: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero__subtitle { font-size: var(--fs-md); color: var(--color-text-muted); line-height: 1.6; margin-bottom: var(--space-7); max-width: 560px; }
.hero__cta { display: flex; gap: var(--space-4); flex-wrap: wrap; }
@media (max-width: 768px) { .hero { min-height: 80vh; } .hero__title { font-size: var(--fs-3xl); } }
@media (max-width: 480px) { .hero__title { font-size: var(--fs-2xl); } .hero__cta { flex-direction: column; } .hero__cta > * { width: 100%; } }
</style>
