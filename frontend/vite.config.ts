import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev only: proxy /api to the local backend so the SPA can reach FastAPI without CORS.
// In prod a reverse proxy on the VPS routes /api -> backend (compose binds to 127.0.0.1).
// Override the target with VITE_API_PROXY (e.g. http://localhost:9999 for docker compose).
const apiTarget = process.env.VITE_API_PROXY ?? 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
    },
  },
})
