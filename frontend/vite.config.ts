import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev only: proxy /api to the local backend so the SPA can reach FastAPI without CORS.
// In prod a reverse proxy on the VPS routes /api -> backend (compose binds to 127.0.0.1).
// Override the target with VITE_API_PROXY if your local backend runs elsewhere.
const apiTarget = process.env.VITE_API_PROXY ?? 'http://localhost:9999'

export default defineConfig({
  plugins: [react()],
  build: {
    // exceljs (~940 kB) is intentionally a separate lazy chunk loaded only on
    // the admin export action; the default 500 kB warning is noise for it.
    // The eagerly-loaded main bundle stays well under the limit (~340 kB).
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
      '/thumbor': { target: process.env.VITE_THUMBOR_PROXY ?? 'http://localhost:8888', changeOrigin: true },
    },
  },
})
