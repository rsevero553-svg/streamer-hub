<script setup lang="ts">
import { onMounted } from 'vue'
import HeroSection from '@/components/home/HeroSection.vue'
import BannerCarousel from '@/components/home/BannerCarousel.vue'
import QuickAccess from '@/components/home/QuickAccess.vue'
import FeaturedApps from '@/components/home/FeaturedApps.vue'
import HowItWorks from '@/components/home/HowItWorks.vue'
import { useAppsStore } from '@/stores/apps'
import { useMeta } from '@/composables/useMeta'

useMeta('Inicio', 'Plataforma educativa e informativa para aprender a trabajar en aplicaciones online: mensajería, videollamadas y más, con guías y orientación.')

const store = useAppsStore()
onMounted(() => { store.loadAll() })
</script>

<template>
  <div>
    <HeroSection />
    <div class="container" style="margin-top: -4rem; position: relative; z-index: 2;">
      <BannerCarousel />
    </div>
    <QuickAccess />
    <div id="featured-apps">
      <FeaturedApps />
    </div>
    <HowItWorks />
  </div>
</template>
