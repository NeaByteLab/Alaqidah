import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import path from 'node:path'

/** Current project directory path */
const dirName = path.dirname(fileURLToPath(import.meta.url))

/**
 * Vite configuration.
 * @description Setup plugins and path aliases.
 */
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
      }
    })
  ],
  resolve: {
    alias: { '@app': path.resolve(dirName, 'src') }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: moduleId => {
          if (moduleId.includes('node_modules')) {
            if (
              moduleId.includes('react-dom') ||
              moduleId.includes('react/') ||
              moduleId.includes('react-router-dom')
            ) {
              return 'vendor'
            }
          }
          return undefined
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
