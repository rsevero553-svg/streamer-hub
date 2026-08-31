<script setup lang="ts">
// Fondo dinámico: alterna rosa oscuro / azul oscuro cada 30s con transición suave (2.5D glow layers)
</script>
<template>
  <div class="dynamic-bg" aria-hidden="true">
    <div class="dynamic-bg__layer dynamic-bg__layer--a"></div>
    <div class="dynamic-bg__layer dynamic-bg__layer--b"></div>
    <div class="dynamic-bg__glow"></div>
    <div class="dynamic-bg__grid"></div>
  </div>
</template>
<style scoped>
.dynamic-bg { position: absolute; inset: 0; overflow: hidden; z-index: 0; }
.dynamic-bg__layer {
  position: absolute; inset: -10%;
  background-size: 200% 200%;
  animation: bg-shift var(--dur-bg) var(--ease-in-out) infinite;
}
.dynamic-bg__layer--a {
  background-image: linear-gradient(135deg, var(--color-pink-900), var(--color-blue-950) 60%);
  opacity: 1;
}
.dynamic-bg__layer--b {
  background-image: linear-gradient(315deg, var(--color-blue-800), var(--color-pink-950) 60%);
  opacity: 0;
  animation: bg-shift var(--dur-bg) var(--ease-in-out) infinite, layer-b-fade 60s ease-in-out infinite;
}
@keyframes layer-b-fade { 0%, 45% { opacity: 0; } 50%, 95% { opacity: 0.85; } 100% { opacity: 0; } }
.dynamic-bg__glow { position: absolute; inset: 0; background: var(--gradient-glow); }
.dynamic-bg__grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(circle at 50% 30%, black, transparent 75%);
}
</style>
