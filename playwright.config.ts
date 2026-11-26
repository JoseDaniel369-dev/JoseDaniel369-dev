import { defineConfig, devices } from '@playwright/test'

// Las pruebas corren contra el build de producción (con prerender): `npm run build && npm test`.
// En local usan el Chrome instalado; en CI, el Chromium que instala `npx playwright install`.
const useInstalledChrome = !process.env.CI

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    // Sin animaciones, los contrastes y posiciones se miden en su estado final y no a mitad de entrada.
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, ...(useInstalledChrome && { channel: 'chrome' }) },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], ...(useInstalledChrome && { channel: 'chrome' }) },
    },
  ],
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
