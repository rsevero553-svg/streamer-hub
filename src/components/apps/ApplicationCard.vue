<script setup lang="ts">
import type { AppEntity } from '@/types/application'
import { onTilt, resetTilt } from '@/utils/tilt'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const props = withDefaults(defineProps<{ app: AppEntity; basePath?: string }>(), { basePath: '/apps' })
</script>

<template>
  <RouterLink :to="`${props.basePath}/${app.slug}`" class="app-card tilt-card" @mousemove="onTilt" @mouseleave="resetTilt">
    <div class="app-card__layer tilt-card__layer">
      <div class="app-card__logo-wrap">
        <img v-if="app.logo_url" :src="app.logo_url" :alt="app.name" class="app-card__logo" />
        <span v-else class="app-card__logo-fallback">{{ app.name.slice(0,2).toUpperCase() }}</span>
      </div>
      <h3 class="app-card__name">{{ app.name }}</h3>
      <p class="app-card__desc">{{ app.description }}</p>
      <div class="app-card__tags">
        <BaseBadge v-if="app.agency_required" tone="accent">Con agencia</BaseBadge>
        <BaseBadge tone="neutral">{{ app.gender === 'women' ? 'Mujeres' : 'Hombres' }}</BaseBadge>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.app-card {
  display: block; background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); padding: var(--space-5); backdrop-filter: blur(10px);
}
.app-card__logo-wrap {
  width: 56px; height: 56px; border-radius: var(--radius-md); background: var(--gradient-brand-soft);
  display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-4); overflow: hidden;
}
.app-card__logo { width: 100%; height: 100%; object-fit: cover; }
.app-card__logo-fallback { font-weight: 800; font-size: var(--fs-lg); }
.app-card__name { font-size: var(--fs-md); font-weight: 700; margin-bottom: var(--space-2); }
.app-card__desc { font-size: var(--fs-sm); color: var(--color-text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: var(--space-4); }
.app-card__tags { display: flex; gap: var(--space-2); flex-wrap: wrap; }
</style>
