import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 🌟 यह प्लगइन आपके टेलविंड v4 इंजन को सीधे सिंक कर देगा
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

