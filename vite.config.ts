import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/focus60/', // base para GitHub Pages
  plugins: [react()],
})
