<template><div class="spinner" role="status" aria-label="Cargando"></div></template>
<style scoped>
.spinner {
  width: 34px; height: 34px; border-radius: 50%;
  border: 3px solid var(--color-surface-strong);
  border-top-color: var(--color-pink-500);
  animation: spin-slow 0.8s linear infinite;
  margin: var(--space-6) auto;
}
</style>
