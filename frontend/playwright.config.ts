import { defineConfig } from '@playwright/test';

/** @type {import('@playwright/test').PlaywrightConfig} */
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
  },
  browsers: ['chromium', 'firefox', 'webkit'],
});