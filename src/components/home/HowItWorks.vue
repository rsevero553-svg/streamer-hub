<script setup lang="ts">
const steps = [
  { n: '01', t: 'Explora', d: 'Descubre aplicaciones para mujeres y hombres, cada una con su ficha completa.' },
  { n: '02', t: 'Aprende', d: 'Revisa actividades, recompensas, reglas de retiro y si requiere agencia.' },
  { n: '03', t: 'Conecta', d: 'Habla con tu tutor de WhatsApp y únete al canal de Telegram correspondiente.' },
  { n: '04', t: 'Comienza', d: 'Sigue las guías paso a paso y accede a la aplicación oficial.' }
]
</script>
<template>
  <section class="section">
    <div class="container">
      <h2 class="section__title">Cómo funciona</h2>
      <div class="steps">
        <div v-for="s in steps" :key="s.n" class="step animate-fade-up">
          <span class="step__n">{{ s.n }}</span>
          <h3>{{ s.t }}</h3>
          <p>{{ s.d }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.section { padding: var(--space-9) 0; }
.section__title { font-size: var(--fs-2xl); font-family: var(--font-display); margin-bottom: var(--space-6); }
.steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-5); }
.step { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); }
.step__n { font-family: var(--font-display); font-size: var(--fs-2xl); background: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
.step h3 { margin: var(--space-3) 0 var(--space-2); font-size: var(--fs-md); }
.step p { color: var(--color-text-muted); font-size: var(--fs-sm); line-height: 1.5; }
@media (max-width: 768px) { .steps { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px) { .steps { grid-template-columns: 1fr; } }
</style>
