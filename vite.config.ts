import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/pericia-trabalhista-pro/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  },
  define: {
    'process.env.API_BASE': JSON.stringify('https://marcosantoniocunhasa1771856246033.0772036.meusitehostgator.com.br/wp-json/pericia-trabalhista-pro/v1'),
    'process.env.WP_BASE': JSON.stringify('https://marcosantoniocunhasa1771856246033.0772036.meusitehostgator.com.br')
  }
})
