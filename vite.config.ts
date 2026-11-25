import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Para GitHub Pages en un repo (p. ej. /portfolio/) lanza: BASE=/portfolio/ npm run build
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react()],
})
