import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      },
      manifestFilename: 'manifest.json',
      injectRegister: null, // We handle registration manually in main.tsx
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
})
