import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/auth': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/users': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/seller': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/admin': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/products': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/orders': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/carts': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/payments': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/oauth2': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/notice': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/inquiry': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/qna': {
        target: "http://localhost:8000",
        changeOrigin: true
      },

      '/settlement': {
        target: "http://localhost:8000",
        changeOrigin: true
      }
    }
  }
})
