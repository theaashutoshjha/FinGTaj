import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/login': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/logout': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/callback': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/signup': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/sitemap.xml': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/robots.txt': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})

