import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Streamer Hub',
        short_name: 'StreamerHub',
        description: 'Plataforma educativa e informativa para conocer aplicaciones de trabajo online.',
        theme_color: '#1a1033',
        background_color: '#1a1033',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: { host: true, port: 5173 },
  preview: { host: true, port: Number(process.env.PORT) || 4173, allowedHosts: true }
})
