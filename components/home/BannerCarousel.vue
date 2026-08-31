<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { fetchActiveBanners } from '@/services/banners.service'
import type { Banner } from '@/types/banner'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

const banners = ref<Banner[]>([])
const active = ref(0)
const state = ref<'loading' | 'success' | 'empty'>('loading')
let timer: number | undefined

onMounted(async () => {
  try {
    banners.value = await fetchActiveBanners()
    state.value = banners.value.length ? 'success' : 'empty'
    timer = window.setInterval(next, 6000)
  } catch { state.value = 'empty' }
})
onUnmounted(() => { if (timer) clearInterval(timer) })

function next() { active.value = (active.value + 1) % banners.value.length }
function prev() { active.value = (active.value - 1 + banners.value.length) % banners.value.length }
function go(i: number) { active.value = i }
</script>

<template>
  <div class="carousel" v-if="state === 'success'">
    <TransitionGroup name="slide">
      <a
        v-for="(b, i) in [banners[active]]"
        :key="b.id"
        :href="b.link_url || '#'"
        class="carousel__slide tilt-card"
      >
        <img :src="b.image_url" :alt="b.title || 'Banner'" class="carousel__img" />
        <div class="carousel__overlay">
          <h3 v-if="b.title">{{ b.title }}</h3>
          <p v-if="b.subtitle">{{ b.subtitle }}</p>
          <BaseButton v-if="b.button_text" size="sm">{{ b.button_text }}</BaseButton>
        </div>
      </a>
    </TransitionGroup>

    <button class="carousel__nav carousel__nav--prev" @click="prev" aria-label="Anterior">‹</button>
    <button class="carousel__nav carousel__nav--next" @click="next" aria-label="Siguiente">›</button>

    <div class="carousel__dots">
      <button v-for="(b, i) in banners" :key="b.id" class="carousel__dot" :class="{ 'carousel__dot--active': i === active }" @click="go(i)" />
    </div>
  </div>
  <BaseSpinner v-else-if="state === 'loading'" />
</template>

<style scoped>
.carousel { position: relative; border-radius: var(--radius-xl); overflow: hidden; aspect-ratio: 21/9; max-height: 420px; }
.carousel__slide { position: relative; display: block; width: 100%; height: 100%; }
.carousel__img { width: 100%; height: 100%; object-fit: cover; }
.carousel__overlay {
  position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; gap: var(--space-3);
  padding: var(--space-7); background: linear-gradient(0deg, rgba(6,8,20,0.85) 0%, transparent 60%);
}
.carousel__overlay h3 { font-size: var(--fs-2xl); font-family: var(--font-display); }
.carousel__overlay p { color: var(--color-text-muted); max-width: 460px; }
.carousel__nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(0,0,0,0.35); color: white; border: none; width: 42px; height: 42px; border-radius: 50%; font-size: 1.4rem;
}
.carousel__nav--prev { left: var(--space-4); }
.carousel__nav--next { right: var(--space-4); }
.carousel__dots { position: absolute; bottom: var(--space-4); left: 50%; transform: translateX(-50%); display: flex; gap: var(--space-2); }
.carousel__dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); border: none; }
.carousel__dot--active { background: white; width: 22px; border-radius: var(--radius-full); }
.slide-enter-active, .slide-leave-active { transition: opacity var(--dur-base) var(--ease-out); position: absolute; inset: 0; }
.slide-enter-from, .slide-leave-to { opacity: 0; }

@media (max-width: 768px) { .carousel { aspect-ratio: 4/5; max-height: none; } .carousel__overlay h3 { font-size: var(--fs-xl); } }
</style>
