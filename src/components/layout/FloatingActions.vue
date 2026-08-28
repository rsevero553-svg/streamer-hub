<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchSocialLinks } from '@/services/social.service'
import { useUiStore } from '@/stores/ui'
import type { SocialLink } from '@/types/misc'

const ui = useUiStore()
const socials = ref<SocialLink[]>([])
const canInstall = ref(false)
let deferredPrompt: any = null

onMounted(async () => {
  try { socials.value = (await fetchSocialLinks()).filter(s => s.position !== 'left') } catch { socials.value = [] }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    canInstall.value = true
  })
})

async function installApp() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  await deferredPrompt.userChoice
  deferredPrompt = null
  canInstall.value = false
}
</script>

<template>
  <div class="floating">
    <div class="floating__right">
      <a v-for="s in socials" :key="s.id" :href="s.url" target="_blank" rel="noopener" class="floating__btn animate-float" :style="{ '--tilt': '2deg' }">
        {{ s.icon || s.platform.slice(0,1) }}
      </a>
      <button v-if="canInstall" class="floating__btn floating__btn--install animate-glow" @click="installApp" aria-label="Instalar aplicación">⬇</button>
    </div>

    <button class="floating__chat animate-glow" @click="ui.toggleHelpChat()" aria-label="Abrir chat de ayuda">💬</button>
  </div>
</template>

<style scoped>
.floating { position: fixed; inset: 0; pointer-events: none; z-index: var(--z-float); }
.floating__right {
  position: absolute; right: var(--space-5); bottom: var(--space-6);
  display: flex; flex-direction: column; gap: var(--space-3); pointer-events: auto;
}
.floating__btn {
  width: 46px; height: 46px; border-radius: 50%;
  background: var(--color-surface-strong); border: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: var(--color-text);
}
.floating__btn--install { background: var(--gradient-brand); border: none; color: white; }
.floating__chat {
  position: absolute; left: var(--space-5); bottom: var(--space-6); pointer-events: auto;
  width: 56px; height: 56px; border-radius: 50%; border: none;
  background: var(--gradient-brand); color: white; font-size: 1.4rem;
  box-shadow: var(--shadow-glow-pink);
}
</style>
