import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/smoke',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3000',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
  },
  projects: [
    // Smoke tests run on Chromium only; extend to other browsers in a separate suite.
    { name: 'chromium' },
  ],
});