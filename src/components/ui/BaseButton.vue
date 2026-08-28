<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  tag?: 'button' | 'a'
  href?: string
  target?: string
}>(), { variant: 'primary', size: 'md', tag: 'button' })
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :target="target"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  border-radius: var(--radius-full);
  font-weight: 600;
  transition: transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast);
  white-space: nowrap;
}
.btn:active { transform: scale(0.97); }

.btn--sm { padding: var(--space-2) var(--space-4); font-size: var(--fs-sm); }
.btn--md { padding: var(--space-3) var(--space-6); font-size: var(--fs-base); }
.btn--lg { padding: var(--space-4) var(--space-7); font-size: var(--fs-md); }

.btn--primary {
  background: var(--gradient-brand);
  color: white;
  box-shadow: var(--shadow-glow-pink);
}
.btn--primary:hover { box-shadow: 0 0 55px rgba(217,46,158,0.55); transform: translateY(-2px); }

.btn--secondary {
  background: var(--color-surface-strong);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn--secondary:hover { background: rgba(255,255,255,0.14); }

.btn--outline {
  background: transparent;
  color: var(--color-text);
  border: 1.5px solid var(--color-pink-500);
}
.btn--outline:hover { background: rgba(217,46,158,0.12); }

.btn--ghost { background: transparent; color: var(--color-text-muted); }
.btn--ghost:hover { color: var(--color-text); }
</style>
