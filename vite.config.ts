import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Todo el SEO que depende de la URL (título, descripción, canonical, hreflang, Open Graph, datos estructurados,
// robots.txt y sitemap.xml) lo escribe scripts/prerender.mjs a partir de las rutas de src/routes.ts.
// Para GitHub Pages en un repo (p. ej. /portfolio/) lanza: BASE=/portfolio/ SITE_URL=https://… npm run build
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react()],
})
