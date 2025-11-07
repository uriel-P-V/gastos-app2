import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/gastos-app/', // ← Esto es crucial para GitHub Pages
  build: {
    outDir: 'dist'
  }
})