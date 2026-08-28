<script setup lang="ts">
defineProps<{ open: boolean; title?: string }>()
defineEmits<{ close: [] }>()
</script>
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal">
          <header class="modal__header">
            <h3>{{ title }}</h3>
            <button class="modal__close" @click="$emit('close')" aria-label="Cerrar">✕</button>
          </header>
          <div class="modal__body"><slot /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(6,8,20,0.7); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: var(--z-modal); padding: var(--space-4);
}
.modal {
  background: var(--color-blue-900); border: 1px solid var(--color-border); border-radius: var(--radius-lg);
  max-width: 520px; width: 100%; max-height: 85vh; overflow-y: auto; box-shadow: var(--shadow-lg);
}
.modal__header { display: flex; justify-content: space-between; align-items: center; padding: var(--space-5); border-bottom: 1px solid var(--color-border); }
.modal__close { background: none; border: none; color: var(--color-text-muted); font-size: var(--fs-lg); }
.modal__body { padding: var(--space-5); }
.modal-enter-active, .modal-leave-active { transition: opacity var(--dur-base) var(--ease-out); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
