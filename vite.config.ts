import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: 'localhost',
    proxy: {
      // Local discovery/contact submits → Bonotech mail API (or remote when unset).
      '/send-email': {
        target: process.env.VITE_EMAIL_PROXY_TARGET || 'http://127.0.0.1:8792',
        changeOrigin: true,
      },
    },
  },
})
