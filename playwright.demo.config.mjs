// Smoke tests for the data explorer (demo/), built by tools/build-demo.mjs and served under the wonmor.io
// CSP at /demo/uz-open-data/.   npm run test:demo
import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.DEMO_PORT) || 4292;
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: 'tests/demo',
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: { baseURL: `http://127.0.0.1:${PORT}/demo/uz-open-data/` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: executablePath ? { executablePath } : {} } }],
  webServer: {
    command: 'node tools/build-demo.mjs && node tools/serve-demo.mjs',
    env: { PORT: String(PORT) },
    url: `http://127.0.0.1:${PORT}/demo/uz-open-data/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
