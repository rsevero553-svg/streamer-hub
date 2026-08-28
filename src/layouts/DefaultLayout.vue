<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'
import FloatingActions from '@/components/layout/FloatingActions.vue'
import HelpChat from '@/components/chat/HelpChat.vue'
</script>

<template>
  <div class="layout">
    <AppHeader />
    <MobileMenu />
    <main class="layout__main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <FloatingActions />
    <HelpChat />
  </div>
</template>

<style scoped>
.layout { display: flex; flex-direction: column; min-height: 100vh; }
.layout__main { flex: 1; }
.page-enter-active, .page-leave-active { transition: opacity var(--dur-base) var(--ease-out); }
.page-enter-from, .page-leave-to { opacity: 0; }
</style>
