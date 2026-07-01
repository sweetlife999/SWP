import { defineConfig } from '@playwright/test';

/** @type {import('@playwright/test').PlaywrightConfig} */
export default defineConfig({
  testDir: './src/tests/smoke',
  use: {
    baseURL: 'http://127.0.0.1:3000',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium' },
  ],
});