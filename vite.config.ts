import { defineConfig } from 'vite'

export default defineConfig({
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
      }
    }
  }
})
