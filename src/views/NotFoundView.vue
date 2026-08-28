<script setup lang="ts"></script>
<template>
  <section class="notfound">
    <h1>404</h1>
    <p>Esta página no existe.</p>
    <RouterLink to="/">Volver al inicio</RouterLink>
  </section>
</template>
<style scoped>
.notfound { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-3); text-align: center; }
h1 { font-family: var(--font-display); font-size: var(--fs-4xl); background: var(--gradient-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
a { color: var(--color-pink-400); font-weight: 700; }
</style>
